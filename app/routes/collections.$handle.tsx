/**
 * Dynamic Collection Route
 *
 * Renders a collection page with products, filters, and pagination.
 * Uses Shopify's native productFilters for efficient server-side filtering.
 *
 * URL: /collections/:handle
 * Supports query params: vendor, type, availability, price_min, price_max, sort, after
 */

import {json, redirect, type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {useLoaderData, useSearchParams, useNavigation, Link} from '@remix-run/react';
import {useState, useMemo, useEffect} from 'react';
import {FunnelIcon} from '@heroicons/react/24/outline';

import {
  getCollection,
  parseFiltersFromSearchParams,
  COLLECTION_SORT_OPTIONS,
  SORT_LOOKUP,
  getLegacyRedirect,
  type CollectionData,
  type CollectionSortKey,
} from '~/lib/collections';
import {CollectionFilters} from '~/components/collection/CollectionFilters';
import {CollectionProducts} from '~/components/collection/CollectionProducts';
import {MobileCollectionFilters} from '~/components/collection/MobileCollectionFilters';
import {ClientOnly} from '~/components/ClientOnly';
import {SEOAutomationService} from '~/preserved/seo-automation';
import {
  generateCollectionPageSchema,
  generateBreadcrumbSchema,
  structuredDataScript,
  SITE_URL,
} from '~/lib/structured-data';

// =============================================================================
// TYPES
// =============================================================================

interface CollectionLoaderData {
  collection: CollectionData;
  selectedFilters: {
    vendors: string[];
    types: string[];
    availability: 'in-stock' | 'out-of-stock' | null;
    priceRange: {min?: number; max?: number};
  };
  currentSort: string;
  error?: string;
}

// =============================================================================
// LOADER
// =============================================================================

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {handle} = params;

  if (!handle) {
    throw new Response('Collection handle is required', {status: 400});
  }

  // Check for legacy redirects
  const legacyRedirect = getLegacyRedirect(request.url);
  if (legacyRedirect) {
    return redirect(legacyRedirect, 301);
  }

  const {searchParams} = new URL(request.url);

  // Parse filters from URL
  const filters = parseFiltersFromSearchParams(searchParams);

  // Parse sort options
  const sortParam = searchParams.get('sort') || 'COLLECTION_DEFAULT';
  const sortConfig = SORT_LOOKUP[sortParam] ?? SORT_LOOKUP.COLLECTION_DEFAULT;

  // Parse pagination
  const after = searchParams.get('after') || undefined;

  // Fetch collection data
  const collection = await getCollection(context.storefront, handle, {
    first: 24,
    after,
    filters,
    sortKey: sortConfig.sortKey,
    reverse: sortConfig.reverse,
  });

  if (!collection) {
    throw new Response('Collection not found', {status: 404});
  }

  // Extract selected filter state for UI
  const selectedFilters = {
    vendors: searchParams.getAll('vendor'),
    types: searchParams.getAll('type'),
    availability: searchParams.get('availability') as 'in-stock' | 'out-of-stock' | null,
    priceRange: {
      min: searchParams.get('price_min') ? parseFloat(searchParams.get('price_min')!) : undefined,
      max: searchParams.get('price_max') ? parseFloat(searchParams.get('price_max')!) : undefined,
    },
  };

  return json<CollectionLoaderData>(
    {
      collection,
      selectedFilters,
      currentSort: sortParam,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    },
  );
}

// =============================================================================
// META
// =============================================================================

export const meta: MetaFunction<typeof loader> = ({data, params}) => {
  if (!data?.collection) {
    return [
      {title: 'Collection Not Found | Vapourism'},
      {name: 'robots', content: 'noindex'},
    ];
  }

  const {collection} = data;
  const productCount = collection.products.length;

  // Use SEO fields from Shopify if available, otherwise generate
  const title = collection.seo?.title ||
    SEOAutomationService.truncateTitle(
      `${collection.title} (${productCount}+ Products) | Fast UK Delivery | Vapourism`,
    );

  const description = collection.seo?.description ||
    `Shop ${collection.title} at Vapourism. ✓ ${productCount}+ products ✓ Fast UK delivery ✓ Best prices. ${collection.description?.slice(0, 100) || ''}`;

  return [
    {title},
    {name: 'description', content: description},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:type', content: 'website'},
    {property: 'og:url', content: `${SITE_URL}/collections/${collection.handle}`},
    ...(collection.image
      ? [{property: 'og:image', content: collection.image.url}]
      : []),
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
    {
      name: 'keywords',
      content: `${collection.title.toLowerCase()}, vape, vaping, uk, buy ${collection.title.toLowerCase()}, ${collection.title.toLowerCase()} uk`,
    },
    // Index collection pages (they have SEO value)
    {name: 'robots', content: 'index, follow'},
  ];
};

