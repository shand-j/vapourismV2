/**
 * SEO Compliance Test Suite
 *
 * This test suite validates SEO best practices across the application:
 * - Meta tag generation and validation
 * - Schema.org structured data
 * - Title and description constraints
 * - Canonical URL handling
 * - Image alt text generation
 *
 * These tests run automatically in CI to prevent SEO regressions.
 */

import {describe, it, expect} from 'vitest';
import {SEOAutomationService} from '../../app/preserved/seo-automation';

// SEO Best Practice Constants
const SEO_CONSTRAINTS = {
  TITLE_MAX_LENGTH: 70,
  TITLE_MIN_LENGTH: 30,
  META_DESCRIPTION_MAX_LENGTH: 160,
  META_DESCRIPTION_MIN_LENGTH: 70,
  H1_MAX_LENGTH: 60,
  H1_MIN_LENGTH: 20,
  IMAGE_ALT_MIN_LENGTH: 10,
  IMAGE_ALT_MAX_LENGTH: 125,
};

describe('SEO Compliance Tests', () => {
  describe('Meta Title Validation', () => {
    const testProducts = [
      {
        title: 'Hayati Pro Ultra 25000 Puffs Disposable Vape',
        vendor: 'Hayati',
        seoTitle: null,
        handle: 'hayati-pro-ultra-25000',
      },
      {
        title: 'Lost Mary BM6000 Disposable Vape',
        vendor: 'Lost Mary',
        seoTitle: 'Lost Mary BM6000 | Premium Disposable Vape | Vapourism',
        handle: 'lost-mary-bm6000',
      },
      {
        title: 'This Is An Extremely Long Product Title That Exceeds The Recommended SEO Character Limit For Meta Titles',
        vendor: 'Test Brand',
        seoTitle: null,
        handle: 'long-product-title',
      },
    ];

    it('should generate titles within 70 character limit', () => {
      testProducts.forEach(product => {
        const title = SEOAutomationService.generateProductTitle(
          product.title,
          product.vendor,
          product.seoTitle,
          product.handle
        );
        expect(title.length).toBeLessThanOrEqual(SEO_CONSTRAINTS.TITLE_MAX_LENGTH);
      });
    });

    it('should include brand name or store name', () => {
      testProducts.forEach(product => {
        const title = SEOAutomationService.generateProductTitle(
          product.title,
          product.vendor,
          product.seoTitle,
          product.handle
        );
        const hasBrandOrStore =
          title.toLowerCase().includes(product.vendor.toLowerCase()) ||
          title.toLowerCase().includes('vapourism');
        expect(hasBrandOrStore).toBe(true);
      });
    });

    it('should not have empty titles', () => {
      testProducts.forEach(product => {
        const title = SEOAutomationService.generateProductTitle(
          product.title,
          product.vendor,
          product.seoTitle,
          product.handle
        );
        expect(title.trim().length).toBeGreaterThan(0);
      });
    });

    it('should use SEO title override when provided', () => {
      const product = testProducts[1];
      const title = SEOAutomationService.generateProductTitle(
        product.title,
        product.vendor,
        product.seoTitle,
        product.handle
      );
      expect(title).toContain('Lost Mary BM6000');
    });

    it('should truncate titles properly with ellipsis', () => {
      const truncated = SEOAutomationService.truncateTitle(
        'This is a very long title that exceeds the maximum allowed characters for SEO optimization and needs truncation',
        70
      );
      expect(truncated.length).toBeLessThanOrEqual(70);
      expect(truncated).toContain('…');
    });
  });

  describe('Meta Description Validation', () => {
    const testProduct = {
      title: 'Elf Bar 600 Disposable Vape',
      vendor: 'Elf Bar',
      productType: 'Disposable Vape',
      description: 'The Elf Bar 600 is a compact, lightweight disposable vape with a 550mAh battery and 2ml pre-filled e-liquid.',
      tags: ['disposable', 'elf-bar', '20mg', '600-puffs'],
      handle: 'elf-bar-600',
    };

    it('should generate descriptions within 160 character limit', () => {
      const description = SEOAutomationService.generateProductMetaDescription(testProduct);
      expect(description.length).toBeLessThanOrEqual(SEO_CONSTRAINTS.META_DESCRIPTION_MAX_LENGTH);
    });

    it('should include product name in description', () => {
      const description = SEOAutomationService.generateProductMetaDescription(testProduct);
      expect(description.toLowerCase()).toContain('elf bar');
    });

    it('should include call-to-action elements', () => {
      const description = SEOAutomationService.generateProductMetaDescription(testProduct);
      const hasCallToAction =
        description.toLowerCase().includes('shop') ||
        description.toLowerCase().includes('buy') ||
        description.toLowerCase().includes('✓');
      expect(hasCallToAction).toBe(true);
    });
  });

  describe('H1 Heading Validation', () => {
    const testCases = [
      {
        title: 'Short',
        vendor: 'Brand',
        expected: {minLength: SEO_CONSTRAINTS.H1_MIN_LENGTH},
      },
      {
        title: 'This is a very long product title that definitely exceeds the sixty character limit recommended for H1 headings',
        vendor: 'Brand',
        expected: {maxLength: SEO_CONSTRAINTS.H1_MAX_LENGTH},
      },
      {
        title: 'Normal Product Title Here',
        vendor: 'Brand',
        expected: {unchanged: true},
      },
    ];

    it('should keep H1 within 60 character limit', () => {
      testCases.forEach(testCase => {
        const h1 = SEOAutomationService.formatProductH1(testCase.title, testCase.vendor);
        expect(h1.length).toBeLessThanOrEqual(SEO_CONSTRAINTS.H1_MAX_LENGTH);
      });
    });

    it('should add vendor name for very short titles', () => {
      const h1 = SEOAutomationService.formatProductH1('Short', 'TestBrand');
      expect(h1).toContain('TestBrand');
    });

    it('should clean up promotional text formatting', () => {
      const h1 = SEOAutomationService.formatProductH1(
        'Test Product (BUY 1 GET 1 FREE)',
        'Brand'
      );
      expect(h1).not.toContain('(BUY');
      expect(h1).toContain('Buy 1 Get 1 Free');
    });
  });

  describe('Image Alt Text Validation', () => {
    const testProduct = {
      title: 'Geek Bar Pro 5000 Puffs',
      vendor: 'Geek Bar',
      productType: 'Disposable Vape',
      description: 'Premium disposable vape',
      tags: ['geek-bar', 'disposable'],
      handle: 'geek-bar-pro-5000',
    };

    it('should generate descriptive alt text for main images', () => {
      const altText = SEOAutomationService.generateImageAltText(testProduct, 'main');
      expect(altText.length).toBeGreaterThanOrEqual(SEO_CONSTRAINTS.IMAGE_ALT_MIN_LENGTH);
      expect(altText.length).toBeLessThanOrEqual(SEO_CONSTRAINTS.IMAGE_ALT_MAX_LENGTH);
      expect(altText).toContain(testProduct.title);
      expect(altText).toContain(testProduct.vendor);
    });

    it('should generate unique alt text for gallery images', () => {
      const altText1 = SEOAutomationService.generateImageAltText(testProduct, 'gallery', 1);
      const altText2 = SEOAutomationService.generateImageAltText(testProduct, 'gallery', 2);
      expect(altText1).not.toBe(altText2);
      expect(altText1).toContain('image 1');
      expect(altText2).toContain('image 2');
    });

    it('should include product type for main images', () => {
      const altText = SEOAutomationService.generateImageAltText(testProduct, 'main');
      expect(altText).toContain(testProduct.productType);
    });
  });

  describe('Schema.org Structured Data Validation', () => {
    const testProduct = {
      title: 'Crystal Bar 600 Puffs Disposable Vape',
      vendor: 'Crystal',
      productType: 'Disposable Vape',
      description: 'Premium Crystal Bar with 600 puffs of smooth vapour',
      tags: ['crystal', 'disposable', '600-puffs'],
      price: {amount: '4.99', currencyCode: 'GBP'},
      handle: 'crystal-bar-600',
      availableForSale: true,
      image: 'https://cdn.shopify.com/s/files/1/0000/0001/products/crystal-bar.jpg',
      url: 'https://vapourism.co.uk/products/crystal-bar-600',
      sku: 'CB600-001',
    };

    it('should generate valid Product schema', () => {
      const schema = SEOAutomationService.generateProductSchema(testProduct);
      expect(schema).not.toBeNull();
      expect(schema?.['@context']).toBe('https://schema.org');
      expect(schema?.['@type']).toBe('Product');
    });

    it('should include required Product schema properties', () => {
      const schema = SEOAutomationService.generateProductSchema(testProduct);
      expect(schema?.name).toBe(testProduct.title);
      expect(schema?.brand?.name).toBe(testProduct.vendor);
      expect(schema?.offers).toBeDefined();
    });

    it('should include Offer schema with pricing', () => {
      const schema = SEOAutomationService.generateProductSchema(testProduct);
      expect(schema?.offers?.['@type']).toBe('Offer');
      expect(schema?.offers?.price).toBe(parseFloat(testProduct.price.amount)); // Expect number format per Google 2025 requirements
      expect(schema?.offers?.priceCurrency).toBe('GBP');
    });

    it('should include availability status', () => {
      const schema = SEOAutomationService.generateProductSchema(testProduct);
      expect(schema?.offers?.availability).toBe('https://schema.org/InStock');
    });

    it('should generate FAQ schema for products', () => {
      const faqSchema = SEOAutomationService.generateProductFAQSchema(testProduct);
      expect(faqSchema?.['@context']).toBe('https://schema.org');
      expect(faqSchema?.['@type']).toBe('FAQPage');
      expect(faqSchema?.mainEntity).toBeInstanceOf(Array);
      expect(faqSchema?.mainEntity.length).toBeGreaterThan(0);
    });

    it('should generate breadcrumb schema', () => {
      const breadcrumbs = [
        {name: 'Home', url: '/'},
        {name: 'Disposable Vapes', url: '/collections/disposable-vapes'},
        {name: testProduct.title, url: `/products/${testProduct.handle}`},
      ];
      const schema = SEOAutomationService.generateBreadcrumbSchema(breadcrumbs);
      expect(schema?.['@type']).toBe('BreadcrumbList');
      expect(schema?.itemListElement).toHaveLength(3);
      expect(schema?.itemListElement[0].position).toBe(1);
    });
  });

  describe('Keyword Generation', () => {
    const testProduct = {
      title: 'Vaporesso XROS 4 Pod Kit',
      vendor: 'Vaporesso',
      productType: 'Pod Kit',
      description: 'The XROS 4 features a 1000mAh battery, 3ml pod capacity, and adjustable airflow.',
      tags: ['vaporesso', 'pod-kit', 'xros', 'mtl'],
      handle: 'vaporesso-xros-4',
    };

    it('should generate relevant keywords', () => {
      const keywords = SEOAutomationService.generateProductKeywords(testProduct);
      expect(keywords).toBeInstanceOf(Array);
      expect(keywords.length).toBeGreaterThan(5);
    });

    it('should include brand in keywords', () => {
      const keywords = SEOAutomationService.generateProductKeywords(testProduct);
      const hasVendor = keywords.some(k => k.toLowerCase().includes('vaporesso'));
      expect(hasVendor).toBe(true);
    });

    it('should include UK-specific keywords', () => {
      const keywords = SEOAutomationService.generateProductKeywords(testProduct);
      const hasUK = keywords.some(k => k.toLowerCase().includes('uk'));
      expect(hasUK).toBe(true);
    });

    it('should not have duplicate keywords', () => {
      const keywords = SEOAutomationService.generateProductKeywords(testProduct);
      const uniqueKeywords = new Set(keywords.map(k => k.toLowerCase()));
      expect(uniqueKeywords.size).toBe(keywords.length);
    });
  });

  describe('Open Graph Title Generation', () => {
    it('should create concise titles for social sharing', () => {
      const ogTitle = SEOAutomationService.generateOGTitle(
        'Hayati Pro Ultra 25000 Puffs Disposable Vape Device',
        'Hayati'
      );
      expect(ogTitle.length).toBeLessThan(80);
    });

    it('should highlight promotions effectively', () => {
      const ogTitle = SEOAutomationService.generateOGTitle(
        'Realest CBD 1000mg Crumble (BUY 1 GET 1 FREE)',
        'Realest CBD'
      );
      expect(ogTitle).toContain('Buy 1 Get 1 Free');
    });
  });

  describe('Category SEO', () => {
    it('should generate category meta descriptions', () => {
      const description = SEOAutomationService.generateCategoryMetaDescription(
        'Disposable Vapes',
        150,
        ['Elf Bar', 'Lost Mary', 'Geek Bar']
      );
      expect(description.length).toBeLessThanOrEqual(200);
      expect(description.toLowerCase()).toContain('disposable');
    });

    it('should generate category titles with year', () => {
      const title = SEOAutomationService.generateCategoryTitle('Pod Kits', 75);
      const currentYear = new Date().getFullYear().toString();
      expect(title).toContain(currentYear);
      expect(title).toContain('Pod Kits');
    });
  });
});

describe('SEO Regression Prevention', () => {
  it('should not generate empty meta titles', () => {
    const edgeCases = [
      {title: '', vendor: '', seoTitle: null, handle: null},
      {title: '   ', vendor: '   ', seoTitle: null, handle: null},
    ];

    edgeCases.forEach(product => {
      const title = SEOAutomationService.generateProductTitle(
        product.title,
        product.vendor,
        product.seoTitle,
        product.handle
      );
      // Even empty inputs should produce at least " | Vapourism"
      expect(title.length).toBeGreaterThan(0);
    });
  });

  it('should handle special characters in product titles', () => {
    const specialChars = [
      'Product with "quotes"',
      'Product & ampersand',
      "Product's apostrophe",
      'Product (with parentheses)',
    ];

    specialChars.forEach(title => {
      const result = SEOAutomationService.generateProductTitle(title, 'Brand', null, null);
      // Should generate valid title without crashing
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain('Vapourism');
    });
  });

  it('should handle unicode characters', () => {
    const title = SEOAutomationService.generateProductTitle(
      'Café Vape™ with £ price',
      'Brand',
      null,
      null
    );
    expect(title.length).toBeGreaterThan(0);
  });
});
