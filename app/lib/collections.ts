/**
 * Shopify Collection-Based Navigation
 *
 * This module provides collection data fetching, navigation structure building,
 * and utilities for the collection-based navigation system.
 *
 * References:
 * - https://shopify.dev/docs/api/storefront/2025-01/queries/collection
 * - https://shopify.dev/docs/api/storefront/2025-01/queries/collections
 * - https://shopify.dev/docs/custom-storefronts/hydrogen/data-fetching/cache
 */

import type {Storefront} from '@shopify/hydrogen';
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

// =============================================================================
// TYPES
// =============================================================================

export interface CollectionProduct {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  productType: string;
  tags: string[];
  featuredImage?: {
    url: string;
    altText?: string;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  availableForSale: boolean;
}

export interface CollectionFilterValue {
  id: string;
  label: string;
  count: number;
  input: string;
}

export interface CollectionFilter {
  id: string;
  label: string;
  type: string;
  values: CollectionFilterValue[];
}

export interface CollectionData {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  seo: {
    title?: string;
    description?: string;
  };
  image?: {
    url: string;
    altText?: string;
  };
  products: CollectionProduct[];
  filters: CollectionFilter[];
  totalCount: number;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
}

export interface CollectionNavItem {
  id: string;
  title: string;
  handle: string;
  url: string;
  description?: string;
  image?: {
    url: string;
    altText?: string;
  };
  productsCount?: number;
  children?: CollectionNavItem[];
}

export interface CollectionNavCategory {
  id: string;
  label: string;
  handle: string;
  url: string;
  description?: string;
  accentColor: string;
  columns: CollectionNavColumn[];
}

export interface CollectionNavColumn {
  heading: string;
  collections: CollectionNavItem[];
  seeAllHandle?: string;
}

// =============================================================================
// GRAPHQL QUERIES
// =============================================================================

/**
 * Fetch a single collection with products and filters
 */
const COLLECTION_QUERY = `#graphql
  query Collection(
    $handle: String!
    $first: Int!
    $after: String
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      seo {
        title
        description
      }
      image {
        url
        altText
      }
      products(
        first: $first
        after: $after
        filters: $filters
        sortKey: $sortKey
        reverse: $reverse
      ) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        edges {
          node {
            id
            title
            handle
            vendor
            productType
            tags
            featuredImage {
              url(transform: {maxWidth: 500})
              altText
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            availableForSale
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
` as const;

/**
 * Fetch all collections for navigation
 */
const COLLECTIONS_NAV_QUERY = `#graphql
  query CollectionsNav(
    $first: Int!
    $after: String
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collections(first: $first, after: $after) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url(transform: {maxWidth: 200})
            altText
          }
          productsCount: products(first: 0) {
            filters {
              id
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
` as const;

/**
 * Lightweight query to count collection products
 */
const COLLECTION_COUNT_QUERY = `#graphql
  query CollectionCount(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(first: 1) {
        pageInfo {
          hasNextPage
        }
      }
    }
  }
` as const;

// =============================================================================
// SORT OPTIONS
// =============================================================================

export type CollectionSortKey = StorefrontAPI.ProductCollectionSortKeys;

export interface SortOption {
  label: string;
  value: string;
  sortKey: CollectionSortKey;
  reverse: boolean;
}

export const COLLECTION_SORT_OPTIONS: SortOption[] = [
  {label: 'Featured', value: 'COLLECTION_DEFAULT', sortKey: 'COLLECTION_DEFAULT', reverse: false},
  {label: 'Best Selling', value: 'BEST_SELLING', sortKey: 'BEST_SELLING', reverse: false},
  {label: 'Price: Low to High', value: 'PRICE_ASC', sortKey: 'PRICE', reverse: false},
  {label: 'Price: High to Low', value: 'PRICE_DESC', sortKey: 'PRICE', reverse: true},
  {label: 'Newest', value: 'CREATED_DESC', sortKey: 'CREATED', reverse: true},
  {label: 'Name: A-Z', value: 'TITLE_ASC', sortKey: 'TITLE', reverse: false},
  {label: 'Name: Z-A', value: 'TITLE_DESC', sortKey: 'TITLE', reverse: true},
];

export const SORT_LOOKUP = COLLECTION_SORT_OPTIONS.reduce<
  Record<string, {sortKey: CollectionSortKey; reverse: boolean}>
>((acc, option) => {
  acc[option.value] = {sortKey: option.sortKey, reverse: option.reverse};
  return acc;
}, {});

// =============================================================================
// DATA FETCHING FUNCTIONS
// =============================================================================

export interface GetCollectionOptions {
  first?: number;
  after?: string;
  filters?: StorefrontAPI.ProductFilter[];
  sortKey?: CollectionSortKey;
  reverse?: boolean;
}

/**
 * Fetch a collection with products and filters
 *
 * @param storefront - Hydrogen Storefront client
 * @param handle - Collection handle (URL slug)
 * @param options - Pagination, filtering, and sorting options
 * @returns Collection data with products and filters
 */
export async function getCollection(
  storefront: Storefront,
  handle: string,
  options: GetCollectionOptions = {},
): Promise<CollectionData | null> {
  const {
    first = 24,
    after,
    filters = [],
    sortKey = 'COLLECTION_DEFAULT',
    reverse = false,
  } = options;

  try {
    const response = await storefront.query(COLLECTION_QUERY, {
      variables: {
        handle,
        first,
        after,
        filters,
        sortKey,
        reverse,
      },
      cache: storefront.CacheShort(),
    });

    const collection = (response as any)?.collection;
    if (!collection) {
      return null;
    }

    const products = collection.products.edges.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      handle: edge.node.handle,
      vendor: edge.node.vendor,
      productType: edge.node.productType,
      tags: edge.node.tags || [],
      featuredImage: edge.node.featuredImage
        ? {
            url: edge.node.featuredImage.url,
            altText: edge.node.featuredImage.altText,
          }
        : undefined,
      priceRange: edge.node.priceRange,
      availableForSale: edge.node.availableForSale,
    }));

    const collectionFilters: CollectionFilter[] = (collection.products.filters || []).map(
      (filter: any) => ({
        id: filter.id,
        label: filter.label,
        type: filter.type,
        values: (filter.values || []).map((value: any) => ({
          id: value.id,
          label: value.label,
          count: value.count,
          input: value.input,
        })),
      }),
    );

    return {
      id: collection.id,
      title: collection.title,
      handle: collection.handle,
      description: collection.description || '',
      descriptionHtml: collection.descriptionHtml || '',
      seo: {
        title: collection.seo?.title,
        description: collection.seo?.description,
      },
      image: collection.image
        ? {
            url: collection.image.url,
            altText: collection.image.altText,
          }
        : undefined,
      products,
      filters: collectionFilters,
      totalCount: products.length, // Note: Shopify doesn't return totalCount for collections
      pageInfo: {
        hasNextPage: collection.products.pageInfo.hasNextPage,
        hasPreviousPage: collection.products.pageInfo.hasPreviousPage,
        startCursor: collection.products.pageInfo.startCursor,
        endCursor: collection.products.pageInfo.endCursor,
      },
    };
  } catch (error) {
    console.error('Error fetching collection:', error);
    return null;
  }
}

