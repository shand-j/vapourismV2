/**
 * Related Products Component
 * 
 * Displays related products to improve internal linking and reduce orphan pages.
 * Uses multiple strategies to find related products:
 * - Same vendor/brand
 * - Same product type
 * - Shared tags
 * - Complementary products
 */

import {Suspense} from 'react';
import {Link, useLoaderData, Await} from '@remix-run/react';
import type {ProductCardProduct} from './ProductCard';
import {ProductCard, ProductCardSkeleton} from './ProductCard';
import {cn} from '~/lib/utils';

export interface RelatedProductsLoaderData {
  relatedProducts: Promise<ProductCardProduct[]>;
  strategy: 'vendor' | 'productType' | 'tags' | 'mixed' | 'popular';
  currentProductId: string;
}

interface RelatedProductsProps {
  title?: string;
  className?: string;
}

/**
 * Related Products Section
 * Wraps the async loader data in Suspense for progressive enhancement
 */
export function RelatedProducts({
  title = 'You May Also Like',
  className,
}: RelatedProductsProps) {
  const {relatedProducts, currentProductId} = useLoaderData<RelatedProductsLoaderData>();

  return (
    <section className={cn('py-16', className)}>
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <ProductCardSkeleton key={`skeleton-${i}`} />
              ))}
            </div>
          }
        >
          <Await resolve={relatedProducts}>
            {(products) => {
              // Filter out current product
              const filtered = products.filter((p) => p.id !== currentProductId);
              
              if (filtered.length === 0) {
                return null;
              }

              return (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                  {filtered.slice(0, 4).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      showVendor={true}
                      showRating={true}
                      size="default"
                    />
                  ))}
                </div>
              );
            }}
          </Await>
        </Suspense>
      </div>
    </section>
  );
}

/**
 * Vendor Products Link Component
 * Creates internal link to vendor/brand page
 */
interface VendorLinkProps {
  vendor: string;
  className?: string;
}

export function VendorProductsLink({vendor, className}: VendorLinkProps) {
  return (
    <div className={cn('py-8 border-t border-slate-200', className)}>
      <Link
        to={`/search?vendor=${encodeURIComponent(vendor)}`}
        className="inline-flex items-center gap-2 text-base font-semibold text-[#5b2be0] hover:underline"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
        View all {vendor} products
      </Link>
    </div>
  );
}

/**
 * Breadcrumb Component
 * Provides hierarchical navigation structure for SEO
 */
interface BreadcrumbProps {
  items: Array<{label: string; url: string}>;
  currentPage: string;
  className?: string;
}

export function ProductBreadcrumb({items, currentPage, className}: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('py-4', className)}>
      <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <li>
          <Link to="/" className="hover:text-[#5b2be0] transition-colors">
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <svg className="h-4 w-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <Link to={item.url} className="hover:text-[#5b2be0] transition-colors">
              {item.label}
            </Link>
          </li>
        ))}
        <li className="flex items-center gap-2">
          <svg className="h-4 w-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium text-slate-900">{currentPage}</span>
        </li>
      </ol>
    </nav>
  );
}

/**
 * Popular Categories Component
 * Quick links to popular product categories
 */
interface PopularCategoriesProps {
  className?: string;
}

const POPULAR_CATEGORIES = [
  {label: 'Disposable Vapes', url: '/search?product_type=disposable_vape', icon: '💨'},
  {label: 'E-Liquids', url: '/search?product_type=e-liquid', icon: '💧'},
  {label: 'Pod Systems', url: '/search?product_type=pod_system', icon: '📱'},
  {label: 'CBD Products', url: '/search?product_type=cbd', icon: '🌿'},
  {label: 'Nicotine Pouches', url: '/search?product_type=nicotine_pouches', icon: '🎯'},
  {label: 'Coils & Pods', url: '/search?product_type=coil', icon: '🔧'},
];

export function PopularCategories({className}: PopularCategoriesProps) {
  return (
    <section className={cn('py-12 bg-slate-50', className)}>
      <div className="container mx-auto px-4">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {POPULAR_CATEGORIES.map((category) => (
            <Link
              key={category.url}
              to={category.url}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-6 text-center transition-all hover:border-[#5b2be0] hover:shadow-md"
            >
              <span className="text-3xl">{category.icon}</span>
              <span className="text-sm font-semibold text-slate-900">{category.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RelatedProducts;
