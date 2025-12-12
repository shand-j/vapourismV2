import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

/**
 * Custom sitemap index generator.
 * 
 * The Hydrogen getSitemapIndex relies on the sitemap API which requires
 * products to be published to the Hydrogen sales channel specifically.
 * This custom implementation uses standard queries to count items.
 */

const PRODUCTS_COUNT_QUERY = `#graphql
  query ProductsCount {
    products(first: 1) {
      pageInfo {
        hasNextPage
      }
    }
  }
` as const;

// Query to get actual product count by fetching all (inefficient but accurate)
const ALL_PRODUCT_HANDLES_QUERY = `#graphql
  query AllProductHandles($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        handle
      }
    }
  }
` as const;

interface AllProductsResult {
  products: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    nodes: { handle: string }[];
  };
}

/**
 * Count total products by paginating through all
 */
async function countProducts(
  storefront: LoaderFunctionArgs['context']['storefront']
): Promise<number> {
  let count = 0;
  let hasNextPage = true;
  let cursor: string | null = null;

  while (hasNextPage) {
    const result = await storefront.query<AllProductsResult>(ALL_PRODUCT_HANDLES_QUERY, {
      variables: {
        first: 250,
        after: cursor,
      },
      cache: storefront.CacheLong(),
    });

    count += result.products.nodes.length;
    hasNextPage = result.products.pageInfo.hasNextPage;
    cursor = result.products.pageInfo.endCursor;

    // Safety limit
    if (count > 50000) break;
  }

  return count;
}

export async function loader({
  request,
  context: {storefront},
}: LoaderFunctionArgs) {
  const baseUrl = new URL(request.url).origin;
  
  // Get actual product count
  const productCount = await countProducts(storefront);
  
  // Calculate number of sitemap pages needed (max 250 per page is Shopify's limit, 
  // but we fetch all in one go for simplicity - single page)
  // For a proper implementation, you'd paginate. For now, we use 1 page since
  // our custom handler fetches all products.
  const productPages = productCount > 0 ? 1 : 0;
  
  // Build sitemap index XML
  const sitemaps: string[] = [];
  
  // Add product sitemaps
  for (let i = 1; i <= productPages; i++) {
    sitemaps.push(`  <sitemap><loc>${baseUrl}/sitemap/products/${i}.xml</loc></sitemap>`);
  }
  
  // Add pages sitemap (collections not used - tag-based navigation only)
  sitemaps.push(
    `  <sitemap><loc>${baseUrl}/sitemap/pages/1.xml</loc></sitemap>`
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.join('\n')}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
      'X-Sitemap-Source': 'custom-index',
      'X-Product-Count': String(productCount),
    },
  });
}
