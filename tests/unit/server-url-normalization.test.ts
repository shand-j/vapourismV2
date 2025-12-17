import {describe, it, expect} from 'vitest';

/**
 * Test URL normalization for SEO compliance
 * 
 * The server should normalize URLs by converting all percent-encoded hex digits
 * to lowercase to comply with SEO best practices.
 */
describe('Server URL Normalization', () => {
  /**
   * Helper function to test URL normalization logic
   * This mirrors the normalizeUrl function in server.ts
   */
  function normalizeUrl(url: URL): URL {
    const normalizedPathname = url.pathname.replace(
      /%[0-9A-F]{2}/g,
      (match) => match.toLowerCase()
    );
    
    if (normalizedPathname !== url.pathname) {
      const normalizedUrl = new URL(url.toString());
      normalizedUrl.pathname = normalizedPathname;
      return normalizedUrl;
    }
    
    return url;
  }

  describe('Percent-encoded character normalization', () => {
    it('should convert uppercase hex digits to lowercase in percent-encoded characters', () => {
      const url = new URL('https://www.vapourism.co.uk/products/test-%CF%89');
      const normalized = normalizeUrl(url);
      
      expect(normalized.pathname).toBe('/products/test-%cf%89');
      expect(normalized.toString()).toBe('https://www.vapourism.co.uk/products/test-%cf%89');
    });

    it('should normalize Ω (omega) character encoding - example 1', () => {
      const url = new URL('https://www.vapourism.co.uk/products/voopoo-ito-m-series-replacement-coils-1-0%CF%89-1-2%CF%89-0-5%CF%89');
      const normalized = normalizeUrl(url);
      
      expect(normalized.pathname).toBe('/products/voopoo-ito-m-series-replacement-coils-1-0%cf%89-1-2%cf%89-0-5%cf%89');
    });

    it('should normalize º (masculine ordinal) character encoding - example 2', () => {
      const url = new URL('https://www.vapourism.co.uk/products/legacy-369-250mg-cbd-sleep-spray-n%C2%BA-7-dreams');
      const normalized = normalizeUrl(url);
      
      expect(normalized.pathname).toBe('/products/legacy-369-250mg-cbd-sleep-spray-n%c2%ba-7-dreams');
    });

    it('should normalize ® (registered trademark) character encoding - example 3', () => {
      const url = new URL('https://www.vapourism.co.uk/products/50mg-access-cbd%C2%AE-cbd-patches-10-patches');
      const normalized = normalizeUrl(url);
      
      expect(normalized.pathname).toBe('/products/50mg-access-cbd%c2%ae-cbd-patches-10-patches');
    });

    it('should handle multiple different special characters in one URL', () => {
      const url = new URL('https://www.vapourism.co.uk/products/test-%CF%89-%C2%BA-%C2%AE');
      const normalized = normalizeUrl(url);
      
      expect(normalized.pathname).toBe('/products/test-%cf%89-%c2%ba-%c2%ae');
    });
  });

  describe('URL components preservation', () => {
    it('should preserve query parameters', () => {
      const url = new URL('https://www.vapourism.co.uk/products/test-%CF%89?variant=123&color=blue');
      const normalized = normalizeUrl(url);
      
      expect(normalized.pathname).toBe('/products/test-%cf%89');
      expect(normalized.search).toBe('?variant=123&color=blue');
      expect(normalized.toString()).toBe('https://www.vapourism.co.uk/products/test-%cf%89?variant=123&color=blue');
    });

    it('should preserve hash fragments', () => {
      const url = new URL('https://www.vapourism.co.uk/products/test-%CF%89#reviews');
      const normalized = normalizeUrl(url);
      
      expect(normalized.pathname).toBe('/products/test-%cf%89');
      expect(normalized.hash).toBe('#reviews');
    });

    it('should preserve both query parameters and hash fragments', () => {
      const url = new URL('https://www.vapourism.co.uk/products/test-%CF%89?page=2#description');
      const normalized = normalizeUrl(url);
      
      expect(normalized.pathname).toBe('/products/test-%cf%89');
      expect(normalized.search).toBe('?page=2');
      expect(normalized.hash).toBe('#description');
    });
  });

  describe('Already normalized URLs', () => {
    it('should not modify URLs that are already lowercase', () => {
      const url = new URL('https://www.vapourism.co.uk/products/test-%cf%89');
      const normalized = normalizeUrl(url);
      
      expect(normalized.toString()).toBe(url.toString());
    });

    it('should not modify URLs without percent-encoded characters', () => {
      const url = new URL('https://www.vapourism.co.uk/products/simple-product-name');
      const normalized = normalizeUrl(url);
      
      expect(normalized.toString()).toBe(url.toString());
    });

    it('should not modify homepage', () => {
      const url = new URL('https://www.vapourism.co.uk/');
      const normalized = normalizeUrl(url);
      
      expect(normalized.toString()).toBe(url.toString());
    });
  });

  describe('Edge cases', () => {
    it('should handle consecutive percent-encoded characters', () => {
      const url = new URL('https://www.vapourism.co.uk/products/test-%CF%89%C2%BA%C2%AE');
      const normalized = normalizeUrl(url);
      
      expect(normalized.pathname).toBe('/products/test-%cf%89%c2%ba%c2%ae');
    });

    it('should handle mixed case in same URL', () => {
      const url = new URL('https://www.vapourism.co.uk/products/test-%cf%89-%C2%BA');
      const normalized = normalizeUrl(url);
      
      expect(normalized.pathname).toBe('/products/test-%cf%89-%c2%ba');
    });

    it('should only affect pathname, not hostname', () => {
      const url = new URL('https://www.VAPOURISM.co.uk/products/test-%CF%89');
      const normalized = normalizeUrl(url);
      
      // Hostname should remain as-is (URL constructor normalizes it)
      expect(normalized.hostname).toBe('www.vapourism.co.uk');
      expect(normalized.pathname).toBe('/products/test-%cf%89');
    });
  });

  describe('Real-world product URLs from SEO audit', () => {
    const problematicUrls = [
      {
        original: '/products/voopoo-ito-m-series-replacement-coils-1-0%CF%89-1-2%CF%89-0-5%CF%89',
        expected: '/products/voopoo-ito-m-series-replacement-coils-1-0%cf%89-1-2%cf%89-0-5%cf%89',
      },
      {
        original: '/products/fulsun-nobol-replaceable-pods-1-0%CF%89',
        expected: '/products/fulsun-nobol-replaceable-pods-1-0%cf%89',
      },
      {
        original: '/products/vaporesso-gt4-mesh-coils-0-15%CF%89',
        expected: '/products/vaporesso-gt4-mesh-coils-0-15%cf%89',
      },
      {
        original: '/products/aspire-tsx-replacement-mesh-pods-2pcs-0-8%CF%89-1-0%CF%89',
        expected: '/products/aspire-tsx-replacement-mesh-pods-2pcs-0-8%cf%89-1-0%cf%89',
      },
      {
        original: '/products/legacy-369-250mg-cbd-sleep-spray-n%C2%BA-7-dreams',
        expected: '/products/legacy-369-250mg-cbd-sleep-spray-n%c2%ba-7-dreams',
      },
      {
        original: '/products/50mg-access-cbd%C2%AE-cbd-patches-10-patches',
        expected: '/products/50mg-access-cbd%c2%ae-cbd-patches-10-patches',
      },
    ];

    problematicUrls.forEach(({original, expected}) => {
      it(`should normalize ${original}`, () => {
        const url = new URL(`https://www.vapourism.co.uk${original}`);
        const normalized = normalizeUrl(url);
        
        expect(normalized.pathname).toBe(expected);
      });
    });
  });

  describe('Performance considerations', () => {
    it('should handle long URLs efficiently', () => {
      const longPath = '/products/' + 'a'.repeat(100) + '-%CF%89-%C2%BA-%C2%AE';
      const url = new URL(`https://www.vapourism.co.uk${longPath}`);
      const normalized = normalizeUrl(url);
      
      expect(normalized.pathname).toContain('%cf%89');
      expect(normalized.pathname).toContain('%c2%ba');
      expect(normalized.pathname).toContain('%c2%ae');
    });

    it('should handle URLs with many percent-encoded characters', () => {
      const manyEncoded = '/products/test-' + Array(10).fill('%CF%89').join('-');
      const url = new URL(`https://www.vapourism.co.uk${manyEncoded}`);
      const normalized = normalizeUrl(url);
      
      expect(normalized.pathname).not.toContain('%CF%89');
      expect((normalized.pathname.match(/%cf%89/g) || []).length).toBe(10);
    });
  });
});
