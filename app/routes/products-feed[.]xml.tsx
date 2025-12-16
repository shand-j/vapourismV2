/**
 * Google Merchant Center Product Feed
 * 
 * Generates XML product feed for Google Shopping integration.
 * URL: /products-feed.xml
 * 
 * Required GMC fields:
 * - id, title, description, link, image_link
 * - price, availability, condition, brand
 * 
 * Optional but recommended:
 * - gtin (barcode), mpn (sku), product_type
 */

import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';

const PRODUCTS_FEED_QUERY = `#graphql
  query ProductsFeed($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          handle
          description
          vendor
          productType
          availableForSale
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url
          }
          variants(first: 1) {
            edges {
              node {
                id
                sku
                barcode
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
` as const;

interface ProductNode {
  id: string;
  title: string;
  handle: string;
  description: string;
  vendor: string;
  productType: string;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  featuredImage: {
    url: string;
  } | null;
  variants: {
    edges: Array<{
      node: {
        id: string;
        sku: string | null;
        barcode: string | null;
        price: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
}

interface ProductsQueryResult {
  products: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    edges: Array<{node: ProductNode}>;
  };
}

// Escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe
    .split('&').join('&amp;')
    .split('<').join('&lt;')
    .split('>').join('&gt;')
    .split('"').join('&quot;')
    .split("'").join('&apos;');
}

// Strip HTML tags from description
function stripHtml(html: string): string {
  return html.split(/<[^>]*>/).join('').trim();
}

// Truncate description to GMC max length (5000 chars)
function truncateDescription(description: string, maxLength = 5000): string {
  const clean = stripHtml(description);
  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength - 3) + '...';
}

export async function loader({context}: LoaderFunctionArgs) {
  const siteUrl = 'https://www.vapourism.co.uk';
  const allProducts: ProductNode[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;
  
  // Fetch all products (paginated)
  while (hasNextPage) {
    const result = await context.storefront.query<ProductsQueryResult>(PRODUCTS_FEED_QUERY, {
      variables: {
        first: 250, // Max allowed per request
        after: cursor,
      },
      cache: context.storefront.CacheLong(), // Cache for 1 hour
    });
    
    allProducts.push(...result.products.edges.map((edge) => edge.node));
    hasNextPage = result.products.pageInfo.hasNextPage;
    cursor = result.products.pageInfo.endCursor;
    
    // Safety limit - prevent infinite loops
    if (allProducts.length > 10000) break;
  }
  
  // Build XML feed
  const xmlItems = allProducts.map((product) => {
    const variant = product.variants.edges[0]?.node;
    const productId = product.id.replace('gid://shopify/Product/', '');
    const price = `${product.priceRange.minVariantPrice.amount} ${product.priceRange.minVariantPrice.currencyCode}`;
    const availability = product.availableForSale ? 'in_stock' : 'out_of_stock';
    
    // Build item XML
    let item = `
    <item>
      <g:id>${escapeXml(productId)}</g:id>
      <title>${escapeXml(product.title)}</title>
      <description>${escapeXml(truncateDescription(product.description))}</description>
      <link>${siteUrl}/products/${escapeXml(product.handle)}</link>
      <g:price>${escapeXml(price)}</g:price>
      <g:availability>${availability}</g:availability>
      <g:condition>new</g:condition>
      <g:brand>${escapeXml(product.vendor)}</g:brand>`;
    
    // Add image if available
    if (product.featuredImage?.url) {
      item += `
      <g:image_link>${escapeXml(product.featuredImage.url)}</g:image_link>`;
    }
    
    // Add GTIN (barcode) if available
    if (variant?.barcode) {
      item += `
      <g:gtin>${escapeXml(variant.barcode)}</g:gtin>`;
    }
    
    // Add MPN (SKU) if available and no GTIN
    if (variant?.sku && !variant.barcode) {
      item += `
      <g:mpn>${escapeXml(variant.sku)}</g:mpn>`;
    }
    
    // Add product type if available
    if (product.productType) {
      item += `
      <g:product_type>${escapeXml(product.productType)}</g:product_type>`;
    }
    
    // Add identifier_exists flag (required if no GTIN/MPN)
    if (!variant?.barcode && !variant?.sku) {
      item += `
      <g:identifier_exists>false</g:identifier_exists>`;
    }
    
    // Age restriction for vaping products (UK 18+)
    item += `
      <g:age_group>adult</g:age_group>`;
    
    item += `
    </item>`;
    
    return item;
  });
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Vapourism Product Feed</title>
    <link>${siteUrl}</link>
    <description>Premium vaping products and e-liquids from Vapourism UK</description>
    ${xmlItems.join('')}
  </channel>
</rss>`;
  
  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
}
