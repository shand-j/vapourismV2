/**
 * Unit tests for simplified search-facets utilities
 */
import {describe, expect, it} from 'vitest';
import type {SearchProduct} from '../../app/lib/shopify-search';
import {
  calculatePriceSummary,
  formatFacetLabel,
} from '../../app/lib/search-facets';

describe('formatFacetLabel', () => {
  it('title cases values and strips delimiters', () => {
    expect(formatFacetLabel('approx-600')).toBe('Approx 600');
    expect(formatFacetLabel('mtl')).toBe('Mtl');
  });

  it('handles underscores', () => {
    expect(formatFacetLabel('nicotine_strength')).toBe('Nicotine Strength');
  });

  it('handles empty string', () => {
    expect(formatFacetLabel('')).toBe('');
  });
});

describe('calculatePriceSummary', () => {
  const mockProducts: SearchProduct[] = [
    {
      id: 'product-1',
      title: 'Sample',
      handle: 'sample-1',
      vendor: 'Brand A',
      productType: 'Disposable',
      tags: [],
      description: '',
      availableForSale: true,
      priceRange: {
        minVariantPrice: {amount: '9.99', currencyCode: 'GBP'},
      },
    } as SearchProduct,
    {
      id: 'product-2',
      title: 'Sample 2',
      handle: 'sample-2',
      vendor: 'Brand B',
      productType: 'Pod Kit',
      tags: [],
      description: '',
      availableForSale: true,
      priceRange: {
        minVariantPrice: {amount: '11.99', currencyCode: 'GBP'},
      },
    } as SearchProduct,
  ];

  it('calculates min and max prices with VAT', () => {
    const summary = calculatePriceSummary(mockProducts);
    expect(summary).not.toBeNull();
    // 9.99 * 1.2 = 11.988
    expect(summary!.min).toBeCloseTo(11.988, 2);
    // 11.99 * 1.2 = 14.388
    expect(summary!.max).toBeCloseTo(14.388, 2);
    expect(summary!.currencyCode).toBe('GBP');
  });

  it('returns null for empty products', () => {
    const summary = calculatePriceSummary([]);
    expect(summary).toBeNull();
  });

  it('handles products without price range', () => {
    const productsWithoutPrice: SearchProduct[] = [
      {
        id: 'product-1',
        title: 'No Price',
        handle: 'no-price',
        vendor: 'Brand',
        productType: 'Test',
        tags: [],
        description: '',
        availableForSale: true,
        priceRange: {
          minVariantPrice: {amount: '', currencyCode: 'GBP'},
        },
      } as SearchProduct,
    ];
    const summary = calculatePriceSummary(productsWithoutPrice);
    expect(summary).toBeNull();
  });
});
