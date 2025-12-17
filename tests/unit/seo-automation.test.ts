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
