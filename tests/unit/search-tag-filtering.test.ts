/**
 * Unit tests for tag filtering in search
 * Tests the fix for tag search logic to use Shopify's query syntax
 */
import {describe, it, expect, vi, beforeEach} from 'vitest';
import {searchProducts} from '~/lib/shopify-search';
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

describe('searchProducts with tag filters', () => {
  let mockStorefront: any;
  let mockQuery: any;

  beforeEach(() => {
    mockQuery = vi.fn();
    mockStorefront = {
      query: mockQuery,
      CacheShort: vi.fn(() => ({cache: 'short'})),
    };
  });

  it('should convert single tag filter to query syntax', async () => {
    mockQuery.mockResolvedValue({
      search: {
        edges: [],
        pageInfo: {hasNextPage: false},
        totalCount: 0,
      },
    });

    const tagFilters: StorefrontAPI.ProductFilter[] = [
      {tag: 'disposable'} as StorefrontAPI.ProductFilter,
    ];

    await searchProducts(mockStorefront, '', {
      filters: tagFilters,
    });

    expect(mockQuery).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        variables: expect.objectContaining({
          query: 'tag:disposable',
        }),
      })
    );
  });

  it('should convert multiple tag filters to OR query syntax', async () => {
    mockQuery.mockResolvedValue({
      search: {
        edges: [],
        pageInfo: {hasNextPage: false},
        totalCount: 0,
      },
    });

    const tagFilters: StorefrontAPI.ProductFilter[] = [
      {tag: 'disposable'} as StorefrontAPI.ProductFilter,
      {tag: 'device'} as StorefrontAPI.ProductFilter,
      {tag: '20mg'} as StorefrontAPI.ProductFilter,
    ];

    await searchProducts(mockStorefront, '', {
      filters: tagFilters,
    });

    expect(mockQuery).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        variables: expect.objectContaining({
          query: '(tag:disposable OR tag:device OR tag:20mg)',
        }),
      })
    );
  });

  it('should combine search term with tag filters', async () => {
    mockQuery.mockResolvedValue({
      search: {
        edges: [],
        pageInfo: {hasNextPage: false},
        totalCount: 0,
      },
    });

    const tagFilters: StorefrontAPI.ProductFilter[] = [
      {tag: 'disposable'} as StorefrontAPI.ProductFilter,
    ];

    await searchProducts(mockStorefront, 'vape', {
      filters: tagFilters,
    });

    expect(mockQuery).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        variables: expect.objectContaining({
          query: 'vape AND tag:disposable',
        }),
      })
    );
  });

  it('should combine tag filters with other filter types', async () => {
    mockQuery.mockResolvedValue({
      search: {
        edges: [],
        pageInfo: {hasNextPage: false},
        totalCount: 0,
      },
    });

    const filters: StorefrontAPI.ProductFilter[] = [
      {tag: 'disposable'} as StorefrontAPI.ProductFilter,
      {productVendor: 'Elf Bar'} as StorefrontAPI.ProductFilter,
      {available: true} as StorefrontAPI.ProductFilter,
    ];

    await searchProducts(mockStorefront, '', {
      filters,
    });

    expect(mockQuery).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        variables: expect.objectContaining({
          query: 'vendor:Elf Bar available:true tag:disposable',
        }),
      })
    );
  });

  it('should handle multiple tags with multiple other filters', async () => {
    mockQuery.mockResolvedValue({
      search: {
        edges: [],
        pageInfo: {hasNextPage: false},
        totalCount: 0,
      },
    });

    const filters: StorefrontAPI.ProductFilter[] = [
      {tag: 'disposable'} as StorefrontAPI.ProductFilter,
      {tag: '20mg'} as StorefrontAPI.ProductFilter,
      {productType: 'Vape Device'} as StorefrontAPI.ProductFilter,
      {available: true} as StorefrontAPI.ProductFilter,
    ];

    await searchProducts(mockStorefront, 'fruit', {
      filters,
    });

    expect(mockQuery).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        variables: expect.objectContaining({
          query: 'fruit AND product_type:Vape Device available:true (tag:disposable OR tag:20mg)',
        }),
      })
    );
  });

  it('should handle price filters with tag filters', async () => {
    mockQuery.mockResolvedValue({
      search: {
        edges: [],
        pageInfo: {hasNextPage: false},
        totalCount: 0,
      },
    });

    const filters: StorefrontAPI.ProductFilter[] = [
      {tag: 'e-liquid'} as StorefrontAPI.ProductFilter,
      {price: {min: 5, max: 20}} as StorefrontAPI.ProductFilter,
    ];

    await searchProducts(mockStorefront, '', {
      filters,
    });

    expect(mockQuery).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        variables: expect.objectContaining({
          query: 'price:>5 price:<20 tag:e-liquid',
        }),
      })
    );
  });

  it('should work with wildcard query when no search term', async () => {
    mockQuery.mockResolvedValue({
      search: {
        edges: [],
        pageInfo: {hasNextPage: false},
        totalCount: 0,
      },
    });

    const tagFilters: StorefrontAPI.ProductFilter[] = [
      {tag: 'CBD'} as StorefrontAPI.ProductFilter,
    ];

    await searchProducts(mockStorefront, '', {
      filters: tagFilters,
    });

    // Should not have wildcard when we have filters
    expect(mockQuery).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        variables: expect.objectContaining({
          query: 'tag:CBD',
        }),
      })
    );
  });
});
