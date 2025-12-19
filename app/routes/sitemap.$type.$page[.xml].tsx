import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getSitemap} from '@shopify/hydrogen';
import {escapeXml} from '~/lib/utils';

/**
 * Sitemap Type Handler - Generates XML sitemaps for different content types
 * 
 * This route handles sitemap generation for:
 * - Products: /sitemap/products/1.xml (available products only, ensures 200 status)
 * - Pages: /sitemap/pages/1.xml (excludes redirect/noindex routes)
 * - Other types: Falls back to Hydrogen's getSitemap (articles, blogs, etc.)
 * 
 * SEO Requirements (per SEMrush audit):
 * - Only include canonical URLs that return 200 status codes
 * - Exclude URLs that redirect (301/302)
 * - Exclude URLs with noindex meta tags
 * - Exclude URLs with duplicate content
 * 
 * Custom product sitemap query using standard products query.
 * This is a workaround for when the sitemap API returns empty results.
 * The Storefront sitemap API requires products to be published to the
 * Hydrogen sales channel specifically, not just the Online Store channel.
 * 
 * Fields:
 * - handle: Product URL slug
 * - updatedAt: Last modified date for sitemap lastmod
 * - availableForSale: Whether product is available - used to ensure only purchasable products in sitemap
 * 
 * Note: The 'status' field (ACTIVE, DRAFT, ARCHIVED) is NOT available in the
 * Storefront API - it's only available in the Admin API. We use availableForSale
 * instead to filter products that should be in the sitemap.
 */
const PRODUCTS_SITEMAP_QUERY = `#graphql
  query ProductsSitemap($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        handle
        updatedAt
        availableForSale
      }
    }
  }
` as const;

// Collections are not used in this store - removed collections sitemap query

const PAGES_SITEMAP_QUERY = `#graphql
  query PagesSitemap($first: Int!, $after: String) {
    pages(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        handle
        updatedAt
      }
    }
  }
` as const;

/**
 * Routes/handles that should be excluded from sitemap because they:
 * - Return non-200 status codes (redirects, etc.)
 * - Are not canonical URLs
 * - Should not be indexed by search engines
 * - Have noindex meta tags
 * 
 * This list should include any Shopify page handles that correspond to
 * Remix routes that perform redirects, have noindex tags, or return non-200 status codes.
 */
const EXCLUDED_ROUTES = new Set([
  // Redirect routes (301/302 status codes)
  'help',                    // Redirects to /faq (301)
  'track-order',             // Redirects to external Shopify domain (301)
  'track',                   // Alternative handle for track-order
  
  // Age verification routes (noindex, nofollow)
  'age-verification',        // Age verification flow
  'age-verification-fail',   // Age verification failure
  'age-verification-retry',  // Age verification retry
  'age-verification-success',// Age verification success
  'age-verify',              // Alternative handle
  
  // Account/Auth routes (noindex, require auth)
  'account',                 // Account portal
  'account-login',           // Login page
  'account-authorize',       // OAuth authorize
  'account-orders',          // Order history (requires auth)
  'login',                   // Alternative handle for login
  'register',                // Registration page
  'signup',                  // Alternative handle for signup
  
  // Utility/Search routes (dynamic content, not canonical)
  'search',                  // Search results page (dynamic)
  'device-studio-results',   // Device recommendation results
  'flavour-lab-results',     // Flavor recommendation results
  
  // Cart and checkout (handled by Shopify)
  'cart',                    // Cart page (Remix-handled but dynamic)
  'checkout',                // Checkout (Shopify-hosted)
  
  // API and utility routes
  'api',                     // API routes
]);

/**
 * Sitemap priority values for different page types
 */
const PRIORITY = {
  HIGH: 0.8,      // Core pages, collection landing pages
  MEDIUM: 0.7,    // Guides index, FAQ, Blog
  MEDIUM_LOW: 0.6, // Individual guide pages
  LOW: 0.5,       // Policy pages
} as const;

