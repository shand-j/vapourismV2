/**
 * Shopify Native Search Implementation for V2
 * 
 * Replaces Algolia with Shopify Storefront API predictive search.
 * 
 * Key features:
 * - Predictive search for autocomplete
 * - Full search results with pagination
 * - Edge caching hints
 * - Debouncing utilities
 * 
 * References:
 * - https://shopify.dev/docs/api/storefront/2025-01/queries/predictiveSearch
 * - https://shopify.dev/docs/api/storefront/2025-01/queries/search
 */

import type {Storefront} from '@shopify/hydrogen';
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';
import type {
  PredictiveSearchQuery,
  PredictiveSearchQueryVariables,
  SearchProductsQuery,
  SearchProductsQueryVariables,
} from 'storefrontapi.generated';

export interface PredictiveSearchProduct {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  featuredImage?: {
    url: string;
    altText?: string;
  };
  availableForSale: boolean;
}

export interface PredictiveSearchCollection {
  id: string;
  title: string;
  handle: string;
}

export interface PredictiveSearchResults {
  products: PredictiveSearchProduct[];
  collections: PredictiveSearchCollection[];
  queries: Array<{
    text: string;
    styledText: string;
  }>;
}

export interface SearchProduct extends PredictiveSearchProduct {
  productType: string;
  tags: string[];
  description: string;
}

export interface SearchResults {
  products: SearchProduct[];
  totalCount: number;
  pageInfo: {
    hasNextPage: boolean;
    endCursor?: string;
  };
}

const DEFAULT_PREDICTIVE_TYPES: StorefrontAPI.PredictiveSearchType[] = ['PRODUCT'];
const DEFAULT_SEARCH_SORT_KEY: StorefrontAPI.SearchSortKeys = 'RELEVANCE';

const EMPTY_PREDICTIVE_RESULTS: PredictiveSearchResults = {
  products: [],
  collections: [], // Empty - collections not used in this store
  queries: [],
};

type SearchProductsOptions = {
  first?: number;
  after?: string;
  sortKey?: StorefrontAPI.SearchSortKeys | null;
  reverse?: boolean;
  filters?: StorefrontAPI.ProductFilter[];
};

/**
 * Predictive Search GraphQL Query
 * Used for autocomplete suggestions
 */
const PREDICTIVE_SEARCH_QUERY = `#graphql
  query PredictiveSearch(
    $query: String!
    $limit: Int
    $types: [PredictiveSearchType!]
  ) {
    predictiveSearch(
      query: $query
      limit: $limit
      limitScope: EACH
      searchableFields: [TITLE, PRODUCT_TYPE, VARIANTS_TITLE, VENDOR, TAG]
      types: $types
      unavailableProducts: HIDE
    ) {
      products {
        id
        title
        handle
        vendor
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        featuredImage {
          url
          altText
        }
        variants(first: 1) {
          edges {
            node {
              id
              availableForSale
            }
          }
        }
      }
      collections {
        id
        title
        handle
      }
      queries {
        text
        styledText
      }
    }
  }
` as const;

/**
 * Full Search GraphQL Query
 * Used for search results pages
 */
const SEARCH_QUERY = `#graphql
  query SearchProducts(
    $query: String!
    $first: Int
    $after: String
    $sortKey: SearchSortKeys
    $reverse: Boolean
  ) {
    search(
      query: $query
      first: $first
      after: $after
      sortKey: $sortKey
      reverse: $reverse
      types: PRODUCT
      unavailableProducts: HIDE
    ) {
      edges {
        node {
          ... on Product {
            id
            title
            handle
            vendor
            productType
            tags
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            featuredImage {
              url(transform: {maxWidth: 500})
              altText
            }
            availableForSale
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
` as const;

/**
 * Perform predictive search for autocomplete
 * 
 * @param storefront - Hydrogen Storefront client
 * @param query - Search query string
 * @param limit - Maximum results per type (default: 10)
 * @param types - Types to search (default: [PRODUCT, COLLECTION])
 * @returns Predictive search results
 */
export async function predictiveSearch(
  storefront: Storefront,
  query: string,
  limit: number = 10,
  types: StorefrontAPI.PredictiveSearchType[] = DEFAULT_PREDICTIVE_TYPES
): Promise<PredictiveSearchResults> {
  const trimmedQuery = query?.trim() ?? '';
  if (trimmedQuery.length < 2) {
    return EMPTY_PREDICTIVE_RESULTS;
  }

  try {
  const response = await storefront.query<PredictiveSearchQuery>(
      PREDICTIVE_SEARCH_QUERY,
      {
        variables: {
          query: trimmedQuery,
          limit,
          types,
        },
        cache: storefront.CacheLong(),
      }
    );

    const results = response?.predictiveSearch;
    if (!results) {
      return EMPTY_PREDICTIVE_RESULTS;
    }

    const products = (results.products ?? []).map((product) => ({
      id: product.id,
      title: product.title,
      handle: product.handle,
      vendor: product.vendor,
      priceRange: product.priceRange,
      featuredImage: product.featuredImage?.url
        ? {
            url: product.featuredImage.url,
            altText: product.featuredImage.altText ?? undefined,
          }
        : undefined,
      availableForSale: product.variants?.edges?.[0]?.node?.availableForSale ?? false,
    }));

    return {
      products,
      collections: results.collections ?? [],
      queries: results.queries ?? [],
    };
  } catch (error) {
    console.error('Predictive search error:', error);
    return EMPTY_PREDICTIVE_RESULTS;
  }
}

/**
 * Perform full product search with pagination
 * 
 * @param storefront - Hydrogen Storefront client
 * @param query - Search query string
 * @param options - Search options (pagination, sorting, filters)
 * @returns Search results with pagination info
 */