/**
 * Fetch all collections for navigation building
 *
 * @param storefront - Hydrogen Storefront client
 * @param limit - Maximum number of collections to fetch
 * @returns Array of collection nav items
 */
export async function getCollectionsForNav(
  storefront: Storefront,
  limit: number = 100,
): Promise<CollectionNavItem[]> {
  const collections: CollectionNavItem[] = [];
  let hasNextPage = true;
  let endCursor: string | undefined;

  try {
    while (hasNextPage && collections.length < limit) {
      const batchSize = Math.min(50, limit - collections.length);
      const response = await storefront.query(COLLECTIONS_NAV_QUERY, {
        variables: {
          first: batchSize,
          after: endCursor,
        },
        cache: storefront.CacheLong(),
      });

      const data = response as any;
      const edges = data?.collections?.edges || [];

      for (const edge of edges) {
        const node = edge.node;
        collections.push({
          id: node.id,
          title: node.title,
          handle: node.handle,
          url: `/collections/${node.handle}`,
          description: node.description,
          image: node.image
            ? {
                url: node.image.url,
                altText: node.image.altText,
              }
            : undefined,
        });
      }

      hasNextPage = data?.collections?.pageInfo?.hasNextPage ?? false;
      endCursor = data?.collections?.pageInfo?.endCursor;
    }

    return collections;
  } catch (error) {
    console.error('Error fetching collections for nav:', error);
    return [];
  }
}

