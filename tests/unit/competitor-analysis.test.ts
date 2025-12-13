/**
 * Unit tests for Competitor Analysis
 */

import { describe, it, expect } from 'vitest';
import { 
  parseCompetitorKeywords,
  generateSEOImprovementPlan,
  generateKeywordRoadmap,
  exportAnalysisReport
} from '../../app/lib/competitor-analysis';

describe('parseCompetitorKeywords', () => {
  it('should parse CSV data correctly', () => {
    const csvData = `keyword,search_volume,difficulty,position
"disposable vape",33100,65,1
"elf bar",27100,70,2
"buy vape",5000,50,3`;
    
    const keywords = parseCompetitorKeywords(csvData);
    
    expect(keywords).toHaveLength(3);
    expect(keywords[0].keyword).toBe('disposable vape');
    expect(keywords[0].searchVolume).toBe(33100);
    expect(keywords[0].difficulty).toBe(65);
    expect(keywords[0].position).toBe(1);
  });

  it('should classify keyword intents correctly', () => {
    const csvData = `keyword,search_volume,difficulty,position
"buy vape",1000,50,5
"how to vape",1000,30,10
"best vape",1000,60,3
"vape shop",1000,40,7`;
    
    const keywords = parseCompetitorKeywords(csvData);
    
    expect(keywords[0].intent).toBe('transactional'); // buy vape
    expect(keywords[1].intent).toBe('informational'); // how to vape
    expect(keywords[2].intent).toBe('commercial'); // best vape
    expect(keywords[3].intent).toBe('navigational'); // vape shop
  });

  it('should classify keyword categories correctly', () => {
    const csvData = `keyword,search_volume,difficulty,position
"disposable vape",1000,50,1
"e-liquid",1000,50,2
"pod kit",1000,50,3
"elf bar",1000,50,4`;
    
    const keywords = parseCompetitorKeywords(csvData);
    
    expect(keywords[0].category).toBe('Disposable Vapes');
    expect(keywords[1].category).toBe('E-Liquids');
    expect(keywords[2].category).toBe('Pod Systems');
    expect(keywords[3].category).toBe('Brand - Elf Bar');
  });

  it('should handle empty lines and malformed data', () => {
    const csvData = `keyword,search_volume,difficulty,position
"valid keyword",1000,50,5

,,,
"another valid",2000,40,3`;
    
    const keywords = parseCompetitorKeywords(csvData);
    
    expect(keywords).toHaveLength(2);
    expect(keywords[0].keyword).toBe('valid keyword');
    expect(keywords[1].keyword).toBe('another valid');
  });
});

describe('generateSEOImprovementPlan', () => {
  const sampleKeywords = [
    { keyword: 'disposable vape', searchVolume: 10000, difficulty: 50, position: 3, intent: 'commercial' as const, category: 'Disposable Vapes' },
    { keyword: 'buy vape online', searchVolume: 5000, difficulty: 40, position: 2, intent: 'transactional' as const, category: 'General' },
    { keyword: 'how to vape', searchVolume: 2000, difficulty: 30, position: 8, intent: 'informational' as const, category: 'General' },
    { keyword: 'vape guide', searchVolume: 1000, difficulty: 25, position: 5, intent: 'informational' as const, category: 'General' },
  ];

  const currentKeywords = ['vape', 'e-liquid'];

  it('should generate a complete improvement plan', () => {
    const plan = generateSEOImprovementPlan(sampleKeywords, currentKeywords);
    
    expect(plan).toHaveProperty('summary');
    expect(plan).toHaveProperty('opportunities');
    expect(plan).toHaveProperty('contentGaps');
    expect(plan).toHaveProperty('technicalRecommendations');
  });

  it('should identify quick wins', () => {
    const plan = generateSEOImprovementPlan(sampleKeywords, currentKeywords);
    
    expect(plan.opportunities.quickWins).toBeDefined();
    expect(Array.isArray(plan.opportunities.quickWins)).toBe(true);
  });

  it('should categorize opportunities by timeline', () => {
    const plan = generateSEOImprovementPlan(sampleKeywords, currentKeywords);
    
    expect(plan.opportunities).toHaveProperty('quickWins');
    expect(plan.opportunities).toHaveProperty('mediumTerm');
    expect(plan.opportunities).toHaveProperty('longTerm');
  });

  it('should identify content gaps by category', () => {
    const plan = generateSEOImprovementPlan(sampleKeywords, currentKeywords);
    
    expect(plan.contentGaps).toBeDefined();
    expect(Array.isArray(plan.contentGaps)).toBe(true);
    
    if (plan.contentGaps.length > 0) {
      expect(plan.contentGaps[0]).toHaveProperty('category');
      expect(plan.contentGaps[0]).toHaveProperty('keywords');
      expect(plan.contentGaps[0]).toHaveProperty('priority');
    }
  });

  it('should include technical recommendations', () => {
    const plan = generateSEOImprovementPlan(sampleKeywords, currentKeywords);
    
    expect(plan.technicalRecommendations).toBeDefined();
    expect(Array.isArray(plan.technicalRecommendations)).toBe(true);
    expect(plan.technicalRecommendations.length).toBeGreaterThan(0);
    expect(plan.technicalRecommendations[0]).toContain('schema');
  });

  it('should provide actionable suggestions', () => {
    const plan = generateSEOImprovementPlan(sampleKeywords, currentKeywords);
    
    const allOpportunities = [
      ...plan.opportunities.quickWins,
      ...plan.opportunities.mediumTerm,
      ...plan.opportunities.longTerm
    ];
    
    allOpportunities.forEach(opp => {
      expect(opp).toHaveProperty('keyword');
      expect(opp).toHaveProperty('reason');
      expect(opp).toHaveProperty('action');
      expect(opp.action).toBeTruthy();
    });
  });
});