export async function searchProducts(
  storefront: Storefront,
  term: string,
  options: SearchProductsOptions = {}
): Promise<SearchResults> {
  const {
    first = 24,
    after,
    sortKey = DEFAULT_SEARCH_SORT_KEY,
    reverse = false,
    filters = [],
  } = options;

  const trimmedTerm = term?.trim() ?? '';

  // Build the full query string from term and filters
  const queryParts: string[] = [];
  if (trimmedTerm) {
    queryParts.push(trimmedTerm);
  }

  // Add filters to the query string
  for (const filter of filters) {
    if ('productType' in filter && filter.productType) {
      queryParts.push(`product_type:${filter.productType}`);
    } else if ('productVendor' in filter && filter.productVendor) {
      queryParts.push(`vendor:${filter.productVendor}`);
    } else if ('available' in filter) {
      queryParts.push(`available:${filter.available}`);
    } else if ('price' in filter && filter.price) {
      if (filter.price.min !== undefined) {
        queryParts.push(`price:>${filter.price.min}`);
      }
      if (filter.price.max !== undefined) {
        queryParts.push(`price:<${filter.price.max}`);
      }
    }
  }

  const fullQuery = queryParts.join(' ') || '*';

  // Allow empty queries to return all products
  if (fullQuery !== '*' && fullQuery.length < 2) {
    return {
      products: [],
      totalCount: 0,
      pageInfo: {
        hasNextPage: false,
      },
    };
  }

  try {
    const response = await storefront.query<SearchProductsQuery>(SEARCH_QUERY, {
      variables: {
        query: fullQuery,
        first,
        after,
        sortKey,
        reverse,
      },
      cache: storefront.CacheShort(),
    });

    const results = response?.search;
    if (!results) {
      return {
        products: [],
        totalCount: 0,
        pageInfo: {
          hasNextPage: false,
        },
      };
    }

    const mappedProducts = results.edges
      .map((edge) => edge?.node)
      .filter(Boolean) as SearchProduct[];

    return {
      products: mappedProducts,
      totalCount: results.totalCount ?? mappedProducts.length,
      pageInfo: {
        hasNextPage: results.pageInfo?.hasNextPage ?? false,
        endCursor: results.pageInfo?.endCursor ?? undefined,
      },
    };
  } catch (error) {
    console.error('Search error:', error);
    return {
      products: [],
      totalCount: 0,
      pageInfo: {
        hasNextPage: false,
      },
    };
  }
}

/**
 * Debounce utility for search input
 * Prevents excessive API calls while typing
 * 
 * @param func - Function to debounce
 * @param wait - Debounce delay in milliseconds (default: 300ms)
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number = 300
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Cache key generator for search results
 * Used with Oxygen edge caching
 * 
 * @param query - Search query
 * @param options - Search options
 * @returns Cache key string
 */
export function generateSearchCacheKey(
  query: string,
  options: Record<string, any> = {}
): string {
  const normalized = query.toLowerCase().trim();
  const params = Object.entries(options)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');

  return `search:${normalized}${params ? `:${params}` : ''}`;
}

/**
 * Feature flag for gradual rollout
 * Returns true if Shopify search should be used
 * 
 * @param env - Environment variables
 * @returns Whether to use Shopify search
 */
export function useShopifySearch(env?: any): boolean {
  // Check environment variable
  const flag = env?.USE_SHOPIFY_SEARCH || process.env.USE_SHOPIFY_SEARCH;
  
  if (flag === 'true' || flag === '1') return true;
  if (flag === 'false' || flag === '0') return false;
  
  // Default to true for V2
  return true;
}

/**
 * Analytics tracking helper for search events
 * 
 * @param query - Search query
 * @param resultCount - Number of results
 * @param searchType - Type of search ('predictive' | 'full')
 */
export function trackSearchEvent(
  query: string,
  resultCount: number,
  searchType: 'predictive' | 'full' = 'full'
): void {
  if (typeof window === 'undefined') return;

  // GA4 search event
  if ('gtag' in window && typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', 'search', {
      search_term: query,
      search_results: resultCount,
      search_type: searchType,
    });
  }

  // Custom event for analytics
  window.dispatchEvent(
    new CustomEvent('shopify_search', {
      detail: {
        query,
        resultCount,
        searchType,
        timestamp: Date.now(),
      },
    })
  );
}

/**
 * Cached Facet Calculation
 * Uses Hydrogen's caching to avoid recalculating facets on every request
 */
export async function getCachedFacets(
  storefront: Storefront,
  cacheKey = 'facets:v2'
): Promise<ReturnType<typeof buildTagFacetGroups>> {
  // Import here to avoid circular dependency
  const { buildTagFacetGroups } = await import('../lib/search-facets');

  // Use a cached query to get all products for facet data
  const FACET_QUERY = `#graphql
    query FacetData($first: Int, $after: String) {
      products(first: $first, after: $after) {
        nodes {
          id
          vendor
          productType
          tags
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  ` as const;

  try {
    const allProducts: any[] = [];
    let hasNextPage = true;
    let endCursor: string | null = null;

    while (hasNextPage) {
      const response = await storefront.query(FACET_QUERY, {
        variables: {
          first: 250, // Shopify max per page
          after: endCursor,
        },
        cache: storefront.CacheLong(), // Cache for longer periods
      }) as any;

      allProducts.push(...response.products.nodes);
      hasNextPage = response.products.pageInfo.hasNextPage;
      endCursor = response.products.pageInfo.endCursor;
    }

    return buildTagFacetGroups(allProducts, []);
  } catch (error) {
    console.error('Error calculating facets:', error);
    // Return empty facets on error
    return [];
  }
}
