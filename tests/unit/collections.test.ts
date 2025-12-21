/**
 * Collection Navigation Unit Tests
 *
 * Tests for collection data fetching utilities, filter parsing,
 * navigation structure building, and URL helpers.
 */

import {describe, it, expect, vi, beforeEach} from 'vitest';
import {
  parseFiltersFromSearchParams,
  serializeFiltersToSearchParams,
  buildCollectionUrl,
  getParentCollectionHandle,
  buildNavigationStructure,
  COLLECTION_CATEGORIES,
  getLegacyRedirect,
  useCollectionNav,
  getCollectionNavRollout,
  isUserInCollectionNavRollout,
  COLLECTION_SORT_OPTIONS,
  SORT_LOOKUP,
  type CollectionNavItem,
} from '~/lib/collections';

// =============================================================================
// FILTER PARSING TESTS
// =============================================================================

describe('parseFiltersFromSearchParams', () => {
  it('should parse vendor filters', () => {
    const params = new URLSearchParams();
    params.append('vendor', 'Elf Bar');
    params.append('vendor', 'Lost Mary');

    const filters = parseFiltersFromSearchParams(params);

    expect(filters).toContainEqual({productVendor: 'Elf Bar'});
    expect(filters).toContainEqual({productVendor: 'Lost Mary'});
  });

  it('should parse product type filters', () => {
    const params = new URLSearchParams();
    params.append('type', 'Disposable');
    params.append('type', 'E-Liquid');

    const filters = parseFiltersFromSearchParams(params);

    expect(filters).toContainEqual({productType: 'Disposable'});
    expect(filters).toContainEqual({productType: 'E-Liquid'});
  });

  it('should parse availability filters', () => {
    const params = new URLSearchParams();
    params.set('availability', 'in-stock');

    const filters = parseFiltersFromSearchParams(params);

    expect(filters).toContainEqual({available: true});
  });

  it('should parse out-of-stock availability', () => {
    const params = new URLSearchParams();
    params.set('availability', 'out-of-stock');

    const filters = parseFiltersFromSearchParams(params);

    expect(filters).toContainEqual({available: false});
  });

  it('should parse price range filters', () => {
    const params = new URLSearchParams();
    params.set('price_min', '5');
    params.set('price_max', '50');

    const filters = parseFiltersFromSearchParams(params);

    expect(filters).toContainEqual({price: {min: 5, max: 50}});
  });

  it('should parse price range with only min', () => {
    const params = new URLSearchParams();
    params.set('price_min', '10');

    const filters = parseFiltersFromSearchParams(params);

    expect(filters).toContainEqual({price: {min: 10}});
  });

  it('should parse price range with only max', () => {
    const params = new URLSearchParams();
    params.set('price_max', '100');

    const filters = parseFiltersFromSearchParams(params);

    expect(filters).toContainEqual({price: {max: 100}});
  });

  it('should handle empty params', () => {
    const params = new URLSearchParams();

    const filters = parseFiltersFromSearchParams(params);

    expect(filters).toHaveLength(0);
  });

  it('should ignore invalid price values', () => {
    const params = new URLSearchParams();
    params.set('price_min', 'invalid');
    params.set('price_max', 'also-invalid');

    const filters = parseFiltersFromSearchParams(params);

    // Should not include invalid price filter
    expect(filters.filter((f) => 'price' in f)).toHaveLength(0);
  });
});

describe('serializeFiltersToSearchParams', () => {
  it('should serialize vendors', () => {
    const filters = {
      vendor: ['Elf Bar', 'Lost Mary'],
    };

    const params = serializeFiltersToSearchParams(filters);

    expect(params.getAll('vendor')).toEqual(['Elf Bar', 'Lost Mary']);
  });

  it('should serialize product types', () => {
    const filters = {
      productType: ['Disposable'],
    };

    const params = serializeFiltersToSearchParams(filters);

    expect(params.getAll('type')).toEqual(['Disposable']);
  });

  it('should serialize availability', () => {
    const filters = {
      available: true,
    };

    const params = serializeFiltersToSearchParams(filters);

    expect(params.get('availability')).toBe('in-stock');
  });

  it('should serialize price range', () => {
    const filters = {
      price: {min: 5, max: 50},
    };

    const params = serializeFiltersToSearchParams(filters);

    expect(params.get('price_min')).toBe('5');
    expect(params.get('price_max')).toBe('50');
  });
});

// =============================================================================
// URL HELPER TESTS
// =============================================================================