// =============================================================================
// NAVIGATION STRUCTURE BUILDING
// =============================================================================

/**
 * Category configuration for navigation
 * Maps top-level categories to their accent colors and structure
 */
export interface CategoryConfig {
  id: string;
  label: string;
  handle: string;
  accentColor: string;
  description: string;
  subCategories: {
    heading: string;
    handles: string[];
  }[];
}

/**
 * Default category configuration
 * This maps conceptual categories to collection handles
 */
export const COLLECTION_CATEGORIES: CategoryConfig[] = [
  {
    id: 'disposables',
    label: 'Reusables',
    handle: 'disposables',
    accentColor: '#f97316',
    description: 'Ready-to-use devices with pre-filled e-liquid.',
    subCategories: [
      {heading: 'By Puff Count', handles: ['disposables-3500', 'disposables-5000', 'disposables-9000']},
      {heading: 'By Brand', handles: ['elf-bar', 'lost-mary', 'crystal-bar', 'hayati']},
    ],
  },
  {
    id: 'e-liquids',
    label: 'E-Liquids',
    handle: 'e-liquids',
    accentColor: '#8b5cf6',
    description: 'Premium vape juice in every flavour and strength.',
    subCategories: [
      {heading: 'By Type', handles: ['nic-salts', 'shortfills', 'freebase']},
      {heading: 'By Size', handles: ['10ml-liquids', '50ml-liquids', '100ml-liquids']},
    ],
  },
  {
    id: 'devices',
    label: 'Devices',
    handle: 'devices',
    accentColor: '#0ea5e9',
    description: 'Pod systems, box mods, and starter kits.',
    subCategories: [
      {heading: 'By Type', handles: ['pod-systems', 'box-mods', 'starter-kits']},
      {heading: 'By Brand', handles: ['voopoo', 'smok', 'aspire', 'vaporesso']},
    ],
  },
  {
    id: 'pods-coils',
    label: 'Pods & Coils',
    handle: 'pods-coils',
    accentColor: '#06b6d4',
    description: 'Replacement pods and coils for your devices.',
    subCategories: [
      {heading: 'Pods', handles: ['pre-filled-pods', 'replacement-pods']},
      {heading: 'Coils', handles: ['sub-ohm-coils', 'mtl-coils']},
    ],
  },
  {
    id: 'accessories',
    label: 'Accessories',
    handle: 'accessories',
    accentColor: '#64748b',
    description: 'Batteries, chargers, cases, and more.',
    subCategories: [
      {heading: 'Power', handles: ['batteries', 'chargers']},
      {heading: 'Tools', handles: ['tool-kits', 'cotton-wire']},
    ],
  },
  {
    id: 'nicotine-pouches',
    label: 'Nic Pouches',
    handle: 'nicotine-pouches',
    accentColor: '#ec4899',
    description: 'Tobacco-free nicotine pouches.',
    subCategories: [
      {heading: 'By Brand', handles: ['velo-nicotine-pouches', 'zyn-nicotine-pouches']},
      {heading: 'By Strength', handles: ['low-strength-pouches', 'high-strength-pouches']},
    ],
  },
];

/**
 * Build navigation structure from collections
 *
 * @param collections - Array of collection nav items
 * @param categoryConfigs - Category configuration
 * @returns Navigation structure with categories and columns
 */
