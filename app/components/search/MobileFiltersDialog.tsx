/**
 * Mobile Search Filters Dialog
 * 
 * Native HTML modal implementation to avoid SSR issues with Headless UI
 */

import {useEffect} from 'react';
import {XMarkIcon} from '@heroicons/react/24/outline';
import {SearchFilters} from './SearchFilters';
import type {TagFacetGroup} from '../../lib/search-facets';

interface PriceRangeSelection {
  min?: number;
  max?: number;
}

interface PriceSummary {
  min: number;
  max: number;
  currencyCode: string;
}

interface MobileFiltersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  facetGroups: TagFacetGroup[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  availability: 'in-stock' | 'out-of-stock' | null;
  onAvailabilityChange: (value: 'in-stock' | 'out-of-stock' | null) => void;
  selectedPriceRange: PriceRangeSelection;
  priceSummary: PriceSummary | null;
  onPriceRangeChange: (range: PriceRangeSelection) => void;
  onClearFilters: () => void;
}

export function MobileFiltersDialog({
  isOpen,
  onClose,
  facetGroups,
  selectedTags,
  onTagToggle,
  availability,
  onAvailabilityChange,
  selectedPriceRange,
  priceSummary,
  onPriceRangeChange,
  onClearFilters,
}: MobileFiltersDialogProps) {
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
          <div className="flex items-center justify-between border-b border-slate-200 p-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Filters</h2>
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

          <div className="flex-1 overflow-y-auto">
            <SearchFilters
              facetGroups={facetGroups}
              selectedTags={selectedTags}
              onTagToggle={onTagToggle}
              availability={availability}
              onAvailabilityChange={onAvailabilityChange}
              selectedPriceRange={selectedPriceRange}
              priceSummary={priceSummary}
              onPriceRangeChange={onPriceRangeChange}
              onClearFilters={onClearFilters}
              className="!rounded-none !border-none !bg-transparent !p-4 !shadow-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}