describe('buildCollectionUrl', () => {
  it('should build basic collection URL', () => {
    expect(buildCollectionUrl('disposables')).toBe('/collections/disposables');
  });

  it('should build URL with filters', () => {
    const filters = new URLSearchParams();
    filters.set('vendor', 'Elf Bar');

    const url = buildCollectionUrl('disposables', filters);

    expect(url).toBe('/collections/disposables?vendor=Elf+Bar');
  });

  it('should build URL with multiple filters', () => {
    const url = buildCollectionUrl('disposables', {
      vendor: ['Elf Bar', 'Lost Mary'],
      availability: 'in-stock',
    });

    expect(url).toContain('/collections/disposables');
    expect(url).toContain('vendor=');
    expect(url).toContain('availability=in-stock');
  });

  it('should handle filters object with arrays', () => {
    const url = buildCollectionUrl('e-liquids', {
      vendor: ['Brand A', 'Brand B'],
    });

    expect(url).toContain('vendor=Brand+A');
    expect(url).toContain('vendor=Brand+B');
  });
});

describe('getParentCollectionHandle', () => {
  it('should return null for simple handles', () => {
    expect(getParentCollectionHandle('disposables')).toBeNull();
  });

  it('should return null for unknown parent', () => {
    expect(getParentCollectionHandle('unknown-child')).toBeNull();
  });
});

// =============================================================================
// NAVIGATION STRUCTURE TESTS
// =============================================================================

describe('buildNavigationStructure', () => {
  const mockCollections: CollectionNavItem[] = [
    {id: '1', title: 'Disposables', handle: 'disposables', url: '/collections/disposables'},
    {id: '2', title: 'Elf Bar', handle: 'elf-bar', url: '/collections/elf-bar'},
    {id: '3', title: 'Lost Mary', handle: 'lost-mary', url: '/collections/lost-mary'},
    {id: '4', title: 'Crystal Bar', handle: 'crystal-bar', url: '/collections/crystal-bar'},
    {id: '5', title: 'Hayati', handle: 'hayati', url: '/collections/hayati'},
  ];

  it('should build navigation structure from collections', () => {
    const nav = buildNavigationStructure(mockCollections);

    // Should have categories with columns
    expect(nav.length).toBeGreaterThan(0);
    expect(nav[0]).toHaveProperty('id');
    expect(nav[0]).toHaveProperty('label');
    expect(nav[0]).toHaveProperty('columns');
  });

  it('should filter out categories with no matching collections', () => {
    const emptyCollections: CollectionNavItem[] = [];
    const nav = buildNavigationStructure(emptyCollections);

    // Should have no categories if no collections match
    expect(nav).toHaveLength(0);
  });

  it('should use custom category configs', () => {
    const customConfig = [
      {
        id: 'test',
        label: 'Test Category',
        handle: 'test',
        accentColor: '#000',
        description: 'Test',
        subCategories: [
          {heading: 'Brands', handles: ['elf-bar', 'lost-mary']},
        ],
      },
    ];

    const nav = buildNavigationStructure(mockCollections, customConfig);

    expect(nav.length).toBe(1);
    expect(nav[0].id).toBe('test');
    expect(nav[0].columns[0].collections).toHaveLength(2);
  });
});

describe('COLLECTION_CATEGORIES', () => {
  it('should have valid category structure', () => {
    COLLECTION_CATEGORIES.forEach((category) => {
      expect(category).toHaveProperty('id');
      expect(category).toHaveProperty('label');
      expect(category).toHaveProperty('handle');
      expect(category).toHaveProperty('accentColor');
      expect(category).toHaveProperty('description');
      expect(category).toHaveProperty('subCategories');
      expect(Array.isArray(category.subCategories)).toBe(true);
    });
  });

  it('should have valid sub-category structure', () => {
    COLLECTION_CATEGORIES.forEach((category) => {
      category.subCategories.forEach((subCat) => {
        expect(subCat).toHaveProperty('heading');
        expect(subCat).toHaveProperty('handles');
        expect(Array.isArray(subCat.handles)).toBe(true);
      });
    });
  });
});

// =============================================================================
// LEGACY REDIRECT TESTS
// =============================================================================

describe('getLegacyRedirect', () => {
  it('should redirect tag-based disposable URL', () => {
    const redirect = getLegacyRedirect('/search?tag=disposable');

    expect(redirect).toBe('/collections/disposables');
  });

  it('should redirect tag-based e-liquid URL', () => {
    const redirect = getLegacyRedirect('/search?tag=e-liquid');

    expect(redirect).toBe('/collections/e-liquids');
  });

  it('should return null for non-matching URL', () => {
    const redirect = getLegacyRedirect('/search?q=test');

    expect(redirect).toBeNull();
  });

  it('should return null for collection URLs', () => {
    const redirect = getLegacyRedirect('/collections/disposables');

    expect(redirect).toBeNull();
  });
});

// =============================================================================
// FEATURE FLAG TESTS
// =============================================================================

