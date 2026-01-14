import React from 'react';
import {Link} from '@remix-run/react';
import {cn, formatMoney} from '~/lib/utils';

/**
 * Product type for ProductCard component
 * Matches the PRODUCT_CARD_FRAGMENT from fragments.ts
 */
export interface ProductCardProduct {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  featuredImage?: {
    url: string;
    altText?: string | null;
  } | null;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
}

interface ProductCardProps {
  product: ProductCardProduct;
  className?: string;
  showVendor?: boolean;
  showRating?: boolean;
  /** Size variant for different contexts */
  size?: 'default' | 'compact';
}

function StarIcon() {
  return (
    <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

const STAR_POSITIONS = [1, 2, 3, 4, 5] as const;

/**
 * Reusable ProductCard component for product grids and showcases.
 * Extracts the pattern from _index.tsx for consistency across the site.
 */
export function ProductCard({
  product,
  className,
  showVendor = true,
  showRating = true,
  size = 'default',
}: ProductCardProps) {
  const isCompact = size === 'compact';

  return (
    <Link
      key={product.id}
      to={`/products/${product.handle}`}
      prefetch="intent"
      className={cn(
        'group relative block overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:border-slate-300/80 hover:shadow-[0_20px_60px_rgba(91,43,224,0.15)] hover:-translate-y-1',
        className,
      )}
    >
      {/* Gradient border effect on hover */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#5b2be0]/0 via-[#1fb2ff]/0 to-[#5b2be0]/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{padding: '1px', zIndex: -1}} />
      
      <div className="relative aspect-square overflow-hidden rounded-t-3xl bg-gradient-to-br from-slate-50 to-slate-100">
        {product.featuredImage ? (
          <>
            <img
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
              loading="lazy"
            />
            {/* Overlay gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400">
            <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs">No image</span>
          </div>
        )}
        {showVendor && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
            {product.vendor}
          </span>
        )}
        {/* Quick view badge on hover */}
        <div className="absolute bottom-3 right-3 rounded-full bg-[#5b2be0] p-2.5 text-white opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 group-hover:scale-110">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
      </div>
      <div className={cn('space-y-3 bg-gradient-to-b from-white to-slate-50/50', isCompact ? 'p-4' : 'p-5')}>
        <h3
          className={cn(
            'font-semibold text-slate-900 transition-colors duration-200 group-hover:text-[#5b2be0] line-clamp-2 leading-snug',
            isCompact ? 'text-sm' : 'text-base',
          )}
        >
          {product.title}
        </h3>
        {showRating && (
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {STAR_POSITIONS.map((position) => (
                <StarIcon key={`${product.id}-star-${position}`} />
              ))}
            </div>
            <span className="text-xs text-slate-500">(4.8)</span>
          </div>
        )}
        <div className="flex items-baseline justify-between">
          <p className={cn('font-bold bg-gradient-to-r from-[#5b2be0] to-[#1fb2ff] bg-clip-text text-transparent', isCompact ? 'text-lg' : 'text-xl')}>
            {formatMoney(product.priceRange.minVariantPrice)}
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5b2be0] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
            View
            <ArrowRightIcon />
          </span>
        </div>
      </div>
    </Link>
  );
}

/**
 * Skeleton loader for ProductCard - used during Suspense fallback
 */
export function ProductCardSkeleton({className}: {className?: string}) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-3xl border border-slate-200/60 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]',
        className,
      )}
    >
      <div className="aspect-square rounded-t-3xl bg-gradient-to-br from-slate-200 to-slate-300" />
      <div className="space-y-3 bg-gradient-to-b from-white to-slate-50/50 p-5">
        <div className="h-4 w-3/4 rounded-lg bg-slate-200" />
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {STAR_POSITIONS.map((pos) => (
              <div key={pos} className="h-4 w-4 rounded bg-slate-200" />
            ))}
          </div>
          <div className="h-3 w-8 rounded bg-slate-200" />
        </div>
        <div className="flex items-baseline justify-between">
          <div className="h-6 w-20 rounded-lg bg-slate-200" />
          <div className="h-3 w-12 rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
