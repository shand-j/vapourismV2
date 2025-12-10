/**
 * Shopify Collections Management for V2
 * 
 * Replaces category-mapping.ts with Shopify-native collection navigation.
 * 
 * Key features:
 * - Fetch collection hierarchies
 * - Cache collection data
 * - Generate navigation structure
 * - Legacy URL redirects
 * 
 * References:
 * - https://shopify.dev/docs/api/storefront/latest/objects/Collection
 * - v2/docs/research/collections-audit.md
 */

import type {Storefront} from '@shopify/hydrogen';
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image?: {
    url: string;
    altText?: string;
  };
  seo?: {
    title?: string;
    description?: string;
  };
  productCount?: number;
}

export interface CollectionWithProducts extends Collection {
  products: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        handle: string;
        vendor: string;
          productType: string;
          tags: string[];
          description?: string;
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
      };
    }>;
    pageInfo: {
      hasNextPage: boolean;
      endCursor?: string;
    };
  };
}

export interface NavigationStructure {
  main: NavItem[];
  featured: NavItem[];
}

export interface NavItem {
  id: string;
  title: string;
  handle: string;
  url: string;
  children?: NavItem[];
  productCount?: number;
}

interface MenuDefinition {
  key: string;
  label: string;
  fallbackUrl: string;
  handlePattern?: RegExp;
  childPattern?: RegExp;
  staticChildren?: Array<{title: string; url: string}>;
}

const BRAND_SHORTCUTS = [
  {title: 'Elf Bar', url: '/search?q=elf%20bar'},
  {title: 'Lost Mary', url: '/search?q=lost%20mary'},
  {title: 'SKE Crystal', url: '/search?q=SKE%20Crystal'},
  {title: 'IVG', url: '/search?q=IVG'},
  {title: 'Vaporesso', url: '/search?q=Vaporesso'},
  {title: 'Geek Vape', url: '/search?q=Geek%20Vape'},
];

const PRIMARY_MENU_DEFINITIONS: MenuDefinition[] = [
  {
    key: 'disposables',
    label: 'Disposables',
    fallbackUrl: '/collections/disposable-vapes',
    handlePattern: /^disposable-vapes?$/i,
    childPattern: /^disposable-vapes?-/i,
  },
  {
    key: 'eliquids',
    label: 'Eliquids',
    fallbackUrl: '/collections/e-liquids',
    handlePattern: /^e-liquids?$/i,
    childPattern: /^e-liquids?-/i,
  },
  {
    key: 'vape-kits',
    label: 'Vape Kits',
    fallbackUrl: '/collections/vape-kits',
    handlePattern: /^vape-kits?$/i,
    childPattern: /^vape-kits?-/i,
  },
  {
    key: 'accessories',
    label: 'Accessories',
    fallbackUrl: '/collections/accessories',
    handlePattern: /^accessories?$/i,
    childPattern: /^(accessories?|coils?|pods?|batteries?|tanks?)-/i,
  },
  {
    key: 'brands',
    label: 'Brands',
    fallbackUrl: '/collections?view=brands',
    staticChildren: BRAND_SHORTCUTS,
  },
  {
    key: 'cbd',
    label: 'CBD',
    fallbackUrl: '/collections/cbd',
    handlePattern: /^cbd$/i,
    childPattern: /^cbd-/i,
  },
];

/**
 * GraphQL Query for Collections List
 */
