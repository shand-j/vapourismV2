import {describe, expect, it} from 'vitest';
import type {SearchProduct} from '../../app/lib/shopify-search';
import {
  buildTagFacetGroups,
  formatFacetLabel,
  getTagDisplayLabel,
  parseFilterTag,
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
    const categoryGroup = groups.find((group) => group.key === 'category');
    expect(categoryGroup).toBeDefined();
    expect(categoryGroup?.options[0]).toMatchObject({label: 'Disposable', count: 2});
  });

  it('keeps selected tags even when absent in current results', () => {
    const groups = buildTagFacetGroups(mockProducts, ['filter:category:Unavailable']);
    const categoryGroup = groups.find((group) => group.key === 'category');
    expect(categoryGroup?.options.some((option) => option.label === 'Unavailable')).toBe(true);
  });
});

describe('getTagDisplayLabel', () => {
  it('returns friendly labels for known tags', () => {
    expect(getTagDisplayLabel('filter:category:disposable')).toBe('Product Type: Disposable');
  });

  it('falls back to raw tag when unknown', () => {
    expect(getTagDisplayLabel('promo:flash')).toBe('promo:flash');
  });
});
