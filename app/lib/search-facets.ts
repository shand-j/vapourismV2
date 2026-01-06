/**
 * Simplified Search Facets
 * 
 * This module provides minimal utilities for displaying price summaries.
 * Complex tag-based filtering has been removed in favor of Shopify Search & Discovery.
 * 
 * For product taxonomy and filtering, see docs/metafield-schema.md
 * Filtering is handled natively by Shopify's Search & Discovery app using metafields.
 */

import type {SearchProduct} from './shopify-search';

/**
 * UK VAT rate (20%)
 * Shopify prices are stored ex-VAT, we add VAT for display.
 */
const UK_VAT_RATE = 0.2;

export interface PriceSummary {
  min: number;
  max: number;
  currencyCode: string;
}

/**
 * Calculate price summary from search results
 * Returns min/max prices with VAT included for display
 */
export function calculatePriceSummary(products: SearchProduct[]): PriceSummary | null {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  let currencyCode: string | null = null;

  products.forEach((product) => {
    const amountRaw = product.priceRange?.minVariantPrice?.amount;
    if (!amountRaw) return;
    const numericAmount = parseFloat(amountRaw);
    if (Number.isNaN(numericAmount)) return;
    currencyCode = currencyCode ?? product.priceRange.minVariantPrice.currencyCode ?? 'GBP';
    min = Math.min(min, numericAmount);
    max = Math.max(max, numericAmount);
  });

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return null;
  }

  // Return VAT-inclusive prices for display
  return {
    min: min * (1 + UK_VAT_RATE),
    max: max * (1 + UK_VAT_RATE),
    currencyCode: currencyCode ?? 'GBP',
  };
}

/**
 * Format a label for display (title case, replace delimiters)
 */
export function formatFacetLabel(value: string): string {
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase()) || value;
}