const COLLECTIONS_QUERY = `#graphql
  query Collections($first: Int!, $after: String) {
    collections(first: $first, after: $after) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
          }
          seo {
            title
            description
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
 * GraphQL Query for Single Collection with Products
 */
const COLLECTION_QUERY = `#graphql
  query Collection(
    $handle: String!
    $first: Int
    $after: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $filters: [ProductFilter!]
  ) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      image {
        url
        altText
      }
      seo {
        title
        description
      }
      products(
        first: $first
        after: $after
        sortKey: $sortKey
        reverse: $reverse
        filters: $filters
      ) {
        edges {
          node {
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
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
` as const;

/**
 * Fetch all collections with pagination
 * 
 * @param storefront - Hydrogen Storefront client
 * @param limit - Maximum number of collections to fetch
 * @returns Array of collections
 */
export async function fetchAllCollections(
  storefront: Storefront,
  limit: number = 100
): Promise<Collection[]> {
  const collections: Collection[] = [];
  let hasNextPage = true;
  let after: string | undefined;

  try {
    while (hasNextPage && collections.length < limit) {
      const {collections: result} = await storefront.query(COLLECTIONS_QUERY, {
        variables: {
          first: Math.min(50, limit - collections.length),
          after,
        },
        cache: storefront.CacheLong(), // Cache for 1 hour
      });

      collections.push(...result.edges.map((edge: any) => edge.node));
  hasNextPage = result.pageInfo.hasNextPage;
  after = result.pageInfo.endCursor ?? undefined;
    }

    return collections;
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
}

/**
 * Fetch a single collection with products
 * 
 * @param storefront - Hydrogen Storefront client
 * @param handle - Collection handle
 * @param options - Pagination and sorting options
 * @returns Collection with products
 */
export async function fetchCollection(
  storefront: Storefront,
  handle: string,
  options: {
    first?: number;
    after?: string;
    sortKey?: StorefrontAPI.ProductCollectionSortKeys;
    reverse?: boolean;
    filters?: StorefrontAPI.ProductFilter[];
  } = {}
): Promise<CollectionWithProducts | null> {
  const {first = 48, after, sortKey = 'MANUAL', reverse = false, filters = []} = options;

  try {
    const {collection} = await storefront.query(COLLECTION_QUERY, {
      variables: {
        handle,
        first,
        after,
        sortKey,
        reverse,
        filters,
      },
      cache: storefront.CacheShort(), // Cache for 5 minutes
    });

    if (!collection) {
      return null;
    }

    const productCount = Array.isArray(collection.products?.edges)
      ? collection.products.edges.length
      : undefined;

    const edges = Array.isArray(collection.products?.edges)
      ? collection.products.edges
          .filter(Boolean)
          .map((edge) => ({
            node: {
              ...edge.node,
              featuredImage: edge.node.featuredImage
                ? {
                    url: edge.node.featuredImage.url,
                    altText: edge.node.featuredImage.altText ?? undefined,
                  }
                : undefined,
            },
          }))
      : [];

    const pageInfo = {
      hasNextPage: collection.products?.pageInfo?.hasNextPage ?? false,
      endCursor: collection.products?.pageInfo?.endCursor ?? undefined,
    };

    const normalizedImage = collection.image
      ? {
          url: collection.image.url,
          altText: collection.image.altText ?? undefined,
        }
      : undefined;

    const normalizedSeo = {
      title: collection.seo?.title ?? undefined,
      description: collection.seo?.description ?? undefined,
    };

    return {
      ...collection,
      image: normalizedImage,
      seo: normalizedSeo,
      productCount,
      products: {
        edges,
        pageInfo,
      },
    };
  } catch (error) {
    console.error(`Error fetching collection "${handle}":`, error);
    return null;
  }
}

/**
 * Build navigation structure from collections
 * Groups collections by hierarchy based on naming convention
 * 
 * Main navigation structure (from collections-audit.md):
 * 1. Disposable Vapes
 * 2. E-Liquids
 * 3. Vape Kits
 * 4. Coils & Pods
 * 5. Tanks
 * 6. Batteries & Mods
 * 7. Accessories
 * 8. CBD Products
 * 9. Nicotine Pouches
 * 
 * @param collections - All collections
 * @returns Navigation structure
 */
export function buildNavigationStructure(collections: Collection[]): NavigationStructure {
  // Featured/smart collections
  const featuredPatterns = [
    'new-arrivals',
    'best-sellers',
    'sale',
    'starter-bundles',
    'premium-products',
  ];

  const main: NavItem[] = [];
  const featured: NavItem[] = [];

  PRIMARY_MENU_DEFINITIONS.forEach((definition) => {
    const primaryCollection = definition.handlePattern
      ? collections.find((collection) => definition.handlePattern!.test(collection.handle))
      : undefined;

    let collectedChildren: NavItem[] | undefined;
    if (definition.childPattern && collections.length) {
      const foundChildren = collections
        .filter((collection) =>
          definition.childPattern!.test(collection.handle) && (!primaryCollection || collection.handle !== primaryCollection.handle),
        )
        .map((child) => ({
          id: child.id,
          title: child.title,
          handle: child.handle,
          url: `/collections/${child.handle}`,
          productCount: child.productCount,
        }))
        .sort((a, b) => a.title.localeCompare(b.title));
      if (foundChildren.length) {
        collectedChildren = foundChildren;
      }
    }

    if (!collectedChildren && definition.staticChildren?.length) {
      collectedChildren = definition.staticChildren.map((child, index) => ({
        id: `${definition.key}-shortcut-${index}`,
        title: child.title,
        handle: slugify(child.title),
        url: child.url,
      }));
    }

    main.push({
      id: primaryCollection?.id ?? `nav-${definition.key}`,
      title: definition.label,
      handle: primaryCollection?.handle ?? definition.key,
      url: primaryCollection ? `/collections/${primaryCollection.handle}` : definition.fallbackUrl,
      productCount: primaryCollection?.productCount,
      children: collectedChildren,
    });
  });

  // Build featured navigation
  featuredPatterns.forEach((handle) => {
    const collection = collections.find((c) => c.handle === handle);
    if (collection) {
      featured.push({
        id: collection.id,
        title: collection.title,
        handle: collection.handle,
        url: `/collections/${collection.handle}`,
        productCount: collection.productCount,
      });
    }
  });

  return {main, featured};
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-');
}

/**
 * Legacy URL redirect map
 * Maps old category-mapping URLs to new collection URLs
 * 
 * Based on category-mapping.ts analysis
 */
export const LEGACY_CATEGORY_REDIRECTS: Record<string, string> = {
  // Disposable Vapes
  '/search?category=disposable-vapes': '/collections/disposable-vapes',
  '/search?category=600-puffs': '/collections/disposable-vapes-600-puffs',
  '/search?category=3000-puffs': '/collections/disposable-vapes-3000-puffs',
  '/search?category=5000-puffs': '/collections/disposable-vapes-5000-puffs',
  '/search?category=elf-bar': '/collections/disposable-vapes-elf-bar',
  '/search?category=lost-mary': '/collections/disposable-vapes-lost-mary',

  // E-Liquids
  '/search?category=e-liquids': '/collections/e-liquids',
  '/search?category=nic-salts': '/collections/e-liquids-nic-salts',
  '/search?category=shortfills': '/collections/e-liquids-shortfills',
  '/search?category=50-50-e-liquids': '/collections/e-liquids-50-50',
  '/search?category=10ml': '/collections/e-liquids-10ml',
  '/search?category=50ml': '/collections/e-liquids-50ml',
  '/search?category=100ml': '/collections/e-liquids-100ml',

  // Vape Kits
  '/search?category=vape-kits': '/collections/vape-kits',
  '/search?category=pod-kits': '/collections/vape-kits-pod',
  '/search?category=beginner-kits': '/collections/vape-kits-beginner',
  '/search?category=box-mods': '/collections/vape-kits-box-mod',

  // Coils & Pods
  '/search?category=coils': '/collections/coils',
  '/search?category=pods': '/collections/pods',
  '/search?category=sub-ohm-coils': '/collections/coils-sub-ohm',

  // Accessories
  '/search?category=accessories': '/collections/accessories',
  '/search?category=batteries': '/collections/accessories-batteries',
  '/search?category=chargers': '/collections/accessories-chargers',

  // CBD
  '/search?category=cbd': '/collections/cbd',
  '/search?category=cbd-oils': '/collections/cbd-oils',

  // Nicotine Pouches
  '/search?category=nicotine-pouches': '/collections/nicotine-pouches',
};

/**
 * Get redirect URL for legacy category URL
 * 
 * @param pathname - Request pathname
 * @param search - URL search params
 * @returns Redirect URL or null
 */
export function getLegacyRedirect(pathname: string, search: string): string | null {
  const fullPath = pathname + search;
  return LEGACY_CATEGORY_REDIRECTS[fullPath] || null;
}

/**
 * Generate collection URL
 * 
 * @param handle - Collection handle
 * @returns Collection URL
 */
export function getCollectionUrl(handle: string): string {
  return `/collections/${handle}`;
}

/**
 * Cache key generator for collection data
 * 
 * @param handle - Collection handle
 * @param options - Query options
 * @returns Cache key
 */
export function generateCollectionCacheKey(
  handle: string,
  options: Record<string, any> = {}
): string {
  const params = Object.entries(options)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');

  return `collection:${handle}${params ? `:${params}` : ''}`;
}
