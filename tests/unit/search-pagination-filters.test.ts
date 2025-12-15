/**
 * Tests to verify that filters apply to all results from Shopify, not just the current page
 */
import {describe, it, expect, vi, beforeEach} from 'vitest';
import {searchProducts} from '~/lib/shopify-search';
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

describe('search pagination with filters', () => {
  let mockStorefront: any;
  let mockQuery: any;

  beforeEach(() => {
    mockQuery = vi.fn();
    mockStorefront = {
      query: mockQuery,
      CacheShort: vi.fn(() => ({cache: 'short'})),
    };
  });

  it('should apply tag filters to all pages, not just first page', async () => {
    // Mock first page response
    mockQuery.mockResolvedValueOnce({
      search: {
        edges: [
          {node: {id: '1', title: 'Product 1', tags: ['disposable']}},
          {node: {id: '2', title: 'Product 2', tags: ['disposable']}},
        ],
        pageInfo: {hasNextPage: true, endCursor: 'cursor123'},
        totalCount: 50, // Total matching products across all pages
      },
    });

    const tagFilters: StorefrontAPI.ProductFilter[] = [
      {tag: 'disposable'} as StorefrontAPI.ProductFilter,
    ];

    // First page request
    const firstPage = await searchProducts(mockStorefront, '', {
      first: 2,
      filters: tagFilters,
    });

    // Verify first page call includes tag filter in query
    expect(mockQuery).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        variables: expect.objectContaining({
          query: 'tag:disposable',
          first: 2,
          after: undefined,
        }),
      })
    );

    expect(firstPage.totalCount).toBe(50);
    expect(firstPage.pageInfo.hasNextPage).toBe(true);
    expect(firstPage.pageInfo.endCursor).toBe('cursor123');

    // Mock second page response
    mockQuery.mockResolvedValueOnce({
      search: {
        edges: [
          {node: {id: '3', title: 'Product 3', tags: ['disposable']}},
          {node: {id: '4', title: 'Product 4', tags: ['disposable']}},
        ],
        pageInfo: {hasNextPage: true, endCursor: 'cursor456'},
        totalCount: 50, // Same total count
      },
    });

    // Second page request with cursor
    const secondPage = await searchProducts(mockStorefront, '', {
      first: 2,
      after: 'cursor123',
      filters: tagFilters,
    });

    // Verify second page call ALSO includes the same tag filter
    expect(mockQuery).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        variables: expect.objectContaining({
          query: 'tag:disposable',
          first: 2,
          after: 'cursor123', // Cursor for pagination
        }),
      })
    );

    expect(secondPage.totalCount).toBe(50);
    expect(secondPage.products[0].id).toBe('3');
  });

  it('should apply multiple filters consistently across all pages', async () => {
    mockQuery.mockResolvedValue({
      search: {
        edges: [],
        pageInfo: {hasNextPage: false},
        totalCount: 25,
      },
    });

    const filters: StorefrontAPI.ProductFilter[] = [
      {tag: 'disposable'} as StorefrontAPI.ProductFilter,
      {tag: '20mg'} as StorefrontAPI.ProductFilter,
      {productVendor: 'Elf Bar'} as StorefrontAPI.ProductFilter,
      {available: true} as StorefrontAPI.ProductFilter,
    ];

    // Page 1
    await searchProducts(mockStorefront, 'vape', {
      first: 10,
      filters,
    });

    // Verify page 1 has all filters
    const firstCallQuery = mockQuery.mock.calls[0][1].variables.query;
    expect(firstCallQuery).toContain('vape');
    expect(firstCallQuery).toContain('tag:disposable');
    expect(firstCallQuery).toContain('tag:20mg');
    expect(firstCallQuery).toContain('vendor:Elf Bar');
    expect(firstCallQuery).toContain('available:true');

    // Page 2 with cursor
    await searchProducts(mockStorefront, 'vape', {
      first: 10,
      after: 'page2cursor',
      filters,
    });

    // Verify page 2 has EXACTLY the same filters
    const secondCallQuery = mockQuery.mock.calls[1][1].variables.query;
    expect(secondCallQuery).toEqual(firstCallQuery);
    expect(mockQuery.mock.calls[1][1].variables.after).toBe('page2cursor');
  });

  it('should return totalCount representing all filtered results, not just current page', async () => {
    mockQuery.mockResolvedValue({
      search: {
        edges: [
          {node: {id: '1', title: 'Product 1'}},
          {node: {id: '2', title: 'Product 2'}},
        ],
        pageInfo: {hasNextPage: true, endCursor: 'cursor'},
        totalCount: 100, // Total across all pages
      },
    });

    const result = await searchProducts(mockStorefront, '', {
      first: 2,
      filters: [{tag: 'e-liquid'} as StorefrontAPI.ProductFilter],
    });

    // Returned only 2 products for this page
    expect(result.products).toHaveLength(2);
    
    // But totalCount shows all 100 matching products across all pages
    expect(result.totalCount).toBe(100);
    
    // And indicates there are more pages
    expect(result.pageInfo.hasNextPage).toBe(true);
  });

  it('should maintain filter consistency when navigating back and forth between pages', async () => {
    const filters: StorefrontAPI.ProductFilter[] = [
      {tag: 'CBD'} as StorefrontAPI.ProductFilter,
      {price: {min: 10, max: 50}} as StorefrontAPI.ProductFilter,
    ];

    mockQuery.mockResolvedValue({
      search: {
        edges: [],
        pageInfo: {hasNextPage: false},
        totalCount: 15,
      },
    });

    // Navigate to page 2
    await searchProducts(mockStorefront, '', {
      first: 5,
      after: 'page2cursor',
      filters,
    });

    const page2Query = mockQuery.mock.calls[0][1].variables.query;

    // Navigate back to page 1
    await searchProducts(mockStorefront, '', {
      first: 5,
      filters,
    });

    const page1Query = mockQuery.mock.calls[1][1].variables.query;

    // Both pages should have identical filter queries
    expect(page1Query).toBe(page2Query);
    expect(page1Query).toContain('tag:CBD');
    expect(page1Query).toContain('price:>10');
    expect(page1Query).toContain('price:<50');
  });
});
