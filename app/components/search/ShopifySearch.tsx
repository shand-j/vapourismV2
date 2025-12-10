/**
 * Shopify Predictive Search Component
 * 
 * Autocomplete search using Shopify Storefront API
 * Replaces AlgoliaHeaderSearch component
 */

import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {Link, useNavigate} from '@remix-run/react';
import {debounce} from '../../lib/shopify-search';
import type {PredictiveSearchResults} from '../../lib/shopify-search';

/**
 * UK VAT rate (20%)
 * Shopify prices are stored ex-VAT (tax calculated at checkout).
 * We add VAT to display prices for UK customers.
 */
const UK_VAT_RATE = 0.2;

/**
 * Format price with VAT included.
 * Shopify prices are ex-VAT, so we add 20% for UK display.
 */
function formatPriceWithVat(amount: string): string {
  const exVat = parseFloat(amount);
  if (isNaN(exVat)) return amount;
  const incVat = exVat * (1 + UK_VAT_RATE);
  return incVat.toFixed(2);
}

/**
 * Build a predictive search API base URL relative to the provided base href
 * (or the current location href). This allows the app to be mounted at a
 * sub-path and still resolve the API route correctly.
 */
export function buildPredictiveApiBaseUrl(baseHref?: string): string {
  const href = baseHref ?? (typeof globalThis !== 'undefined' && (globalThis as any).location?.href) ?? '/';
  return new URL('api/search/predictive', href).toString();
}

function isPredictiveSearchResults(
  value: unknown
): value is PredictiveSearchResults {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;

  // helper to check predictive response shape only

  return (
    Array.isArray(candidate.products) &&
    Array.isArray(candidate.collections) &&
    Array.isArray(candidate.queries)
  );
}

interface ShopifySearchProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  minCharacters?: number;
  debounceMs?: number;
  className?: string;
  showQuickQueries?: boolean;
}

