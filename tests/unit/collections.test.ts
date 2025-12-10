/**
 * Unit tests for collections utilities
 */
import {describe, it, expect} from 'vitest';
import {
  buildNavigationStructure,
  getLegacyRedirect,
  getCollectionUrl,
  generateCollectionCacheKey,
  type Collection,
} from '../../app/lib/collections';

describe('collections utilities', () => {
  describe('buildNavigationStructure', () => {
    it('should organize collections into main and featured categories', () => {
      const mockCollections: Collection[] = [
        {
          id: '1',
          title: 'Disposable Vapes',
          handle: 'disposable-vapes',
          description: 'All disposables',
          productCount: 100,
        },
        {
          id: '2',
          title: 'Disposable Vapes 3000 Puffs',
          handle: 'disposable-vapes-3000-puffs',
          description: '3000 puff disposables',
          productCount: 50,
        },
        {
          id: '3',
          title: 'E-Liquids',
          handle: 'e-liquids',
          description: 'All e-liquids',
          productCount: 200,
        },
        {
          id: '4',
          title: 'New Arrivals',
          handle: 'new-arrivals',
          description: 'Latest products',
          productCount: 30,
        },
      ];

      const nav = buildNavigationStructure(mockCollections);

      expect(nav.main.length).toBeGreaterThan(0);
      expect(nav.featured.length).toBeGreaterThan(0);

      // Check main category
      const disposables = nav.main.find((item) => item.handle === 'disposable-vapes');
      expect(disposables).toBeDefined();
      expect(disposables?.children).toBeDefined();
      expect(disposables?.children?.length).toBeGreaterThan(0);

      // Check featured category
      const newArrivals = nav.featured.find((item) => item.handle === 'new-arrivals');
      expect(newArrivals).toBeDefined();
    });

    it('should handle empty collections array', () => {
      const nav = buildNavigationStructure([]);

      expect(nav.featured).toEqual([]);
      expect(nav.main).toHaveLength(6);
      expect(nav.main.map((item) => item.title)).toEqual([
        'Disposables',
        'Eliquids',
        'Vape Kits',
        'Accessories',
        'Brands',
        'CBD',
      ]);
      const brands = nav.main.find((item) => item.title === 'Brands');
      expect(brands?.children).toHaveLength(6);
    });

    it('should sort child collections alphabetically', () => {
      const mockCollections: Collection[] = [
        {
          id: '1',
          title: 'E-Liquids',
          handle: 'e-liquids',
          description: '',
          productCount: 100,
        },
        {
          id: '2',
          title: 'Nic Salts',
          handle: 'e-liquids-nic-salts',
          description: '',
          productCount: 50,
        },
        {
          id: '3',
          title: 'Shortfills',
          handle: 'e-liquids-shortfills',
          description: '',
          productCount: 30,
        },
        {
          id: '4',
          title: '50/50 E-Liquids',
          handle: 'e-liquids-50-50',
          description: '',
          productCount: 20,
        },
      ];

      const nav = buildNavigationStructure(mockCollections);
      const eLiquids = nav.main.find((item) => item.handle === 'e-liquids');

      expect(eLiquids?.children).toBeDefined();
      expect(eLiquids!.children![0].title).toBe('50/50 E-Liquids');
      expect(eLiquids!.children![1].title).toBe('Nic Salts');
      expect(eLiquids!.children![2].title).toBe('Shortfills');
    });
  });

  describe('getLegacyRedirect', () => {
    it('should return redirect URL for known legacy paths', () => {
      const redirect = getLegacyRedirect('/search', '?category=nic-salts');
      expect(redirect).toBe('/collections/e-liquids-nic-salts');
    });

    it('should return null for unknown paths', () => {
      const redirect = getLegacyRedirect('/products', '?handle=test');
      expect(redirect).toBeNull();
    });

    it('should handle exact path matches', () => {
      const redirect = getLegacyRedirect('/search', '?category=disposable-vapes');
      expect(redirect).toBe('/collections/disposable-vapes');
    });
  });

  describe('getCollectionUrl', () => {
    it('should generate correct collection URLs', () => {
      expect(getCollectionUrl('nic-salts')).toBe('/collections/nic-salts');
      expect(getCollectionUrl('disposable-vapes')).toBe('/collections/disposable-vapes');
    });

    it('should handle special characters in handles', () => {
      expect(getCollectionUrl('coils-pods')).toBe('/collections/coils-pods');
    });
  });

  describe('generateCollectionCacheKey', () => {
    it('should generate consistent cache keys', () => {
      const key1 = generateCollectionCacheKey('nic-salts', {first: 24});
      const key2 = generateCollectionCacheKey('nic-salts', {first: 24});

      expect(key1).toBe(key2);
    });

    it('should include options in cache key', () => {
      const key1 = generateCollectionCacheKey('nic-salts', {first: 24});
      const key2 = generateCollectionCacheKey('nic-salts', {first: 48});

      expect(key1).not.toBe(key2);
    });

    it('should sort options alphabetically', () => {
      const key1 = generateCollectionCacheKey('test', {b: '2', a: '1'});
      const key2 = generateCollectionCacheKey('test', {a: '1', b: '2'});

      expect(key1).toBe(key2);
    });

    it('should handle empty options', () => {
      const key = generateCollectionCacheKey('test');
      expect(key).toBe('collection:test');
    });
  });
});
