/**
 * Search Results Display Component
 * 
 * Renders paginated search results from Shopify search API with modern UI
 */

import {Link} from '@remix-run/react';
import type {SearchProduct} from '../../lib/shopify-search';
import {formatMoney} from '../../lib/utils';
import {ProductCard} from '../ProductCard';

interface SearchResultsProps {
  products: SearchProduct[];
  totalCount: number;
  query: string;
  hasNextPage: boolean;
  onLoadMore?: () => void;
  isLoading?: boolean;
}

export function SearchResults({
  products,
  totalCount,
  query,
  hasNextPage,
  onLoadMore,
  isLoading = false,
}: SearchResultsProps) {
  // Show initial loading state when no products and loading
  if (isLoading && products.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200/60 bg-white p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-200 border-t-[#5b2be0]"></div>
            <div className="absolute inset-2 animate-ping rounded-full bg-[#5b2be0]/20"></div>
          </div>
          <p className="text-xl font-bold bg-gradient-to-r from-[#5b2be0] to-[#1fb2ff] bg-clip-text text-transparent">
            Loading products...
          </p>
          <p className="text-sm text-slate-600">Fetching the best results for you</p>
        </div>
      </div>
    );
  }

  // Show no results state
  if (products.length === 0 && !isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200/60 bg-gradient-to-br from-white to-slate-50 p-16 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="relative mx-auto mb-6 h-24 w-24">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 opacity-50"></div>
          <svg
            className="relative h-full w-full p-5 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-slate-900">
          No results found
        </h3>
        <p className="mt-3 text-base text-slate-600 max-w-md mx-auto">
          {query.trim()
            ? `We couldn't find any products matching "${query}"`
            : 'No products match your current filters'
          }
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Try adjusting your filters or search terms
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/search"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#5b2be0] to-[#1fb2ff] px-8 py-4 text-sm font-semibold text-white shadow-[0_25px_60px_rgba(91,43,224,0.35)] hover:shadow-[0_35px_80px_rgba(91,43,224,0.45)] transition-all hover:scale-105"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Browse All Products
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 bg-white px-8 py-4 text-sm font-semibold text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Main content with loading overlay
  return (
    <div className="relative">
      {/* Loading overlay when navigating/filtering */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-white/95 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-200 border-t-[#5b2be0]"></div>
            </div>
            <p className="text-sm font-semibold bg-gradient-to-r from-[#5b2be0] to-[#1fb2ff] bg-clip-text text-transparent">
              Updating results...
            </p>
          </div>
        </div>
      )}

      <div className={`space-y-8 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{totalCount}</span> product{totalCount !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Product Grid - Use ProductCard component for consistency */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showVendor={true}
              showRating={true}
            />
          ))}
        </div>

        {hasNextPage && onLoadMore && (
          <div className="flex justify-center pt-8">
            <button
              onClick={onLoadMore}
              disabled={isLoading}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border-2 border-slate-200 bg-white px-10 py-4 text-sm font-semibold text-slate-900 shadow-sm transition-all hover:border-[#5b2be0] hover:shadow-lg hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#5b2be0]/5 to-[#1fb2ff]/5 opacity-0 transition-opacity group-hover:opacity-100"></span>
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-[#5b2be0]"></div>
                  Loading more...
                </>
              ) : (
                <>
                  Load More Products
                  <svg className="h-4 w-4 transition-transform group-hover:translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
