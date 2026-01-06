/**
 * Search Results Page Route
 * 
 * Simplified search page using Shopify native search.
 * Filtering is handled by Shopify Search & Discovery app.
 * URL: /search?q=query&page=1&sort=RELEVANCE
 */

import {FunnelIcon} from '@heroicons/react/24/outline';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';
import {useLoaderData, useNavigation, useSearchParams} from '@remix-run/react';
import {useEffect, useMemo, useState} from 'react';

import {ClientOnly} from '../components/ClientOnly';
import {SearchFilters} from '../components/search/SearchFilters';
import {SearchResults} from '../components/search/SearchResults';
import {MobileFiltersDialog} from '../components/search/MobileFiltersDialog';
import {EmailCapturePopup} from '../components/EmailCapturePopup';
import {useEmailCapturePopup} from '../lib/hooks/useEmailCapturePopup';
import {
  calculatePriceSummary,
  type PriceSummary,
} from '../lib/search-facets';
import {searchProducts, trackSearchEvent} from '../lib/shopify-search';
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
  priceSummary: PriceSummary | null;
  hero: CategoryHero | null;
  selectedVendor: string | null;
  selectedProductType: string | null;
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
  
  // Simple filters - vendor and product type
  const vendor = searchParams.get('vendor') || undefined;
  const productType = searchParams.get('type') || undefined;
  const availability = searchParams.get('availability');
  const priceMinParam = searchParams.get('price_min');
  const priceMaxParam = searchParams.get('price_max');

  // User enters VAT-inclusive prices, but Shopify stores ex-VAT
  // Convert user input to ex-VAT for filtering
  const priceRange: {min?: number; max?: number} = {};
  const parsedMin = priceMinParam ? parseFloat(priceMinParam) : undefined;
  const parsedMax = priceMaxParam ? parseFloat(priceMaxParam) : undefined;
  if (parsedMin !== undefined && !Number.isNaN(parsedMin) && parsedMin >= 0) {
    priceRange.min = parsedMin / (1 + UK_VAT_RATE);
  }
  if (parsedMax !== undefined && !Number.isNaN(parsedMax) && parsedMax >= 0) {
    priceRange.max = parsedMax / (1 + UK_VAT_RATE);
  }
  if (
    priceRange.min !== undefined &&
    priceRange.max !== undefined &&
    priceRange.min > priceRange.max
  ) {
    const temp = priceRange.min;
    priceRange.min = priceRange.max;
    priceRange.max = temp;
  }

  try {
    // Use simplified search with direct options
    const searchResults = await searchProducts(context.storefront, query, {
      first: 24,
      after,
      sortKey,
      reverse,
      vendor,
      productType,
      available: availability === 'in-stock' ? true : availability === 'out-of-stock' ? false : undefined,
      priceRange: (priceRange.min !== undefined || priceRange.max !== undefined) ? priceRange : undefined,
    });

    // Calculate price summary from filtered results
    const priceSummary = calculatePriceSummary(searchResults.products);

    // Get hero banner based on product type (simplified from tag-based)
    const heroTags = productType ? [productType.toLowerCase().replace(/\s+/g, '_')] : [];
    const hero = getHeroForTags(heroTags);

    return json<SearchLoaderData>({
      query,
      products: searchResults.products,
      totalCount: searchResults.totalCount,
      pageInfo: searchResults.pageInfo,
      priceSummary,
      hero,
      selectedVendor: vendor || null,
      selectedProductType: productType || null,
    }, {
      headers: {
        'Cache-Control': 'public, max-age=60',
        'X-Search-Performance': `${Date.now() - startTime}ms`,
      },
    });

  } catch (error) {
    console.error('Search error:', error);
    return json<SearchLoaderData>({
      query,
      products: [],
      totalCount: 0,
      pageInfo: { hasNextPage: false },
      priceSummary: null,
      hero: null,
      selectedVendor: vendor || null,
      selectedProductType: productType || null,
      error: 'Search failed',
    }, {status: 500});
  }
}

export default function SearchPage() {
  const data = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFiltersOpen, setFiltersOpen] = useState(false);
  
  // Email capture popup - show on search page landing
  const emailCapture = useEmailCapturePopup({
    showImmediately: true,
    trigger: 'search',
  });

  const isLoading = navigation.state === 'loading';
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
    ['type', 'vendor', 'availability', 'after', 'price_min', 'price_max'].forEach((param) =>
      newParams.delete(param),
    );
    setSearchParams(newParams);
    setFiltersOpen(false);
  };

  // Build active filter chips from current filters
  const activeFilterChips: Array<{id: string; label: string; onRemove: () => void}> = [];
  
  if (data.selectedVendor) {
    activeFilterChips.push({
      id: `vendor:${data.selectedVendor}`,
      label: `Brand: ${data.selectedVendor}`,
      onRemove: () => {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('vendor');
        newParams.delete('after');
        setSearchParams(newParams);
      },
    });
  }
  
  if (data.selectedProductType) {
    activeFilterChips.push({
      id: `type:${data.selectedProductType}`,
      label: `Type: ${data.selectedProductType}`,
      onRemove: () => {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('type');
        newParams.delete('after');
        setSearchParams(newParams);
      },
    });
  }
  
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
            <h1 className="text-4xl font-semibold text-slate-900">
              {data.totalCount > 0 
                ? `Browse ${data.totalCount.toLocaleString()} Vaping Products at Vapourism: Fast Delivery & Filters`
                : 'Browse Vaping Products at Vapourism: Fast Delivery & Filters'}
            </h1>
            <p className="text-slate-600">
              {data.totalCount > 0 
                ? 'Matching products powered by Shopify native search.'
                : 'No matching products found. Try adjusting your filters or search terms.'}
            </p>
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
            availability={selectedAvailability}
            onAvailabilityChange={handleAvailabilityChange}
            selectedPriceRange={selectedPriceRange}
            priceSummary={data.priceSummary}
            onPriceRangeChange={handlePriceRangeChange}
            onClearFilters={handleClearFilters}
          />
        )}
      </ClientOnly>

      {/* Email Capture Popup */}
      <ClientOnly fallback={null}>
        {() => (
          <EmailCapturePopup
            isOpen={emailCapture.isOpen}
            onClose={emailCapture.closePopup}
            trigger={emailCapture.trigger}
          />
        )}
      </ClientOnly>
    </div>
  );
}

