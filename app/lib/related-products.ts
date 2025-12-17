/**
 * Related Products Service
 * 
 * Finds related products using multiple strategies to improve internal linking
 * and reduce orphan pages. Prioritizes products that are similar but diverse
 * enough to be interesting to customers.
 */

import type {Storefront} from '@shopify/hydrogen';

/**
 * GraphQL fragment for product card data
 */
const PRODUCT_CARD_FRAGMENT = `#graphql
  fragment ProductCard on Product {
    id
    title
    handle
    vendor
    featuredImage {
      url
      altText
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
  }
` as const;

/**
 * Query to find products by vendor
 */
const PRODUCTS_BY_VENDOR_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query ProductsByVendor($vendor: String!, $first: Int!) {
    products(first: $first, query: $vendor) {
      nodes {
        ...ProductCard
      }
    }
  }
` as const;

/**
 * Query to find products by product type
 */
const PRODUCTS_BY_TYPE_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query ProductsByType($productType: String!, $first: Int!) {
    products(first: $first, query: $productType) {
      nodes {
        ...ProductCard
      }
    }
  }
` as const;

/**
 * Query to find products by tag
 */
const PRODUCTS_BY_TAG_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query ProductsByTag($tag: String!, $first: Int!) {
    products(first: $first, query: $tag) {
      nodes {
        ...ProductCard
      }
    }
  }
` as const;

/**
 * Query to get random popular products as fallback
 */
const POPULAR_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query PopularProducts($first: Int!) {
    products(first: $first, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
` as const;

/**
 * Product card data structure - matches ProductCardProduct from ProductCard.tsx
 */
export interface ProductCard {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  featuredImage?: {
    url: string;
    altText?: string | null;
  } | null;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
}

/**
 * Type alias for compatibility with ProductCard component
 */
export type ProductCardProduct = ProductCard;

interface ProductsQueryResult {
  products: {
    nodes: ProductCard[];
  };
}

interface RelatedProductsParams {
  storefront: Storefront;
  currentProductId: string;
  vendor: string;
  productType: string;
  tags: string[];
  limit?: number;
}

