/**
 * Collection Filters Component
 *
 * Displays and manages filters for collection pages using Shopify's native productFilters.
 * Supports vendor, product type, availability, and price range filters.
 */

import {useEffect, useMemo, useState} from 'react';
import {cn} from '~/lib/utils';
import type {CollectionFilter} from '~/lib/collections';

// =============================================================================
// TYPES
// =============================================================================

interface PriceRange {
  min: number;
  max: number;
  currencyCode: string;
}

interface CollectionFiltersProps {
  filters: CollectionFilter[];
  selectedVendors: string[];
  selectedTypes: string[];
  selectedAvailability: 'in-stock' | 'out-of-stock' | null;
  selectedPriceRange: {min?: number; max?: number};
  priceRange: PriceRange | null;
  onVendorToggle: (vendor: string) => void;
  onTypeToggle: (type: string) => void;
  onAvailabilityChange: (value: 'in-stock' | 'out-of-stock' | null) => void;
  onPriceRangeChange: (range: {min?: number; max?: number}) => void;
  onClearFilters: () => void;
  className?: string;
}

// =============================================================================
// SUBCOMPONENTS
// =============================================================================

function FilterChip({
  label,
  selected,
  count,
  onClick,
  disabled = false,
}: {
  label: string;
  selected: boolean;
  count?: number;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled && !selected}
      className={cn(
        'rounded-full border px-3 py-1.5 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-1',
        selected
          ? 'border-slate-900 bg-slate-900 text-white shadow-lg'
          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400',
        disabled && !selected && 'cursor-not-allowed opacity-60',
      )}
    >
      {label}
      {count !== undefined && (
        <span className={cn('ml-1 text-xs', selected ? 'text-white/70' : 'text-slate-400')}>
          ({count})
        </span>
      )}
    </button>
  );
}

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-100 pb-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-2"
      >
        <span className="text-sm font-semibold text-slate-800">{title}</span>
        <svg
          className={cn('h-4 w-4 text-slate-400 transition-transform', isOpen && 'rotate-180')}
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
      {isOpen && <div className="mt-2">{children}</div>}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function CollectionFilters({
  filters,
  selectedVendors,
  selectedTypes,
  selectedAvailability,
  selectedPriceRange,
  priceRange,
  onVendorToggle,
  onTypeToggle,
  onAvailabilityChange,
  onPriceRangeChange,
  onClearFilters,
  className,
}: CollectionFiltersProps) {
  const [priceInputs, setPriceInputs] = useState<{min: string; max: string}>({
    min: selectedPriceRange.min?.toString() ?? '',
    max: selectedPriceRange.max?.toString() ?? '',
  });

  // Sync price inputs with selected range
  useEffect(() => {
    setPriceInputs({
      min: selectedPriceRange.min?.toString() ?? '',
      max: selectedPriceRange.max?.toString() ?? '',
    });
  }, [selectedPriceRange.min, selectedPriceRange.max]);

  // Extract vendor filter from Shopify filters
  const vendorFilter = useMemo(
    () => filters.find((f) => f.label.toLowerCase() === 'vendor' || f.id.includes('vendor')),
    [filters],
  );

  // Extract product type filter from Shopify filters
  const typeFilter = useMemo(
    () =>
      filters.find(
        (f) => f.label.toLowerCase() === 'product type' || f.id.includes('productType'),
      ),
    [filters],
  );

  // Extract availability filter from Shopify filters
  const availabilityFilter = useMemo(
    () =>
      filters.find(
        (f) => f.label.toLowerCase() === 'availability' || f.id.includes('available'),
      ),
    [filters],
  );

  // Currency formatter
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: priceRange?.currencyCode ?? 'GBP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [priceRange?.currencyCode],
  );

  // Check if any filters are active
  const hasActiveFilters =
    selectedVendors.length > 0 ||
    selectedTypes.length > 0 ||
    selectedAvailability !== null ||
    selectedPriceRange.min !== undefined ||
    selectedPriceRange.max !== undefined;

  // Handle price input change
  const handlePriceInputChange = (field: 'min' | 'max', value: string) => {
    setPriceInputs((prev) => ({...prev, [field]: value}));
  };

  // Apply price range
  const applyPriceRange = () => {
    let minValue = priceInputs.min.trim() === '' ? undefined : Number(priceInputs.min);
    let maxValue = priceInputs.max.trim() === '' ? undefined : Number(priceInputs.max);

    if (minValue !== undefined && !Number.isFinite(minValue)) minValue = undefined;
    if (maxValue !== undefined && !Number.isFinite(maxValue)) maxValue = undefined;

    // Swap if min > max
    if (minValue !== undefined && maxValue !== undefined && minValue > maxValue) {
      [minValue, maxValue] = [maxValue, minValue];
    }

    onPriceRangeChange({min: minValue, max: maxValue});
  };

  // Clear price range
  const clearPriceRange = () => {
    setPriceInputs({min: '', max: ''});
    onPriceRangeChange({});
  };

  const isPriceApplyDisabled = priceInputs.min.trim() === '' && priceInputs.max.trim() === '';

  return (
    <aside
      className={cn(
        'rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.08)]',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
            Filters
          </p>
          <p className="text-xs text-slate-400">Refine your results</p>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-xs font-semibold text-slate-600 underline-offset-2 hover:text-slate-900"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Availability Filter */}
        <FilterSection title="Availability">
          <div className="flex flex-wrap gap-2">
            <FilterChip
              label="In Stock"
              selected={selectedAvailability === 'in-stock'}
              onClick={() =>
                onAvailabilityChange(selectedAvailability === 'in-stock' ? null : 'in-stock')
              }
            />
            <FilterChip
              label="Out of Stock"
              selected={selectedAvailability === 'out-of-stock'}
              onClick={() =>
                onAvailabilityChange(
                  selectedAvailability === 'out-of-stock' ? null : 'out-of-stock',
                )
              }
            />
          </div>
        </FilterSection>

        {/* Price Range Filter */}
        <FilterSection title="Price Range">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
            {priceRange && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {currencyFormatter.format(priceRange.min)} –{' '}
                {currencyFormatter.format(priceRange.max)}
              </p>
            )}
            <div className="flex gap-3">
              <label className="flex-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Min
                <input
                  type="number"
                  inputMode="decimal"
                  value={priceInputs.min}
                  onChange={(e) => handlePriceInputChange('min', e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 focus:border-slate-900 focus:outline-none"
                  placeholder={priceRange ? currencyFormatter.format(priceRange.min).replace('£', '') : '0'}
                />
              </label>
              <label className="flex-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Max
                <input
                  type="number"
                  inputMode="decimal"
                  value={priceInputs.max}
                  onChange={(e) => handlePriceInputChange('max', e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 focus:border-slate-900 focus:outline-none"
                  placeholder={priceRange ? currencyFormatter.format(priceRange.max).replace('£', '') : '0'}
                />
              </label>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                disabled={isPriceApplyDisabled}
                onClick={applyPriceRange}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg transition',
                  isPriceApplyDisabled
                    ? 'cursor-not-allowed bg-slate-300 shadow-none'
                    : 'bg-slate-900 hover:bg-slate-800',
                )}
              >
                Apply
              </button>
              <button
                type="button"
                onClick={clearPriceRange}
                className="text-xs font-semibold text-slate-500 underline-offset-2 hover:text-slate-900"
              >
                Reset
              </button>
            </div>
          </div>
        </FilterSection>

        {/* Vendor/Brand Filter */}
        {vendorFilter && vendorFilter.values.length > 0 && (
          <FilterSection title="Brand">
            {vendorFilter.values.length > 10 ? (
              <select
                value={selectedVendors[0] || ''}
                onChange={(e) => {
                  // Clear existing selections first
                  selectedVendors.forEach((v) => onVendorToggle(v));
                  // Add new selection if not empty
                  if (e.target.value) {
                    onVendorToggle(e.target.value);
                  }
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              >
                <option value="">All brands</option>
                {vendorFilter.values
                  .sort((a, b) => a.label.localeCompare(b.label))
                  .map((value) => (
                    <option key={value.id} value={value.label}>
                      {value.label} ({value.count})
                    </option>
                  ))}
              </select>
            ) : (
              <div className="flex flex-wrap gap-2">
                {vendorFilter.values
                  .sort((a, b) => b.count - a.count)
                  .map((value) => (
                    <FilterChip
                      key={value.id}
                      label={value.label}
                      count={value.count}
                      selected={selectedVendors.includes(value.label)}
                      onClick={() => onVendorToggle(value.label)}
                      disabled={value.count === 0}
                    />
                  ))}
              </div>
            )}
          </FilterSection>
        )}

        {/* Product Type Filter */}
        {typeFilter && typeFilter.values.length > 0 && (
          <FilterSection title="Product Type">
            <div className="flex flex-wrap gap-2">
              {typeFilter.values
                .sort((a, b) => b.count - a.count)
                .slice(0, 10)
                .map((value) => (
                  <FilterChip
                    key={value.id}
                    label={value.label}
                    count={value.count}
                    selected={selectedTypes.includes(value.label)}
                    onClick={() => onTypeToggle(value.label)}
                    disabled={value.count === 0}
                  />
                ))}
            </div>
          </FilterSection>
        )}

        {/* 
         * Note: Variant option filters (Size, Color, etc.) from Shopify's productFilters
         * are available in the filters array but not yet implemented. To add them:
         * 1. Create URL param handlers for variant options
         * 2. Add them to parseFiltersFromSearchParams in collections.ts  
         * 3. Add UI components similar to vendor/type filters above
         */}
      </div>
    </aside>
  );
}