export function buildNavigationStructure(
  collections: CollectionNavItem[],
  categoryConfigs: CategoryConfig[] = COLLECTION_CATEGORIES,
): CollectionNavCategory[] {
  const collectionMap = new Map(collections.map((c) => [c.handle, c]));

  return categoryConfigs
    .map((config) => {
      const columns = config.subCategories
        .map((subCat) => {
          const navItems = subCat.handles
            .map((handle) => collectionMap.get(handle))
            .filter((item): item is CollectionNavItem => item !== undefined);

          if (navItems.length === 0) return null;

          return {
            heading: subCat.heading,
            collections: navItems,
            seeAllHandle: config.handle,
          } as CollectionNavColumn;
        })
        .filter((col): col is CollectionNavColumn => col !== null);

      return {
        id: config.id,
        label: config.label,
        handle: config.handle,
        url: `/collections/${config.handle}`,
        description: config.description,
        accentColor: config.accentColor,
        columns,
      };
    })
    .filter((cat) => cat.columns.length > 0);
}

// =============================================================================
// FILTER PARSING UTILITIES
// =============================================================================

export interface ParsedFilters {
  vendor?: string[];
  productType?: string[];
  available?: boolean;
  price?: {min?: number; max?: number};
  variantOptions?: {name: string; value: string}[];
}

/**
 * Parse URL search params into Shopify ProductFilter array
 *
 * @param searchParams - URL search params
 * @returns Array of ProductFilter objects
 */
export function parseFiltersFromSearchParams(
  searchParams: URLSearchParams,
): StorefrontAPI.ProductFilter[] {
  const filters: StorefrontAPI.ProductFilter[] = [];

  // Vendor/brand filters
  const vendors = searchParams.getAll('vendor');
  vendors.forEach((vendor) => {
    filters.push({productVendor: vendor});
  });

  // Product type filters
  const types = searchParams.getAll('type');
  types.forEach((type) => {
    filters.push({productType: type});
  });

  // Availability filter
  const availability = searchParams.get('availability');
  if (availability === 'in-stock') {
    filters.push({available: true});
  } else if (availability === 'out-of-stock') {
    filters.push({available: false});
  }

  // Price range filter
  const priceMin = searchParams.get('price_min');
  const priceMax = searchParams.get('price_max');
  if (priceMin || priceMax) {
    const priceFilter: StorefrontAPI.ProductFilter = {price: {}};
    if (priceMin) {
      const minVal = parseFloat(priceMin);
      if (!isNaN(minVal)) {
        priceFilter.price!.min = minVal;
      }
    }
    if (priceMax) {
      const maxVal = parseFloat(priceMax);
      if (!isNaN(maxVal)) {
        priceFilter.price!.max = maxVal;
      }
    }
    if (priceFilter.price?.min !== undefined || priceFilter.price?.max !== undefined) {
      filters.push(priceFilter);
    }
  }

  // Variant option filters (e.g., size, color)
  // Format: option_name=value (e.g., size=large)
  const variantOptionPrefixes = ['size', 'color', 'strength', 'flavour'];
  variantOptionPrefixes.forEach((prefix) => {
    const values = searchParams.getAll(prefix);
    values.forEach((value) => {
      filters.push({
        variantOption: {
          name: prefix.charAt(0).toUpperCase() + prefix.slice(1),
          value,
        },
      });
    });
  });

  return filters;
}

/**
 * Serialize filters back to URL search params
 *
 * @param filters - Parsed filter state
 * @returns URLSearchParams object
 */
export function serializeFiltersToSearchParams(filters: ParsedFilters): URLSearchParams {
  const params = new URLSearchParams();

  filters.vendor?.forEach((v) => params.append('vendor', v));
  filters.productType?.forEach((t) => params.append('type', t));

  if (filters.available !== undefined) {
    params.set('availability', filters.available ? 'in-stock' : 'out-of-stock');
  }

  if (filters.price?.min !== undefined) {
    params.set('price_min', filters.price.min.toString());
  }
  if (filters.price?.max !== undefined) {
    params.set('price_max', filters.price.max.toString());
  }

  filters.variantOptions?.forEach((opt) => {
    params.append(opt.name.toLowerCase(), opt.value);
  });

  return params;
}

// =============================================================================
// URL HELPERS
// =============================================================================

/**
 * Build collection URL with optional filters
 *
 * @param handle - Collection handle
 * @param filters - Optional filter params
 * @returns Collection URL string
 */
