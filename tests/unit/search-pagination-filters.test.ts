/**
 * Tests for simplified search with pagination
 * Tests that basic search options (vendor, productType, price) work correctly
 */
import {describe, it, expect, vi, beforeEach} from 'vitest';
import {searchProducts} from '~/lib/shopify-search';

describe('search pagination with simplified filters', () => {
  let mockStorefront: any;
  let mockQuery: any;

  beforeEach(() => {
    mockQuery = vi.fn();
    mockStorefront = {
      query: mockQuery,
      CacheShort: vi.fn(() => ({cache: 'short'})),
    };
  });

  it('should apply vendor filter to query', async () => {
    mockQuery.mockResolvedValueOnce({
      search: {
        edges: [
          {node: {id: '1', title: 'Product 1'}},
          {node: {id: '2', title: 'Product 2'}},
        ],
        pageInfo: {hasNextPage: true, endCursor: 'cursor123'},
        totalCount: 50,
      },
    });

    await searchProducts(mockStorefront, '', {
      first: 2,
      vendor: 'Elf Bar',
    });

    expect(mockQuery).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        variables: expect.objectContaining({
          query: 'vendor:Elf Bar',
          first: 2,
        }),
      })
    );
  });

  it('should apply productType filter to query', async () => {
    mockQuery.mockResolvedValueOnce({
      search: {
        edges: [],
        pageInfo: {hasNextPage: false},
        totalCount: 0,
      },
    });

    await searchProducts(mockStorefront, '', {
      first: 10,
      productType: 'Disposable',
    });

    expect(mockQuery).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        variables: expect.objectContaining({
          query: 'product_type:Disposable',
        }),
      })
    );
  });

  it('should apply multiple filters consistently across all pages', async () => {
    mockQuery.mockResolvedValue({
      search: {
        edges: [],
        pageInfo: {hasNextPage: false},
        totalCount: 25,
      },
    });

    // Page 1
    await searchProducts(mockStorefront, 'vape', {
      first: 10,
      vendor: 'Elf Bar',
      available: true,
    });

    // Verify page 1 has all filters
    const firstCallQuery = mockQuery.mock.calls[0][1].variables.query;
    expect(firstCallQuery).toContain('vape');
    expect(firstCallQuery).toContain('vendor:Elf Bar');
    expect(firstCallQuery).toContain('available:true');

    // Page 2 with cursor
    await searchProducts(mockStorefront, 'vape', {
      first: 10,
      after: 'page2cursor',
      vendor: 'Elf Bar',
      available: true,
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
      productType: 'E-Liquid',
    });

    // Returned only 2 products for this page
    expect(result.products).toHaveLength(2);
    
    // But totalCount shows all 100 matching products across all pages
    expect(result.totalCount).toBe(100);
    
    // And indicates there are more pages
    expect(result.pageInfo.hasNextPage).toBe(true);
  });

  it('should maintain filter consistency when navigating back and forth between pages', async () => {
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
      priceRange: {min: 10, max: 50},
    });

    const page2Query = mockQuery.mock.calls[0][1].variables.query;

    // Navigate back to page 1
    await searchProducts(mockStorefront, '', {
      first: 5,
      priceRange: {min: 10, max: 50},
    });

    const page1Query = mockQuery.mock.calls[1][1].variables.query;

    // Both pages should have identical filter queries
    expect(page1Query).toBe(page2Query);
    expect(page1Query).toContain('price:>10');
    expect(page1Query).toContain('price:<50');
  });

  it('should use wildcard query when no search term or filters', async () => {
    mockQuery.mockResolvedValue({
      search: {
        edges: [],
        pageInfo: {hasNextPage: false},
        totalCount: 0,
      },
    });

    await searchProducts(mockStorefront, '', {
      first: 10,
    });

    expect(mockQuery).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        variables: expect.objectContaining({
          query: '*',
        }),
      })
    );
  });
});
