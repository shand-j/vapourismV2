/**
 * Collection Products Component
 *
 * Renders a grid of products from a collection with load more pagination.
 */

import {Link} from '@remix-run/react';
import {cn} from '~/lib/utils';
import type {CollectionProduct} from '~/lib/collections';

// =============================================================================
// TYPES
// =============================================================================

interface CollectionProductsProps {
  products: CollectionProduct[];
  hasNextPage: boolean;
  onLoadMore: () => void;
  isLoading: boolean;
  className?: string;
}

// =============================================================================
// SUBCOMPONENTS
// =============================================================================

function ProductCard({product}: {product: CollectionProduct}) {
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const formattedPrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: product.priceRange.minVariantPrice.currencyCode || 'GBP',
  }).format(price);

  return (
    <Link
      to={`/products/${product.handle}`}
      prefetch="intent"
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        {product.featuredImage ? (
          <img
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Out of stock badge */}
        {!product.availableForSale && (
          <div className="absolute left-2 top-2 rounded-full bg-slate-900/80 px-2 py-1 text-xs font-semibold text-white">
            Out of Stock
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Vendor */}
        {product.vendor && (
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {product.vendor}
          </p>
        )}

        {/* Title */}
        <h3 className="mt-1 flex-1 text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-slate-700">
          {product.title}
        </h3>

        {/* Price */}
        <div className="mt-2">
          <span className="text-lg font-bold text-slate-900">{formattedPrice}</span>
        </div>
      </div>
    </Link>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="aspect-square bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 rounded bg-slate-200" />
        <div className="h-4 w-full rounded bg-slate-200" />
        <div className="h-4 w-2/3 rounded bg-slate-200" />
        <div className="h-6 w-20 rounded bg-slate-200" />
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function CollectionProducts({
  products,
  hasNextPage,
  onLoadMore,
  isLoading,
  className,
}: CollectionProductsProps) {
  if (products.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className={cn('space-y-8', className)}>
      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}

        {/* Loading skeletons */}
        {isLoading &&
          Array.from({length: 4}).map((_, i) => <ProductCardSkeleton key={`skeleton-${i}`} />)}
      </div>

      {/* Load More Button */}
      {hasNextPage && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoading}
            className={cn(
              'rounded-full px-8 py-3 text-sm font-semibold transition',
              isLoading
                ? 'cursor-not-allowed bg-slate-200 text-slate-500'
                : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg',
            )}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Loading...
              </span>
            ) : (
              'Load More Products'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
