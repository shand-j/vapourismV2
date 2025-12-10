/**
 * Unit tests for brand assets utilities
 */
import {describe, it, expect} from 'vitest';
import {
  normalizeVendorSlug,
  generateImageSrcSet,
  getFallbackBrandAssets,
  validateBrandAssets,
  hasBrandAssetType,
  getBrandPrimaryColor,
  formatSocialMediaUrl,
  type BrandAssets,
} from '~/lib/brand-assets';

describe('brand-assets utilities', () => {
  describe('normalizeVendorSlug', () => {
    it('should convert vendor names to slugs', () => {
      expect(normalizeVendorSlug('I VG')).toBe('i-vg');
      expect(normalizeVendorSlug('Vapes Bars')).toBe('vapes-bars');
      expect(normalizeVendorSlug('SMOK Tech')).toBe('smok-tech');
    });

    it('should handle special characters', () => {
      expect(normalizeVendorSlug('Brand & Co.')).toBe('brand-co');
      expect(normalizeVendorSlug('E-Liquid Company')).toBe('e-liquid-company');
    });

    it('should remove multiple consecutive hyphens', () => {
      expect(normalizeVendorSlug('Brand  &  Co')).toBe('brand-co');
    });

    it('should trim leading/trailing hyphens', () => {
      expect(normalizeVendorSlug(' Brand ')).toBe('brand');
    });
  });

  describe('generateImageSrcSet', () => {
    it('should generate srcset for unoptimized images', () => {
      const srcset = generateImageSrcSet('/media_packs/i-vg/lifestyle/img.jpg');

      expect(srcset).toContain('300w');
      expect(srcset).toContain('600w');
      expect(srcset).toContain('1200w');
      expect(srcset).toContain('.webp');
    });

    it('should use optimized images as-is', () => {
      const url = '/media_packs/i-vg/lifestyle/img-600w.webp';
      const srcset = generateImageSrcSet(url);

      expect(srcset).toBe(url);
    });

    it('should handle custom widths', () => {
      const srcset = generateImageSrcSet('/img.jpg', [400, 800]);

      expect(srcset).toContain('400w');
      expect(srcset).toContain('800w');
      expect(srcset).not.toContain('300w');
    });
  });

  describe('getFallbackBrandAssets', () => {
    it('should return valid fallback structure', () => {
      const fallback = getFallbackBrandAssets();

      expect(fallback.hasMediaPack).toBe(false);
      expect(fallback.logos).toEqual({});
      expect(fallback.lifestyle).toEqual([]);
      expect(fallback.products).toEqual({});
    });
  });

  describe('validateBrandAssets', () => {
    it('should validate complete brand assets', () => {
      const validAssets: BrandAssets = {
        displayName: 'Test Brand',
        vendor: 'Test',
        shopifyVendor: 'Test',
        slug: 'test',
        hasMediaPack: true,
        logos: {
          primary: '/logo.png',
        },
        lifestyle: [
          {
            url: '/img.jpg',
            alt: 'Test image',
          },
        ],
        products: {},
      };

      const result = validateBrandAssets(validAssets);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should detect missing required fields', () => {
      const invalidAssets = {
        vendor: 'Test',
        hasMediaPack: true,
        logos: {},
        lifestyle: [],
        products: {},
      };

      const result = validateBrandAssets(invalidAssets);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing displayName');
      expect(result.errors).toContain('Missing slug');
    });

    it('should validate lifestyle images', () => {
      const invalidAssets = {
        displayName: 'Test',
        vendor: 'Test',
        slug: 'test',
        hasMediaPack: true,
        logos: {},
        lifestyle: [
          {url: '/img.jpg'}, // Missing alt
        ],
        products: {},
      };

      const result = validateBrandAssets(invalidAssets);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Lifestyle image 0: missing alt text');
    });
  });

  describe('hasBrandAssetType', () => {
    const mockAssets: BrandAssets = {
      displayName: 'Test',
      vendor: 'Test',
      shopifyVendor: 'Test',
      slug: 'test',
      hasMediaPack: true,
      logos: {
        primary: '/logo.png',
      },
      lifestyle: [
        {
          url: '/img.jpg',
          alt: 'Test',
        },
      ],
      products: {
        'test-product': '/product.png',
      },
      guidelines: '/guidelines.pdf',
    };

    it('should detect logo assets', () => {
      expect(hasBrandAssetType(mockAssets, 'logo')).toBe(true);
    });

    it('should detect lifestyle assets', () => {
      expect(hasBrandAssetType(mockAssets, 'lifestyle')).toBe(true);
    });

    it('should detect product assets', () => {
      expect(hasBrandAssetType(mockAssets, 'products')).toBe(true);
    });

    it('should detect guidelines', () => {
      expect(hasBrandAssetType(mockAssets, 'guidelines')).toBe(true);
    });

    it('should return false for missing assets', () => {
      const emptyAssets = getFallbackBrandAssets();

      expect(hasBrandAssetType(emptyAssets, 'logo')).toBe(false);
      expect(hasBrandAssetType(emptyAssets, 'lifestyle')).toBe(false);
    });

    it('should return false for null assets', () => {
      expect(hasBrandAssetType(null, 'logo')).toBe(false);
    });
  });

  describe('getBrandPrimaryColor', () => {
    it('should return brand primary color', () => {
      const assets: BrandAssets = {
        displayName: 'Test',
        vendor: 'Test',
        shopifyVendor: 'Test',
        slug: 'test',
        hasMediaPack: true,
        logos: {},
        lifestyle: [],
        products: {},
        brandColors: {
          primary: '#FF0000',
          secondary: '#00FF00',
        },
      };

      expect(getBrandPrimaryColor(assets)).toBe('#FF0000');
    });

    it('should use fallback for missing colors', () => {
      const assets = getFallbackBrandAssets();

      expect(getBrandPrimaryColor(assets)).toBe('#000000');
    });

    it('should use custom fallback', () => {
      expect(getBrandPrimaryColor(null, '#FFFFFF')).toBe('#FFFFFF');
    });
  });

  describe('formatSocialMediaUrl', () => {
    it('should format Instagram URLs', () => {
      expect(formatSocialMediaUrl('instagram', '@testbrand')).toBe(
        'https://instagram.com/testbrand'
      );
      expect(formatSocialMediaUrl('instagram', 'testbrand')).toBe(
        'https://instagram.com/testbrand'
      );
    });

    it('should format Facebook URLs', () => {
      expect(formatSocialMediaUrl('facebook', 'testbrand')).toBe(
        'https://facebook.com/testbrand'
      );
    });

    it('should format Twitter URLs', () => {
      expect(formatSocialMediaUrl('twitter', '@testbrand')).toBe(
        'https://twitter.com/testbrand'
      );
    });
  });
});
