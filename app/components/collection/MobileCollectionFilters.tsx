/**
 * Mobile Collection Filters Dialog
 *
 * Native HTML modal implementation for collection filtering on mobile devices.
 * Uses the same filter controls as the desktop CollectionFilters component.
 */

import {useEffect} from 'react';
import {XMarkIcon} from '@heroicons/react/24/outline';
import type {CollectionFilter} from '~/lib/collections';

interface PriceRangeSelection {
  min?: number;
  max?: number;
}

interface PriceSummary {
  min: number;
  max: number;
  currencyCode: string;
}

interface MobileCollectionFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: CollectionFilter[];
  selectedVendors: string[];
  selectedTypes: string[];
  availability: 'in-stock' | 'out-of-stock' | null;
  selectedPriceRange: PriceRangeSelection;
  priceSummary: PriceSummary | null;
  onVendorToggle: (vendor: string) => void;
  onTypeToggle: (type: string) => void;
  onAvailabilityChange: (value: 'in-stock' | 'out-of-stock' | null) => void;
  onPriceRangeChange: (range: PriceRangeSelection) => void;
  onClearFilters: () => void;
}

export function MobileCollectionFilters({
  isOpen,
  onClose,
  filters,
  selectedVendors,
  selectedTypes,
  availability,
  selectedPriceRange,
  priceSummary,
  onVendorToggle,
  onTypeToggle,
  onAvailabilityChange,
  onPriceRangeChange,
  onClearFilters,
}: MobileCollectionFiltersProps) {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Extract vendor and product type filters
  const vendorFilter = filters.find(
    (f) => f.id.includes('vendor') || f.label.toLowerCase() === 'brand',
  );
  const typeFilter = filters.find(
    (f) => f.id.includes('productType') || f.label.toLowerCase() === 'product type',
  );

  const hasActiveFilters =
    selectedVendors.length > 0 ||
    selectedTypes.length > 0 ||
    availability !== null ||
    selectedPriceRange.min !== undefined ||
    selectedPriceRange.max !== undefined;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="fixed inset-0 flex justify-end">
        <div className="flex h-full w-full max-w-xl flex-col bg-white shadow-2xl transition-transform duration-300 transform">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 p-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Filters</h2>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={onClearFilters}
                  className="mt-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear all
                </button>
              )}
            </div>
            <button
              type="button"
              className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-700"
              onClick={onClose}
              aria-label="Close filters"
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Availability */}
            <FilterSection title="Availability">
              <div className="flex flex-wrap gap-2">
                <FilterChip
                  label="In Stock"
                  selected={availability === 'in-stock'}
                  onClick={() =>
                    onAvailabilityChange(availability === 'in-stock' ? null : 'in-stock')
                  }
                />
                <FilterChip
                  label="Back Order"
                  selected={availability === 'out-of-stock'}
                  onClick={() =>
                    onAvailabilityChange(availability === 'out-of-stock' ? null : 'out-of-stock')
                  }
                />
              </div>
            </FilterSection>

            {/* Price Range */}
            {priceSummary && (
              <FilterSection title="Price Range">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label htmlFor="mobile-price-min" className="sr-only">
                      Minimum price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                        £
                      </span>
                      <input
                        type="number"
                        id="mobile-price-min"
                        placeholder={`${Math.floor(priceSummary.min)}`}
                        value={selectedPriceRange.min ?? ''}
                        onChange={(e) =>
                          onPriceRangeChange({
                            ...selectedPriceRange,
                            min: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-7 pr-3 text-sm text-slate-700 focus:border-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>
                  <span className="text-slate-400">–</span>
                  <div className="flex-1">
                    <label htmlFor="mobile-price-max" className="sr-only">
                      Maximum price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                        £
                      </span>
                      <input
                        type="number"
                        id="mobile-price-max"
                        placeholder={`${Math.ceil(priceSummary.max)}`}
                        value={selectedPriceRange.max ?? ''}
                        onChange={(e) =>
                          onPriceRangeChange({
                            ...selectedPriceRange,
                            max: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-7 pr-3 text-sm text-slate-700 focus:border-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </FilterSection>
            )}

            {/* Vendor/Brand Filter */}
            {vendorFilter && vendorFilter.values.length > 0 && (
              <FilterSection title="Brand">
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                  {vendorFilter.values.map((value) => (
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
              </FilterSection>
            )}

            {/* Product Type Filter */}
            {typeFilter && typeFilter.values.length > 0 && (
              <FilterSection title="Product Type">
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                  {typeFilter.values.map((value) => (
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
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 p-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
            >
              Show Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper components

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

function FilterSection({title, children}: FilterSectionProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900 mb-3">{title}</h3>
      {children}
    </div>
  );
}

interface FilterChipProps {
  label: string;
  count?: number;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function FilterChip({label, count, selected, onClick, disabled}: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${
        selected
          ? 'bg-slate-900 text-white'
          : disabled
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      }`}
    >
      {label}
      {count !== undefined && (
        <span className={selected ? 'text-slate-300' : 'text-slate-400'}>({count})</span>
      )}
    </button>
  );
}
