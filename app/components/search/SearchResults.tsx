/**
 * Search Results Display Component
 * 
 * Renders paginated search results from Shopify search API
 */

import {Link} from '@remix-run/react';
import type {SearchProduct} from '../../lib/shopify-search';
import {formatMoney} from '../../lib/utils';

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
      <div className="rounded-[32px] border border-slate-200 bg-white/90 p-10 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900"></div>
          <p className="text-lg font-semibold text-slate-900">Loading products...</p>
          <p className="text-sm text-slate-600">Please wait while we fetch your results</p>
        </div>
      </div>
    );
  }

  // Show no results state
  if (products.length === 0 && !isLoading) {
    return (
      <div className="rounded-[32px] border border-slate-200 bg-white/90 p-10 text-center shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
        <svg
          className="mx-auto h-12 w-12 text-slate-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-semibold text-slate-900">
          No results found
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          {query.trim()
            ? `No products match your search for "${query}"`
            : 'No products found'
          }
        </p>
        <p className="mt-2 text-xs text-slate-400">
          Try different keywords, check your spelling, or browse our collections
        </p>
        <div className="mt-6">
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 rounded-full gradient-brand px-6 py-3 text-sm font-semibold text-white shadow-md"
          >
            Browse Collections
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
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[32px] border border-slate-200 bg-white/90 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900"></div>
            <p className="text-sm font-semibold text-slate-900">Updating results...</p>
          </div>
        </div>
      )}

      <div className={`space-y-6 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.handle}`}
              className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              prefetch="intent"
            >
              <div className="aspect-square overflow-hidden bg-slate-50">
                {product.featuredImage ? (
                  <img
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText || product.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-300">
                    <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM4 7v10h16V7H4zm8 2l5 3H7l5-3z"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-slate-700">
                  {product.title}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-500">
                  {product.vendor}
                </p>
                <div className="mt-2">
                  <p className="text-lg font-bold text-slate-900">
                    {formatMoney(product.priceRange.minVariantPrice)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {hasNextPage && onLoadMore && (
          <div className="flex justify-center pt-6">
            <button
              onClick={onLoadMore}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
                  Loading...
                </>
              ) : (
                <>
                  Load More Products
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
