/**
 * Simplified Search Filters Component
 * 
 * Provides basic filtering for availability and price.
 * Advanced filtering is handled by Shopify Search & Discovery app.
 * 
 * See docs/metafield-schema.md for product taxonomy.
 */

import {useEffect, useMemo, useState} from 'react';
import {cn} from '../../lib/utils';

type AvailabilityValue = 'in-stock' | 'out-of-stock';

interface PriceRangeSelection {
  min?: number;
  max?: number;
}

interface PriceSummary {
  min: number;
  max: number;
  currencyCode: string;
}

interface SearchFiltersProps {
  availability: AvailabilityValue | null;
  onAvailabilityChange: (value: AvailabilityValue | null) => void;
  selectedPriceRange: PriceRangeSelection;
  priceSummary: PriceSummary | null;
  onPriceRangeChange: (range: PriceRangeSelection) => void;
  onClearFilters: () => void;
  className?: string;
}

const availabilityOptions: Array<{label: string; value: AvailabilityValue}> = [
  {label: 'In stock', value: 'in-stock'},
  {label: 'Back-order', value: 'out-of-stock'},
];

function FilterChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-1',
        selected
          ? 'border-slate-900 bg-slate-900 text-white shadow-lg'
          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'
      )}
    >
      {label}
    </button>
  );
}

export function SearchFilters({
  availability,
  onAvailabilityChange,
  selectedPriceRange,
  priceSummary,
  onPriceRangeChange,
  onClearFilters,
  className,
}: SearchFiltersProps) {
  const [priceInputs, setPriceInputs] = useState<{min: string; max: string}>(
    () => ({
      min: selectedPriceRange.min?.toString() ?? '',
      max: selectedPriceRange.max?.toString() ?? '',
    })
  );

  useEffect(() => {
    setPriceInputs({
      min: selectedPriceRange.min?.toString() ?? '',
      max: selectedPriceRange.max?.toString() ?? '',
    });
  }, [selectedPriceRange.min, selectedPriceRange.max]);

  const hasActiveFilters =
    !!availability ||
    selectedPriceRange.min !== undefined ||
    selectedPriceRange.max !== undefined;

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: priceSummary?.currencyCode ?? 'GBP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [priceSummary?.currencyCode],
  );

  const handlePriceInputChange = (field: 'min' | 'max', value: string) => {
    setPriceInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const applyPriceRange = () => {
    let minValue = priceInputs.min.trim() === '' ? undefined : Number(priceInputs.min);
    let maxValue = priceInputs.max.trim() === '' ? undefined : Number(priceInputs.max);
    if (minValue !== undefined && !Number.isFinite(minValue)) minValue = undefined;
    if (maxValue !== undefined && !Number.isFinite(maxValue)) maxValue = undefined;
    if (minValue !== undefined && maxValue !== undefined && minValue > maxValue) {
      [minValue, maxValue] = [maxValue, minValue];
    }
    onPriceRangeChange({min: minValue, max: maxValue});
  };

  const clearPriceRange = () => {
    setPriceInputs({min: '', max: ''});
    onPriceRangeChange({});
  };

  const priceSummaryText = priceSummary
    ? `${currencyFormatter.format(priceSummary.min)} – ${currencyFormatter.format(priceSummary.max)}`
    : null;

  const isApplyDisabled =
    priceInputs.min.trim() === '' && priceInputs.max.trim() === '';

  return (
    <aside
      className={cn(
        'rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.08)]',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Filters</p>
          <p className="text-xs text-slate-400">Refine your search results</p>
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

      <div className="mt-6 space-y-6">
        <div>
          <p className="text-sm font-semibold text-slate-800">Availability</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {availabilityOptions.map((option) => (
              <FilterChip
                key={option.value}
                label={option.label}
                selected={availability === option.value}
                onClick={() =>
                  onAvailabilityChange(availability === option.value ? null : option.value)
                }
              />
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-slate-50/80 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">Price range <span className="font-normal text-slate-500">(inc. VAT)</span></p>
            {priceSummaryText && (
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {priceSummaryText}
              </span>
            )}
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <label className="flex-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Min
              <input
                type="number"
                inputMode="decimal"
                value={priceInputs.min}
                onChange={(event) => handlePriceInputChange('min', event.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 focus:border-slate-900 focus:outline-none"
                placeholder={priceSummary ? currencyFormatter.format(priceSummary.min).replace('£', '') : '0'}
              />
            </label>
            <label className="flex-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Max
              <input
                type="number"
                inputMode="decimal"
                value={priceInputs.max}
                onChange={(event) => handlePriceInputChange('max', event.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 focus:border-slate-900 focus:outline-none"
                placeholder={priceSummary ? currencyFormatter.format(priceSummary.max).replace('£', '') : '0'}
              />
            </label>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              disabled={isApplyDisabled}
              onClick={applyPriceRange}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg transition',
                isApplyDisabled
                  ? 'cursor-not-allowed bg-slate-300 shadow-none'
                  : 'bg-slate-900 hover:bg-slate-800'
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

        {/* Note about advanced filtering */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
          <p className="text-sm text-blue-700">
            <strong>Looking for specific filters?</strong> Use the search bar to find products by brand, 
            nicotine strength, flavour, or other attributes. Our search is powered by Shopify's 
            Search &amp; Discovery.
          </p>
        </div>
      </div>
    </aside>
  );
}
