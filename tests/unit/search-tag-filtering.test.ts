/**
 * Unit tests for simplified search filtering
 * Tests the simplified filter options (vendor, productType, availability, price)
 */
import {describe, it, expect, vi, beforeEach} from 'vitest';
import {searchProducts} from '~/lib/shopify-search';

describe('searchProducts with simplified filters', () => {
  let mockStorefront: any;
  let mockQuery: any;

  beforeEach(() => {
    mockQuery = vi.fn();
    mockStorefront = {
      query: mockQuery,
      CacheShort: vi.fn(() => ({cache: 'short'})),
    };
  });

  it('should convert vendor filter to query syntax', async () => {
    mockQuery.mockResolvedValue({
      search: {
        edges: [],
        pageInfo: {hasNextPage: false},
        totalCount: 0,
      },
    });

    await searchProducts(mockStorefront, '', {
      vendor: 'Elf Bar',
    });

    expect(mockQuery).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        variables: expect.objectContaining({
          query: 'vendor:Elf Bar',
        }),
      })
    );
  });

  it('should convert productType filter to query syntax', async () => {
    mockQuery.mockResolvedValue({
      search: {
        edges: [],
        pageInfo: {hasNextPage: false},
        totalCount: 0,
      },
    });

    await searchProducts(mockStorefront, '', {
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

  it('should combine search term with filters', async () => {
    mockQuery.mockResolvedValue({
      search: {
        edges: [],
        pageInfo: {hasNextPage: false},
        totalCount: 0,
      },
    });

    await searchProducts(mockStorefront, 'vape', {
      vendor: 'Elf Bar',
    });

    expect(mockQuery).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        variables: expect.objectContaining({
          query: 'vape vendor:Elf Bar',
        }),
      })
    );
  });

  it('should combine multiple filter types', async () => {
    mockQuery.mockResolvedValue({
      search: {
        edges: [],
        pageInfo: {hasNextPage: false},
        totalCount: 0,
      },
    });

    await searchProducts(mockStorefront, '', {
      vendor: 'Elf Bar',
      available: true,
    });

    const query = mockQuery.mock.calls[0][1].variables.query;
    expect(query).toContain('vendor:Elf Bar');
    expect(query).toContain('available:true');
  });

  it('should handle availability filter', async () => {
    mockQuery.mockResolvedValue({
      search: {
        edges: [],
        pageInfo: {hasNextPage: false},
        totalCount: 0,
      },
    });

    await searchProducts(mockStorefront, '', {
      available: false,
    });

    expect(mockQuery).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        variables: expect.objectContaining({
          query: 'available:false',
        }),
      })
    );
  });

  it('should handle price filters', async () => {
    mockQuery.mockResolvedValue({
      search: {
        edges: [],
        pageInfo: {hasNextPage: false},
        totalCount: 0,
      },
    });

    await searchProducts(mockStorefront, '', {
      priceRange: {min: 5, max: 20},
    });

    const query = mockQuery.mock.calls[0][1].variables.query;
    expect(query).toContain('price:>5');
    expect(query).toContain('price:<20');
  });

  it('should handle price min only', async () => {
    mockQuery.mockResolvedValue({
      search: {
        edges: [],
        pageInfo: {hasNextPage: false},
        totalCount: 0,
      },
    });

    await searchProducts(mockStorefront, '', {
      priceRange: {min: 10},
    });

    const query = mockQuery.mock.calls[0][1].variables.query;
    expect(query).toContain('price:>10');
    expect(query).not.toContain('price:<');
  });

  it('should handle price max only', async () => {
    mockQuery.mockResolvedValue({
      search: {
        edges: [],
        pageInfo: {hasNextPage: false},
        totalCount: 0,
      },
    });

    await searchProducts(mockStorefront, '', {
      priceRange: {max: 50},
    });

    const query = mockQuery.mock.calls[0][1].variables.query;
    expect(query).not.toContain('price:>');
    expect(query).toContain('price:<50');
  });

  it('should use wildcard query when no search term or filters', async () => {
    mockQuery.mockResolvedValue({
      search: {
        edges: [],
        pageInfo: {hasNextPage: false},
        totalCount: 0,
      },
    });

    await searchProducts(mockStorefront, '', {});

    expect(mockQuery).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        variables: expect.objectContaining({
          query: '*',
        }),
      })
    );
  });

  it('should combine search term with multiple filters', async () => {
    mockQuery.mockResolvedValue({
      search: {
        edges: [],
        pageInfo: {hasNextPage: false},
        totalCount: 0,
      },
    });

    await searchProducts(mockStorefront, 'fruit', {
      productType: 'E-Liquid',
      available: true,
      priceRange: {min: 5, max: 15},
    });

    const query = mockQuery.mock.calls[0][1].variables.query;
    expect(query).toContain('fruit');
    expect(query).toContain('product_type:E-Liquid');
    expect(query).toContain('available:true');
    expect(query).toContain('price:>5');
    expect(query).toContain('price:<15');
  });
});
