/**
 * Unit tests for KeywordOptimizer
 */

import { describe, it, expect } from 'vitest';
import { 
  KeywordOptimizer, 
  VAPING_KEYWORDS,
  generateKeywordVariations 
} from '../../app/lib/keyword-optimizer';

describe('KeywordOptimizer', () => {
  describe('optimizeProductTitle', () => {
    it('should generate optimized product title with brand and UK modifier', () => {
      const title = KeywordOptimizer.optimizeProductTitle(
        'ELF BAR 600 Strawberry Ice',
        'Elf Bar',
        'Disposable Vape',
        ['disposable', '600_puff', 'strawberry']
      );
      
      expect(title).toContain('ELF BAR 600 Strawberry Ice');
      expect(title).toContain('UK');
      expect(title).toContain('Vapourism');
    });

    it('should not duplicate keywords already in title', () => {
      const title = KeywordOptimizer.optimizeProductTitle(
        'UK Elf Bar Disposable Vape',
        'Elf Bar',
        'Disposable Vape',
        []
      );
      
      // Should not add duplicate "UK", "Elf Bar", or "Disposable Vape"
      const ukCount = (title.match(/UK/gi) || []).length;
      expect(ukCount).toBe(1);
    });
  });

  describe('optimizeMetaDescription', () => {
    it('should generate keyword-rich meta description under 155 chars', () => {
      const description = KeywordOptimizer.optimizeMetaDescription({
        title: 'Elf Bar 600',
        vendor: 'Elf Bar',
        productType: 'Disposable Vape',
        price: { amount: '5.99' },
        tags: ['disposable', '600_puff']
      });
      
      expect(description.length).toBeLessThanOrEqual(155);
      expect(description).toContain('Shop');
      expect(description).toContain('Elf Bar 600');
      expect(description).toContain('£5.99');
      expect(description).toContain('UK');
      expect(description).toContain('✓');
    });

    it('should handle products without price', () => {
      const description = KeywordOptimizer.optimizeMetaDescription({
        title: 'Vape Coil Pack',
        vendor: 'SMOK',
        productType: 'Coils',
        tags: ['coil', 'replacement']
      });
      
      expect(description).toBeTruthy();
      expect(description).toContain('SMOK');
      expect(description).not.toContain('£undefined');
    });
  });

  describe('generateCategoryKeywords', () => {
    it('should generate primary, secondary, and long-tail keywords', () => {
      const keywords = KeywordOptimizer.generateCategoryKeywords(
        'disposable_vape',
        150,
        ['Elf Bar', 'Lost Mary', 'Geek Bar']
      );
      
      expect(keywords.primary).toContain('disposable vape');
      expect(keywords.primary).toContain('disposable vape uk');
      expect(keywords.primary).toContain('buy disposable vape');
      
      expect(keywords.secondary.length).toBeGreaterThan(0);
      expect(keywords.secondary[0]).toContain('elf bar');
      
      expect(keywords.longTail.length).toBeGreaterThan(0);
    });

    it('should work without brand data', () => {
      const keywords = KeywordOptimizer.generateCategoryKeywords('e_liquid');
      
      expect(keywords.primary).toContain('e liquid');
      expect(keywords.primary.length).toBeGreaterThan(0);
      expect(keywords.longTail.length).toBeGreaterThan(0);
    });
  });

  describe('extractKeywordsFromContent', () => {
    it('should extract nicotine strength from description', () => {
      const keywords = KeywordOptimizer.extractKeywordsFromContent(
        'This e-liquid contains 3mg nicotine and comes in 10ml bottles',
        ['e-liquid', 'nic_salt'],
        'E-Liquid'
      );
      
      expect(keywords).toContain('3mg');
      expect(keywords).toContain('10ml');
    });

    it('should extract VG/PG ratios', () => {
      const keywords = KeywordOptimizer.extractKeywordsFromContent(
        'High VG e-liquid with 70/30 VG/PG ratio',
        [],
        'E-Liquid'
      );
      
      expect(keywords).toContain('70/30');
    });

    it('should extract device types', () => {
      const keywords = KeywordOptimizer.extractKeywordsFromContent(
        'Compatible with all pod systems and MTL devices',
        ['pod', 'mtl'],
        'Pod System'
      );
      
      expect(keywords).toContain('pod');
      expect(keywords).toContain('mtl');
    });
  });

  describe('generateProductSchema', () => {
    it('should generate valid schema.org Product markup', () => {
      const schema = KeywordOptimizer.generateProductSchema({
        title: 'Elf Bar 600',
        vendor: 'Elf Bar',
        productType: 'Disposable Vape',
        description: 'Premium disposable vape',
        price: { amount: '5.99', currencyCode: 'GBP' },
        image: 'https://example.com/image.jpg',
        url: '/products/elf-bar-600',
        sku: 'EB600',
        availability: true
      });
      
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Product');
      expect(schema.name).toBe('Elf Bar 600');
      expect(schema.brand['@type']).toBe('Brand');
      expect(schema.brand.name).toBe('Elf Bar');
      expect(schema.offers.price).toBe('5.99');
      expect(schema.offers.priceCurrency).toBe('GBP');
      expect(schema.offers.availability).toBe('https://schema.org/InStock');
    });

    it('should handle out of stock products', () => {
      const schema = KeywordOptimizer.generateProductSchema({
        title: 'Test Product',
        vendor: 'Test',
        productType: 'Test',
        description: 'Test',
        price: { amount: '10.00', currencyCode: 'GBP' },
        url: '/test',
        availability: false
      });
      
      expect(schema.offers.availability).toBe('https://schema.org/OutOfStock');
    });
  });

  describe('analyzeCompetitorKeywords', () => {
    it('should analyze keyword data and return summary', () => {
      const keywords = [
        { keyword: 'vape', searchVolume: 10000, difficulty: 70, position: 5, intent: 'commercial' as const, category: 'General' },
        { keyword: 'buy vape', searchVolume: 5000, difficulty: 50, position: 3, intent: 'transactional' as const, category: 'General' },
        { keyword: 'how to vape', searchVolume: 2000, difficulty: 30, position: 8, intent: 'informational' as const, category: 'General' },
      ];
      
      const analysis = KeywordOptimizer.analyzeCompetitorKeywords(keywords);
      
      expect(analysis.totalKeywords).toBe(3);
      expect(analysis.topPerformers.length).toBe(3);
      expect(analysis.categoryBreakdown['General']).toBe(3);
      expect(analysis.intentDistribution.commercial).toBe(1);
      expect(analysis.intentDistribution.transactional).toBe(1);
      expect(analysis.intentDistribution.informational).toBe(1);
    });

    it('should identify top performers (position <= 10)', () => {
      const keywords = [
        { keyword: 'top keyword', searchVolume: 1000, position: 2, intent: 'commercial' as const },
        { keyword: 'not top', searchVolume: 1000, position: 15, intent: 'commercial' as const },
      ];
      
      const analysis = KeywordOptimizer.analyzeCompetitorKeywords(keywords);
      
      expect(analysis.topPerformers.length).toBe(1);
      expect(analysis.topPerformers[0].keyword).toBe('top keyword');
    });
  });

  describe('generateContentSuggestions', () => {
    it('should identify keyword gaps', () => {
      const competitorKeywords = [
        { keyword: 'new vape product', searchVolume: 5000, difficulty: 40, position: 5, intent: 'commercial' as const },
        { keyword: 'how to clean vape', searchVolume: 2000, difficulty: 30, position: 3, intent: 'informational' as const },
      ];
      
      const currentKeywords = ['vape', 'e-liquid'];
      
      const suggestions = KeywordOptimizer.generateContentSuggestions(
        competitorKeywords,
        currentKeywords
      );
      
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions[0]).toHaveProperty('keyword');
      expect(suggestions[0]).toHaveProperty('opportunity');
      expect(suggestions[0]).toHaveProperty('contentType');
      expect(suggestions[0]).toHaveProperty('suggestion');
    });
  });
});

