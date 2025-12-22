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

/**
 * Variant information for a search product
 */
export interface SearchProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: {
    amount: string;
    currencyCode: string;
  };
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  /** Raw JSON string from custom.parsed_variant_attributes metafield */
  parsedVariantAttributesJson?: string | null;
}

export interface SearchProduct extends PredictiveSearchProduct {
  productType: string;
  tags: string[];
  description: string;
  /** Raw JSON string from custom.parsed_attributes metafield */
  parsedAttributesJson?: string | null;
  /** Product variants with their attributes */
  variants?: SearchProductVariant[];
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
 * Includes custom.parsed_attributes metafield for product filtering
 * Includes custom.parsed_variant_attributes metafield for variant filtering
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
            parsedAttributes: metafield(namespace: "custom", key: "parsed_attributes") {
              value
            }
            variants(first: 50) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                  parsedVariantAttributes: metafield(namespace: "custom", key: "parsed_variant_attributes") {
                    value
                  }
                }
              }
            }
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
 * @param types - Types to search (default: [PRODUCT] - collections not used)
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

  // Collect tag filters separately to handle OR logic
  const tagFilters: string[] = [];

  // Add filters to the query string
  for (const filter of filters) {
    if ('tag' in filter && filter.tag) {
      // Collect tag filters for OR logic
      tagFilters.push(filter.tag);
    } else if ('productType' in filter && filter.productType) {
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

  // Add tag filters with OR logic if present
  if (tagFilters.length > 0) {
    if (tagFilters.length === 1) {
      // Single tag, no need for parentheses
      queryParts.push(`tag:${tagFilters[0]}`);
    } else {
      // Multiple tags, use OR logic with parentheses
      const tagQuery = tagFilters.map(tag => `tag:${tag}`).join(' OR ');
      queryParts.push(`(${tagQuery})`);
    }
  }

  // Join with AND logic when we have a search term, otherwise just space-separate
  let fullQuery: string;
  if (trimmedTerm && queryParts.length > 1) {
    // If we have a search term, AND it with the filters
    const [searchTerm, ...filterParts] = queryParts;
    fullQuery = `${searchTerm} AND ${filterParts.join(' ')}`;
  } else {
    fullQuery = queryParts.join(' ') || '*';
  }

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
      .map((edge) => {
        const node = edge?.node;
        if (!node) return null;
        
        // Map the product with parsed attributes and variants
        const product: SearchProduct = {
          id: node.id,
          title: node.title,
          handle: node.handle,
          vendor: node.vendor,
          productType: node.productType || '',
          tags: node.tags || [],
          description: node.description || '',
          priceRange: node.priceRange,
          featuredImage: node.featuredImage?.url
            ? {
                url: node.featuredImage.url,
                altText: node.featuredImage.altText ?? undefined,
              }
            : undefined,
          availableForSale: node.availableForSale,
          parsedAttributesJson: (node as any).parsedAttributes?.value || null,
          variants: (node as any).variants?.edges?.map((variantEdge: any) => ({
            id: variantEdge.node.id,
            title: variantEdge.node.title,
            availableForSale: variantEdge.node.availableForSale,
            price: variantEdge.node.price,
            selectedOptions: variantEdge.node.selectedOptions || [],
            parsedVariantAttributesJson: variantEdge.node.parsedVariantAttributes?.value || null,
          })) || [],
        };
        
        return product;
      })
      .filter((p): p is SearchProduct => p !== null);

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
  // Includes custom.parsed_attributes metafield for attribute-based filtering
  const FACET_QUERY = `#graphql
    query FacetData($first: Int, $after: String) {
      products(first: $first, after: $after) {
        nodes {
          id
          vendor
          productType
          tags
          parsedAttributes: metafield(namespace: "custom", key: "parsed_attributes") {
            value
          }
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

      // Map products to include parsed attributes JSON
      const mappedProducts = response.products.nodes.map((node: any) => ({
        ...node,
        parsedAttributesJson: node.parsedAttributes?.value || null,
      }));

      allProducts.push(...mappedProducts);
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
