/**
 * Collections-Based Navigation Component
 * 
 * Replaces category-mapping navigation with Shopify collections
 * Desktop mega-menu implementation
 */

import {Link} from '@remix-run/react';
import {useState} from 'react';
import type {NavigationStructure} from '../../lib/collections';
import {cn} from '../../lib/utils';

interface CollectionsNavProps {
  navigation: NavigationStructure;
  className?: string;
}

export function CollectionsNav({navigation, className = ''}: CollectionsNavProps) {
  if (!navigation.main.length) {
    return null;
  }

  const composedClassName = cn(
    'rounded-[32px] border border-white/60 bg-white/95 p-8 shadow-[0_45px_120px_rgba(15,23,42,0.22)] backdrop-blur-2xl',
    className,
  );

  return (
    <section className={composedClassName} aria-label="Shop categories">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {navigation.main.map((category) => (
          <div key={category.id} className="space-y-4 rounded-[26px] border border-slate-100 bg-white/90 p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">{category.title}</p>
                <p className="text-xs text-slate-400">
                  {typeof category.productCount === 'number' ? `${category.productCount} products` : 'Live Shopify collection'}
                </p>
              </div>
              <Link
                to={category.url}
                prefetch="intent"
                className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700"
              >
                View all <span className="ml-1" aria-hidden>
                  →
                </span>
              </Link>
            </div>

            <ul className="space-y-2 text-sm text-slate-600">
              {category.children?.length ? (
                category.children.map((child) => (
                  <li key={child.id}>
                    <Link
                      to={child.url}
                      prefetch="intent"
                      className="group flex items-center justify-between rounded-2xl px-3 py-2 transition hover:bg-slate-50"
                    >
                      <span className="font-semibold text-slate-900 group-hover:text-[#5b2be0]">{child.title}</span>
                      {child.productCount && (
                        <span className="text-xs text-slate-400">{child.productCount} SKUs</span>
                      )}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-300">
                  Syncing child collections
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>

      {navigation.featured.length > 0 && (
        <div className="mt-8 rounded-[28px] border border-slate-100 bg-slate-50/70 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Featured shortcuts</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {navigation.featured.map((item) => (
              <Link
                key={item.id}
                to={item.url}
                prefetch="intent"
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-600 shadow-sm"
              >
                {item.title}
                <span aria-hidden>↗</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/**
 * Mobile Navigation Component
 */
interface MobileNavProps {
  navigation: NavigationStructure;
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({navigation, isOpen, onClose}: MobileNavProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleCategory = (handle: string) => {
    setExpandedCategory(expandedCategory === handle ? null : handle);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Menu */}
      <div className="fixed inset-y-0 left-0 z-50 flex w-full max-w-sm flex-col overflow-y-auto rounded-r-[32px] bg-white shadow-2xl lg:hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-900 to-sky-800 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Navigation</p>
              <h2 className="text-lg font-semibold">Explore Vapourism</h2>
            </div>
            <button
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white"
              aria-label="Close menu"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <Link
            to="/search"
            onClick={onClose}
            className="mt-5 inline-flex w-full items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white"
          >
            Search products & brands
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="flex-1 divide-y divide-slate-100">
          {navigation.main.map((item) => (
            <div key={item.id}>
              {item.children && item.children.length > 0 ? (
                <>
                  <button
                    onClick={() => toggleCategory(item.handle)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left text-base font-semibold text-slate-900"
                  >
                    <span>{item.title}</span>
                    <svg
                      className={`h-5 w-5 transition-transform ${expandedCategory === item.handle ? 'rotate-180' : ''}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.033l3.71-3.802a.75.75 0 011.08 1.04l-4.24 4.34a.75.75 0 01-1.08 0l-4.24-4.34a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {expandedCategory === item.handle && (
                    <div className="space-y-2 bg-slate-50 px-5 py-3">
                      <Link
                        to={item.url}
                        onClick={onClose}
                        className="block rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900"
                      >
                        View all {item.title}
                      </Link>
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          to={child.url}
                          onClick={onClose}
                          className="block rounded-2xl px-4 py-3 text-sm text-slate-600 hover:bg-white"
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.url}
                  onClick={onClose}
                  className="block px-5 py-4 text-base font-semibold text-slate-900"
                >
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </div>

        {navigation.featured.length > 0 && (
          <div className="space-y-2 border-t border-slate-100 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Featured</p>
            {navigation.featured.map((item) => (
              <Link
                key={item.id}
                to={item.url}
                onClick={onClose}
                className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
              >
                {item.title}
                <span aria-hidden>↗</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
