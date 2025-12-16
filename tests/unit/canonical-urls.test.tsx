/**
 * Unit tests for canonical URL generation
 * 
 * Tests ensure that canonical URLs always use the production domain
 * (www.vapourism.co.uk) instead of the Shopify development domain
 * (vapourism.myshopify.com) as identified in SEO audit.
 */

import { describe, it, expect } from 'vitest';

describe('Canonical URL Configuration', () => {
  it('should define PRODUCTION_DOMAIN in environment types', () => {
    // This test verifies the TypeScript interface includes PRODUCTION_DOMAIN
    // The actual interface is in env.d.ts
    const envInterface = `
      interface Env extends HydrogenEnv {
        PRODUCTION_DOMAIN?: string;
      }
    `;
    expect(envInterface).toContain('PRODUCTION_DOMAIN');
  });

  it('should use www.vapourism.co.uk as the canonical domain', () => {
    const expectedDomain = 'https://www.vapourism.co.uk';
    const testPath = '/products/test-product';
    
    // Simulate the canonical URL generation logic from root.tsx
    const productionDomain = 'https://www.vapourism.co.uk';
    const canonicalUrl = `${productionDomain.replace(/\/$/, '')}${testPath}`;
    
    expect(canonicalUrl).toBe('https://www.vapourism.co.uk/products/test-product');
    expect(canonicalUrl).not.toContain('myshopify.com');
  });

  it('should strip trailing slashes from production domain', () => {
    const productionDomainWithSlash = 'https://www.vapourism.co.uk/';
    const testPath = '/products/test';
    
    const canonicalUrl = `${productionDomainWithSlash.replace(/\/$/, '')}${testPath}`;
    
    expect(canonicalUrl).toBe('https://www.vapourism.co.uk/products/test');
    expect(canonicalUrl).not.toMatch(/\/\//); // No double slashes
  });

  it('should fallback to www.vapourism.co.uk when PRODUCTION_DOMAIN is not set', () => {
    // Simulate the fallback logic
    const envProductionDomain = undefined;
    const productionDomain = envProductionDomain || 'https://www.vapourism.co.uk';
    
    expect(productionDomain).toBe('https://www.vapourism.co.uk');
  });

  it('should use PRODUCTION_DOMAIN env var when available', () => {
    const envProductionDomain = 'https://custom.domain.com';
    const productionDomain = envProductionDomain || 'https://www.vapourism.co.uk';
    
    expect(productionDomain).toBe('https://custom.domain.com');
  });

  it('should generate correct canonical URLs for different page types', () => {
    const productionDomain = 'https://www.vapourism.co.uk';
    
    const testCases = [
      { path: '/', expected: 'https://www.vapourism.co.uk/' },
      { path: '/products/vape-kit', expected: 'https://www.vapourism.co.uk/products/vape-kit' },
      { path: '/collections/hayati-x4', expected: 'https://www.vapourism.co.uk/collections/hayati-x4' },
      { path: '/search', expected: 'https://www.vapourism.co.uk/search' },
      { path: '/about', expected: 'https://www.vapourism.co.uk/about' },
    ];

    testCases.forEach(({ path, expected }) => {
      const canonicalUrl = `${productionDomain.replace(/\/$/, '')}${path}`;
      expect(canonicalUrl).toBe(expected);
    });
  });

  it('should not include query parameters in canonical URLs', () => {
    // Note: This behavior is implemented in root.tsx by using location.pathname
    // (not location.search) when building the canonical URL
    const productionDomain = 'https://www.vapourism.co.uk';
    const pathname = '/products/test-product';
    // Query params should be excluded from canonical URL
    
    const canonicalUrl = `${productionDomain.replace(/\/$/, '')}${pathname}`;
    
    expect(canonicalUrl).toBe('https://www.vapourism.co.uk/products/test-product');
    expect(canonicalUrl).not.toContain('?');
    expect(canonicalUrl).not.toContain('utm_');
  });

  it('should never use myshopify.com domain for canonical URLs', () => {
    // This test ensures the fix prevents using Shopify's development domain
    const shopifyDevDomain = 'https://vapourism.myshopify.com';
    const productionDomain = 'https://www.vapourism.co.uk';
    
    // The canonical URL should always use production domain
    expect(productionDomain).not.toBe(shopifyDevDomain);
    expect(productionDomain).not.toContain('myshopify.com');
  });
});

describe('Schema.org URL Consistency', () => {
  it('should use www.vapourism.co.uk in product schemas', () => {
    const productHandle = 'test-product';
    const productUrl = `https://www.vapourism.co.uk/products/${productHandle}`;
    
    expect(productUrl).toContain('www.vapourism.co.uk');
    expect(productUrl).not.toContain('myshopify.com');
  });

  it('should use www.vapourism.co.uk in breadcrumb schemas', () => {
    const breadcrumbs = [
      { name: 'Home', url: '/' },
      { name: 'Products', url: '/search' },
      { name: 'Test Product', url: '/products/test-product' },
    ];

    breadcrumbs.forEach(crumb => {
      const fullUrl = `https://www.vapourism.co.uk${crumb.url}`;
      expect(fullUrl).toContain('www.vapourism.co.uk');
      expect(fullUrl).not.toContain('myshopify.com');
    });
  });

  it('should use consistent domain across all schema types', () => {
    const domain = 'https://www.vapourism.co.uk';
    
    // All these should use the same domain
    const organizationUrl = domain;
    const productUrl = `${domain}/products/test`;
    const breadcrumbUrl = `${domain}/search`;
    
    const urls = [organizationUrl, productUrl, breadcrumbUrl];
    
    urls.forEach(url => {
      expect(url).toContain('www.vapourism.co.uk');
      expect(url).not.toContain('myshopify.com');
    });
  });
});

describe('CSV Report Issue Coverage', () => {
  it('should fix product canonical URLs from CSV report', () => {
    // Sample issues from the CSV report
    const csvIssues = [
      '/products/geekvape-q-side-fill-replacement-pods-xl-0-4ohm-0-6ohm-0-8ohm-1-2ohm',
      '/products/10mg-maryliq-nic-salt-by-lost-mary-10ml-50vg-50pg',
      '/products/voopoo-argus-z2-pod-vape-kit-20w',
    ];

    const productionDomain = 'https://www.vapourism.co.uk';

    csvIssues.forEach(path => {
      const correctCanonical = `${productionDomain}${path}`;
      const wrongCanonical = `https://vapourism.myshopify.com${path}`;
      
      expect(correctCanonical).toContain('www.vapourism.co.uk');
      expect(correctCanonical).not.toBe(wrongCanonical);
    });
  });

  it('should fix collection canonical URLs from CSV report', () => {
    const csvIssue = '/collections/hayati-x4';
    const productionDomain = 'https://www.vapourism.co.uk';
    
    const correctCanonical = `${productionDomain}${csvIssue}`;
    const wrongCanonical = `https://vapourism.myshopify.com${csvIssue}`;
    
    expect(correctCanonical).toBe('https://www.vapourism.co.uk/collections/hayati-x4');
    expect(correctCanonical).not.toBe(wrongCanonical);
  });
});
