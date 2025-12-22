import {describe, expect, it} from 'vitest';
import type {SearchProduct} from '../../app/lib/shopify-search';
import {
  buildTagFacetGroups,
  formatFacetLabel,
  getTagDisplayLabel,
  parseFilterTag,
  parseAttributeFilter,
} from '../../app/lib/search-facets';

describe('parseFilterTag', () => {
  it('parses valid filter tags', () => {
    expect(parseFilterTag('filter:category:disposables')).toEqual({
      groupKey: 'category',
      value: 'disposables',
    });
  });

  it('returns null for invalid formats', () => {
    expect(parseFilterTag('category:disposables')).toBeNull();
    expect(parseFilterTag('filter:unknown:value')).toBeNull();
  });
});

describe('parseAttributeFilter', () => {
  it('parses valid attribute filters', () => {
    expect(parseAttributeFilter('product_type:e-liquid')).toEqual({
      key: 'product_type',
      value: 'e-liquid',
    });
    expect(parseAttributeFilter('flavour_category:fruity')).toEqual({
      key: 'flavour_category',
      value: 'fruity',
    });
  });

  it('returns null for invalid formats', () => {
    expect(parseAttributeFilter('unknown_key:value')).toBeNull();
    expect(parseAttributeFilter('nocolon')).toBeNull();
  });
});

describe('formatFacetLabel', () => {
  it('title cases values and strips delimiters', () => {
    expect(formatFacetLabel('approx-600')).toBe('Approx 600');
    expect(formatFacetLabel('mtl')).toBe('Mtl');
  });
});

describe('buildTagFacetGroups', () => {
  const mockProducts: SearchProduct[] = [
    {
      id: 'product-1',
      title: 'Sample',
      handle: 'sample-1',
      vendor: 'Brand A',
      productType: 'Disposable',
      tags: ['filter:category:Disposable', 'filter:nicotine_strength:20mg', 'Promo'],
      description: '',
      availableForSale: true,
      priceRange: {
        minVariantPrice: {amount: '9.99', currencyCode: 'GBP'},
      },
      featuredImage: undefined,
    } as SearchProduct,
    {
      id: 'product-2',
      title: 'Sample 2',
      handle: 'sample-2',
      vendor: 'Brand B',
      productType: 'Pod Kit',
      tags: ['filter:category:Disposable', 'filter:category:Starter', 'filter:nicotine_strength:10mg'],
      description: '',
      availableForSale: true,
      priceRange: {
        minVariantPrice: {amount: '11.99', currencyCode: 'GBP'},
      },
      featuredImage: undefined,
    } as SearchProduct,
  ];

  it('builds grouped facets with counts', () => {
    const groups = buildTagFacetGroups(mockProducts, []);
    // Look for product_type group (primary key, not legacy 'category')
    const productTypeGroup = groups.find((group) => group.key === 'product_type');
    expect(productTypeGroup).toBeDefined();
    // Should contain the productType from the product fields
    expect(productTypeGroup?.options.some(opt => opt.label === 'Disposable')).toBe(true);
  });

  it('keeps selected filters even when absent in current results', () => {
    // Use new attribute format
    const groups = buildTagFacetGroups(mockProducts, ['product_type:Unavailable']);
    const productTypeGroup = groups.find((group) => group.key === 'product_type');
    expect(productTypeGroup).toBeDefined();
    expect(productTypeGroup?.options.some((option) => option.label === 'Unavailable')).toBe(true);
  });

  it('extracts brand facets from vendor field', () => {
    const groups = buildTagFacetGroups(mockProducts, []);
    const brandGroup = groups.find((group) => group.key === 'brand');
    expect(brandGroup).toBeDefined();
    expect(brandGroup?.options.some(opt => opt.label === 'Brand A')).toBe(true);
    expect(brandGroup?.options.some(opt => opt.label === 'Brand B')).toBe(true);
  });
});

describe('getTagDisplayLabel', () => {
  it('returns friendly labels for known attribute filters', () => {
    expect(getTagDisplayLabel('product_type:disposable')).toBe('Product Type: Disposable');
    expect(getTagDisplayLabel('flavour_category:fruity')).toBe('Flavour: Fruity');
    expect(getTagDisplayLabel('nicotine_strength:20mg')).toBe('Nicotine Strength: 20mg');
  });

  it('returns friendly labels for legacy filter tags', () => {
    expect(getTagDisplayLabel('filter:category:disposable')).toBe('Product Type: Disposable');
  });

  it('falls back to raw tag when unknown', () => {
    expect(getTagDisplayLabel('promo:flash')).toBe('promo:flash');
  });
});
