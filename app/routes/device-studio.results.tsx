/**
 * Device Studio Results Route
 * 
 * Displays personalised device recommendations based on quiz answers.
 * Uses Shopify Storefront search API with attribute-based filtering.
 * 
 * URL: /device-studio/results?product_type=pod_system&device_type=mouth-to-lung
 */

import {FunnelIcon} from '@heroicons/react/24/outline';
import {json, type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {Link, useLoaderData, useNavigation, useSearchParams} from '@remix-run/react';
import {useState} from 'react';

import {ClientOnly} from '~/components/ClientOnly';
import {SearchFilters} from '~/components/search/SearchFilters';
import {SearchResults} from '~/components/search/SearchResults';
import {MobileFiltersDialog} from '~/components/search/MobileFiltersDialog';
import {
  buildTagFacetGroups,
  calculatePriceSummary,
  getTagDisplayLabel,
  type PriceSummary,
} from '~/lib/search-facets';
import {searchProducts} from '~/lib/shopify-search';
import type {SearchProduct} from '~/lib/shopify-search';


type LoaderData = {
  products: SearchProduct[];
  totalCount: number;
  pageInfo: {
    hasNextPage: boolean;
    endCursor?: string;
  };
  facets: ReturnType<typeof buildTagFacetGroups>;
  priceSummary: PriceSummary | null;
  appliedTags: string[];
  quizSource: boolean;
  error?: string;
};

export const meta: MetaFunction<typeof loader> = ({data}) => {
  const count = data?.totalCount || 0;
  return [
    {title: `Your Device Matches (${count} products) | Vapourism`},
    {
      name: 'description',
      content: `Found ${count} vaping devices matching your preferences. Compare pod systems, mods, and starter kits with fast UK delivery.`,
    },
    {name: 'robots', content: 'noindex, follow'},
  ];
};

export async function loader({request, context}: LoaderFunctionArgs) {
  const {searchParams} = new URL(request.url);
  
  const selectedTags = searchParams.getAll('tag');
  const after = searchParams.get('after') || undefined;
  const quizSource = searchParams.get('source') === 'device-studio';
  
  // Also check for new attribute-based filters
  const productTypeFilters = searchParams.getAll('product_type');
  const deviceTypeFilters = searchParams.getAll('device_type');
  
  // If no tags or filters, show devices by default
  const hasFilters = selectedTags.length > 0 || productTypeFilters.length > 0 || deviceTypeFilters.length > 0;
  const defaultProductTypes = ['pod_system', 'mod', 'disposable_vape'];

  try {
    // Build search query
    let searchQuery = '*';
    
    if (hasFilters) {
      // Use provided filters
      const queryParts: string[] = [];
      
      // Add tag-based query parts
      if (selectedTags.length > 0) {
        queryParts.push(`(${selectedTags.map(tag => `tag:${tag}`).join(' OR ')})`);
      }
      
      // Add product type filters
      if (productTypeFilters.length > 0) {
        queryParts.push(`(${productTypeFilters.map(pt => `product_type:${pt}`).join(' OR ')})`);
      }
      
      if (queryParts.length > 0) {
        searchQuery = queryParts.join(' ');
      }
    } else {
      // Default: show device-related product types
      searchQuery = `(${defaultProductTypes.map(pt => `product_type:${pt}`).join(' OR ')})`;
    }

    const searchResults = await searchProducts(context.storefront, searchQuery, {
      first: 100,
      after,
      sortKey: 'RELEVANCE',
      reverse: false,
    });

    // Apply additional client-side filtering by parsed_attributes if needed
    let filteredProducts = searchResults.products;
    
    // Filter by device_type if specified
    if (deviceTypeFilters.length > 0) {
      const { filterProductsByAttributes } = await import('~/lib/search-facets');
      filteredProducts = filterProductsByAttributes(filteredProducts, {
        device_type: deviceTypeFilters,
      });
    }
    
    // Legacy tag filtering (for backwards compatibility)
    if (selectedTags.length > 0) {
      filteredProducts = filteredProducts.filter((product) => {
        const productTags = (product.tags || []).map(t => t.toLowerCase());
        return selectedTags.some(tag => 
          productTags.includes(tag.toLowerCase()) ||
          productTags.some(pt => pt.includes(tag.toLowerCase()))
        );
      });
    }

    const facets = buildTagFacetGroups(filteredProducts, selectedTags);
    const priceSummary = calculatePriceSummary(filteredProducts);

    // Paginate
    const pageSize = 24;
    const startIndex = after ? Number.parseInt(after, 10) || 0 : 0;
    const endIndex = startIndex + pageSize;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    const hasMorePages = endIndex < filteredProducts.length;

    return json<LoaderData>({
      products: paginatedProducts,
      totalCount: filteredProducts.length,
      pageInfo: {
        hasNextPage: hasMorePages,
        endCursor: hasMorePages ? endIndex.toString() : undefined,
      },
      facets,
      priceSummary,
      appliedTags: selectedTags,
      quizSource,
    });
  } catch (error) {
    console.error('Device studio results error:', error);
    return json<LoaderData>({
      products: [],
      totalCount: 0,
      pageInfo: {hasNextPage: false},
      facets: [],
      priceSummary: null,
      appliedTags: selectedTags,
      quizSource,
      error: 'Failed to load results',
    }, {status: 500});
  }
}

export default function DeviceStudioResultsRoute() {
  const data = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const isLoading = navigation.state === 'loading';
  const selectedTags = searchParams.getAll('tag');

  const handleLoadMore = () => {
    if (data.pageInfo.endCursor) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('after', data.pageInfo.endCursor);
      setSearchParams(newParams);
    }
  };

  const handleTagToggle = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    const existingTags = newParams.getAll('tag');
    const existingSet = new Set(existingTags);
    if (existingSet.has(value)) {
      existingSet.delete(value);
    } else {
      existingSet.add(value);
    }
    newParams.delete('tag');
    // eslint-disable-next-line unicorn/no-array-for-each
    Array.from(existingSet).forEach((item) => newParams.append('tag', item));
    newParams.delete('after');
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    const newParams = new URLSearchParams();
    newParams.set('source', 'device-studio');
    setSearchParams(newParams);
    setIsFiltersOpen(false);
  };

  const activeFilterChips = selectedTags.map((tag) => ({
    id: `tag:${tag}`,
    label: getTagDisplayLabel(tag) || tag.split('_').join(' '),
    onRemove: () => handleTagToggle(tag),
  }));

  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-slate-100">
      {/* Hero Header */}
      <div
        className="relative overflow-hidden py-12 text-white"
        style={{
          background: `linear-gradient(135deg, #1fb2ff 0%, #5b2be0 100%)`,
        }}
      >
        <div className="container-custom">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <Link
                  to="/device-studio"
                  className="inline-flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m6-6l-6 6 6 6" />
                  </svg>
                  Retake quiz
                </Link>
              </div>
              <h1 className="text-3xl font-bold md:text-4xl">Your Device Matches</h1>
              <p className="mt-2 text-white/80">
                {data.totalCount} devices matched your preferences
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔋</span>
              <span className="text-3xl">💨</span>
              <span className="text-3xl">⚡</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Filter Toggle */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing {data.products.length} of {data.totalCount} products
          </p>
          <button
            type="button"
            onClick={() => setIsFiltersOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400"
          >
            <FunnelIcon className="h-5 w-5" />
            Refine results
            {activeFilterChips.length > 0 && (
              <span className="rounded-full bg-[#1fb2ff] px-2 py-0.5 text-xs font-bold text-white">
                {activeFilterChips.length}
              </span>
            )}
          </button>
        </div>

        {/* Active Filters */}
        {activeFilterChips.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-slate-500">Active filters:</span>
            {activeFilterChips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={chip.onRemove}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 hover:border-slate-300"
              >
                {chip.label}
                <span className="text-slate-400">×</span>
              </button>
            ))}
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-sm font-medium text-[#1fb2ff] hover:underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid gap-8 lg:grid-cols-[280px,1fr]">
          {/* Desktop Filters */}
          <div className="hidden lg:block">
            <SearchFilters
              facetGroups={data.facets}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
              availability={null}
              onAvailabilityChange={() => {}}
              selectedPriceRange={{}}
              priceSummary={data.priceSummary}
              onPriceRangeChange={() => {}}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Products */}
          <div>
            <SearchResults
              products={data.products}
              totalCount={data.totalCount}
              query=""
              hasNextPage={data.pageInfo.hasNextPage}
              onLoadMore={handleLoadMore}
              isLoading={isLoading}
            />

            {data.error && (
              <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50 p-4">
                <p className="text-sm text-rose-700">{data.error}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      <ClientOnly fallback={null}>
        {() => (
          <MobileFiltersDialog
            isOpen={isFiltersOpen}
            onClose={() => setIsFiltersOpen(false)}
            facetGroups={data.facets}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            availability={null}
            onAvailabilityChange={() => {}}
            selectedPriceRange={{}}
            priceSummary={data.priceSummary}
            onPriceRangeChange={() => {}}
            onClearFilters={handleClearFilters}
          />
        )}
      </ClientOnly>
    </div>
  );
}