interface RelatedProductsResult {
  products: ProductCard[];
  strategy: 'vendor' | 'productType' | 'tags' | 'mixed' | 'popular';
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Remove duplicates from product array by ID
 */
function deduplicateProducts(products: ProductCard[]): ProductCard[] {
  const seen = new Set<string>();
  return products.filter((product) => {
    if (seen.has(product.id)) {
      return false;
    }
    seen.add(product.id);
    return true;
  });
}

/**
 * Find related products using vendor match
 * Fetches extra products to allow for filtering current product and provide variety
 */
async function findProductsByVendor(
  storefront: Storefront,
  vendor: string,
  limit: number,
): Promise<ProductCard[]> {
  try {
    const query = `vendor:${vendor}`;
    // Fetch 50% more to account for current product filtering and provide shuffle variety
    // For small catalogs (limit=8), this fetches 12 products which is reasonable
    const fetchLimit = Math.min(limit + Math.ceil(limit * 0.5), 20);
    const result = await storefront.query<ProductsQueryResult>(PRODUCTS_BY_VENDOR_QUERY, {
      variables: {vendor: query, first: fetchLimit},
      cache: storefront.CacheShort(),
    });
    return shuffleArray(result.products.nodes).slice(0, limit);
  } catch (error) {
    console.error('Error fetching products by vendor:', error);
    return [];
  }
}

/**
 * Find related products using product type match
 */
async function findProductsByType(
  storefront: Storefront,
  productType: string,
  limit: number,
): Promise<ProductCard[]> {
  try {
    const query = `product_type:${productType}`;
    const fetchLimit = Math.min(limit + Math.ceil(limit * 0.5), 20);
    const result = await storefront.query<ProductsQueryResult>(PRODUCTS_BY_TYPE_QUERY, {
      variables: {productType: query, first: fetchLimit},
      cache: storefront.CacheShort(),
    });
    return shuffleArray(result.products.nodes).slice(0, limit);
  } catch (error) {
    console.error('Error fetching products by type:', error);
    return [];
  }
}

/**
 * Find related products using tag match
 */
async function findProductsByTag(
  storefront: Storefront,
  tag: string,
  limit: number,
): Promise<ProductCard[]> {
  try {
    const query = `tag:${tag}`;
    const fetchLimit = Math.min(limit + Math.ceil(limit * 0.5), 20);
    const result = await storefront.query<ProductsQueryResult>(PRODUCTS_BY_TAG_QUERY, {
      variables: {tag: query, first: fetchLimit},
      cache: storefront.CacheShort(),
    });
    return shuffleArray(result.products.nodes).slice(0, limit);
  } catch (error) {
    console.error('Error fetching products by tag:', error);
    return [];
  }
}

/**
 * Get popular products as fallback
 */
async function getPopularProducts(storefront: Storefront, limit: number): Promise<ProductCard[]> {
  try {
    const result = await storefront.query<ProductsQueryResult>(POPULAR_PRODUCTS_QUERY, {
      variables: {first: limit},
      cache: storefront.CacheLong(),
    });
    return result.products.nodes;
  } catch (error) {
    console.error('Error fetching popular products:', error);
    return [];
  }
}

/**
 * Find related products using multiple strategies
 * 
 * Strategy priority:
 * 1. Same vendor (brand affinity)
 * 2. Same product type (category browsing)
 * 3. Shared tags (feature similarity)
 * 4. Popular products (fallback)
 * 
 * Returns a diverse mix of products for better discovery
 */
export async function findRelatedProducts({
  storefront,
  currentProductId,
  vendor,
  productType,
  tags,
  limit = 8,
}: RelatedProductsParams): Promise<RelatedProductsResult> {
  const allRelatedProducts: ProductCard[] = [];
  let strategy: RelatedProductsResult['strategy'] = 'mixed';

  // Strategy 1: Find products by vendor (most relevant)
  const vendorProducts = await findProductsByVendor(storefront, vendor, limit);
  allRelatedProducts.push(...vendorProducts);

  // If we have enough from vendor, use vendor strategy
  if (vendorProducts.length >= limit) {
    strategy = 'vendor';
  } else {
    // Strategy 2: Find products by product type
    const typeProducts = await findProductsByType(storefront, productType, limit);
    allRelatedProducts.push(...typeProducts);

    if (typeProducts.length >= limit) {
      strategy = 'productType';
    } else {
      // Strategy 3: Find products by tags (use most relevant tags)
      const relevantTags = tags.filter(
        (tag) =>
          !tag.startsWith('shopify_') &&
          !tag.startsWith('gid:') &&
          tag.length > 2 &&
          // Filter out overly generic tags
          !['product', 'vape', 'sale', 'new'].includes(tag.toLowerCase()),
      );

      // Try first 3 most relevant tags
      for (const tag of relevantTags.slice(0, 3)) {
        const tagProducts = await findProductsByTag(storefront, tag, Math.ceil(limit / 2));
        allRelatedProducts.push(...tagProducts);
      }

      if (relevantTags.length > 0 && allRelatedProducts.length >= limit) {
        strategy = 'tags';
      }
    }
  }

  // Remove duplicates and current product
  const deduplicated = deduplicateProducts(allRelatedProducts).filter(
    (product) => product.id !== currentProductId,
  );

  // If we still don't have enough, add popular products
  if (deduplicated.length < limit) {
    const popularProducts = await getPopularProducts(storefront, limit);
    allRelatedProducts.push(...popularProducts);
    strategy = deduplicated.length > 0 ? 'mixed' : 'popular';
  }

  // Final deduplication and shuffle for variety
  const finalProducts = shuffleArray(
    deduplicateProducts(allRelatedProducts).filter((product) => product.id !== currentProductId),
  ).slice(0, limit);

  return {
    products: finalProducts,
    strategy,
  };
}

/**
 * Extract primary category from tags for breadcrumb
 */
export function extractPrimaryCategoryFromTags(tags: string[]): string | null {
  const categoryTags = [
    'disposable',
    'e-liquid',
    'device',
    'pod_system',
    'box_mod',
    'tank',
    'pod',
    'coil',
    'accessory',
    'CBD',
    'nicotine_pouches',
  ];

  for (const tag of tags) {
    if (categoryTags.includes(tag)) {
      return tag;
    }
  }

  return null;
}

/**
 * Build breadcrumb items from product data
 */
export function buildProductBreadcrumb(
  productType: string,
  vendor: string,
  tags: string[],
): Array<{label: string; url: string}> {
  const items: Array<{label: string; url: string}> = [];

  // Try to find primary category from tags first
  const primaryCategory = extractPrimaryCategoryFromTags(tags);

  if (primaryCategory) {
    // Map category tags to user-friendly labels
    const categoryLabels: Record<string, string> = {
      disposable: 'Disposable Vapes',
      'e-liquid': 'E-Liquids',
      device: 'Vape Devices',
      pod_system: 'Pod Systems',
      box_mod: 'Box Mods',
      tank: 'Tanks',
      pod: 'Pods',
      coil: 'Coils',
      accessory: 'Accessories',
      CBD: 'CBD Products',
      nicotine_pouches: 'Nicotine Pouches',
    };

    items.push({
      label: categoryLabels[primaryCategory] || productType,
      url: `/search?tag=${primaryCategory}`,
    });
  } else if (productType) {
    // Fallback to product type
    items.push({
      label: productType,
      url: `/search?productType=${encodeURIComponent(productType)}`,
    });
  }

  // Add vendor/brand
  if (vendor) {
    items.push({
      label: vendor,
      url: `/search?vendor=${encodeURIComponent(vendor)}`,
    });
  }

  return items;
}
