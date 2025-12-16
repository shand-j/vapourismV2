/**
 * Search Results Page Route
 * 
 * Full search page with pagination
 * URL: /search?q=query&page=1&sort=RELEVANCE
 */

// Headless UI components imported in separate component to avoid SSR issues
import {FunnelIcon, XMarkIcon} from '@heroicons/react/24/outline';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';
import {useLoaderData, useNavigation, useSearchParams} from '@remix-run/react';
import {Fragment, useEffect, useMemo, useState} from 'react';

import {ClientOnly} from '../components/ClientOnly';
import {SearchFilters} from '../components/search/SearchFilters';
import {SearchResults} from '../components/search/SearchResults';
import {MobileFiltersDialog} from '../components/search/MobileFiltersDialog';
import {
  buildTagFacetGroups,
  calculatePriceSummary,
  getTagDisplayLabel,
  type PriceSummary,
} from '../lib/search-facets';
import {searchProducts, getCachedFacets, trackSearchEvent} from '../lib/shopify-search';
import {getHeroForTags, type CategoryHero} from '../lib/menu-config';
import {SEOAutomationService} from '../preserved/seo-automation';

/**
 * UK VAT rate (20%)
 * User price inputs are VAT-inclusive, but Shopify stores ex-VAT prices.
 * We convert user inputs to ex-VAT for filtering.
 */
const UK_VAT_RATE = 0.2;
import type {SearchProduct} from '../lib/shopify-search';

type SearchLoaderData = {
  query: string;
  products: SearchProduct[];
  totalCount: number;
  pageInfo: {
    hasNextPage: boolean;
    endCursor?: string;
  };
  facets: ReturnType<typeof buildTagFacetGroups>;
  priceSummary: PriceSummary | null;
  hero: CategoryHero | null;
  selectedTags: string[];
  error?: string;
};

type SortGraphQLKey = StorefrontAPI.SearchSortKeys;

const SORT_OPTIONS = [
  {label: 'Relevance', value: 'RELEVANCE', sortKey: 'RELEVANCE' as SortGraphQLKey, reverse: false},
  {label: 'Price: Low to High', value: 'PRICE_ASC', sortKey: 'PRICE' as SortGraphQLKey, reverse: false},
  {label: 'Price: High to Low', value: 'PRICE_DESC', sortKey: 'PRICE' as SortGraphQLKey, reverse: true},
  {label: 'Best Selling', value: 'BEST_SELLING', sortKey: 'BEST_SELLING' as SortGraphQLKey, reverse: false},
  {label: 'Newest', value: 'CREATED_DESC', sortKey: 'CREATED' as SortGraphQLKey, reverse: true},
  {label: 'Name: A-Z', value: 'TITLE_ASC', sortKey: 'TITLE' as SortGraphQLKey, reverse: false},
  {label: 'Name: Z-A', value: 'TITLE_DESC', sortKey: 'TITLE' as SortGraphQLKey, reverse: true},
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]['value'];

const SORT_LOOKUP = SORT_OPTIONS.reduce<Record<string, {sortKey: SortGraphQLKey; reverse: boolean}>>( (acc, option) => {
  acc[option.value] = {sortKey: option.sortKey, reverse: option.reverse};
  return acc;
}, {});