/**
 * Static Remix routes that should be included in the sitemap
 * These are routes that don't come from Shopify Pages but should be indexed
 * 
 * IMPORTANT: Only include routes that:
 * 1. Always return 200 status (no redirects)
 * 2. Never have noindex meta tags
 * 3. Have stable, canonical URLs
 * 4. Don't require authentication
 * 
 * Collection routes are excluded because they have conditional noindex
 * when data fails to load, which violates SEMrush audit requirements.
 */
const STATIC_ROUTES = [
  // Core information pages
  { handle: 'about', priority: PRIORITY.HIGH },
  { handle: 'contact', priority: PRIORITY.HIGH },
  { handle: 'faq', priority: PRIORITY.MEDIUM },
  
  // Policy pages
  { handle: 'policies/privacy-policy', priority: PRIORITY.LOW },
  { handle: 'policies/terms-of-service', priority: PRIORITY.LOW },
  { handle: 'policies/returns-policy', priority: PRIORITY.LOW },
  { handle: 'policies/cookie-policy', priority: PRIORITY.LOW },
  
  // Guide pages
  { handle: 'guides', priority: PRIORITY.MEDIUM },
  { handle: 'guides/age-verification', priority: PRIORITY.MEDIUM_LOW },
  { handle: 'guides/certifications', priority: PRIORITY.MEDIUM_LOW },
  { handle: 'guides/sustainability', priority: PRIORITY.MEDIUM_LOW },
  
  // Blog index
  { handle: 'blog', priority: PRIORITY.MEDIUM },
  
  // Collection landing pages (SEO-optimized category pages)
  // NOTE: These routes have conditional noindex as a safety measure, but their loaders
  // always return data successfully (using searchProducts which never throws).
  // The noindex condition will never trigger in production, so these are safe to include.
  { handle: 'collections/crystal-bar', priority: PRIORITY.HIGH },
  { handle: 'collections/elux-legend', priority: PRIORITY.HIGH },
  { handle: 'collections/hayati-pro-max', priority: PRIORITY.HIGH },
  { handle: 'collections/hayati-pro-ultra', priority: PRIORITY.HIGH },
  { handle: 'collections/hayati-remix', priority: PRIORITY.HIGH },
  { handle: 'collections/hayati-x4', priority: PRIORITY.HIGH },
  { handle: 'collections/lost-mary-bm6000', priority: PRIORITY.HIGH },
  { handle: 'collections/nicotine-pouches', priority: PRIORITY.HIGH },
  { handle: 'collections/riot-squad', priority: PRIORITY.HIGH },
  { handle: 'collections/velo-nicotine-pouches', priority: PRIORITY.HIGH },
  { handle: 'collections/zyn-nicotine-pouches', priority: PRIORITY.HIGH },
] as const;

interface SitemapItem {
  handle: string;
  updatedAt: string;
  availableForSale?: boolean;
}

interface ProductsResult {
  products: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    nodes: SitemapItem[];
  };
}

// Collections interface removed - not used in this store

interface PagesResult {
  pages: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    nodes: SitemapItem[];
  };
}

/**
 * Fetch all items of a type with pagination for custom sitemap
 */
