/**
 * NicPowch Mega Menu Component
 *
 * Simplified navigation focused exclusively on nicotine pouches.
 * Links to /search with tag query parameters.
 */

import * as React from 'react';
import {Link} from '@remix-run/react';
import {useState, useCallback} from 'react';
import {
  NICPOWCH_MENU,
  buildSearchUrl,
  type MenuCategory,
  type MenuColumn,
  type MenuLink,
} from '../../lib/menu-config';
import {BRAND_CONFIG} from '../../brand-config';

interface NicPowchMegaMenuProps {
  className?: string;
}

function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function NicPowchMegaMenu({className}: NicPowchMegaMenuProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const closeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback((categoryId: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveCategory(categoryId);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 150);
  }, []);

  const handleDropdownEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <nav className={cn('relative w-full', className)}>
      <ul className="flex w-full items-center justify-between">
        {NICPOWCH_MENU.map((category: MenuCategory) => (
          <li
            key={category.id}
            className="flex-1"
            onMouseEnter={() => handleMouseEnter(category.id)}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              to={buildSearchUrl(category.tags)}
              className={cn(
                'flex items-center justify-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition',
                activeCategory === category.id
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900',
              )}
            >
              {category.label}
              <svg
                className={cn(
                  'h-3 w-3 transition-transform',
                  activeCategory === category.id && 'rotate-180',
                )}
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M3 4.5L6 7.5L9 4.5" />
              </svg>
            </Link>
          </li>
        ))}
        {/* All Pouches link */}
        <li className="flex-1">
          <Link
            to="/search?tag=nicotine_pouches"
            className="flex items-center justify-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
          >
            All Pouches
          </Link>
        </li>
      </ul>

      {activeCategory && (
        <NicPowchMenuDropdown
          category={NICPOWCH_MENU.find((c: MenuCategory) => c.id === activeCategory)!}
          onMouseEnter={handleDropdownEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </nav>
  );
}

interface NicPowchMenuDropdownProps {
  category: MenuCategory;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function NicPowchMenuDropdown({category, onMouseEnter, onMouseLeave}: NicPowchMenuDropdownProps) {
  return (
    <div
      className="absolute inset-x-0 top-full z-[100]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="h-2" />
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        {/* Category header */}
        <div className="mb-6 flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{category.label}</h2>
            <p className="mt-1 text-sm text-slate-500">{category.hero.subtitle}</p>
          </div>
          <Link
            to={buildSearchUrl(category.tags)}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition"
            style={{backgroundColor: BRAND_CONFIG.colors.accent}}
          >
            See All
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Columns grid */}
        <div
          className={cn(
            'grid gap-6',
            category.columns.length <= 2 ? 'grid-cols-2' : 'grid-cols-3',
          )}
        >
          {category.columns.map((column: MenuColumn, columnIndex: number) => (
            <NicPowchMenuColumn key={columnIndex} column={column} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface NicPowchMenuColumnProps {
  column: MenuColumn;
}

function NicPowchMenuColumn({column}: NicPowchMenuColumnProps) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {column.heading}
      </h3>
      <ul className="space-y-1">
        {column.links.map((link: MenuLink, linkIndex: number) => (
          <li key={linkIndex}>
            <Link
              to={link.url}
              prefetch="intent"
              className="block rounded-lg px-2 py-1.5 text-sm text-slate-700 transition hover:bg-teal-50 hover:text-teal-700"
            >
              {link.label}
            </Link>
          </li>
        ))}
        {column.seeAllLabel && column.seeAllTags && (
          <li className="pt-2">
            <Link
              to={buildSearchUrl(column.seeAllTags)}
              prefetch="intent"
              className="inline-flex items-center gap-1 text-xs font-medium text-teal-600 transition hover:text-teal-700"
            >
              {column.seeAllLabel}
              <span aria-hidden="true">→</span>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}

/**
 * NicPowch Mobile Navigation Component
 */
interface NicPowchMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NicPowchMobileMenu({isOpen, onClose}: NicPowchMobileMenuProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Menu */}
      <div className="fixed inset-y-0 left-0 z-50 flex w-full max-w-sm flex-col overflow-y-auto bg-white shadow-2xl lg:hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <span className="text-lg font-semibold text-gradient">{BRAND_CONFIG.name}</span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close menu"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search link */}
        <div className="border-b border-slate-100 p-4">
          <Link
            to="/search?tag=nicotine_pouches"
            onClick={onClose}
            className="flex items-center justify-between rounded-xl bg-teal-50 px-4 py-3 text-sm font-medium text-teal-700"
          >
            Search pouches
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </Link>
        </div>

        {/* Categories */}
        <div className="flex-1 divide-y divide-slate-100 overflow-y-auto">
          {NICPOWCH_MENU.map((category: MenuCategory) => (
            <div key={category.id}>
              <button
                type="button"
                onClick={() => toggleCategory(category.id)}
                className="flex w-full items-center justify-between px-4 py-4 text-left"
              >
                <span className="font-medium text-slate-900">{category.label}</span>
                <svg
                  className={cn(
                    'h-5 w-5 text-slate-400 transition-transform',
                    expandedCategory === category.id && 'rotate-180',
                  )}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.033l3.71-3.802a.75.75 0 111.08 1.04l-4.24 4.34a.75.75 0 01-1.08 0l-4.24-4.34a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {expandedCategory === category.id && (
                <div className="bg-slate-50 px-4 pb-4">
                  {/* See all link */}
                  <Link
                    to={buildSearchUrl(category.tags)}
                    onClick={onClose}
                    className="mb-3 flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-900"
                  >
                    See All {category.label}
                    <span aria-hidden="true">→</span>
                  </Link>

                  {/* Columns */}
                  <div className="space-y-4">
                    {category.columns.map((column: MenuColumn, columnIndex: number) => (
                      <div key={columnIndex}>
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                          {column.heading}
                        </h4>
                        <ul className="space-y-1">
                          {column.links.slice(0, 5).map((link: MenuLink, linkIndex: number) => (
                            <li key={linkIndex}>
                              <Link
                                to={link.url}
                                onClick={onClose}
                                className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-white"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                          {column.links.length > 5 && column.seeAllTags && (
                            <li>
                              <Link
                                to={buildSearchUrl(column.seeAllTags)}
                                onClick={onClose}
                                className="block px-3 py-2 text-xs font-medium text-teal-600"
                              >
                                + {column.links.length - 5} more
                              </Link>
                            </li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer links */}
        <div className="border-t border-slate-200 p-4">
          <div className="flex gap-4">
            <Link to="/about" onClick={onClose} className="text-sm text-slate-600 hover:text-slate-900">
              About
            </Link>
            <Link to="/account" onClick={onClose} className="text-sm text-slate-600 hover:text-slate-900">
              Account
            </Link>
            <Link to="/faq" onClick={onClose} className="text-sm text-slate-600 hover:text-slate-900">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default NicPowchMegaMenu;
