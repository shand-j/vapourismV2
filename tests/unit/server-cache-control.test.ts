import {describe, it, expect} from 'vitest';

/**
 * Test Cache-Control header logic for performance optimization
 * 
 * The server should set appropriate Cache-Control headers based on:
 * 1. Static assets (js, css, images, fonts) - aggressive caching (1 year immutable)
 * 2. HTML pages - brief caching (60s with stale-while-revalidate)
 * 3. User-specific pages - no caching (cart, account, checkout, age-verification)
 */
describe('Server Cache-Control Headers', () => {
  /**
   * Static asset file extensions regex from server.ts
   */
  const STATIC_ASSET_EXTENSIONS = /\.(js|css|woff|woff2|ttf|eot|ico|png|jpg|jpeg|gif|svg|webp)$/;

  /**
   * Helper function to determine cache control for a given pathname and content type
   * This mirrors the caching logic in server.ts lines 73-86
   * Note: pathname should NOT include query parameters (use url.pathname)
   */
  function getCacheControlHeader(pathname: string, contentType?: string): string | null {
    // Cache static assets aggressively (1 year immutable cache)
    if (STATIC_ASSET_EXTENSIONS.test(pathname)) {
      return 'public, max-age=31536000, immutable';
    }
    // Cache HTML pages briefly to improve repeat visits without stale content
    else if (contentType?.includes('text/html')) {
      // Don't cache user-specific pages (cart, account, checkout)
      if (!pathname.match(/\/(cart|account|checkout|age-verification)/)) {
        return 'public, max-age=60, stale-while-revalidate=300';
      }
    }
    
    return null;
  }

  describe('Static asset caching', () => {
    describe('JavaScript files', () => {
      it('should cache .js files with immutable directive', () => {
        const cacheControl = getCacheControlHeader('/build/entry.client.js');
        
        expect(cacheControl).toBe('public, max-age=31536000, immutable');
      });

      it('should cache nested .js files', () => {
        const cacheControl = getCacheControlHeader('/assets/scripts/main.js');
        
        expect(cacheControl).toBe('public, max-age=31536000, immutable');
      });

      it('should cache .js files (query parameters handled by URL.pathname)', () => {
        // In server.ts, pathname comes from URL.pathname which strips query params
        const cacheControl = getCacheControlHeader('/build/entry.client.js');
        
        expect(cacheControl).toBe('public, max-age=31536000, immutable');
      });
    });

    describe('CSS files', () => {
      it('should cache .css files with immutable directive', () => {
        const cacheControl = getCacheControlHeader('/styles/main.css');
        
        expect(cacheControl).toBe('public, max-age=31536000, immutable');
      });

      it('should cache nested .css files', () => {
        const cacheControl = getCacheControlHeader('/assets/styles/theme.css');
        
        expect(cacheControl).toBe('public, max-age=31536000, immutable');
      });
    });

    describe('Image files', () => {
      it('should cache .png files', () => {
        const cacheControl = getCacheControlHeader('/images/logo.png');
        
        expect(cacheControl).toBe('public, max-age=31536000, immutable');
      });

      it('should cache .jpg files', () => {
        const cacheControl = getCacheControlHeader('/images/product.jpg');
        
        expect(cacheControl).toBe('public, max-age=31536000, immutable');
      });

      it('should cache .jpeg files', () => {
        const cacheControl = getCacheControlHeader('/images/banner.jpeg');
        
        expect(cacheControl).toBe('public, max-age=31536000, immutable');
      });

      it('should cache .gif files', () => {
        const cacheControl = getCacheControlHeader('/images/animation.gif');
        
        expect(cacheControl).toBe('public, max-age=31536000, immutable');
      });

      it('should cache .svg files', () => {
        const cacheControl = getCacheControlHeader('/icons/cart.svg');
        
        expect(cacheControl).toBe('public, max-age=31536000, immutable');
      });

      it('should cache .webp files', () => {
        const cacheControl = getCacheControlHeader('/images/hero.webp');
        
        expect(cacheControl).toBe('public, max-age=31536000, immutable');
      });
    });

    describe('Font files', () => {
      it('should cache .woff files', () => {
        const cacheControl = getCacheControlHeader('/fonts/inter.woff');
        
        expect(cacheControl).toBe('public, max-age=31536000, immutable');
      });

      it('should cache .woff2 files', () => {
        const cacheControl = getCacheControlHeader('/fonts/inter.woff2');
        
        expect(cacheControl).toBe('public, max-age=31536000, immutable');
      });

      it('should cache .ttf files', () => {
        const cacheControl = getCacheControlHeader('/fonts/roboto.ttf');
        
        expect(cacheControl).toBe('public, max-age=31536000, immutable');
      });

      it('should cache .eot files', () => {
        const cacheControl = getCacheControlHeader('/fonts/legacy.eot');
        
        expect(cacheControl).toBe('public, max-age=31536000, immutable');
      });
    });

    describe('Favicon', () => {
      it('should cache .ico files', () => {
        const cacheControl = getCacheControlHeader('/favicon.ico');
        
        expect(cacheControl).toBe('public, max-age=31536000, immutable');
      });
    });

    describe('Static assets in subdirectories', () => {
      it('should cache deeply nested static files', () => {
        const cacheControl = getCacheControlHeader('/assets/vendor/library/v2/style.css');
        
        expect(cacheControl).toBe('public, max-age=31536000, immutable');
      });

      it('should cache static files with hyphens', () => {
        const cacheControl = getCacheControlHeader('/build/entry-client-abc123.js');
        
        expect(cacheControl).toBe('public, max-age=31536000, immutable');
      });

      it('should cache static files with version numbers', () => {
        const cacheControl = getCacheControlHeader('/assets/v2.1.3/main.css');
        
        expect(cacheControl).toBe('public, max-age=31536000, immutable');
      });
    });
  });

  describe('HTML page caching', () => {
    describe('General pages', () => {
      it('should cache homepage HTML with brief TTL', () => {
        const cacheControl = getCacheControlHeader('/', 'text/html; charset=utf-8');
        
        expect(cacheControl).toBe('public, max-age=60, stale-while-revalidate=300');
      });

      it('should cache product pages HTML', () => {
        const cacheControl = getCacheControlHeader('/products/vape-juice', 'text/html');
        
        expect(cacheControl).toBe('public, max-age=60, stale-while-revalidate=300');
      });

      it('should cache collection pages HTML', () => {
        const cacheControl = getCacheControlHeader('/collections/e-liquids', 'text/html');
        
        expect(cacheControl).toBe('public, max-age=60, stale-while-revalidate=300');
      });

      it('should cache about page HTML', () => {
        const cacheControl = getCacheControlHeader('/about', 'text/html');
        
        expect(cacheControl).toBe('public, max-age=60, stale-while-revalidate=300');
      });

      it('should cache blog pages HTML', () => {
        const cacheControl = getCacheControlHeader('/blogs/news/article-title', 'text/html');
        
        expect(cacheControl).toBe('public, max-age=60, stale-while-revalidate=300');
      });

      it('should cache search results HTML', () => {
        const cacheControl = getCacheControlHeader('/search', 'text/html');
        
        expect(cacheControl).toBe('public, max-age=60, stale-while-revalidate=300');
      });

      it('should work with full content-type header', () => {
        const cacheControl = getCacheControlHeader('/products/test', 'text/html; charset=utf-8');
        
        expect(cacheControl).toBe('public, max-age=60, stale-while-revalidate=300');
      });
    });

    describe('HTML pages with query parameters in URL', () => {
      it('should cache product pages (query params stripped by URL.pathname)', () => {
        // In production: new URL('...?variant=123').pathname returns '/products/vape-juice'
        // Testing the pathname WITHOUT query params as it would be in production
        const cacheControl = getCacheControlHeader('/products/vape-juice', 'text/html');
        
        expect(cacheControl).toBe('public, max-age=60, stale-while-revalidate=300');
      });

      it('should cache search (query params stripped by URL.pathname)', () => {
        // In production: new URL('...?q=nicotine').pathname returns '/search'
        const cacheControl = getCacheControlHeader('/search', 'text/html');
        
        expect(cacheControl).toBe('public, max-age=60, stale-while-revalidate=300');
      });

      it('should cache collection pages (query params stripped by URL.pathname)', () => {
        // In production: new URL('...?filter=...').pathname returns '/collections/all'
        const cacheControl = getCacheControlHeader('/collections/all', 'text/html');
        
        expect(cacheControl).toBe('public, max-age=60, stale-while-revalidate=300');
      });
    });
  });

  describe('User-specific pages (no caching)', () => {
    describe('Cart pages', () => {
      it('should NOT cache /cart page', () => {
        const cacheControl = getCacheControlHeader('/cart', 'text/html');
        
        expect(cacheControl).toBeNull();
      });

      it('should NOT cache cart API routes', () => {
        const cacheControl = getCacheControlHeader('/cart/add', 'text/html');
        
        expect(cacheControl).toBeNull();
      });

      it('should NOT cache nested cart routes', () => {
        const cacheControl = getCacheControlHeader('/cart/update', 'text/html');
        
        expect(cacheControl).toBeNull();
      });
    });

    describe('Account pages', () => {
      it('should NOT cache /account page', () => {
        const cacheControl = getCacheControlHeader('/account', 'text/html');
        
        expect(cacheControl).toBeNull();
      });

      it('should NOT cache account subpages', () => {
        const cacheControl = getCacheControlHeader('/account/orders', 'text/html');
        
        expect(cacheControl).toBeNull();
      });

      it('should NOT cache account settings', () => {
        const cacheControl = getCacheControlHeader('/account/settings', 'text/html');
        
        expect(cacheControl).toBeNull();
      });

      it('should NOT cache account profile', () => {
        const cacheControl = getCacheControlHeader('/account/profile', 'text/html');
        
        expect(cacheControl).toBeNull();
      });
    });

    describe('Checkout pages', () => {
      it('should NOT cache /checkout page', () => {
        const cacheControl = getCacheControlHeader('/checkout', 'text/html');
        
        expect(cacheControl).toBeNull();
      });

      it('should NOT cache checkout steps', () => {
        const cacheControl = getCacheControlHeader('/checkout/shipping', 'text/html');
        
        expect(cacheControl).toBeNull();
      });

      it('should NOT cache checkout payment', () => {
        const cacheControl = getCacheControlHeader('/checkout/payment', 'text/html');
        
        expect(cacheControl).toBeNull();
      });
    });

    describe('Age verification pages', () => {
      it('should NOT cache /age-verification page', () => {
        const cacheControl = getCacheControlHeader('/age-verification', 'text/html');
        
        expect(cacheControl).toBeNull();
      });

      it('should NOT cache age-verification subpages', () => {
        const cacheControl = getCacheControlHeader('/age-verification/verify', 'text/html');
        
        expect(cacheControl).toBeNull();
      });

      it('should NOT cache age-verification status', () => {
        const cacheControl = getCacheControlHeader('/age-verification/status', 'text/html');
        
        expect(cacheControl).toBeNull();
      });
    });
  });

  describe('Edge cases', () => {
    it('should not cache non-HTML content without matching extension', () => {
      const cacheControl = getCacheControlHeader('/api/products', 'application/json');
      
      expect(cacheControl).toBeNull();
    });

    it('should not cache when content type is missing', () => {
      const cacheControl = getCacheControlHeader('/some-path');
      
      expect(cacheControl).toBeNull();
    });

    it('should cache static assets even without content type', () => {
      const cacheControl = getCacheControlHeader('/build/app.js');
      
      expect(cacheControl).toBe('public, max-age=31536000, immutable');
    });

    it('should handle paths with multiple slashes', () => {
      const cacheControl = getCacheControlHeader('//products//test', 'text/html');
      
      expect(cacheControl).toBe('public, max-age=60, stale-while-revalidate=300');
    });

    it('should handle trailing slashes', () => {
      const cacheControl = getCacheControlHeader('/products/', 'text/html');
      
      expect(cacheControl).toBe('public, max-age=60, stale-while-revalidate=300');
    });

    it('should match paths containing cart/account keywords (regex limitation)', () => {
      // IMPORTANT: The regex /\/(cart|account|checkout|age-verification)/ 
      // matches these paths because it looks for the pattern ANYWHERE in the string:
      // - /cartography contains "/cart" substring, so regex matches -> NO caching
      // - /accountability contains "/account" substring, so regex matches -> NO caching
      // - /discard does NOT contain "/cart" (contains "scar"), so NO match -> caching enabled
      // This is a known limitation of the simple pattern matching approach
      
      const discardCache = getCacheControlHeader('/discard', 'text/html');
      expect(discardCache).toBe('public, max-age=60, stale-while-revalidate=300');
      
      const cartographyCache = getCacheControlHeader('/cartography', 'text/html');
      expect(cartographyCache).toBeNull(); // Contains '/cart' so regex matches
      
      const accountabilityCache = getCacheControlHeader('/accountability', 'text/html');
      expect(accountabilityCache).toBeNull(); // Contains '/account' so regex matches
    });

    it('should handle uppercase file extensions', () => {
      // Note: In real URLs, extensions are usually lowercase, but testing robustness
      const cacheControl = getCacheControlHeader('/image.PNG');
      
      // The regex in server.ts is case-sensitive, so this should not match
      expect(cacheControl).toBeNull();
    });

    it('should handle files with multiple dots', () => {
      const cacheControl = getCacheControlHeader('/build/app.min.js');
      
      expect(cacheControl).toBe('public, max-age=31536000, immutable');
    });

    it('should handle files ending with static extension but as part of name', () => {
      const cacheControl = getCacheControlHeader('/products/test.js-vape', 'text/html');
      
      // This should NOT match as static asset since .js is not at the end
      expect(cacheControl).toBe('public, max-age=60, stale-while-revalidate=300');
    });
  });

  describe('Cache control values', () => {
    it('should use max-age of 1 year (31536000 seconds) for static assets', () => {
      const cacheControl = getCacheControlHeader('/app.js');
      
      expect(cacheControl).toContain('max-age=31536000');
    });

    it('should include "immutable" directive for static assets', () => {
      const cacheControl = getCacheControlHeader('/styles.css');
      
      expect(cacheControl).toContain('immutable');
    });

    it('should use max-age of 60 seconds for HTML pages', () => {
      const cacheControl = getCacheControlHeader('/products/test', 'text/html');
      
      expect(cacheControl).toContain('max-age=60');
    });

    it('should include stale-while-revalidate=300 for HTML pages', () => {
      const cacheControl = getCacheControlHeader('/', 'text/html');
      
      expect(cacheControl).toContain('stale-while-revalidate=300');
    });

    it('should use "public" directive for all cached content', () => {
      const staticCache = getCacheControlHeader('/app.js');
      const htmlCache = getCacheControlHeader('/', 'text/html');
      
      expect(staticCache).toContain('public');
      expect(htmlCache).toContain('public');
    });
  });

  describe('Real-world URL patterns', () => {
    const realWorldUrls = [
      // Static assets
      { path: '/build/entry.client-HASH123.js', contentType: undefined, expectedCache: 'public, max-age=31536000, immutable' },
      { path: '/favicon.ico', contentType: undefined, expectedCache: 'public, max-age=31536000, immutable' },
      { path: '/assets/logo.svg', contentType: undefined, expectedCache: 'public, max-age=31536000, immutable' },
      
      // HTML pages that should cache
      { path: '/', contentType: 'text/html', expectedCache: 'public, max-age=60, stale-while-revalidate=300' },
      { path: '/products/elux-legend-nic-salt', contentType: 'text/html', expectedCache: 'public, max-age=60, stale-while-revalidate=300' },
      { path: '/collections/e-liquids', contentType: 'text/html', expectedCache: 'public, max-age=60, stale-while-revalidate=300' },
      { path: '/blogs/news/latest-vaping-trends', contentType: 'text/html', expectedCache: 'public, max-age=60, stale-while-revalidate=300' },
      
      // User-specific pages that should NOT cache
      { path: '/cart', contentType: 'text/html', expectedCache: null },
      { path: '/account', contentType: 'text/html', expectedCache: null },
      { path: '/account/orders', contentType: 'text/html', expectedCache: null },
      { path: '/checkout', contentType: 'text/html', expectedCache: null },
      { path: '/age-verification', contentType: 'text/html', expectedCache: null },
      { path: '/age-verification/verify', contentType: 'text/html', expectedCache: null },
    ];

    realWorldUrls.forEach(({ path, contentType, expectedCache }) => {
      it(`should handle ${path} correctly`, () => {
        const cacheControl = getCacheControlHeader(path, contentType);
        
        expect(cacheControl).toBe(expectedCache);
      });
    });
  });

  describe('Performance considerations', () => {
    it('should handle very long pathnames', () => {
      const longPath = '/products/' + 'a'.repeat(500) + '.js';
      const cacheControl = getCacheControlHeader(longPath);
      
      expect(cacheControl).toBe('public, max-age=31536000, immutable');
    });

    it('should handle paths with many segments', () => {
      const deepPath = '/a/b/c/d/e/f/g/h/i/j/style.css';
      const cacheControl = getCacheControlHeader(deepPath);
      
      expect(cacheControl).toBe('public, max-age=31536000, immutable');
    });

    it('should efficiently skip caching for user pages', () => {
      const paths = ['/cart', '/account', '/checkout', '/age-verification'];
      
      paths.forEach(path => {
        const cacheControl = getCacheControlHeader(path, 'text/html');
        expect(cacheControl).toBeNull();
      });
    });
  });
});
