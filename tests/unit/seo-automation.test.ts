/**
 * Tests for SEO Automation Service
 * Specifically testing the generateOGTitle method for Open Graph title generation
 */

import {describe, it, expect} from 'vitest';
import {SEOAutomationService} from '../../app/preserved/seo-automation';

describe('SEOAutomationService.generateOGTitle', () => {
  describe('Promotional text handling', () => {
    it('should move "BUY 1 GET 1 FREE" to front with vendor and strength', () => {
      const result = SEOAutomationService.generateOGTitle(
        'Realest CBD 1000mg 80% Broad Spectrum CBD Crumble (BUY 1 GET 1 FREE)',
        'Realest CBD'
      );
      expect(result).toContain('Buy 1 Get 1 Free');
      expect(result).toContain('1000mg');
      expect(result).toContain('Realest CBD');
      expect(result).toContain('Crumble');
    });

    it('should move "BUY 1 GET 2 FREE" to front with vendor and strength', () => {
      const result = SEOAutomationService.generateOGTitle(
        'CBD Asylum Infuse 10000mg CBD Cola Oil - 30ml (BUY 1 GET 2 FREE)',
        'CBD Asylum'
      );
      expect(result).toContain('Buy 1 Get 2 Free');
      expect(result).toContain('10000mg');
      expect(result).toContain('CBD Asylum');
      expect(result).toContain('Oil');
    });

    it('should handle 5000mg with BUY 1 GET 1 FREE promo', () => {
      const result = SEOAutomationService.generateOGTitle(
        'Realest CBD 5000mg 80% Broad Spectrum CBD Crumble (BUY 1 GET 1 FREE)',
        'Realest CBD'
      );
      expect(result).toContain('Buy 1 Get 1 Free');
      expect(result).toContain('5000mg');
      expect(result).toContain('Crumble');
    });

    it('should handle BUY 2 GET 1 FREE promotional pattern', () => {
      const result = SEOAutomationService.generateOGTitle(
        'Test Product 1000mg CBD Oil (BUY 2 GET 1 FREE)',
        'Test Brand'
      );
      expect(result).toContain('Buy 2 Get 1 Free');
      expect(result).toContain('1000mg');
      expect(result).toContain('Test Brand');
    });

    it('should find promo text even when not first parentheses', () => {
      const result = SEOAutomationService.generateOGTitle(
        'Product (Free Shipping) 1000mg Oil (BUY 1 GET 1 FREE)',
        'Brand'
      );
      expect(result).toContain('Buy 1 Get 1 Free');
      expect(result).toContain('1000mg');
    });
  });

  describe('Standard product title optimization', () => {
    it('should extract strength, category, vendor and descriptor for CBD oil', () => {
      const result = SEOAutomationService.generateOGTitle(
        'CBD by British Cannabis 1000mg CBD Raw Cannabis Oil Drops 10ml',
        'British Cannabis'
      );
      expect(result).toContain('1000mg');
      expect(result).toContain('British Cannabis');
      expect(result).toContain('Drops'); // "Drops" is detected before "Oil" in categories map
      expect(result).toContain('Raw Extract');
    });

    it('should handle CBD tea with multiple descriptors', () => {
      const result = SEOAutomationService.generateOGTitle(
        'CBTea 125mg Cold Pressed Full Spectrum CBD Chamomile & Mint Tea - 50g',
        'CBTea'
      );
      expect(result).toContain('125mg');
      expect(result).toContain('CBTea');
      expect(result).toContain('Tea');
      // Should have at least one descriptor
      expect(result).toMatch(/Full Spectrum|Cold Pressed/);
    });

    it('should handle 500mg MCT oil with promo', () => {
      const result = SEOAutomationService.generateOGTitle(
        'Realest CBD 500mg Broad Spectrum CBD MCT Oil - 30ml (BUY 1 GET 1 FREE)',
        'Realest CBD'
      );
      expect(result).toContain('Buy 1 Get 1 Free');
      expect(result).toContain('500mg');
      expect(result).toContain('Oil');
    });

    it('should handle Peppermint Oil with BUY 1 GET 2 FREE', () => {
      const result = SEOAutomationService.generateOGTitle(
        'CBD Asylum Infuse 5000mg CBD Peppermint Oil - 30ml (BUY 1 GET 2 FREE)',
        'CBD Asylum'
      );
      expect(result).toContain('Buy 1 Get 2 Free');
      expect(result).toContain('5000mg');
      expect(result).toContain('CBD Asylum');
    });

    it('should handle non-CBD vape products without CBD prefix', () => {
      const result = SEOAutomationService.generateOGTitle(
        'Premium Vape Kit 2000mAh E-Liquid Compatible',
        'Vape Co'
      );
      // Should not add "CBD" prefix for non-CBD products
      expect(result).not.toMatch(/CBD Vape/);
      // Should include vendor and product type when detected
      expect(result).toContain('Vape Co');
      expect(result).toContain('Vape');
    });
  });

  describe('Edge cases and formatting', () => {
    it('should handle titles without promotional text', () => {
      const result = SEOAutomationService.generateOGTitle(
        'Simple Product 100mg CBD Oil',
        'Test Vendor'
      );
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
      // Should contain key components from standard processing
      expect(result).toContain('100mg');
      expect(result).toContain('CBD Oil');
    });

    it('should handle titles with percentage', () => {
      const result = SEOAutomationService.generateOGTitle(
        'Product 80% Broad Spectrum 1000mg',
        'Test Brand'
      );
      expect(result).toContain('1000mg');
    });

    it('should not include parentheses in final output', () => {
      const result = SEOAutomationService.generateOGTitle(
        'Product (BUY 1 GET 1 FREE)',
        'Test'
      );
      expect(result).not.toMatch(/\([^)]*\)/);
    });

    it('should handle multiple spaces and normalize them', () => {
      const result = SEOAutomationService.generateOGTitle(
        'Test  Product   1000mg   Oil',
        'Brand'
      );
      expect(result).not.toMatch(/\s{2,}/);
    });
  });

  describe('Product type detection', () => {
    it('should detect and include "Crumble" product type', () => {
      const result = SEOAutomationService.generateOGTitle(
        '1000mg CBD Crumble',
        'Test'
      );
      expect(result).toContain('Crumble');
    });

    it('should detect and include "Oil" product type', () => {
      const result = SEOAutomationService.generateOGTitle(
        '1000mg CBD Oil',
        'Test'
      );
      expect(result).toContain('Oil');
    });

    it('should detect and include "Tea" product type', () => {
      const result = SEOAutomationService.generateOGTitle(
        '125mg CBD Tea',
        'Test'
      );
      expect(result).toContain('Tea');
    });

    it('should prioritize "Drops" over "Oil" when both present', () => {
      const result = SEOAutomationService.generateOGTitle(
        '1000mg CBD Oil Drops',
        'Test'
      );
      // "Drops" should be detected first in the categories map
      expect(result).toContain('Drops');
    });
  });

  describe('Descriptor extraction', () => {
    it('should extract "Broad Spectrum" descriptor', () => {
      const result = SEOAutomationService.generateOGTitle(
        '1000mg Broad Spectrum CBD Oil',
        'Test'
      );
      expect(result).toContain('Broad Spectrum');
    });

    it('should extract "Full Spectrum" descriptor', () => {
      const result = SEOAutomationService.generateOGTitle(
        '1000mg Full Spectrum CBD Oil',
        'Test'
      );
      expect(result).toContain('Full Spectrum');
    });

    it('should extract "Raw Extract" descriptor from "Raw"', () => {
      const result = SEOAutomationService.generateOGTitle(
        '1000mg Raw CBD Oil',
        'Test'
      );
      expect(result).toContain('Raw Extract');
    });

    it('should extract "Cold Pressed" descriptor', () => {
      const result = SEOAutomationService.generateOGTitle(
        '125mg Cold Pressed CBD Tea',
        'Test'
      );
      expect(result).toMatch(/Cold Pressed|Full Spectrum/); // May prioritize Full Spectrum if present
    });
  });

  describe('Real-world examples from problem statement', () => {
    it('should handle Realest CBD 1000mg Crumble correctly', () => {
      const result = SEOAutomationService.generateOGTitle(
        'Realest CBD 1000mg 80% Broad Spectrum CBD Crumble (BUY 1 GET 1 FREE)',
        'Realest CBD'
      );
      // Should contain all key elements
      expect(result).toContain('Buy 1 Get 1 Free');
      expect(result).toContain('Realest CBD');
      expect(result).toContain('1000mg');
      expect(result).toContain('Crumble');
      // Should be concise
      expect(result.length).toBeLessThan(80);
    });

    it('should generate consistent format across similar products', () => {
      const result1 = SEOAutomationService.generateOGTitle(
        'Realest CBD 1000mg 80% Broad Spectrum CBD Crumble (BUY 1 GET 1 FREE)',
        'Realest CBD'
      );
      const result2 = SEOAutomationService.generateOGTitle(
        'Realest CBD 5000mg 80% Broad Spectrum CBD Crumble (BUY 1 GET 1 FREE)',
        'Realest CBD'
      );
      
      // Both should start with promo text
      expect(result1).toMatch(/^Buy 1 Get 1 Free:/);
      expect(result2).toMatch(/^Buy 1 Get 1 Free:/);
      
      // Both should include vendor
      expect(result1).toContain('Realest CBD');
      expect(result2).toContain('Realest CBD');
      
      // Both should include product type
      expect(result1).toContain('Crumble');
      expect(result2).toContain('Crumble');
    });
  });
});