export function buildCollectionUrl(
  handle: string,
  filters?: URLSearchParams | Record<string, string | string[]>,
): string {
  const base = `/collections/${handle}`;

  if (!filters) return base;

  const params =
    filters instanceof URLSearchParams
      ? filters
      : new URLSearchParams(
          Object.entries(filters).flatMap(([key, value]) =>
            Array.isArray(value) ? value.map((v) => [key, v]) : [[key, value]],
          ),
        );

  const queryString = params.toString();
  return queryString ? `${base}?${queryString}` : base;
}

/**
 * Get the parent collection handle from a child handle
 * Uses naming convention: parent-child (e.g., "disposables-elf-bar")
 *
 * @param childHandle - Child collection handle
 * @returns Parent handle or null
 */
export function getParentCollectionHandle(childHandle: string): string | null {
  const parts = childHandle.split('-');
  if (parts.length <= 1) return null;

  // Try progressively shorter prefixes
  for (let i = parts.length - 1; i >= 1; i--) {
    const potentialParent = parts.slice(0, i).join('-');
    // Check against known parent handles
    const knownParents = COLLECTION_CATEGORIES.map((c) => c.handle);
    if (knownParents.includes(potentialParent)) {
      return potentialParent;
    }
  }

  return null;
}

// =============================================================================
// LEGACY URL REDIRECTS
// =============================================================================

/**
 * Legacy tag-based URLs mapped to new collection URLs
 * Used for SEO redirect preservation
 */
export const LEGACY_TAG_REDIRECTS: Record<string, string> = {
  '/search?tag=disposable': '/collections/disposables',
  '/search?tag=e-liquid': '/collections/e-liquids',
  '/search?tag=device': '/collections/devices',
  '/search?tag=pod': '/collections/pods-coils',
  '/search?tag=coil': '/collections/pods-coils',
  '/search?tag=accessory': '/collections/accessories',
  '/search?tag=nicotine_pouches': '/collections/nicotine-pouches',
  '/search?tag=CBD': '/collections/cbd',
};

/**
 * Check if a URL should redirect to a collection
 *
 * @param url - Request URL
 * @returns Redirect URL or null
 */
export function getLegacyRedirect(url: string): string | null {
  const pathname = new URL(url, 'http://localhost').pathname;
  const search = new URL(url, 'http://localhost').search;
  const fullPath = `${pathname}${search}`;

  return LEGACY_TAG_REDIRECTS[fullPath] ?? null;
}

// =============================================================================
// FEATURE FLAGS
// =============================================================================

/**
 * Check if collection-based navigation is enabled
 *
 * @param env - Environment object (required for server-side usage)
 * @returns boolean
 */
export function useCollectionNav(env?: Record<string, string | undefined>): boolean {
  // Only use the env parameter - avoid process.env to prevent browser runtime errors
  const flag = env?.USE_COLLECTION_NAV;
  if (flag === 'true' || flag === '1') return true;
  if (flag === 'false' || flag === '0') return false;
  // Default to false for safe rollout
  return false;
}

/**
 * Get rollout percentage for gradual collection nav rollout
 *
 * @param env - Environment object (required for server-side usage)
 * @returns Rollout percentage (0-100)
 */
export function getCollectionNavRollout(env?: Record<string, string | undefined>): number {
  // Only use the env parameter - avoid process.env to prevent browser runtime errors
  const rollout = env?.COLLECTION_NAV_ROLLOUT;
  if (!rollout) return 0;
  const value = parseInt(rollout, 10);
  if (isNaN(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

/**
 * Determine if a user should see collection nav based on rollout percentage
 *
 * @param userId - User identifier for consistent bucketing
 * @param rolloutPercent - Rollout percentage
 * @returns boolean
 */
export function isUserInCollectionNavRollout(
  userId: string,
  rolloutPercent: number,
): boolean {
  if (rolloutPercent >= 100) return true;
  if (rolloutPercent <= 0) return false;

  // Simple hash-based bucketing for consistent user experience
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  const bucket = Math.abs(hash) % 100;
  return bucket < rolloutPercent;
}
