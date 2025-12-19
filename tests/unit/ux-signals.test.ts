/**
 * Tests for UX Signals Library
 * Tests Core Web Vitals tracking, engagement metrics, and SEO utilities
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  CORE_WEB_VITALS_THRESHOLDS,
  ENGAGEMENT_THRESHOLDS,
  rateCoreWebVital,
  getDeviceType,
  isUserEngaged,
  getCoreWebVitalsSummary,
  hasGoodCoreWebVitals,
  generateWebPageSchema,
  generateSpeakableSchema,
  SCROLL_MILESTONES,
} from '../../app/lib/ux-signals';

describe('UX Signals - Constants', () => {
  it('should have correct Core Web Vitals thresholds per Google standards', () => {
    // LCP thresholds
    expect(CORE_WEB_VITALS_THRESHOLDS.lcp.good).toBe(2500);
    expect(CORE_WEB_VITALS_THRESHOLDS.lcp.needsImprovement).toBe(4000);
    
    // INP thresholds
    expect(CORE_WEB_VITALS_THRESHOLDS.inp.good).toBe(200);
    expect(CORE_WEB_VITALS_THRESHOLDS.inp.needsImprovement).toBe(500);
    
    // CLS thresholds
    expect(CORE_WEB_VITALS_THRESHOLDS.cls.good).toBe(0.1);
    expect(CORE_WEB_VITALS_THRESHOLDS.cls.needsImprovement).toBe(0.25);
  });

  it('should have reasonable engagement thresholds', () => {
    expect(ENGAGEMENT_THRESHOLDS.minEngagedScrollDepth).toBe(25);
    expect(ENGAGEMENT_THRESHOLDS.minEngagedTimeOnPage).toBe(30);
    expect(ENGAGEMENT_THRESHOLDS.contentEndScrollDepth).toBe(90);
    expect(ENGAGEMENT_THRESHOLDS.belowFoldThreshold).toBe(15);
  });

  it('should define standard scroll milestones', () => {
    expect(SCROLL_MILESTONES).toEqual([25, 50, 75, 90, 100]);
  });
});

describe('UX Signals - rateCoreWebVital', () => {
  describe('LCP rating', () => {
    it('should rate LCP as good when <= 2500ms', () => {
      expect(rateCoreWebVital('lcp', 2000)).toEqual({
        metric: 'lcp',
        value: 2000,
        rating: 'good',
      });
      
      expect(rateCoreWebVital('lcp', 2500)).toEqual({
        metric: 'lcp',
        value: 2500,
        rating: 'good',
      });
    });

    it('should rate LCP as needs-improvement when between 2500-4000ms', () => {
      expect(rateCoreWebVital('lcp', 3000)).toEqual({
        metric: 'lcp',
        value: 3000,
        rating: 'needs-improvement',
      });
      
      expect(rateCoreWebVital('lcp', 4000)).toEqual({
        metric: 'lcp',
        value: 4000,
        rating: 'needs-improvement',
      });
    });

    it('should rate LCP as poor when > 4000ms', () => {
      expect(rateCoreWebVital('lcp', 5000)).toEqual({
        metric: 'lcp',
        value: 5000,
        rating: 'poor',
      });
    });
  });

  describe('INP rating', () => {
    it('should rate INP as good when <= 200ms', () => {
      expect(rateCoreWebVital('inp', 100)).toEqual({
        metric: 'inp',
        value: 100,
        rating: 'good',
      });
      
      expect(rateCoreWebVital('inp', 200)).toEqual({
        metric: 'inp',
        value: 200,
        rating: 'good',
      });
    });

    it('should rate INP as needs-improvement when between 200-500ms', () => {
      expect(rateCoreWebVital('inp', 300)).toEqual({
        metric: 'inp',
        value: 300,
        rating: 'needs-improvement',
      });
    });

    it('should rate INP as poor when > 500ms', () => {
      expect(rateCoreWebVital('inp', 600)).toEqual({
        metric: 'inp',
        value: 600,
        rating: 'poor',
      });
    });
  });

  describe('CLS rating', () => {
    it('should rate CLS as good when <= 0.1', () => {
      expect(rateCoreWebVital('cls', 0.05)).toEqual({
        metric: 'cls',
        value: 0.05,
        rating: 'good',
      });
      
      expect(rateCoreWebVital('cls', 0.1)).toEqual({
        metric: 'cls',
        value: 0.1,
        rating: 'good',
      });
    });

    it('should rate CLS as needs-improvement when between 0.1-0.25', () => {
      expect(rateCoreWebVital('cls', 0.15)).toEqual({
        metric: 'cls',
        value: 0.15,
        rating: 'needs-improvement',
      });
    });

    it('should rate CLS as poor when > 0.25', () => {
      expect(rateCoreWebVital('cls', 0.3)).toEqual({
        metric: 'cls',
        value: 0.3,
        rating: 'poor',
      });
    });
  });
});

describe('UX Signals - getDeviceType', () => {
  const originalWindow = global.window;

  beforeEach(() => {
    // Reset window mock
    vi.stubGlobal('window', {
      innerWidth: 1024,
    });
  });

  afterEach(() => {
    vi.stubGlobal('window', originalWindow);
  });

  it('should return mobile for width < 768', () => {
    vi.stubGlobal('window', { innerWidth: 375 });
    expect(getDeviceType()).toBe('mobile');
    
    vi.stubGlobal('window', { innerWidth: 767 });
    expect(getDeviceType()).toBe('mobile');
  });

  it('should return tablet for width >= 768 and < 1024', () => {
    vi.stubGlobal('window', { innerWidth: 768 });
    expect(getDeviceType()).toBe('tablet');
    
    vi.stubGlobal('window', { innerWidth: 1023 });
    expect(getDeviceType()).toBe('tablet');
  });

  it('should return desktop for width >= 1024', () => {
    vi.stubGlobal('window', { innerWidth: 1024 });
    expect(getDeviceType()).toBe('desktop');
    
    vi.stubGlobal('window', { innerWidth: 1920 });
    expect(getDeviceType()).toBe('desktop');
  });
});

describe('UX Signals - generateWebPageSchema', () => {
  it('should generate basic WebPage schema', () => {
    const schema = generateWebPageSchema({
      name: 'Test Page',
      description: 'A test page description',
      url: 'https://www.vapourism.co.uk/test',
    });

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('WebPage');
    expect(schema.name).toBe('Test Page');
    expect(schema.description).toBe('A test page description');
    expect(schema.url).toBe('https://www.vapourism.co.uk/test');
    expect(schema.inLanguage).toBe('en-GB');
  });

  it('should include isPartOf with Vapourism WebSite', () => {
    const schema = generateWebPageSchema({
      name: 'Test',
      description: 'Test',
      url: 'https://www.vapourism.co.uk/test',
    });

    expect(schema.isPartOf).toEqual({
      '@type': 'WebSite',
      name: 'Vapourism',
      url: 'https://www.vapourism.co.uk',
    });
  });

  it('should include speakable specification for voice search', () => {
    const schema = generateWebPageSchema({
      name: 'Test',
      description: 'Test',
      url: 'https://www.vapourism.co.uk/test',
    });

    expect(schema.speakable).toBeDefined();
    expect((schema.speakable as Record<string, unknown>)['@type']).toBe('SpeakableSpecification');
    expect((schema.speakable as Record<string, unknown>).cssSelector).toContain('h1');
  });

  it('should include dates when provided', () => {
    const schema = generateWebPageSchema({
      name: 'Test',
      description: 'Test',
      url: 'https://www.vapourism.co.uk/test',
      datePublished: '2024-01-01',
      dateModified: '2024-12-01',
    });

    expect(schema.datePublished).toBe('2024-01-01');
    expect(schema.dateModified).toBe('2024-12-01');
  });

  it('should include author when provided', () => {
    const schema = generateWebPageSchema({
      name: 'Test',
      description: 'Test',
      url: 'https://www.vapourism.co.uk/test',
      author: 'Vapourism Team',
    });

    expect(schema.author).toEqual({
      '@type': 'Organization',
      name: 'Vapourism Team',
    });
  });

  it('should include breadcrumb when provided', () => {
    const schema = generateWebPageSchema({
      name: 'Test Product',
      description: 'Test',
      url: 'https://www.vapourism.co.uk/products/test',
      breadcrumb: [
        { name: 'Home', url: 'https://www.vapourism.co.uk' },
        { name: 'Products', url: 'https://www.vapourism.co.uk/search' },
        { name: 'Test Product', url: 'https://www.vapourism.co.uk/products/test' },
      ],
    });

    expect(schema.breadcrumb).toBeDefined();
    const breadcrumb = schema.breadcrumb as Record<string, unknown>;
    expect(breadcrumb['@type']).toBe('BreadcrumbList');
    expect(breadcrumb.itemListElement).toHaveLength(3);
    
    const items = breadcrumb.itemListElement as Array<Record<string, unknown>>;
    expect(items[0].position).toBe(1);
    expect(items[0].name).toBe('Home');
    expect(items[2].position).toBe(3);
    expect(items[2].name).toBe('Test Product');
  });
});

describe('UX Signals - generateSpeakableSchema', () => {
  it('should generate SpeakableSpecification schema', () => {
    const schema = generateSpeakableSchema({
      url: 'https://www.vapourism.co.uk/products/test',
      cssSelectors: ['.product-title', '.product-description', '.price'],
    });

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('WebPage');
    expect(schema.url).toBe('https://www.vapourism.co.uk/products/test');
    expect(schema.speakable['@type']).toBe('SpeakableSpecification');
    expect(schema.speakable.cssSelector).toContain('.product-title');
    expect(schema.speakable.cssSelector).toContain('.product-description');
    expect(schema.speakable.cssSelector).toContain('.price');
  });
});

describe('UX Signals - Edge Cases', () => {
  it('should handle zero values correctly', () => {
    // Zero LCP should still be rated (good)
    expect(rateCoreWebVital('lcp', 0)).toEqual({
      metric: 'lcp',
      value: 0,
      rating: 'good',
    });

    // Zero CLS is perfect
    expect(rateCoreWebVital('cls', 0)).toEqual({
      metric: 'cls',
      value: 0,
      rating: 'good',
    });
  });

  it('should handle boundary values correctly', () => {
    // Exactly at good threshold
    expect(rateCoreWebVital('lcp', 2500).rating).toBe('good');
    expect(rateCoreWebVital('inp', 200).rating).toBe('good');
    expect(rateCoreWebVital('cls', 0.1).rating).toBe('good');

    // Just over good threshold
    expect(rateCoreWebVital('lcp', 2501).rating).toBe('needs-improvement');
    expect(rateCoreWebVital('inp', 201).rating).toBe('needs-improvement');
    expect(rateCoreWebVital('cls', 0.101).rating).toBe('needs-improvement');

    // Exactly at needs-improvement threshold
    expect(rateCoreWebVital('lcp', 4000).rating).toBe('needs-improvement');
    expect(rateCoreWebVital('inp', 500).rating).toBe('needs-improvement');
    expect(rateCoreWebVital('cls', 0.25).rating).toBe('needs-improvement');

    // Just over needs-improvement threshold
    expect(rateCoreWebVital('lcp', 4001).rating).toBe('poor');
    expect(rateCoreWebVital('inp', 501).rating).toBe('poor');
    expect(rateCoreWebVital('cls', 0.251).rating).toBe('poor');
  });

  it('should handle very large values', () => {
    expect(rateCoreWebVital('lcp', 100000)).toEqual({
      metric: 'lcp',
      value: 100000,
      rating: 'poor',
    });
  });

  it('should handle decimal precision for CLS', () => {
    expect(rateCoreWebVital('cls', 0.099).rating).toBe('good');
    expect(rateCoreWebVital('cls', 0.100).rating).toBe('good');
    expect(rateCoreWebVital('cls', 0.101).rating).toBe('needs-improvement');
  });
});

describe('UX Signals - Schema Validation', () => {
  it('should not include undefined fields in schema', () => {
    const schema = generateWebPageSchema({
      name: 'Test',
      description: 'Test',
      url: 'https://www.vapourism.co.uk/test',
      // Not providing datePublished, dateModified, author, breadcrumb
    });

    expect(schema).not.toHaveProperty('datePublished');
    expect(schema).not.toHaveProperty('dateModified');
    expect(schema).not.toHaveProperty('author');
    expect(schema).not.toHaveProperty('breadcrumb');
  });

  it('should not include breadcrumb when array is empty', () => {
    const schema = generateWebPageSchema({
      name: 'Test',
      description: 'Test',
      url: 'https://www.vapourism.co.uk/test',
      breadcrumb: [],
    });

    expect(schema).not.toHaveProperty('breadcrumb');
  });
});