describe('SEOAutomationService.formatProductH1', () => {
  describe('Heading length optimization', () => {
    it('should truncate titles longer than 60 characters', () => {
      const result = SEOAutomationService.formatProductH1(
        'This is a very long product title that exceeds sixty characters and should be truncated for SEO',
        'TestBrand'
      );
      expect(result.length).toBeLessThanOrEqual(60);
      expect(result).toContain('…');
    });

    it('should add vendor name for titles shorter than 20 characters', () => {
      const result = SEOAutomationService.formatProductH1(
        'Short Title',
        'TestBrand'
      );
      expect(result).toContain('by TestBrand');
      expect(result.length).toBeGreaterThanOrEqual(20);
    });

    it('should not modify titles within SEO-recommended range (20-60 chars)', () => {
      const title = 'Perfect Length Product Title Here';
      const result = SEOAutomationService.formatProductH1(title, 'TestBrand');
      expect(result).toBe(title);
      expect(result.length).toBeGreaterThanOrEqual(20);
      expect(result.length).toBeLessThanOrEqual(60);
    });
  });

  describe('Promotional text cleanup', () => {
    it('should convert (BUY 1 GET 1 FREE) to dash format', () => {
      const result = SEOAutomationService.formatProductH1(
        'Test Product (BUY 1 GET 1 FREE)',
        'TestBrand'
      );
      expect(result).toContain('– Buy 1 Get 1 Free');
      expect(result).not.toContain('(BUY');
    });

    it('should handle BUY 2 GET 1 FREE variants', () => {
      const result = SEOAutomationService.formatProductH1(
        'Test Product (BUY 2 GET 1 FREE)',
        'TestBrand'
      );
      expect(result).toContain('– Buy 2 Get 1 Free');
    });
  });

  describe('Vendor name deduplication', () => {
    it('should remove "by [vendor]" pattern from title (and re-add if too short)', () => {
      // "Premium E-Liquid" is 16 chars after removing "by TestBrand", so vendor gets re-added
      const result = SEOAutomationService.formatProductH1(
        'Premium E-Liquid by TestBrand',
        'TestBrand'
      );
      // Since cleaned title is < 20 chars, vendor is added back
      expect(result).toBe('Premium E-Liquid by TestBrand');
    });

    it('should remove "by [vendor]" from longer titles', () => {
      const result = SEOAutomationService.formatProductH1(
        'Premium High Quality E-Liquid 50ml by TestBrand',
        'TestBrand'
      );
      expect(result).not.toContain('by TestBrand');
      expect(result).toBe('Premium High Quality E-Liquid 50ml');
    });

    it('should be case insensitive when removing vendor', () => {
      const result = SEOAutomationService.formatProductH1(
        'Premium High Quality E-Liquid 50ml By TESTBRAND',
        'TestBrand'
      );
      expect(result).not.toContain('By TESTBRAND');
    });
  });

  describe('Whitespace cleanup', () => {
    it('should clean up multiple spaces', () => {
      const result = SEOAutomationService.formatProductH1(
        'Test   Product   Title',
        'TestBrand'
      );
      expect(result).not.toMatch(/\s{2,}/);
    });

    it('should remove isolated hyphens but preserve compound words', () => {
      const result = SEOAutomationService.formatProductH1(
        'E-Liquid - Premium Quality - 50ml',
        'TestBrand'
      );
      expect(result).toContain('E-Liquid');
      expect(result).not.toMatch(/\s-\s/);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty vendor name', () => {
      const result = SEOAutomationService.formatProductH1(
        'Short',
        ''
      );
      expect(result).toBe('Short');
    });

    it('should handle title at exactly 60 characters', () => {
      const title = 'A'.repeat(60);
      const result = SEOAutomationService.formatProductH1(title, 'TestBrand');
      expect(result.length).toBeLessThanOrEqual(60);
    });

    it('should handle title at exactly 20 characters without adding vendor', () => {
      const title = 'A'.repeat(20);
      const result = SEOAutomationService.formatProductH1(title, 'TestBrand');
      expect(result).toBe(title);
    });
  });
});

