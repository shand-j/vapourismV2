/**
 * Tests for Dynamic Keyword Service
 * The SEO Cheatcode - Testing all dynamic keyword generation functionality
 */

import { describe, it, expect } from 'vitest';
import {
  DynamicKeywordService,
  getProductKeywords,
  getCategoryKeywords,
  getBrandKeywords,
  getSearchKeywords,
  getContentKeywords,
  getIntentKeywords,
  getRelatedKeywords,
  generateKeywordSnippet,
  INTENT_KEYWORD_CLUSTERS,
  LSI_KEYWORD_CLUSTERS,
  PageContext,
} from '../../app/lib/dynamic-keywords';

describe('DynamicKeywordService', () => {
  describe('generateKeywords - Product Page', () => {
    it('should generate comprehensive keywords for product pages', () => {
      const context: PageContext = {
        pageType: 'product',
        primaryEntity: 'Elf Bar 600',
        secondaryEntity: 'Elf Bar',
        tags: ['disposable', 'strawberry'],
        price: { amount: '5.99', currencyCode: 'GBP' },
        searchIntent: 'transactional',
      };

      const result = DynamicKeywordService.generateKeywords(context);

      expect(result.primaryKeywords).toContain('elf bar 600');
      expect(result.primaryKeywords).toContain('elf bar');
      expect(result.primaryKeywords).toContain('vape');
      expect(result.primaryKeywords).toContain('uk');
      expect(result.title).toBeTruthy();
      expect(result.title.length).toBeLessThanOrEqual(70);
      expect(result.metaDescription.length).toBeLessThanOrEqual(155);
      expect(result.h1.length).toBeLessThanOrEqual(60);
    });

    it('should include price-based keywords for budget products', () => {
      const context: PageContext = {
        pageType: 'product',
        primaryEntity: 'Budget Vape',
        secondaryEntity: 'Brand',
        price: { amount: '4.99', currencyCode: 'GBP' },
      };

      const result = DynamicKeywordService.generateKeywords(context);

      expect(result.secondaryKeywords).toContain('cheap');
      expect(result.secondaryKeywords).toContain('affordable');
    });

    it('should include premium keywords for expensive products', () => {
      const context: PageContext = {
        pageType: 'product',
        primaryEntity: 'Premium Mod',
        secondaryEntity: 'Brand',
        price: { amount: '89.99', currencyCode: 'GBP' },
      };

      const result = DynamicKeywordService.generateKeywords(context);

      expect(result.secondaryKeywords).toContain('premium');
      expect(result.secondaryKeywords).toContain('quality');
    });
  });

  describe('generateKeywords - Category Page', () => {
    it('should generate category-specific keywords', () => {
      const context: PageContext = {
        pageType: 'category',
        primaryEntity: 'Disposable Vapes',
        productCount: 150,
        tags: ['Elf Bar', 'Lost Mary'],
        searchIntent: 'commercial',
      };

      const result = DynamicKeywordService.generateKeywords(context);

      expect(result.primaryKeywords).toContain('disposable vapes');
      expect(result.primaryKeywords).toContain('disposable vapes uk');
      expect(result.title).toContain('Disposable Vapes');
      expect(result.title).toContain('150');
    });

    it('should include product count in title when available', () => {
      const context: PageContext = {
        pageType: 'category',
        primaryEntity: 'E-Liquids',
        productCount: 500,
      };

      const result = DynamicKeywordService.generateKeywords(context);

      expect(result.title).toContain('500');
    });
  });

  describe('generateKeywords - Brand Page', () => {
    it('should generate brand-focused keywords', () => {
      const context: PageContext = {
        pageType: 'brand',
        primaryEntity: 'SMOK',
        productCount: 75,
        searchIntent: 'commercial',
      };

      const result = DynamicKeywordService.generateKeywords(context);

      expect(result.primaryKeywords).toContain('smok');
      expect(result.primaryKeywords).toContain('smok vape');
      expect(result.primaryKeywords).toContain('smok uk');
      expect(result.title).toContain('SMOK');
    });
  });

  describe('generateKeywords - Search Page', () => {
    it('should handle search queries with results', () => {
      const context: PageContext = {
        pageType: 'search',
        searchQuery: 'strawberry vape juice',
        productCount: 45,
        searchIntent: 'commercial',
      };

      const result = DynamicKeywordService.generateKeywords(context);

      expect(result.primaryKeywords).toContain('strawberry vape juice');
      expect(result.primaryKeywords).toContain('strawberry vape juice uk');
      expect(result.title).toContain('strawberry vape juice');
    });

    it('should handle empty search queries', () => {
      const context: PageContext = {
        pageType: 'search',
        productCount: 1500,
      };

      const result = DynamicKeywordService.generateKeywords(context);

      expect(result.title).toContain('Browse');
      expect(result.primaryKeywords).toContain('vape shop');
    });
  });

  describe('generateKeywords - Blog/Guide Page', () => {
    it('should generate informational keywords for guides', () => {
      const context: PageContext = {
        pageType: 'guide',
        primaryEntity: 'Vaping for Beginners',
        searchIntent: 'informational',
      };

      const result = DynamicKeywordService.generateKeywords(context);

      expect(result.primaryKeywords).toContain('vaping for beginners');
      expect(result.primaryKeywords).toContain('vaping for beginners guide');
    });

    it('should include educational keywords', () => {
      const context: PageContext = {
        pageType: 'blog',
        primaryEntity: 'Best E-Liquids 2025',
        searchIntent: 'informational',
      };

      const result = DynamicKeywordService.generateKeywords(context);

      expect(result.secondaryKeywords.some(kw => 
        INTENT_KEYWORD_CLUSTERS.informational.questions.includes(kw)
      )).toBe(true);
    });
  });

  describe('Long-tail Keywords', () => {
    it('should generate UK-focused long-tail keywords', () => {
      const context: PageContext = {
        pageType: 'product',
        primaryEntity: 'Elf Bar 600',
        secondaryEntity: 'Elf Bar',
      };

      const result = DynamicKeywordService.generateKeywords(context);

      expect(result.longTailKeywords.some(kw => kw.includes('uk'))).toBe(true);
      expect(result.longTailKeywords.some(kw => kw.includes('buy'))).toBe(true);
    });

    it('should include year in long-tail keywords', () => {
      const context: PageContext = {
        pageType: 'category',
        primaryEntity: 'Disposable Vapes',
      };

      const result = DynamicKeywordService.generateKeywords(context);
      const currentYear = new Date().getFullYear().toString();

      expect(result.longTailKeywords.some(kw => kw.includes(currentYear))).toBe(true);
    });
  });

  describe('LSI Keywords', () => {
    it('should include vaping-related LSI keywords', () => {
      const context: PageContext = {
        pageType: 'product',
        primaryEntity: 'Vape Kit',
      };

      const result = DynamicKeywordService.generateKeywords(context);

      expect(result.lsiKeywords.some(kw => 
        LSI_KEYWORD_CLUSTERS.vaping.includes(kw)
      )).toBe(true);
    });

    it('should include UK-specific LSI keywords', () => {
      const context: PageContext = {
        pageType: 'category',
        primaryEntity: 'E-Liquids',
      };

      const result = DynamicKeywordService.generateKeywords(context);

      expect(result.lsiKeywords.some(kw => 
        LSI_KEYWORD_CLUSTERS.uk_specific.includes(kw)
      )).toBe(true);
    });

    it('should include e-liquid LSI for liquid products', () => {
      const context: PageContext = {
        pageType: 'product',
        primaryEntity: 'Strawberry E-Liquid',
        secondaryEntity: 'E-Liquid',
      };

      const result = DynamicKeywordService.generateKeywords(context);

      expect(result.lsiKeywords.some(kw => 
        LSI_KEYWORD_CLUSTERS.e_liquid.includes(kw)
      )).toBe(true);
    });
  });

  describe('Intent Keywords', () => {
    it('should return transactional keywords for product pages', () => {
      const context: PageContext = {
        pageType: 'product',
        primaryEntity: 'Vape Kit',
        searchIntent: 'transactional',
      };

      const result = DynamicKeywordService.generateKeywords(context);

      expect(result.intentKeywords.length).toBeGreaterThan(0);
      expect(result.intentKeywords.some(kw => 
        INTENT_KEYWORD_CLUSTERS.transactional.modifiers.includes(kw) ||
        INTENT_KEYWORD_CLUSTERS.transactional.urgency.includes(kw)
      )).toBe(true);
    });

    it('should return informational keywords for guides', () => {
      const context: PageContext = {
        pageType: 'guide',
        primaryEntity: 'How to Vape',
        searchIntent: 'informational',
      };

      const result = DynamicKeywordService.generateKeywords(context);

      expect(result.intentKeywords.some(kw => 
        INTENT_KEYWORD_CLUSTERS.informational.questions.includes(kw)
      )).toBe(true);
    });
  });

  describe('Title Generation', () => {
    it('should respect 70 character limit', () => {
      const context: PageContext = {
        pageType: 'product',
        primaryEntity: 'This is an extremely long product name that exceeds normal limits',
        secondaryEntity: 'Brand Name Also Long',
      };

      const result = DynamicKeywordService.generateKeywords(context);

      expect(result.title.length).toBeLessThanOrEqual(70);
    });

    it('should include year for product pages', () => {
      const context: PageContext = {
        pageType: 'product',
        primaryEntity: 'Vape Kit',
        secondaryEntity: 'Brand',
      };

      const result = DynamicKeywordService.generateKeywords(context);
      const currentYear = new Date().getFullYear().toString();

      expect(result.title).toContain(currentYear);
    });
  });

  describe('Meta Description Generation', () => {
    it('should respect 155 character limit', () => {
      const context: PageContext = {
        pageType: 'product',
        primaryEntity: 'This is an extremely long product name that exceeds normal limits',
        secondaryEntity: 'Brand Name Also Very Long Indeed',
        price: { amount: '99.99', currencyCode: 'GBP' },
      };

      const result = DynamicKeywordService.generateKeywords(context);

      expect(result.metaDescription.length).toBeLessThanOrEqual(155);
    });

    it('should include price for product pages when available', () => {
      const context: PageContext = {
        pageType: 'product',
        primaryEntity: 'Vape Kit',
        secondaryEntity: 'Brand',
        price: { amount: '29.99', currencyCode: 'GBP' },
      };

      const result = DynamicKeywordService.generateKeywords(context);

      expect(result.metaDescription).toContain('29.99');
    });

    it('should include trust signals', () => {
      const context: PageContext = {
        pageType: 'product',
        primaryEntity: 'Vape Kit',
        secondaryEntity: 'Brand',
      };

      const result = DynamicKeywordService.generateKeywords(context);

      expect(result.metaDescription).toMatch(/✓|Delivery|Authentic|Prices/);
    });
  });

  describe('H1 Generation', () => {
    it('should respect 60 character limit', () => {
      const context: PageContext = {
        pageType: 'product',
        primaryEntity: 'This is an extremely long product name that exceeds normal character limits significantly',
        secondaryEntity: 'Brand',
      };

      const result = DynamicKeywordService.generateKeywords(context);

      expect(result.h1.length).toBeLessThanOrEqual(60);
    });

    it('should include vendor for product pages when not duplicated', () => {
      const context: PageContext = {
        pageType: 'product',
        primaryEntity: 'Vape Kit',
        secondaryEntity: 'TestBrand',
      };

      const result = DynamicKeywordService.generateKeywords(context);

      expect(result.h1).toContain('TestBrand');
    });

    it('should not duplicate vendor if already in product name', () => {
      const context: PageContext = {
        pageType: 'product',
        primaryEntity: 'TestBrand Vape Kit',
        secondaryEntity: 'TestBrand',
      };

      const result = DynamicKeywordService.generateKeywords(context);

      // Should not have "by TestBrand" since it's already in the name
      const testBrandCount = (result.h1.match(/TestBrand/gi) || []).length;
      expect(testBrandCount).toBeLessThanOrEqual(1);
    });
  });

  describe('Anchor Text Generation', () => {
    it('should generate relevant anchor texts', () => {
      const context: PageContext = {
        pageType: 'product',
        primaryEntity: 'Elf Bar 600',
        secondaryEntity: 'Elf Bar',
      };

      const result = DynamicKeywordService.generateKeywords(context);

      expect(result.suggestedAnchors).toContain('Elf Bar 600');
      expect(result.suggestedAnchors.some(a => a.includes('Shop'))).toBe(true);
    });
  });

  describe('Keyword Density Map', () => {
    it('should assign higher density to primary keywords', () => {
      const context: PageContext = {
        pageType: 'product',
        primaryEntity: 'Vape Kit',
        secondaryEntity: 'Brand',
      };

      const result = DynamicKeywordService.generateKeywords(context);

      // Primary keywords should have 2.5% density
      const primaryDensity = result.keywordDensityMap.get('vape kit');
      if (primaryDensity) {
        expect(primaryDensity).toBeGreaterThan(0.02);
      }
    });
  });
});