export async function loader({request, context}: LoaderFunctionArgs) {
  const startTime = Date.now();
  
  const {searchParams} = new URL(request.url);
  
  const query = searchParams.get('q') || '';
  const after = searchParams.get('after') || undefined;
  const sortParam = (searchParams.get('sort') as SortValue) || 'RELEVANCE';
  const sortConfig = SORT_LOOKUP[sortParam] ?? SORT_LOOKUP.RELEVANCE;
  const sortKey = sortConfig.sortKey;
  const reverse = sortConfig.reverse;
  const selectedTypes = searchParams.getAll('type');
  const selectedVendors = searchParams.getAll('vendor');
  const selectedTags = searchParams.getAll('tag');
  const availability = searchParams.get('availability');
  const priceMinParam = searchParams.get('price_min');
  const priceMaxParam = searchParams.get('price_max');

  // User enters VAT-inclusive prices, but Shopify stores ex-VAT
  // Convert user input to ex-VAT for filtering
  const normalizedPriceRange: {min?: number; max?: number} = {};
  const parsedMin = priceMinParam ? parseFloat(priceMinParam) : undefined;
  const parsedMax = priceMaxParam ? parseFloat(priceMaxParam) : undefined;
  if (parsedMin !== undefined && !Number.isNaN(parsedMin) && parsedMin >= 0) {
    // Convert VAT-inclusive input to ex-VAT for Shopify filter
    normalizedPriceRange.min = parsedMin / (1 + UK_VAT_RATE);
  }
  if (parsedMax !== undefined && !Number.isNaN(parsedMax) && parsedMax >= 0) {
    // Convert VAT-inclusive input to ex-VAT for Shopify filter
    normalizedPriceRange.max = parsedMax / (1 + UK_VAT_RATE);
  }
  if (
    normalizedPriceRange.min !== undefined &&
    normalizedPriceRange.max !== undefined &&
    normalizedPriceRange.min > normalizedPriceRange.max
  ) {
    const temp = normalizedPriceRange.min;
    normalizedPriceRange.min = normalizedPriceRange.max;
    normalizedPriceRange.max = temp;
  }

  // Build all filters for server-side application
  const allFilters: StorefrontAPI.ProductFilter[] = [
    ...selectedTypes.map((value) => ({productType: value} as StorefrontAPI.ProductFilter)),
    ...selectedVendors.map((value) => ({productVendor: value} as StorefrontAPI.ProductFilter)),
    ...(availability === 'in-stock' ? [{available: true} as StorefrontAPI.ProductFilter] : []),
    ...(availability === 'out-of-stock' ? [{available: false} as StorefrontAPI.ProductFilter] : []),
    ...(normalizedPriceRange.min !== undefined || normalizedPriceRange.max !== undefined
      ? [{
          price: {
            ...(normalizedPriceRange.min !== undefined ? {min: normalizedPriceRange.min} : {}),
            ...(normalizedPriceRange.max !== undefined ? {max: normalizedPriceRange.max} : {}),
          },
        } as StorefrontAPI.ProductFilter]
      : []),
  ];

  // Handle tag expansion and add to filters
  let expandedTagFilters: string[] = [];
  let additionalVendors: string[] = [];
  let additionalTypes: string[] = [];

  // Get facets from cache for efficient tag expansion
  let facetGroups: ReturnType<typeof buildTagFacetGroups>;

  try {
    // Get cached facets for efficient tag expansion
    facetGroups = await getCachedFacets(context.storefront);

    // Process tag expansions using cached facets
    const flavourTypeFacet = facetGroups.find(fg => fg.key === 'flavour_type');
    const brandFacet = facetGroups.find(fg => fg.key === 'brand');
    const categoryFacet = facetGroups.find(fg => fg.key === 'category');

    selectedTags.forEach((tag) => {
      if (tag.startsWith('filter:flavour_type:') && flavourTypeFacet) {
        const option = flavourTypeFacet.options.find(opt => opt.value === tag);
        if (option && option.originalTags && option.originalTags.length > 0) {
          expandedTagFilters.push(...option.originalTags);
        } else {
          expandedTagFilters.push(tag);
        }
      } else if (tag.startsWith('filter:brand:') && brandFacet) {
        const option = brandFacet.options.find(opt => opt.value === tag);
        if (option && option.originalValue) {
          additionalVendors.push(option.originalValue);
        } else {
          const vendorName = tag.replace('filter:brand:', '').replace(/_/g, ' ');
          additionalVendors.push(vendorName);
        }
      } else if (tag.startsWith('filter:category:') && categoryFacet) {
        const option = categoryFacet.options.find(opt => opt.value === tag);
        if (option && option.originalValue) {
          additionalTypes.push(option.originalValue);
        } else {
          const productType = tag.replace('filter:category:', '').replace(/_/g, ' ');
          additionalTypes.push(productType);
        }
      } else {
        expandedTagFilters.push(tag);
      }
    });

    // Remove duplicates
    expandedTagFilters = Array.from(new Set(expandedTagFilters));
    additionalVendors = Array.from(new Set(additionalVendors));
    additionalTypes = Array.from(new Set(additionalTypes));

    // Add expanded filters to the filter list
    additionalTypes.forEach((value) => allFilters.push({productType: value} as StorefrontAPI.ProductFilter));
    additionalVendors.forEach((value) => allFilters.push({productVendor: value} as StorefrontAPI.ProductFilter));
    
    // Add tag filters to the filter list (will be converted to query syntax by searchProducts)
    expandedTagFilters.forEach((tag) => allFilters.push({tag} as StorefrontAPI.ProductFilter));

    // Use server-side filtering for everything, including tags
    const searchResults = await searchProducts(context.storefront, query, {
      first: 24,
      after,
      sortKey,
      reverse,
      filters: allFilters,
    });

    // Calculate price summary from filtered results
    const priceSummary = calculatePriceSummary(searchResults.products);

    // Calculate facets from the filtered search results
    const filteredFacets = buildTagFacetGroups(searchResults.products);

    // Get hero banner based on selected tags
    const hero = getHeroForTags(selectedTags);

    return json<SearchLoaderData>({
      query,
      products: searchResults.products,
      totalCount: searchResults.totalCount,
      pageInfo: searchResults.pageInfo,
      facets: filteredFacets,
      priceSummary,
      hero,
      selectedTags,
    }, {
      headers: {
        'Cache-Control': 'public, max-age=60', // Cache for 1 minute
        'X-Search-Performance': `${Date.now() - startTime}ms`,
      },
    });

  } catch (error) {
    return json<SearchLoaderData>({
      query,
      products: [],
      totalCount: 0,
      pageInfo: { hasNextPage: false },
      facets: [],
      priceSummary: null,
      hero: null,
      selectedTags: [],
      error: 'Search failed',
    }, {status: 500});
  }
}export default function SearchPage() {
  const data = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFiltersOpen, setFiltersOpen] = useState(false);

  const isLoading = navigation.state === 'loading';
  const selectedTags = searchParams.getAll('tag');
  const availabilityParam = searchParams.get('availability');
  const priceMinParam = searchParams.get('price_min');
  const priceMaxParam = searchParams.get('price_max');

  const parsePriceValue = (value: string | null): number | undefined => {
    if (!value) return undefined;
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : undefined;
  };

  const selectedPriceRange = {
    min: parsePriceValue(priceMinParam),
    max: parsePriceValue(priceMaxParam),
  };

  const selectedAvailability: 'in-stock' | 'out-of-stock' | null =
    availabilityParam === 'in-stock' || availabilityParam === 'out-of-stock'
      ? availabilityParam
      : null;

  const currentSort = (searchParams.get('sort') as SortValue) || 'RELEVANCE';

  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: data.priceSummary?.currencyCode ?? 'GBP',
        maximumFractionDigits: 2,
      }),
    [data.priceSummary?.currencyCode],
  );

  // Track search analytics
  useEffect(() => {
    if (typeof window !== 'undefined' && data.query) {
      trackSearchEvent(data.query, data.totalCount, 'full');
    }
  }, [data.query, data.totalCount]);

  const handleLoadMore = () => {
    if (data.pageInfo.endCursor) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('after', data.pageInfo.endCursor);
      setSearchParams(newParams);
    }
  };

  const handleTagToggle = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    const existing = new Set(newParams.getAll('tag'));
    if (existing.has(value)) {
      existing.delete(value);
    } else {
      existing.add(value);
    }
    newParams.delete('tag');
    existing.forEach((item) => newParams.append('tag', item));
    newParams.delete('after');
    setSearchParams(newParams);
  };

  const handleAvailabilityChange = (value: 'in-stock' | 'out-of-stock' | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value) {
      newParams.delete('availability');
    } else {
      newParams.set('availability', value);
    }
    newParams.delete('after');
    setSearchParams(newParams);
  };

  const handlePriceRangeChange = (range: {min?: number; max?: number}) => {
    const newParams = new URLSearchParams(searchParams);
    if (range.min !== undefined && Number.isFinite(range.min)) {
      newParams.set('price_min', range.min.toString());
    } else {
      newParams.delete('price_min');
    }
    if (range.max !== undefined && Number.isFinite(range.max)) {
      newParams.set('price_max', range.max.toString());
    } else {
      newParams.delete('price_max');
    }
    newParams.delete('after');
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    ['type', 'vendor', 'tag', 'availability', 'after', 'price_min', 'price_max'].forEach((param) =>
      newParams.delete(param),
    );
    setSearchParams(newParams);
    setFiltersOpen(false);
  };

  const activeFilterChips: Array<{id: string; label: string; onRemove: () => void}> = [
    ...selectedTags.map((tag) => ({
      id: `tag:${tag}`,
      label: getTagDisplayLabel(tag),
      onRemove: () => handleTagToggle(tag),
    })),
  ];
  if (selectedAvailability) {
    activeFilterChips.push({
      id: `availability:${selectedAvailability}`,
      label: selectedAvailability === 'in-stock' ? 'In stock' : 'Back-order',
      onRemove: () => handleAvailabilityChange(null),
    });
  }

  if (selectedPriceRange.min !== undefined || selectedPriceRange.max !== undefined) {
    let label = 'Price';
    if (selectedPriceRange.min !== undefined && selectedPriceRange.max !== undefined) {
      label = `Price: ${priceFormatter.format(selectedPriceRange.min)} – ${priceFormatter.format(selectedPriceRange.max)}`;
    } else if (selectedPriceRange.min !== undefined) {
      label = `Price: From ${priceFormatter.format(selectedPriceRange.min)}`;
    } else if (selectedPriceRange.max !== undefined) {
      label = `Price: Up to ${priceFormatter.format(selectedPriceRange.max)}`;
    }
    activeFilterChips.push({
      id: 'price-range',
      label,
      onRemove: () => handlePriceRangeChange({}),
    });
  }

  const activeFilterCount = activeFilterChips.length;
  const openFilters = () => setFiltersOpen(true);
  const closeFilters = () => setFiltersOpen(false);

  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-slate-100">
      {/* Category Hero Banner */}
      {data.hero && (
        <div
          className="border-b border-slate-200 py-12"
          style={{
            background: `linear-gradient(135deg, ${data.hero.accentColor}15 0%, transparent 60%)`,
          }}
        >
          <div className="container-custom">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
              Browse
            </p>
            <h1
              className="mt-2 text-4xl font-bold text-slate-900"
              style={{color: data.hero.accentColor}}
            >
              {data.hero.title}
            </h1>
            <p className="mt-2 max-w-2xl text-lg text-slate-600">
              {data.hero.subtitle}
            </p>
            <p className="mt-4 text-sm text-slate-500">
              {data.totalCount} products available
            </p>
          </div>
        </div>
      )}

      <div className="container-custom py-16">
        {/* Show standard search header if no hero */}
        {!data.hero && (
          <div className="mb-10 space-y-3 text-center lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Search</p>
            <h1 className="text-4xl font-semibold text-slate-900">Browse {data.totalCount.toLocaleString()} Vaping Products at Vapourism: Fast Delivery & Filters</h1>
            <p className="text-slate-600">Matching products powered by Shopify native search.</p>
          </div>
        )}

        <div className="mb-6 flex items-center justify-end">
          <button
            type="button"
            onClick={openFilters}
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
        </div>

        <div className="grid gap-8 lg:grid-cols-[320px,1fr]">
          <div className="order-2 block">
            <SearchFilters
              facetGroups={data.facets}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
              availability={selectedAvailability}
              onAvailabilityChange={handleAvailabilityChange}
              selectedPriceRange={selectedPriceRange}
              priceSummary={data.priceSummary}
              onPriceRangeChange={handlePriceRangeChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          <div className="order-1 space-y-6 lg:order-2">
            {data.products.length > 0 && (
              <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-semibold text-slate-600">
                    Showing {data.products.length} of {data.totalCount} products
                  </p>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <label htmlFor="sort" className="font-semibold">
                      Sort by
                    </label>
                    <select
                      id="sort"
                      value={currentSort}
                      onChange={(e) => {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.set('sort', e.target.value);
                        newParams.delete('after');
                        setSearchParams(newParams);
                      }}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 focus:border-slate-900 focus:outline-none"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {activeFilterChips.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {activeFilterChips.map((chip) => (
                      <button
                        key={chip.id}
                        type="button"
                        onClick={chip.onRemove}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600"
                      >
                        {chip.label}
                        <span aria-hidden className="text-slate-400">×</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <SearchResults
              products={data.products}
              totalCount={data.totalCount}
              query={data.query}
              hasNextPage={data.pageInfo.hasNextPage}
              onLoadMore={handleLoadMore}
              isLoading={isLoading}
            />

            {data.error && (
              <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4">
                <p className="text-sm text-rose-700">
                  {data.error}. Please try again or contact support if the problem persists.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ClientOnly fallback={null}>
        {() => (
          <MobileFiltersDialog
            isOpen={isFiltersOpen}
            onClose={closeFilters}
            facetGroups={data.facets}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            availability={selectedAvailability}
            onAvailabilityChange={handleAvailabilityChange}
            selectedPriceRange={selectedPriceRange}
            priceSummary={data.priceSummary}
            onPriceRangeChange={handlePriceRangeChange}
            onClearFilters={handleClearFilters}
          />
        )}
      </ClientOnly>
    </div>
  );
}

// SEO Meta Tags
export const meta = ({data}: {data: any}) => {
  const query = data?.query || '';
  const count = data?.totalCount || 0;

  // Use centralized truncation for consistency
  const title = SEOAutomationService.truncateTitle(`Search Results for "${query}" | Vapourism`);

  return [
    {title},
    {
      name: 'description',
      content: `Found ${count} products matching "${query}". Shop premium vaping products at Vapourism with fast UK delivery.`,
    },
    {
      name: 'robots',
      content: 'noindex, follow', // Don't index search results pages
    },
  ];
};