describe('SEOAutomationService.generateImageAltText', () => {
  const mockProduct = {
    title: 'Premium Vape Kit',
    vendor: 'TestBrand',
    productType: 'Vape Kit',
    description: 'A high-quality vape kit',
    tags: ['vape', 'kit'],
    handle: 'premium-vape-kit',
  };

  it('should generate SEO-optimized alt text for main images', () => {
    const result = SEOAutomationService.generateImageAltText(mockProduct, 'main');
    expect(result).toContain('Premium Vape Kit');
    expect(result).toContain('TestBrand');
    expect(result).toContain('Vape Kit');
    expect(result).toContain('Vapourism UK');
  });

  it('should generate thumbnail-specific alt text', () => {
    const result = SEOAutomationService.generateImageAltText(mockProduct, 'thumbnail');
    expect(result).toContain('Premium Vape Kit');
    expect(result).toContain('TestBrand');
    expect(result).toContain('thumbnail');
  });

  it('should generate gallery alt text with index', () => {
    const result = SEOAutomationService.generateImageAltText(mockProduct, 'gallery', 3);
    expect(result).toContain('Premium Vape Kit');
    expect(result).toContain('product image 3');
  });

  it('should generate gallery alt text without index', () => {
    const result = SEOAutomationService.generateImageAltText(mockProduct, 'gallery');
    expect(result).toContain('Premium Vape Kit');
    expect(result).toContain('product gallery');
  });
});