export function ShopifySearch({
  onSearch,
  placeholder = 'Search products...',
  minCharacters = 2,
  debounceMs = 300,
  className,
  showQuickQueries = true,
}: ShopifySearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PredictiveSearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const navigateToSearch = (targetQuery?: string) => {
    const q = (targetQuery ?? query)?.trim() ?? '';
    if (!q || q.length < minCharacters) return; // don't navigate on empty/short queries
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };
  const quickQueries = useMemo(
    () => ['Reusable vapes', 'Nic salt pods', 'Vape kits', 'Menthol flavours'],
    [],
  );

  // Fetch search results from API route
  const fetchResults = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < minCharacters) {
      setResults(null);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);

    try {
      // Resolve the API path relative to current location so the component
      // works correctly even when the app is mounted on a sub-path or
      // proxied during development. Using new URL() avoids leading-slash
      // issues that can break under non-root base paths.
      const url = typeof window !== 'undefined'
        ? new URL('api/search/predictive', window.location.href).toString()
        : `/api/search/predictive?q=${encodeURIComponent(searchQuery)}`;

      const response = await fetch(`${url}${url.includes('?') ? '&' : '?'}q=${encodeURIComponent(searchQuery)}`);

      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();

      if (!isPredictiveSearchResults(data)) {
        // Log the received body for easier debugging in development
        console.error('Invalid search response shape', data);
        throw new Error('Invalid search response');
      }

      setResults(data);
      setIsOpen(true);
    } catch (error: any) {
      // Include richer context so issues are easier to diagnose in the browser
      console.error('Search error for query:', searchQuery, 'error:', error?.message ?? error, error);
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  }, [minCharacters]);

  // Debounced search handler
  const debouncedSearch = useMemo(
    () =>
      debounce((searchQuery: string) => {
        fetchResults(searchQuery);
        onSearch?.(searchQuery);
      }, debounceMs),
    [fetchResults, onSearch, debounceMs]
  );

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handlePresetSearch = useCallback(
    (value: string) => {
      setQuery(value);
      fetchResults(value);
      onSearch?.(value);
      inputRef.current?.focus();
    },
    [fetchResults, onSearch],
  );

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasResults = results && (
    results.products.length > 0 ||
    results.queries.length > 0
  );

  const wrapperClassName = ['relative w-full max-w-xl', className].filter(Boolean).join(' ');

  return (
    <div className={wrapperClassName}>
      <div className="rounded-full bg-gradient-to-r from-violet-500/40 via-sky-400/40 to-teal-300/40 p-[1px] shadow-[0_20px_60px_rgba(15,23,42,0.15)]">
        <div className="relative flex items-center rounded-full bg-white/95 px-4 py-1">
          <div className="pointer-events-none flex h-12 w-12 items-center justify-center text-slate-400">
            <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.35-4.65a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
          </div>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full rounded-full border-0 bg-transparent py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            aria-label="Search products"
            aria-autocomplete="list"
            aria-controls="search-results"
          />
          {isLoading ? (
            <div className="flex h-10 w-10 items-center justify-center">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-violet-500" />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => navigateToSearch(inputRef.current?.value)}
              disabled={!query.trim() || query.trim().length < minCharacters}
              className={`inline-flex h-10 items-center rounded-full px-4 text-xs font-semibold uppercase tracking-[0.2em] ${
                !query.trim() || query.trim().length < minCharacters
                  ? 'cursor-not-allowed bg-slate-300 text-slate-500'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              Go
            </button>
          )}
        </div>
      </div>

      {showQuickQueries && quickQueries.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 overflow-x-auto whitespace-nowrap text-xs text-slate-600">
          {quickQueries.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handlePresetSearch(preset)}
              className="rounded-full border border-slate-200 px-3 py-1 font-semibold hover:border-slate-300"
            >
              {preset}
            </button>
          ))}
        </div>
      )}

      {isOpen && hasResults && (
        <div
          ref={resultsRef}
          id="search-results"
          className="absolute z-50 mt-4 w-full min-w-[280px] overflow-hidden rounded-[32px] border border-slate-200 bg-white/95 shadow-[0_30px_90px_rgba(15,23,42,0.2)] sm:min-w-[420px]"
          role="listbox"
        >
          <div className="space-y-6 overflow-y-auto p-6" style={{maxHeight: '60vh'}}>
            {results.queries.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  <span>Suggestions</span>
                  <span className="text-slate-400">Shopify powered</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {results.queries.slice(0, 4).map((suggestion, index) => (
                    <Link
                      key={suggestion.text || `suggestion-${index}`}
                      to={`/search?q=${encodeURIComponent(suggestion.text)}`}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:border-slate-300"
                      prefetch="intent"
                      dangerouslySetInnerHTML={{__html: suggestion.styledText}}
                      onClick={() => setIsOpen(false)}
                    />
                  ))}
                </div>
              </div>
            )}

            {results.products.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Products</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {results.products.slice(0, 3).map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.handle}`}
                      className="group flex items-center gap-4 rounded-2xl border border-slate-100 p-3 hover:border-slate-200"
                      prefetch="intent"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="h-16 w-16 overflow-hidden rounded-xl bg-slate-50">
                        {product.featuredImage ? (
                          <img
                            src={product.featuredImage.url}
                            alt={product.featuredImage.altText || product.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-300">No image</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 line-clamp-1">{product.title}</p>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{product.vendor}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          £{formatPriceWithVat(product.priceRange.minVariantPrice.amount)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}


          </div>

          <div className="border-t border-slate-200 bg-slate-50/70 px-6 py-5">
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Open predictive search</p>
                <p className="text-xs text-slate-500">GA4 events fire automatically when customers engage with this drawer.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigateToSearch(inputRef.current?.value);
                  setIsOpen(false);
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white"
              >
                View results <span aria-hidden>↗</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* No Results Message */}
      {isOpen && results && !hasResults && query.length >= minCharacters && (
        <div
          ref={resultsRef}
          className="absolute z-50 mt-4 w-full rounded-[28px] border border-slate-200 bg-white/95 p-6 text-center shadow-[0_30px_90px_rgba(15,23,42,0.15)]"
        >
          <p className="text-sm font-semibold text-slate-900">No results for "{query}".</p>
          <p className="mt-2 text-xs text-slate-500">Try adjusting your search terms or browse our product range.</p>
          <Link
            to="/search?q=vape"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
            onClick={() => setIsOpen(false)}
          >
            Browse products
            <span aria-hidden>→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