describe('generateKeywordRoadmap', () => {
  const sampleKeywords = Array.from({ length: 100 }, (_, i) => ({
    keyword: `keyword ${i}`,
    searchVolume: 1000 + i * 100,
    difficulty: 30 + (i % 50),
    position: 1 + (i % 20),
    intent: 'commercial' as const,
    category: 'General'
  }));

  it('should generate a three-phase roadmap', () => {
    const roadmap = generateKeywordRoadmap(sampleKeywords);
    
    expect(roadmap).toHaveProperty('phase1');
    expect(roadmap).toHaveProperty('phase2');
    expect(roadmap).toHaveProperty('phase3');
  });

  it('should allocate keywords across phases', () => {
    const roadmap = generateKeywordRoadmap(sampleKeywords);
    
    expect(roadmap.phase1.keywords.length).toBeLessThanOrEqual(20);
    expect(roadmap.phase2.keywords.length).toBeLessThanOrEqual(40);
    expect(roadmap.phase3.keywords.length).toBeLessThanOrEqual(60);
  });

  it('should include timeline information', () => {
    const roadmap = generateKeywordRoadmap(sampleKeywords);
    
    expect(roadmap.phase1.timeline).toBe('1 month');
    expect(roadmap.phase2.timeline).toBe('2 months');
    expect(roadmap.phase3.timeline).toBe('3 months');
  });

  it('should include descriptive titles', () => {
    const roadmap = generateKeywordRoadmap(sampleKeywords);
    
    expect(roadmap.phase1.title).toContain('Quick Wins');
    expect(roadmap.phase2.title).toContain('Medium Priority');
    expect(roadmap.phase3.title).toContain('Long-term');
  });

  it('should prioritize by opportunity score', () => {
    // Create keywords with clear priority differences
    const keywords = [
      { keyword: 'low priority', searchVolume: 100, difficulty: 80, position: 25, intent: 'informational' as const },
      { keyword: 'high priority', searchVolume: 10000, difficulty: 20, position: 2, intent: 'transactional' as const },
      { keyword: 'medium priority', searchVolume: 1000, difficulty: 50, position: 10, intent: 'commercial' as const },
    ];
    
    const roadmap = generateKeywordRoadmap(keywords);
    
    // High priority should be in phase 1
    expect(roadmap.phase1.keywords).toContain('high priority');
  });
});