// =============================================================================
// COMPONENT
// =============================================================================

export default function CollectionPage() {
  const {collection, selectedFilters, currentSort} = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFiltersOpen, setFiltersOpen] = useState(false);

  const isLoading = navigation.state === 'loading';

  // Currency formatter for price display
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        maximumFractionDigits: 2,
      }),
    [],
  );

  // Calculate price range from products
  const priceRange = useMemo(() => {
    if (collection.products.length === 0) return null;
    let min = Infinity;
    let max = -Infinity;
    collection.products.forEach((product) => {
      const price = parseFloat(product.priceRange.minVariantPrice.amount);
      if (!isNaN(price)) {
        min = Math.min(min, price);
        max = Math.max(max, price);
      }
    });
    return {min, max, currencyCode: 'GBP'};
  }, [collection.products]);

  // Filter handlers
  const handleFilterChange = (key: string, value: string | string[] | null) => {
    const newParams = new URLSearchParams(searchParams);

    // Remove pagination when filters change
    newParams.delete('after');

    if (value === null) {
      newParams.delete(key);
    } else if (Array.isArray(value)) {
      newParams.delete(key);
      value.forEach((v) => newParams.append(key, v));
    } else {
      newParams.set(key, value);
    }

    setSearchParams(newParams);
  };

  const handleVendorToggle = (vendor: string) => {
    const current = new Set(selectedFilters.vendors);
    if (current.has(vendor)) {
      current.delete(vendor);
    } else {
      current.add(vendor);
    }
    handleFilterChange('vendor', Array.from(current));
  };

  const handleTypeToggle = (type: string) => {
    const current = new Set(selectedFilters.types);
    if (current.has(type)) {
      current.delete(type);
    } else {
      current.add(type);
    }
    handleFilterChange('type', Array.from(current));
  };

  const handleAvailabilityChange = (value: 'in-stock' | 'out-of-stock' | null) => {
    handleFilterChange('availability', value);
  };

  const handlePriceRangeChange = (range: {min?: number; max?: number}) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('after');

    if (range.min !== undefined) {
      newParams.set('price_min', range.min.toString());
    } else {
      newParams.delete('price_min');
    }

    if (range.max !== undefined) {
      newParams.set('price_max', range.max.toString());
    } else {
      newParams.delete('price_max');
    }

    setSearchParams(newParams);
  };

  const handleSortChange = (sortValue: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('after');
    newParams.set('sort', sortValue);
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    ['vendor', 'type', 'availability', 'price_min', 'price_max', 'after'].forEach((key) =>
      newParams.delete(key),
    );
    setSearchParams(newParams);
    setFiltersOpen(false);
  };

  const handleLoadMore = () => {
    if (collection.pageInfo.endCursor) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('after', collection.pageInfo.endCursor);
      setSearchParams(newParams);
    }
  };

  // Count active filters
  const activeFilterCount =
    selectedFilters.vendors.length +
    selectedFilters.types.length +
    (selectedFilters.availability ? 1 : 0) +
    (selectedFilters.priceRange.min !== undefined || selectedFilters.priceRange.max !== undefined
      ? 1
      : 0);

  // Build filter chips for display
  const filterChips = [
    ...selectedFilters.vendors.map((v) => ({
      id: `vendor:${v}`,
      label: v,
      onRemove: () => handleVendorToggle(v),
    })),
    ...selectedFilters.types.map((t) => ({
      id: `type:${t}`,
      label: t,
      onRemove: () => handleTypeToggle(t),
    })),
    ...(selectedFilters.availability
      ? [
          {
            id: 'availability',
            label: selectedFilters.availability === 'in-stock' ? 'In Stock' : 'Out of Stock',
            onRemove: () => handleAvailabilityChange(null),
          },
        ]
      : []),
    ...(selectedFilters.priceRange.min !== undefined ||
    selectedFilters.priceRange.max !== undefined
      ? [
          {
            id: 'price',
            label: `${
              selectedFilters.priceRange.min !== undefined
                ? currencyFormatter.format(selectedFilters.priceRange.min)
                : ''
            } - ${
              selectedFilters.priceRange.max !== undefined
                ? currencyFormatter.format(selectedFilters.priceRange.max)
                : ''
            }`,
            onRemove: () => handlePriceRangeChange({}),
          },
        ]
      : []),
  ];

  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-slate-100">
      {/* Collection Hero */}
      <div className="border-b border-slate-200 py-12">
        <div className="container-custom">
          {/* Breadcrumbs */}
          <nav className="mb-4 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link to="/" className="text-slate-500 hover:text-slate-700">
                  Home
                </Link>
              </li>
              <li className="text-slate-400">/</li>
              <li>
                <Link to="/search" className="text-slate-500 hover:text-slate-700">
                  Collections
                </Link>
              </li>
              <li className="text-slate-400">/</li>
              <li className="text-slate-900 font-medium">{collection.title}</li>
            </ol>
          </nav>

          <h1 className="text-4xl font-bold text-slate-900">{collection.title}</h1>
          {collection.description && (
            <p className="mt-2 max-w-2xl text-lg text-slate-600">{collection.description}</p>
          )}
          <p className="mt-4 text-sm text-slate-500">
            {collection.products.length} products available
          </p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Filter Toggle Button (Mobile) */}
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-white"
          >
            <FunnelIcon className="h-5 w-5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown (Mobile) */}
          <select
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 focus:border-slate-900 focus:outline-none"
          >
            {COLLECTION_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px,1fr]">
          {/* Sidebar Filters (Desktop) */}
          <div className="hidden lg:block">
            <CollectionFilters
              filters={collection.filters}
              selectedVendors={selectedFilters.vendors}
              selectedTypes={selectedFilters.types}
              selectedAvailability={selectedFilters.availability}
              selectedPriceRange={selectedFilters.priceRange}
              priceRange={priceRange}
              onVendorToggle={handleVendorToggle}
              onTypeToggle={handleTypeToggle}
              onAvailabilityChange={handleAvailabilityChange}
              onPriceRangeChange={handlePriceRangeChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Results Header */}
            {collection.products.length > 0 && (
              <div className="hidden lg:flex rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
                <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-semibold text-slate-600">
                    Showing {collection.products.length} products
                  </p>

                  {/* Sort Dropdown (Desktop) */}
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <label htmlFor="sort-desktop" className="font-semibold">
                      Sort by
                    </label>
                    <select
                      id="sort-desktop"
                      value={currentSort}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 focus:border-slate-900 focus:outline-none"
                    >
                      {COLLECTION_SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Active Filter Chips */}
            {filterChips.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filterChips.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={chip.onRemove}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:border-slate-300"
                  >
                    {chip.label}
                    <span aria-hidden className="text-slate-400">
                      ×
                    </span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs font-semibold text-slate-500 underline-offset-2 hover:text-slate-900"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Products Grid */}
            <CollectionProducts
              products={collection.products}
              hasNextPage={collection.pageInfo.hasNextPage}
              onLoadMore={handleLoadMore}
              isLoading={isLoading}
            />

            {/* Empty State */}
            {collection.products.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-12 text-center shadow-sm">
                <p className="text-lg font-semibold text-slate-700">No products found</p>
                <p className="mt-2 text-slate-500">
                  Try adjusting your filters or browse our other collections.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-4 rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Dialog */}
      <ClientOnly fallback={null}>
        {() => (
          <MobileCollectionFilters
            isOpen={isFiltersOpen}
            onClose={() => setFiltersOpen(false)}
            filters={collection.filters}
            selectedVendors={selectedFilters.vendors}
            selectedTypes={selectedFilters.types}
            availability={selectedFilters.availability}
            selectedPriceRange={selectedFilters.priceRange}
            priceSummary={priceRange}
            onVendorToggle={handleVendorToggle}
            onTypeToggle={handleTypeToggle}
            onAvailabilityChange={handleAvailabilityChange}
            onPriceRangeChange={handlePriceRangeChange}
            onClearFilters={handleClearFilters}
          />
        )}
      </ClientOnly>

      {/* Structured Data */}
      <script
        {...structuredDataScript(
          generateCollectionPageSchema({
            name: collection.title,
            description: collection.description,
            url: `${SITE_URL}/collections/${collection.handle}`,
            numberOfItems: collection.products.length,
          }),
        )}
      />
      <script
        {...structuredDataScript(
          generateBreadcrumbSchema([
            {name: 'Home', url: SITE_URL},
            {name: 'Collections', url: `${SITE_URL}/search`},
            {name: collection.title, url: `${SITE_URL}/collections/${collection.handle}`},
          ]),
        )}
      />
    </div>
  );
}
