import {PRODUCT_CARD_FRAGMENT} from '~/preserved/fragments';
import type {ProductCardProduct} from '~/components/ProductCard';

/**
 * Product showcase utilities for fetching curated products via boolean metafields.
 *
 * Product-level metafields (namespace: custom, type: boolean):
 * - custom.showcase_featured: true = show in homepage featured section
 * - custom.showcase_new_arrival: true = show in new arrivals section
 * - custom.showcase_best_seller: true = show in best sellers section
 * - custom.showcase_hero_{category}: true = show in category hero sections
 *
 * This approach allows:
 * - Easy automation via bulk metafield updates
 * - Simple deprecation by setting to false
 * - Query filtering by metafield value
 *
 * Metafield setup in Shopify Admin:
 * 1. Go to Settings → Custom data → Products
 * 2. Add metafield definitions:
 *    - Name: "Showcase - Featured"
 *    - Namespace and key: custom.showcase_featured
 *    - Type: True or false (boolean)
 * 3. Repeat for showcase_new_arrival, showcase_best_seller, etc.
 */

// Metafield keys for showcase types
export const SHOWCASE_METAFIELD_KEYS = {
  featured: 'showcase_featured',
  newArrivals: 'showcase_new_arrival',
  bestSellers: 'showcase_best_seller',
} as const;

// Category tag to hero metafield key mapping
export const CATEGORY_HERO_KEYS: Record<string, string> = {
  disposables: 'showcase_hero_disposables',
  'e-liquids': 'showcase_hero_eliquids',
  eliquids: 'showcase_hero_eliquids',
  devices: 'showcase_hero_devices',
  'pods-coils': 'showcase_hero_pods_coils',
  'nicotine-pouches': 'showcase_hero_nicotine_pouches',
  cbd: 'showcase_hero_cbd',
  accessories: 'showcase_hero_accessories',
};

/**
 * GraphQL query to fetch featured products (where custom.showcase_featured = true).
 * Uses metafield filter to query products directly.
 */
export const FEATURED_PRODUCTS_QUERY = `#graphql
  query FeaturedShowcaseProducts(
    $first: Int!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first
      sortKey: BEST_SELLING
      query: "metafield:custom.showcase_featured:true"
    ) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

/**
 * GraphQL query to fetch new arrival products (where custom.showcase_new_arrival = true).
 */
export const NEW_ARRIVALS_QUERY = `#graphql
  query NewArrivalsShowcaseProducts(
    $first: Int!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first
      sortKey: CREATED_AT
      reverse: true
      query: "metafield:custom.showcase_new_arrival:true"
    ) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

/**
 * GraphQL query to fetch best seller products (where custom.showcase_best_seller = true).
 */
export const BEST_SELLERS_QUERY = `#graphql
  query BestSellersShowcaseProducts(
    $first: Int!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first
      sortKey: BEST_SELLING
      query: "metafield:custom.showcase_best_seller:true"
    ) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

/**
 * GraphQL query to fetch category hero products by metafield key.
 * Pass the full metafield query string as a variable.
 */
export const CATEGORY_HERO_QUERY = `#graphql
  query CategoryHeroProducts(
    $first: Int!
    $metafieldQuery: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first
      sortKey: BEST_SELLING
      query: $metafieldQuery
    ) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

/**
 * Fallback query to fetch best-selling products when no showcase products are configured.
 */
export const FALLBACK_FEATURED_PRODUCTS_QUERY = `#graphql
  query FallbackFeaturedProducts(
    $first: Int!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: $first, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

// Type definitions for query responses
export interface ShowcaseProductsResponse {
  products: {
    nodes: ProductCardProduct[];
  };
}

export interface FallbackFeaturedResponse {
  products: {
    nodes: ProductCardProduct[];
  };
}

/**
 * Extract products from a showcase query response.
 */
export function extractShowcaseProducts(
  response: ShowcaseProductsResponse | null | undefined,
): ProductCardProduct[] {
  return response?.products?.nodes ?? [];
}

/**
 * Get the metafield query string for a category hero.
 */
export function getCategoryHeroQuery(tag: string): string | null {
  const normalizedTag = tag.toLowerCase().split(/\s+/).join('-');
  const metafieldKey = CATEGORY_HERO_KEYS[normalizedTag];
  if (!metafieldKey) return null;
  return `metafield:custom.${metafieldKey}:true`;
}

/**
 * Get the metafield key for a category tag's hero products.
 */
export function getCategoryHeroKey(tag: string): string | null {
  const normalizedTag = tag.toLowerCase().split(/\s+/).join('-');
  return CATEGORY_HERO_KEYS[normalizedTag] ?? null;
}

/**
 * Showcase query result structure.
 */
export type ShowcaseQueryResult = {
  featured: ProductCardProduct[];
  newArrivals: ProductCardProduct[];
  bestSellers: ProductCardProduct[];
};

/**
 * Fetch all showcase products in parallel.
 * Use this in loaders to get featured, new arrivals, and best sellers at once.
 *
 * @example
 * ```ts
 * const showcases = await fetchAllShowcases(context.storefront, {
 *   featured: 8,
 *   newArrivals: 4,
 *   bestSellers: 4,
 * });
 * ```
 */
export async function fetchAllShowcases(
  storefront: {
    query: <T>(query: string, options?: {variables?: Record<string, unknown>; cache?: unknown}) => Promise<T>;
    CacheLong: () => unknown;
  },
  counts: {featured?: number; newArrivals?: number; bestSellers?: number} = {},
): Promise<ShowcaseQueryResult> {
  const {featured = 8, newArrivals = 4, bestSellers = 4} = counts;

  const [featuredRes, newArrivalsRes, bestSellersRes] = await Promise.all([
    storefront.query<ShowcaseProductsResponse>(FEATURED_PRODUCTS_QUERY, {
      variables: {first: featured},
      cache: storefront.CacheLong(),
    }).catch(() => null),
    storefront.query<ShowcaseProductsResponse>(NEW_ARRIVALS_QUERY, {
      variables: {first: newArrivals},
      cache: storefront.CacheLong(),
    }).catch(() => null),
    storefront.query<ShowcaseProductsResponse>(BEST_SELLERS_QUERY, {
      variables: {first: bestSellers},
      cache: storefront.CacheLong(),
    }).catch(() => null),
  ]);

  return {
    featured: extractShowcaseProducts(featuredRes),
    newArrivals: extractShowcaseProducts(newArrivalsRes),
    bestSellers: extractShowcaseProducts(bestSellersRes),
  };
}

/**
 * Fetch category hero products.
 *
 * @example
 * ```ts
 * const heroProducts = await fetchCategoryHero(context.storefront, 'disposables', 4);
 * ```
 */
export async function fetchCategoryHero(
  storefront: {
    query: <T>(query: string, options?: {variables?: Record<string, unknown>; cache?: unknown}) => Promise<T>;
    CacheLong: () => unknown;
  },
  categoryTag: string,
  count = 4,
): Promise<ProductCardProduct[]> {
  const metafieldQuery = getCategoryHeroQuery(categoryTag);
  if (!metafieldQuery) return [];

  try {
    const response = await storefront.query<ShowcaseProductsResponse>(CATEGORY_HERO_QUERY, {
      variables: {first: count, metafieldQuery},
      cache: storefront.CacheLong(),
    });
    return extractShowcaseProducts(response);
  } catch {
    return [];
  }
}
