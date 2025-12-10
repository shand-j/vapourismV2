/**
 * Unit tests for Shopify search utilities
 */
import {describe, it, expect, vi} from 'vitest';
import {
  debounce,
  generateSearchCacheKey,
  useShopifySearch,
  trackSearchEvent,
} from '~/lib/shopify-search';

describe('shopify-search utilities', () => {
  describe('debounce', () => {
    it('should debounce function calls', async () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('test1');
      debouncedFn('test2');
      debouncedFn('test3');

      expect(mockFn).not.toHaveBeenCalled();

      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('test3');
    });

    it('should use default wait time of 300ms', async () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn);

      debouncedFn('test');

      await new Promise((resolve) => setTimeout(resolve, 250));
      expect(mockFn).not.toHaveBeenCalled();

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('generateSearchCacheKey', () => {
    it('should generate consistent cache keys', () => {
      const key1 = generateSearchCacheKey('test query', {sortKey: 'PRICE'});
      const key2 = generateSearchCacheKey('test query', {sortKey: 'PRICE'});

      expect(key1).toBe(key2);
    });

    it('should normalize query to lowercase', () => {
      const key1 = generateSearchCacheKey('TEST QUERY');
      const key2 = generateSearchCacheKey('test query');

      expect(key1).toBe(key2);
    });

    it('should sort options alphabetically', () => {
      const key1 = generateSearchCacheKey('test', {b: '2', a: '1'});
      const key2 = generateSearchCacheKey('test', {a: '1', b: '2'});

      expect(key1).toBe(key2);
    });

    it('should handle empty options', () => {
      const key = generateSearchCacheKey('test query');

      expect(key).toBe('search:test query');
    });
  });

  describe('useShopifySearch', () => {
    it('should return true by default in V2', () => {
      expect(useShopifySearch()).toBe(true);
    });

    it('should respect environment variable when set to false', () => {
      const env = {USE_SHOPIFY_SEARCH: 'false'};
      expect(useShopifySearch(env)).toBe(false);
    });

    it('should respect environment variable when set to true', () => {
      const env = {USE_SHOPIFY_SEARCH: 'true'};
      expect(useShopifySearch(env)).toBe(true);
    });

    it('should handle numeric flags', () => {
      expect(useShopifySearch({USE_SHOPIFY_SEARCH: '1'})).toBe(true);
      expect(useShopifySearch({USE_SHOPIFY_SEARCH: '0'})).toBe(false);
    });
  });

  describe('trackSearchEvent', () => {
    it('should dispatch custom event', () => {
      const eventListener = vi.fn();
      window.addEventListener('shopify_search', eventListener);

      trackSearchEvent('test query', 10, 'full');

      expect(eventListener).toHaveBeenCalled();

      const event = eventListener.mock.calls[0][0] as CustomEvent;
      expect(event.detail.query).toBe('test query');
      expect(event.detail.resultCount).toBe(10);
      expect(event.detail.searchType).toBe('full');

      window.removeEventListener('shopify_search', eventListener);
    });

    it('should handle missing gtag gracefully', () => {
      expect(() => {
        trackSearchEvent('test', 5);
      }).not.toThrow();
    });
  });
});
