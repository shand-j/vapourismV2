import {useEffect, useMemo, useState} from 'react';

import type {TagFacetGroup} from '../../lib/search-facets';
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
  facetGroups: TagFacetGroup[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
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

function FacetOptionButton({
  label,
  count,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  count: number;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled && !selected}
      onClick={onClick}
      className={cn(
        'flex w-full items-center justify-between rounded-2xl border px-4 py-2 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2',
        selected
          ? 'border-slate-900 bg-slate-900 text-white shadow-lg'
          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400',
        disabled && !selected && 'cursor-not-allowed opacity-60'
      )}
    >
      <span>{label}</span>
      <span className={cn('text-xs font-semibold', selected ? 'text-white/80' : 'text-slate-500')}>
        {count}
      </span>
    </button>
  );
}

export function SearchFilters({
  facetGroups,
  selectedTags,
  onTagToggle,
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
    selectedTags.length > 0 ||
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
          <p className="text-xs text-slate-400">Tap to refine these results</p>
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

        <div className="space-y-6">
          {facetGroups.length === 0 ? (
            <p className="text-sm text-slate-500">
              Tag-driven facets will appear automatically as matching products include structured filter tags.
            </p>
          ) : (
            facetGroups
              .map((group) => ({
                ...group,
                options: group.options.filter((option) => {
                  const selected = selectedTags.includes(option.value);
                  return option.count > 0 || selected;
                }),
              }))
              .filter((group) => group.options.length > 0)
              .map((group) => (
                <div key={group.key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-800">{group.label}</p>
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {group.options.length} options
                    </span>
                  </div>
                  {group.key === 'brand' && group.options.length > 10 ? (
                  <div className="space-y-2">
                    <select
                      value={selectedTags.find(tag => tag.startsWith('filter:brand:')) || ''}
                      onChange={(e) => {
                        // Clear existing brand selection
                        const existingBrandTag = selectedTags.find(tag => tag.startsWith('filter:brand:'));
                        if (existingBrandTag) {
                          onTagToggle(existingBrandTag);
                        }
                        // Add new selection if value is not empty
                        if (e.target.value) {
                          onTagToggle(e.target.value);
                        }
                      }}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                    >
                      <option value="">All brands</option>
                      {group.options
                        .toSorted((a, b) => {
                          if (group.key === 'brand') {
                            return a.label.toLowerCase().localeCompare(b.label.toLowerCase());
                          }
                          return b.count - a.count || a.label.localeCompare(b.label);
                        })
                        .map((option) => {
                          const disabled = option.count === 0;
                          return (
                            <option
                              key={option.value}
                              value={option.value}
                              disabled={disabled}
                            >
                              {option.label} ({option.count})
                            </option>
                          );
                        })}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {group.options.map((option) => {
                      const selected = selectedTags.includes(option.value);
                      const disabled = option.count === 0 && !selected;
                      return (
                        <FacetOptionButton
                          key={option.value}
                          label={`${option.label}`}
                          count={option.count}
                          selected={selected}
                          disabled={disabled}
                          onClick={() => onTagToggle(option.value)}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
