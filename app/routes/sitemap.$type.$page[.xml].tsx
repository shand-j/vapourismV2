import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getSitemap} from '@shopify/hydrogen';

/**
 * Custom product sitemap query using standard products query.
 * This is a workaround for when the sitemap API returns empty results.
 * The Storefront sitemap API requires products to be published to the
 * Hydrogen sales channel specifically, not just the Online Store channel.
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
        status
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
 * 
 * This list should include any Shopify page handles that correspond to
 * Remix routes that perform redirects or return non-200 status codes.
 */
const EXCLUDED_ROUTES = new Set([
  'help',        // Redirects to /faq (301)
  'track-order', // Redirects to external Shopify domain (301)
]);

interface SitemapItem {
  handle: string;
  updatedAt: string;
  status?: string;
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
      // Filter out excluded page handles
      if (type === 'pages' && EXCLUDED_ROUTES.has(node.handle)) {
        return false;
      }
      
      // Filter out products that are not ACTIVE (published)
      // Only include products with ACTIVE status to ensure 200 response
      if (type === 'products' && node.status && node.status !== 'ACTIVE') {
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
 * Generate XML sitemap content
 */
function generateSitemapXml(
  items: SitemapItem[],
  baseUrl: string,
  type: string
): string {
  const xmlPrefix = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;
  const xmlSuffix = `</urlset>`;

  if (items.length === 0) {
    return `${xmlPrefix}
  <url><loc>${baseUrl}/</loc></url>
${xmlSuffix}`;
  }

  const urls = items.map((item) => {
    const loc = `${baseUrl}/${type}/${item.handle}`;
    const lastmod = item.updatedAt ? `
  <lastmod>${item.updatedAt}</lastmod>` : '';
    return `<url>
  <loc>${loc}</loc>${lastmod}
  <changefreq>weekly</changefreq>
</url>`;
  }).join('\n');

  return `${xmlPrefix}
${urls}
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
      
      const xml = generateSitemapXml(items, baseUrl, 'pages');
      
      return new Response(xml, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600',
          'X-Sitemap-Source': 'custom-pages-query',
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