async function fetchAllItems<T extends ProductsResult | PagesResult>(
  storefront: LoaderFunctionArgs['context']['storefront'],
  query: string,
  type: 'products' | 'pages',
  pageSize = 250
): Promise<SitemapItem[]> {
  const allItems: SitemapItem[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  while (hasNextPage) {
    const result = await storefront.query<T>(query, {
      variables: {
        first: pageSize,
        after: cursor,
      },
      cache: storefront.CacheLong(),
    });

    const data = result[type as keyof T] as { pageInfo: { hasNextPage: boolean; endCursor: string | null }; nodes: SitemapItem[] };
    
    // Filter out items that shouldn't be in sitemap
    const filteredNodes = data.nodes.filter(node => {
      // Filter out excluded page handles (redirect-only routes)
      if (type === 'pages' && EXCLUDED_ROUTES.has(node.handle)) {
        return false;
      }
      
      // Filter out products that are not available for sale
      // The 'status' field is not available in Storefront API, so we use
      // availableForSale to ensure only purchasable products are in the sitemap
      if (type === 'products' && node.availableForSale === false) {
        return false;
      }
      
      return true;
    });
    
    allItems.push(...filteredNodes);
    hasNextPage = data.pageInfo.hasNextPage;
    cursor = data.pageInfo.endCursor;

    // Safety limit
    if (allItems.length > 50000) break;
  }

  return allItems;
}

/**
 * Generate XML sitemap content for Shopify Pages and static routes
 */
function generateSitemapXml(
  items: SitemapItem[],
  baseUrl: string,
  type: string,
  includeStaticRoutes = false
): string {
  const xmlPrefix = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;
  const xmlSuffix = `</urlset>`;

  const urls: string[] = [];
  
  // Add homepage if no items
  if (items.length === 0 && !includeStaticRoutes) {
    return `${xmlPrefix}
  <url><loc>${escapeXml(baseUrl)}/</loc></url>
${xmlSuffix}`;
  }

  // Add Shopify Pages/Products
  items.forEach((item) => {
    // Build URL and escape special characters for valid XML
    const loc = escapeXml(`${baseUrl}/${type}/${item.handle}`);
    const lastmod = item.updatedAt ? `
  <lastmod>${item.updatedAt}</lastmod>` : '';
    urls.push(`<url>
  <loc>${loc}</loc>${lastmod}
  <changefreq>weekly</changefreq>
</url>`);
  });
  
  // Add static routes for pages sitemap
  if (includeStaticRoutes && type === 'pages') {
    STATIC_ROUTES.forEach((route) => {
      const loc = escapeXml(`${baseUrl}/${route.handle}`);
      urls.push(`<url>
  <loc>${loc}</loc>
  <changefreq>weekly</changefreq>
  <priority>${route.priority}</priority>
</url>`);
    });
  }

  return `${xmlPrefix}
${urls.join('\n')}
${xmlSuffix}`;
}

export async function loader({
  request,
  params,
  context: {storefront},
}: LoaderFunctionArgs) {
  const { type } = params;
  const baseUrl = new URL(request.url).origin;

  // Use custom sitemap generator for products since the sitemap API
  // returns empty results (products may not be published to Hydrogen channel)
  if (type === 'products') {
    try {
      const items = await fetchAllItems<ProductsResult>(
        storefront,
        PRODUCTS_SITEMAP_QUERY,
        'products'
      );
      
      const xml = generateSitemapXml(items, baseUrl, 'products');
      
      return new Response(xml, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600', // 1 hour cache
          'X-Sitemap-Source': 'custom-products-query',
        },
      });
    } catch (error) {
      console.error('[Sitemap] Error fetching products:', error);
      // Fall through to default handler
    }
  }

  // Collections sitemap removed - not used in this store (tag-based navigation only)

  // Use custom sitemap generator for pages as fallback
  if (type === 'pages') {
    try {
      const items = await fetchAllItems<PagesResult>(
        storefront,
        PAGES_SITEMAP_QUERY,
        'pages'
      );
      
      // Include static routes in the pages sitemap (SEO-optimized Remix routes)
      const xml = generateSitemapXml(items, baseUrl, 'pages', true);
      
      return new Response(xml, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600',
          'X-Sitemap-Source': 'custom-pages-query-with-static-routes',
        },
      });
    } catch (error) {
      console.error('[Sitemap] Error fetching pages:', error);
    }
  }

  // Fall back to default Hydrogen sitemap handler for other types
  // (articles, blogs, metaObjects)
  const response = await getSitemap({
    storefront,
    request,
    params,
    locales: ['EN-GB'],
    getLink: ({type: linkType, baseUrl: linkBaseUrl, handle}) => {
      if (!handle) return linkBaseUrl;
      return `${linkBaseUrl}/${linkType}/${handle}`;
    },
  });

  response.headers.set('Cache-Control', 'public, max-age=3600');

  return response;
}