describe('VAPING_KEYWORDS', () => {
  it('should contain primary vaping keywords', () => {
    expect(VAPING_KEYWORDS.primary).toContain('vape');
    expect(VAPING_KEYWORDS.primary).toContain('e-liquid');
    expect(VAPING_KEYWORDS.primary).toContain('disposable vape');
  });

  it('should contain UK geo-modifiers', () => {
    expect(VAPING_KEYWORDS.geoModifiers).toContain('uk');
    expect(VAPING_KEYWORDS.geoModifiers).toContain('united kingdom');
    expect(VAPING_KEYWORDS.geoModifiers).toContain('london');
  });

  it('should contain product types', () => {
    expect(VAPING_KEYWORDS.productTypes).toContain('disposable vape');
    expect(VAPING_KEYWORDS.productTypes).toContain('pod kit');
    expect(VAPING_KEYWORDS.productTypes).toContain('e-liquid');
  });

  it('should contain popular brands', () => {
    expect(VAPING_KEYWORDS.brands).toContain('elf bar');
    expect(VAPING_KEYWORDS.brands).toContain('lost mary');
    expect(VAPING_KEYWORDS.brands).toContain('geek bar');
  });
});

describe('generateKeywordVariations', () => {
  it('should generate UK variations', () => {
    const variations = generateKeywordVariations('disposable vape');
    
    expect(variations).toContain('disposable vape');
    expect(variations).toContain('disposable vape uk');
    expect(variations).toContain('uk disposable vape');
  });

  it('should generate transactional variations', () => {
    const variations = generateKeywordVariations('vape pen');
    
    expect(variations).toContain('buy vape pen');
    expect(variations).toContain('shop vape pen');
    expect(variations).toContain('best vape pen');
    expect(variations).toContain('cheap vape pen');
  });

  it('should include current year for freshness', () => {
    const currentYear = new Date().getFullYear();
    const variations = generateKeywordVariations('pod kit');
    
    expect(variations).toContain(`pod kit ${currentYear}`);
  });
});
