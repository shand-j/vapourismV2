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
      }
    }
  }
` as const;

const COLLECTIONS_SITEMAP_QUERY = `#graphql
  query CollectionsSitemap($first: Int!, $after: String) {
    collections(first: $first, after: $after) {
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

interface SitemapItem {
  handle: string;
  updatedAt: string;
}

interface ProductsResult {
  products: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    nodes: SitemapItem[];
  };
}

interface CollectionsResult {
  collections: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    nodes: SitemapItem[];
  };
}

interface PagesResult {
  pages: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    nodes: SitemapItem[];
  };
}

/**
 * Fetch all items of a type with pagination for custom sitemap
 */
async function fetchAllItems<T extends ProductsResult | CollectionsResult | PagesResult>(
  storefront: LoaderFunctionArgs['context']['storefront'],
  query: string,
  type: 'products' | 'collections' | 'pages',
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
    allItems.push(...data.nodes);
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

  // Use custom sitemap generator for collections as fallback
  if (type === 'collections') {
    try {
      const items = await fetchAllItems<CollectionsResult>(
        storefront,
        COLLECTIONS_SITEMAP_QUERY,
        'collections'
      );
      
      const xml = generateSitemapXml(items, baseUrl, 'collections');
      
      return new Response(xml, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600',
          'X-Sitemap-Source': 'custom-collections-query',
        },
      });
    } catch (error) {
      console.error('[Sitemap] Error fetching collections:', error);
    }
  }

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