describe('Helper Functions', () => {
  describe('getProductKeywords', () => {
    it('should return complete keyword data for products', () => {
      const result = getProductKeywords(
        'Elf Bar 600',
        'Elf Bar',
        'Disposable Vape',
        ['strawberry', 'ice'],
        { amount: '5.99', currencyCode: 'GBP' }
      );

      expect(result.primaryKeywords.length).toBeGreaterThan(0);
      expect(result.title).toBeTruthy();
      expect(result.metaDescription).toBeTruthy();
    });
  });

  describe('getCategoryKeywords', () => {
    it('should return category-optimized keywords', () => {
      const result = getCategoryKeywords('Disposable Vapes', 150, ['Elf Bar', 'Lost Mary']);

      expect(result.primaryKeywords).toContain('disposable vapes');
      expect(result.title).toContain('Disposable Vapes');
    });
  });

  describe('getBrandKeywords', () => {
    it('should return brand-focused keywords', () => {
      const result = getBrandKeywords('SMOK', 75, ['Mod', 'Pod Kit']);

      expect(result.primaryKeywords).toContain('smok');
      expect(result.title).toContain('SMOK');
    });
  });

  describe('getSearchKeywords', () => {
    it('should return search-optimized keywords', () => {
      const result = getSearchKeywords('strawberry vape', 100);

      expect(result.primaryKeywords).toContain('strawberry vape');
    });
  });

  describe('getContentKeywords', () => {
    it('should return content-optimized keywords for blogs', () => {
      const result = getContentKeywords('Best Vapes 2025', 'blog');

      expect(result.primaryKeywords).toContain('best vapes 2025');
    });

    it('should return content-optimized keywords for guides', () => {
      const result = getContentKeywords('Vaping Beginners Guide', 'guide');

      expect(result.primaryKeywords).toContain('vaping beginners guide');
    });
  });

  describe('getIntentKeywords', () => {
    it('should return transactional intent keywords', () => {
      const result = getIntentKeywords('transactional');

      expect(result).toContain('buy');
      expect(result).toContain('shop');
    });

    it('should return informational intent keywords', () => {
      const result = getIntentKeywords('informational');

      expect(result).toContain('how to');
      expect(result).toContain('guide');
    });
  });

  describe('getRelatedKeywords', () => {
    it('should return LSI keywords for e-liquid topics', () => {
      const result = getRelatedKeywords('e-liquid');

      expect(result.length).toBeGreaterThan(0);
      expect(result.some(kw => kw.includes('juice') || kw.includes('shortfill'))).toBe(true);
    });

    it('should return general vaping LSI for unknown topics', () => {
      const result = getRelatedKeywords('random topic');

      expect(result.length).toBeGreaterThan(0);
      expect(result.some(kw => LSI_KEYWORD_CLUSTERS.vaping.includes(kw))).toBe(true);
    });
  });

  describe('generateKeywordSnippet', () => {
    it('should generate a keyword-rich snippet', () => {
      const result = generateKeywordSnippet('Disposable Vapes');

      expect(result).toContain('Disposable Vapes');
      expect(result).toContain('Vapourism UK');
    });

    it('should respect max length', () => {
      const result = generateKeywordSnippet('Very Long Topic Name That Could Exceed Limits', 'commercial', 80);

      expect(result.length).toBeLessThanOrEqual(80);
    });
  });
});