describe('exportAnalysisReport', () => {
  const sampleKeywords = [
    { keyword: 'vape', searchVolume: 10000, difficulty: 60, position: 5, intent: 'commercial' as const, category: 'General' },
    { keyword: 'buy vape', searchVolume: 5000, difficulty: 40, position: 3, intent: 'transactional' as const, category: 'General' },
  ];

  const currentKeywords = ['e-liquid'];
  const plan = generateSEOImprovementPlan(sampleKeywords, currentKeywords);
  const roadmap = generateKeywordRoadmap(sampleKeywords);

  it('should generate markdown report', () => {
    const report = exportAnalysisReport(plan, roadmap);
    
    expect(typeof report).toBe('string');
    expect(report.length).toBeGreaterThan(0);
  });

  it('should include all major sections', () => {
    const report = exportAnalysisReport(plan, roadmap);
    
    expect(report).toContain('# SEO Optimization Plan');
    expect(report).toContain('## Executive Summary');
    expect(report).toContain('## Keyword Distribution by Intent');
    expect(report).toContain('## Category Breakdown');
    expect(report).toContain('## Implementation Roadmap');
    expect(report).toContain('## Quick Wins');
    expect(report).toContain('## Content Gaps');
    expect(report).toContain('## Technical Recommendations');
  });

  it('should include roadmap phases', () => {
    const report = exportAnalysisReport(plan, roadmap);
    
    expect(report).toContain('### Quick Wins');
    expect(report).toContain('### Medium Priority');
    expect(report).toContain('### Long-term');
  });

  it('should include statistics', () => {
    const report = exportAnalysisReport(plan, roadmap);
    
    expect(report).toContain('Total Keywords Analyzed');
    expect(report).toContain('Top Performers');
  });

  it('should include timestamp', () => {
    const report = exportAnalysisReport(plan, roadmap);
    
    expect(report).toMatch(/Generated on \d{4}-\d{2}-\d{2}/);
  });
});

describe('Intent Classification', () => {
  it('should classify transactional keywords', () => {
    const csvData = `keyword,search_volume,difficulty,position
"buy vape",1000,50,5
"shop disposable vape",1000,50,5
"cheap e-liquid",1000,50,5
"vape sale",1000,50,5`;
    
    const keywords = parseCompetitorKeywords(csvData);
    
    keywords.forEach(kw => {
      expect(kw.intent).toBe('transactional');
    });
  });

  it('should classify informational keywords', () => {
    const csvData = `keyword,search_volume,difficulty,position
"how to vape",1000,30,10
"what is vaping",1000,30,10
"vaping guide",1000,30,10
"vaping tips",1000,30,10`;
    
    const keywords = parseCompetitorKeywords(csvData);
    
    keywords.forEach(kw => {
      expect(kw.intent).toBe('informational');
    });
  });

  it('should classify commercial keywords', () => {
    const csvData = `keyword,search_volume,difficulty,position
"best vape",1000,60,3
"top disposable vape",1000,60,3
"vape review",1000,60,3
"compare vape mods",1000,60,3`;
    
    const keywords = parseCompetitorKeywords(csvData);
    
    keywords.forEach(kw => {
      expect(kw.intent).toBe('commercial');
    });
  });
});

describe('Category Classification', () => {
  it('should classify brand-specific keywords', () => {
    const csvData = `keyword,search_volume,difficulty,position
"elf bar",1000,50,1
"lost mary vape",1000,50,2
"geek bar disposable",1000,50,3`;
    
    const keywords = parseCompetitorKeywords(csvData);
    
    expect(keywords[0].category).toBe('Brand - Elf Bar');
    expect(keywords[1].category).toBe('Brand - Lost Mary');
    expect(keywords[2].category).toBe('Brand - Geek Bar');
  });

  it('should classify product type keywords', () => {
    const csvData = `keyword,search_volume,difficulty,position
"pod kit",1000,50,1
"vape mod",1000,50,2
"vape tank",1000,50,3
"vape coils",1000,50,4`;
    
    const keywords = parseCompetitorKeywords(csvData);
    
    expect(keywords[0].category).toBe('Pod Systems');
    expect(keywords[1].category).toBe('Mods');
    expect(keywords[2].category).toBe('Tanks');
    expect(keywords[3].category).toBe('Coils');
  });

  it('should default to General for unclassified keywords', () => {
    const csvData = `keyword,search_volume,difficulty,position
"random keyword",1000,50,1`;
    
    const keywords = parseCompetitorKeywords(csvData);
    
    expect(keywords[0].category).toBe('General');
  });
});
