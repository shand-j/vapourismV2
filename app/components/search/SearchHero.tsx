import React from 'react';
import {Link} from '@remix-run/react';
import {ProductCard} from '~/components/ProductCard';
import type {ProductCardProduct} from '~/components/ProductCard';

interface SearchHeroProps {
  /** Current category product_type (e.g., "disposable_vape") */
  productType: string;
  /** Hero products from metafields */
  products: ProductCardProduct[];
  /** Category display name */
  categoryName: string;
}

/**
 * Hero section for search results showing top picks for a category.
 * Displayed above search results when category hero products are configured.
 */
export function SearchHero({productType, products, categoryName}: Readonly<SearchHeroProps>) {
  if (!products.length) {
    return null;
  }

  return (
    <section className="mb-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
            Top picks
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900 lg:text-2xl">
            Our best {categoryName}
          </h2>
        </div>
        <Link
          to={`/search?product_type=${encodeURIComponent(productType)}`}
          className="text-sm font-semibold text-[#5b2be0] hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.slice(0, 4).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            size="compact"
            showRating={false}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * Skeleton loader for SearchHero during loading state
 */
export function SearchHeroSkeleton() {
  return (
    <section className="mb-8 animate-pulse rounded-2xl bg-gradient-to-br from-slate-50 to-white p-6 lg:p-8">
      <div className="mb-6">
        <div className="h-3 w-20 rounded bg-slate-200" />
        <div className="mt-2 h-6 w-48 rounded bg-slate-200" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-100 bg-white/90">
            <div className="aspect-square rounded-t-2xl bg-slate-200" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-3/4 rounded bg-slate-200" />
              <div className="h-5 w-1/3 rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SearchHero;