describe('Search Intent Inference', () => {
  it('should infer transactional intent for product pages', () => {
    const context: PageContext = { pageType: 'product' };
    const result = DynamicKeywordService.generateKeywords(context);
    
    // Should have transactional keywords
    expect(result.intentKeywords.some(kw => 
      ['buy', 'shop', 'order', 'today', 'now'].includes(kw)
    )).toBe(true);
  });

  it('should infer commercial intent for category pages', () => {
    const context: PageContext = { pageType: 'category', primaryEntity: 'Vapes' };
    const result = DynamicKeywordService.generateKeywords(context);
    
    // Should have commercial keywords
    expect(result.intentKeywords.some(kw => 
      ['best', 'top', 'quality', 'premium'].includes(kw)
    )).toBe(true);
  });

  it('should infer informational intent for guide pages', () => {
    const context: PageContext = { pageType: 'guide', primaryEntity: 'Vaping Guide' };
    const result = DynamicKeywordService.generateKeywords(context);
    
    // Should have informational keywords
    expect(result.intentKeywords.some(kw => 
      ['how to', 'guide', 'tips', 'beginners'].includes(kw)
    )).toBe(true);
  });
});

describe('Geo Keywords', () => {
  it('should always include UK geo keywords', () => {
    const context: PageContext = { pageType: 'product', primaryEntity: 'Vape' };
    const result = DynamicKeywordService.generateKeywords(context);

    expect(result.geoKeywords).toContain('uk');
    expect(result.geoKeywords).toContain('united kingdom');
  });
});
