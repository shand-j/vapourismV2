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
        'group block rounded-2xl border border-slate-100 bg-white/90 shadow-[0_25px_60px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_35px_80px_rgba(15,23,42,0.12)]',
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-gradient-brand-subtle">
        {product.featuredImage ? (
          <img
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            No image
          </div>
        )}
        {showVendor && (
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">
            {product.vendor}
          </span>
        )}
      </div>
      <div className={cn('space-y-3', isCompact ? 'p-4' : 'p-6')}>
        <h3
          className={cn(
            'font-semibold text-slate-900 group-hover:text-[#5b2be0] line-clamp-2',
            isCompact ? 'text-base' : 'text-lg',
          )}
        >
          {product.title}
        </h3>
        {showRating && (
          <div className="flex items-center gap-1">
            {STAR_POSITIONS.map((position) => (
              <StarIcon key={`${product.id}-star-${position}`} />
            ))}
          </div>
        )}
        <p className={cn('font-semibold text-[#5b2be0]', isCompact ? 'text-xl' : 'text-2xl')}>
          {formatMoney(product.priceRange.minVariantPrice)}
        </p>
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#5b2be0]">
          View product
          <ArrowRightIcon />
        </span>
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
        'animate-pulse rounded-2xl border border-slate-100 bg-white/90 shadow-[0_25px_60px_rgba(15,23,42,0.08)]',
        className,
      )}
    >
      <div className="aspect-square rounded-t-2xl bg-slate-200" />
      <div className="space-y-3 p-6">
        <div className="h-5 w-3/4 rounded bg-slate-200" />
        <div className="flex gap-1">
          {STAR_POSITIONS.map((pos) => (
            <div key={pos} className="h-4 w-4 rounded bg-slate-200" />
          ))}
        </div>
        <div className="h-7 w-1/3 rounded bg-slate-200" />
        <div className="h-4 w-1/2 rounded bg-slate-200" />
      </div>
    </div>
  );
}

export default ProductCard;
