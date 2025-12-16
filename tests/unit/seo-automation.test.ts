/**
 * Unit tests for SEOAutomationService
 */

import { describe, it, expect } from 'vitest';
import { SEOAutomationService } from '../../app/preserved/seo-automation';

describe('SEOAutomationService', () => {
  describe('generateProductTitle', () => {
    it('should return custom title override for specific product handles', () => {
      const title = SEOAutomationService.generateProductTitle(
        'Realest CBD 4000mg CBG Isolate (BUY 1 GET 1 FREE)',
        'Realest',
        null,
        'realest-cbd-4000mg-cbg-isolate-buy-1-get-1-free'
      );
      
      expect(title).toBe('Realest CBD 4000mg CBG Isolate: BOGO at Vapourism');
    });

    it('should use Shopify SEO title when no custom override exists', () => {
      const title = SEOAutomationService.generateProductTitle(
        'Some Product',
        'Some Brand',
        'Custom Shopify SEO Title',
        'some-product'
      );
      
      expect(title).toBe('Custom Shopify SEO Title');
    });

    it('should generate default title when no override or SEO title exists', () => {
      const title = SEOAutomationService.generateProductTitle(
        'Short Product',
        'Brand',
        null,
        'unknown-handle'
      );
      
      expect(title).toContain('Short Product');
      expect(title).toContain('Vapourism');
    });

    it('should handle null handle gracefully', () => {
      const title = SEOAutomationService.generateProductTitle(
        'Test Product',
        'Test Brand',
        null,
        null
      );
      
      expect(title).toContain('Test Product');
      expect(title).toContain('Vapourism');
    });

    it('should return custom title for CBD Asylum product', () => {
      const title = SEOAutomationService.generateProductTitle(
        'CBD Asylum Infuse 10000mg CBD Cola Oil - 30ml (BUY 1 GET…',
        'CBD Asylum',
        null,
        'cbd-asylum-infuse-10000mg-cbd-cola-oil-30ml-buy-1-get-2-free'
      );
      
      expect(title).toBe('CBD Asylum Cola Oil 10000mg: Buy 1 Get 2 Free at Vapourism');
    });

    it('should return custom title for Just Nic It product', () => {
      const title = SEOAutomationService.generateProductTitle(
        '20mg Just Nic It Nic Salt 10ml (50VG/50PG)',
        'Just Nic It',
        null,
        '20mg-just-nic-it-nic-salt-10ml-50vg-50pg'
      );
      
      expect(title).toBe('20mg Just Nic It Nic Salt 10ml: Fast Delivery at Vapourism');
    });

    it('should truncate long custom titles to 70 characters', () => {
      const title = SEOAutomationService.generateProductTitle(
        'Some Long Product Title',
        'Some Brand',
        'This is a very long SEO title that exceeds seventy characters and should be truncated appropriately',
        'some-handle'
      );
      
      expect(title.length).toBeLessThanOrEqual(70);
    });
  });
});