// SEO Meta Tags
export const meta = ({data, location}: {data: SearchLoaderData | null; location: {pathname: string; search?: string}}) => {
  const query = data?.query || '';
  const count = data?.totalCount || 0;
  const vendor = data?.selectedVendor;
  const productType = data?.selectedProductType;
  
  // Extract URL parameters for indexing decisions
  const url = new URL(location?.pathname || '/search', 'https://www.vapourism.co.uk');
  if (location?.search) {
    url.search = location.search;
  }
  const after = url.searchParams.get('after'); // pagination cursor
  const sort = url.searchParams.get('sort');
  // Check for additional filters that create duplicate content
  const hasFilters = url.searchParams.has('price_min') || url.searchParams.has('price_max') || url.searchParams.has('availability');
  
  // Brand/vendor pages should be indexable (important for SEO)
  // But NOT paginated results, filtered results (except by vendor/type), or sorted results
  const shouldIndex = (!!vendor || !!productType) && !after && !sort && !hasFilters;
  
  // Generate brand-specific title and description
  let title = '';
  let description = '';
  
  if (vendor) {
    // Brand/vendor page - optimized for SEO
    title = SEOAutomationService.truncateTitle(`${vendor} Vape Products (${count}) | Fast UK Delivery | Vapourism`);
    description = `Shop ${count}+ authentic ${vendor} vaping products. ✓ Premium quality ✓ Fast UK delivery ✓ Competitive prices ✓ Genuine ${vendor} products from authorized UK retailer. Browse e-liquids, devices & accessories.`;
  } else if (productType) {
    // Product type page
    title = SEOAutomationService.truncateTitle(`${productType} (${count}) | UK Vape Shop | Vapourism`);
    description = SEOAutomationService.generateCategoryMetaDescription(productType, count);
  } else if (query) {
    // Search query results
    title = SEOAutomationService.truncateTitle(`Search: "${query}" (${count} Results) | Vapourism`);
    description = `Found ${count} products matching "${query}". Shop premium vaping products at Vapourism with fast UK delivery.`;
  } else {
    // General search/browse page
    title = SEOAutomationService.truncateTitle(`Browse All Vape Products (${count}+) | Vapourism`);
    description = `Browse ${count}+ vaping products. ✓ E-liquids ✓ Devices ✓ Accessories ✓ Fast UK delivery ✓ Premium quality ✓ Best prices.`;
  }

  return [
    {title},
    {
      name: 'description',
      content: description,
    },
    {
      property: 'og:title',
      content: vendor 
        ? `${vendor} Vape Products - Shop ${count}+ Items with Fast Delivery`
        : query 
        ? `Find Your Vape: ${query} - ${count} Products Available`
        : `Find Your Vape: ${count} Products to Choose From - Fast Delivery`,
    },
    {
      property: 'og:description',
      content: vendor
        ? `Authentic ${vendor} vaping products. Premium quality, fast UK delivery, competitive prices.`
        : 'Vaping products at your fingertips. Fast delivery, great deals.',
    },
    {
      name: 'keywords',
      content: vendor 
        ? `${vendor}, ${vendor} vape, ${vendor} products, ${vendor} uk, buy ${vendor}, ${vendor} e-liquid, ${vendor} devices, official ${vendor} stockist`
        : 'vaping products, e-liquids, vape devices, vape accessories, online vaping store, fast delivery vaping, vape discounts, same-day dispatch',
    },
    {
      name: 'robots',
      // Index brand/vendor pages and product type pages, but not general search results
      content: shouldIndex ? 'index, follow' : 'noindex, follow',
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:site',
      content: '@vapourismuk',
    },
    {
      name: 'twitter:title',
      content: title,
    },
    {
      name: 'twitter:description',
      content: vendor
        ? `Shop authentic ${vendor} products in the UK. ${count} items available with fast delivery!`
        : `Find your perfect vape! ${count > 0 ? count : '1929'} products to choose from. Fast delivery & great prices! #VapingDeals #Eliquids`,
    },
  ];
};
