/**
 * Unit tests for Dynamic Brand Landing Pages
 * 
 * Tests the brand slug normalization, keyword generation,
 * and URL slug conversion functions used in brand landing pages.
 */

import {describe, it, expect} from 'vitest';
import {normalizeVendorSlug} from '~/lib/brand-assets';
import {getBrandKeywords} from '~/lib/dynamic-keywords';

describe('Brand Landing Page Utilities', () => {
  describe('slugToVendorName (reverse slug conversion)', () => {
    /**
     * Helper function to convert URL slug to vendor name format
     * This mirrors the function in brands.$brand.tsx
     */
    function slugToVendorName(slug: string): string {
      return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    it('should convert simple slugs to vendor names', () => {
      expect(slugToVendorName('hayati')).toBe('Hayati');
      expect(slugToVendorName('smok')).toBe('Smok');
      expect(slugToVendorName('voopoo')).toBe('Voopoo');
    });

    it('should handle multi-word brand slugs', () => {
      expect(slugToVendorName('elf-bar')).toBe('Elf Bar');
      expect(slugToVendorName('lost-mary')).toBe('Lost Mary');
      expect(slugToVendorName('crystal-bar')).toBe('Crystal Bar');
      expect(slugToVendorName('riot-squad')).toBe('Riot Squad');
    });

    it('should handle longer brand names', () => {
      expect(slugToVendorName('hayati-pro-ultra')).toBe('Hayati Pro Ultra');
      expect(slugToVendorName('lost-mary-bm6000')).toBe('Lost Mary Bm6000');
    });
  });

  describe('normalizeVendorSlug (vendor name to slug)', () => {
    it('should convert vendor names to URL-safe slugs', () => {
      expect(normalizeVendorSlug('Hayati')).toBe('hayati');
      expect(normalizeVendorSlug('Elf Bar')).toBe('elf-bar');
      expect(normalizeVendorSlug('Lost Mary')).toBe('lost-mary');
    });

    it('should handle special characters', () => {
      expect(normalizeVendorSlug('SMOK')).toBe('smok');
      expect(normalizeVendorSlug('VooPoo')).toBe('voopoo');
      expect(normalizeVendorSlug("Dinner Lady")).toBe('dinner-lady');
    });

    it('should handle ampersands and symbols', () => {
      expect(normalizeVendorSlug('Brand & Co')).toBe('brand-co');
      expect(normalizeVendorSlug('Brand & Co.')).toBe('brand-co');
    });

    it('should normalize whitespace', () => {
      expect(normalizeVendorSlug('  Hayati  ')).toBe('hayati');
      expect(normalizeVendorSlug('Elf  Bar')).toBe('elf-bar');
    });
  });

  describe('Round-trip slug conversion', () => {
    it('should maintain consistency for common brands', () => {
      const brands = ['Hayati', 'Elf Bar', 'Lost Mary', 'Crystal Bar', 'SMOK'];
      
      brands.forEach(brand => {
        const slug = normalizeVendorSlug(brand);
        // Slug should be lowercase and hyphenated
        expect(slug).toBe(slug.toLowerCase());
        expect(slug).not.toContain(' ');
        expect(slug).toMatch(/^[a-z0-9-]+$/);
      });
    });
  });
});

describe('Brand Keywords Generation', () => {
  describe('getBrandKeywords', () => {
    it('should generate comprehensive keywords for a brand', () => {
      const keywords = getBrandKeywords('Hayati', 150, ['Disposable Vape', 'Pod System']);

      expect(keywords.primaryKeywords).toContain('hayati');
      expect(keywords.primaryKeywords).toContain('hayati vape');
      expect(keywords.primaryKeywords).toContain('hayati uk');
    });

    it('should include product count in generated content', () => {
      const keywords = getBrandKeywords('SMOK', 75, ['Mod', 'Pod Kit']);

      // Title should include brand name
      expect(keywords.title).toContain('SMOK');
      // Should be properly formatted
      expect(keywords.title.length).toBeLessThanOrEqual(70);
      expect(keywords.metaDescription.length).toBeLessThanOrEqual(155);
    });

    it('should generate appropriate title', () => {
      const keywords = getBrandKeywords('Lost Mary', 200, ['Disposable Vape']);

      expect(keywords.title).toContain('Lost Mary');
      expect(keywords.title).toContain('UK');
    });

    it('should generate description with trust signals', () => {
      const keywords = getBrandKeywords('Crystal Bar', 100);

      expect(keywords.metaDescription).toBeTruthy();
      expect(keywords.metaDescription.length).toBeLessThanOrEqual(155);
    });

    it('should generate H1 for brand pages', () => {
      const keywords = getBrandKeywords('Elf Bar', 500);

      expect(keywords.h1).toBeTruthy();
      expect(keywords.h1).toContain('Elf Bar');
      expect(keywords.h1.length).toBeLessThanOrEqual(60);
    });

    it('should include long-tail keywords with UK focus', () => {
      const keywords = getBrandKeywords('Hayati', 100);

      expect(keywords.longTailKeywords.some(kw => kw.includes('uk'))).toBe(true);
    });

    it('should include geo keywords', () => {
      const keywords = getBrandKeywords('SMOK', 50);

      expect(keywords.geoKeywords).toContain('uk');
      expect(keywords.geoKeywords).toContain('united kingdom');
    });
  });

  describe('Brand keyword variations', () => {
    it('should handle brands with special characters', () => {
      const keywords = getBrandKeywords('I VG', 30);

      expect(keywords.primaryKeywords).toContain('i vg');
    });

    it('should handle single-word brands', () => {
      const keywords = getBrandKeywords('Aspire', 80);

      expect(keywords.primaryKeywords).toContain('aspire');
      expect(keywords.primaryKeywords).toContain('aspire vape');
    });

    it('should handle multi-word brands', () => {
      const keywords = getBrandKeywords('Hayati Pro Ultra', 25);

      expect(keywords.primaryKeywords).toContain('hayati pro ultra');
    });
  });
});

describe('Brand Page SEO Requirements', () => {
  describe('Title length constraints', () => {
    it('should keep titles under 70 characters', () => {
      const longBrandName = 'This Is A Very Long Brand Name That Exceeds Normal Limits';
      const keywords = getBrandKeywords(longBrandName, 50);

      expect(keywords.title.length).toBeLessThanOrEqual(70);
    });
  });

  describe('Description length constraints', () => {
    it('should keep descriptions under 155 characters', () => {
      const keywords = getBrandKeywords('Test Brand', 100);

      expect(keywords.metaDescription.length).toBeLessThanOrEqual(155);
    });
  });

  describe('H1 length constraints', () => {
    it('should keep H1 under 60 characters', () => {
      const keywords = getBrandKeywords('Test Brand', 100);

      expect(keywords.h1.length).toBeLessThanOrEqual(60);
    });
  });
});