describe('useCollectionNav', () => {
  it('should return true when flag is "true"', () => {
    expect(useCollectionNav({USE_COLLECTION_NAV: 'true'})).toBe(true);
  });

  it('should return true when flag is "1"', () => {
    expect(useCollectionNav({USE_COLLECTION_NAV: '1'})).toBe(true);
  });

  it('should return false when flag is "false"', () => {
    expect(useCollectionNav({USE_COLLECTION_NAV: 'false'})).toBe(false);
  });

  it('should return false when flag is "0"', () => {
    expect(useCollectionNav({USE_COLLECTION_NAV: '0'})).toBe(false);
  });

  it('should return false when flag is not set', () => {
    expect(useCollectionNav({})).toBe(false);
  });

  it('should return false when env is undefined', () => {
    expect(useCollectionNav(undefined)).toBe(false);
  });
});

describe('getCollectionNavRollout', () => {
  it('should return rollout percentage', () => {
    expect(getCollectionNavRollout({COLLECTION_NAV_ROLLOUT: '50'})).toBe(50);
  });

  it('should return 0 when not set', () => {
    expect(getCollectionNavRollout({})).toBe(0);
  });

  it('should clamp to 0 for negative values', () => {
    expect(getCollectionNavRollout({COLLECTION_NAV_ROLLOUT: '-10'})).toBe(0);
  });

  it('should clamp to 100 for values over 100', () => {
    expect(getCollectionNavRollout({COLLECTION_NAV_ROLLOUT: '150'})).toBe(100);
  });

  it('should return 0 for invalid values', () => {
    expect(getCollectionNavRollout({COLLECTION_NAV_ROLLOUT: 'invalid'})).toBe(0);
  });
});

describe('isUserInCollectionNavRollout', () => {
  it('should return true when rollout is 100%', () => {
    expect(isUserInCollectionNavRollout('user-123', 100)).toBe(true);
  });

  it('should return false when rollout is 0%', () => {
    expect(isUserInCollectionNavRollout('user-123', 0)).toBe(false);
  });

  it('should be deterministic for same user', () => {
    const userId = 'consistent-user-id';
    const result1 = isUserInCollectionNavRollout(userId, 50);
    const result2 = isUserInCollectionNavRollout(userId, 50);

    expect(result1).toBe(result2);
  });

  it('should distribute users roughly evenly at 50%', () => {
    // Generate many users and check distribution is roughly 50%
    const inRollout = Array.from({length: 1000}, (_, i) =>
      isUserInCollectionNavRollout(`user-${i}`, 50),
    ).filter(Boolean).length;

    // Should be roughly 50% (allow 10% margin for randomness)
    expect(inRollout).toBeGreaterThan(400);
    expect(inRollout).toBeLessThan(600);
  });
});

// =============================================================================
// SORT OPTIONS TESTS
// =============================================================================

describe('COLLECTION_SORT_OPTIONS', () => {
  it('should have valid sort options', () => {
    expect(COLLECTION_SORT_OPTIONS.length).toBeGreaterThan(0);

    COLLECTION_SORT_OPTIONS.forEach((option) => {
      expect(option).toHaveProperty('label');
      expect(option).toHaveProperty('value');
      expect(option).toHaveProperty('sortKey');
      expect(option).toHaveProperty('reverse');
    });
  });

  it('should include featured sort', () => {
    const featured = COLLECTION_SORT_OPTIONS.find((o) => o.value === 'COLLECTION_DEFAULT');
    expect(featured).toBeDefined();
    expect(featured?.sortKey).toBe('COLLECTION_DEFAULT');
  });

  it('should include price sorts', () => {
    const priceAsc = COLLECTION_SORT_OPTIONS.find((o) => o.value === 'PRICE_ASC');
    const priceDesc = COLLECTION_SORT_OPTIONS.find((o) => o.value === 'PRICE_DESC');

    expect(priceAsc).toBeDefined();
    expect(priceAsc?.reverse).toBe(false);
    expect(priceDesc).toBeDefined();
    expect(priceDesc?.reverse).toBe(true);
  });
});

describe('SORT_LOOKUP', () => {
  it('should lookup sort config by value', () => {
    expect(SORT_LOOKUP['COLLECTION_DEFAULT']).toEqual({
      sortKey: 'COLLECTION_DEFAULT',
      reverse: false,
    });
  });

  it('should lookup price sorts', () => {
    expect(SORT_LOOKUP['PRICE_ASC']).toEqual({
      sortKey: 'PRICE',
      reverse: false,
    });
    expect(SORT_LOOKUP['PRICE_DESC']).toEqual({
      sortKey: 'PRICE',
      reverse: true,
    });
  });
});
