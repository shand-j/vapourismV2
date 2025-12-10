import React, {Suspense} from 'react';
import {Await, Link} from '@remix-run/react';
import {ProductCard, ProductCardSkeleton} from '~/components/ProductCard';
import type {ProductCardProduct} from '~/components/ProductCard';
import {cn} from '~/lib/utils';

interface ProductShowcaseProps {
  /** Section title */
  title: string;
  /** Section subtitle/description */
  subtitle?: string;
  /** Products to display - can be a promise for deferred loading */
  products: ProductCardProduct[] | Promise<ProductCardProduct[]>;
  /** Number of columns in the grid */
  columns?: 4 | 8;
  /** Optional link to see more */
  viewAllLink?: string;
  /** View all link text */
  viewAllText?: string;
  /** Additional class name */
  className?: string;
  /** Show vendor badge on cards */
  showVendor?: boolean;
  /** Show star rating on cards */
  showRating?: boolean;
}

/**
 * Skeleton grid for loading state
 */
function ProductShowcaseSkeleton({
  columns = 4,
  count = 4,
}: Readonly<{
  columns?: 4 | 8;
  count?: number;
}>) {
  const items = Array.from({length: count}, (_, i) => i);
  return (
    <div
      className={cn(
        'grid gap-6',
        columns === 8
          ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-8'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      )}
    >
      {items.map((i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Grid of ProductCards with consistent styling
 */
function ProductGrid({
  products,
  columns = 4,
  showVendor = true,
  showRating = true,
}: Readonly<{
  products: ProductCardProduct[];
  columns?: 4 | 8;
  showVendor?: boolean;
  showRating?: boolean;
}>) {
  if (!products.length) {
    return null;
  }

  return (
    <div
      className={cn(
        'grid gap-6',
        columns === 8
          ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-8'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      )}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          showVendor={showVendor}
          showRating={showRating}
          size={columns === 8 ? 'compact' : 'default'}
        />
      ))}
    </div>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 8l4 4m0 0l-4 4m4-4H3"
      />
    </svg>
  );
}

/**
 * Product showcase section with title, optional subtitle, and product grid.
 * Supports deferred loading via Suspense when products is a Promise.
 *
 * @example
 * // With immediate data
 * <ProductShowcase
 *   title="Featured Products"
 *   subtitle="Our hand-picked selection"
 *   products={featuredProducts}
 *   viewAllLink="/search"
 * />
 *
 * @example
 * // With deferred data (in a loader using defer())
 * <ProductShowcase
 *   title="New Arrivals"
 *   products={deferredNewArrivals}
 * />
 */
export function ProductShowcase({
  title,
  subtitle,
  products,
  columns = 4,
  viewAllLink,
  viewAllText = 'View all',
  className,
  showVendor = true,
  showRating = true,
}: Readonly<ProductShowcaseProps>) {
  const isDeferred = products instanceof Promise;
  const productCount = columns === 8 ? 8 : 4;

  return (
    <section className={cn('py-16 lg:py-24', className)}>
      <div className="container-custom">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
            {title}
          </p>
          {subtitle && (
            <h2 className="mt-3 mb-4">{subtitle}</h2>
          )}
        </div>

        {/* Product Grid */}
        {isDeferred ? (
          <Suspense fallback={<ProductShowcaseSkeleton columns={columns} count={productCount} />}>
            <Await resolve={products}>
              {(resolvedProducts) => (
                <ProductGrid
                  products={resolvedProducts}
                  columns={columns}
                  showVendor={showVendor}
                  showRating={showRating}
                />
              )}
            </Await>
          </Suspense>
        ) : (
          <ProductGrid
            products={products}
            columns={columns}
            showVendor={showVendor}
            showRating={showRating}
          />
        )}

        {/* View All Link */}
        {viewAllLink && (
          <div className="mt-12 text-center">
            <Link
              to={viewAllLink}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:shadow-md"
            >
              {viewAllText}
              <ArrowRightIcon />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Compact product showcase for content pages (guides, policies, FAQ).
 * Shows fewer products with a simpler header.
 */
export function ContinueShoppingShowcase({
  products,
  className,
}: Readonly<{
  products: ProductCardProduct[] | Promise<ProductCardProduct[]>;
  className?: string;
}>) {
  return (
    <ProductShowcase
      title="Continue shopping"
      subtitle="Popular products"
      products={products}
      columns={4}
      viewAllLink="/search"
      viewAllText="Browse all products"
      className={cn('bg-gradient-to-br from-slate-50 to-white', className)}
      showRating={false}
    />
  );
}

export default ProductShowcase;
