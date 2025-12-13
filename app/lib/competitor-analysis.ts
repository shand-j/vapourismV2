/**
 * Competitor Keyword Analysis
 * 
 * This module provides utilities to analyze competitor keyword data
 * and generate actionable insights for SEO optimization
 */

import type { KeywordData, CompetitorKeywordAnalysis } from './keyword-optimizer';
import { KeywordOptimizer } from './keyword-optimizer';

/**
 * Parse competitor keyword data from CSV or structured format
 */
export function parseCompetitorKeywords(data: string): KeywordData[] {
  const keywords: KeywordData[] = [];
  const lines = data.split('\n');
  
  // Skip header row
  const headers = lines[0].toLowerCase().split(',');
  
  // Find column indices
  const keywordIdx = headers.findIndex(h => h.includes('keyword'));
  const volumeIdx = headers.findIndex(h => h.includes('volume') || h.includes('searches'));
  const difficultyIdx = headers.findIndex(h => h.includes('difficulty') || h.includes('competition'));
  const positionIdx = headers.findIndex(h => h.includes('position') || h.includes('rank'));
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const columns = line.split(',');
    
    const keyword = columns[keywordIdx]?.trim().replace(/"/g, '');
    if (!keyword) continue;
    
    keywords.push({
      keyword,
      searchVolume: volumeIdx >= 0 ? parseInt(columns[volumeIdx]) : undefined,
      difficulty: difficultyIdx >= 0 ? parseInt(columns[difficultyIdx]) : undefined,
      position: positionIdx >= 0 ? parseInt(columns[positionIdx]) : undefined,
      intent: classifyKeywordIntent(keyword),
      category: classifyKeywordCategory(keyword)
    });
  }
  
  return keywords;
}

/**
 * Classify keyword search intent
 */
function classifyKeywordIntent(keyword: string): 'informational' | 'commercial' | 'transactional' | 'navigational' {
  const lower = keyword.toLowerCase();
  
  // Transactional intent (highest priority - clear purchase intent)
  if (/(buy|shop|purchase|order|price|cheap|deal|sale|discount|coupon)/.test(lower)) {
    return 'transactional';
  }
  
  // Navigational intent (brand/site specific)
  if (/(login|account|cart|checkout|store|vapourism)/.test(lower)) {
    return 'navigational';
  }
  
  // Commercial investigation (product comparison/evaluation)
  if (/(best|top|review|vs|versus|alternative|comparison)/.test(lower)) {
    return 'commercial';
  }
  
  // Informational intent (learning/how-to)
  if (/(how|what|why|when|guide|tutorial|tips)/.test(lower)) {
    return 'informational';
  }
  
  // Default to commercial for product-related keywords
  return 'commercial';
}

/**
 * Classify keyword into product category
 */
function classifyKeywordCategory(keyword: string): string {
  const lower = keyword.toLowerCase();
  
  if (/(disposable|disposables)/i.test(lower)) return 'Disposable Vapes';
  if (/(e-liquid|eliquid|e liquid|vape juice|shortfill)/i.test(lower)) return 'E-Liquids';
  if (/(pod|pod kit|pod system)/i.test(lower)) return 'Pod Systems';
  if (/(mod|box mod)/i.test(lower)) return 'Mods';
  if (/(tank|clearomizer|atomizer)/i.test(lower)) return 'Tanks';
  if (/(coil|coils|replacement coil)/i.test(lower)) return 'Coils';
  if (/(battery|batteries|charger)/i.test(lower)) return 'Accessories';
  if (/(kit|starter kit|vape kit)/i.test(lower)) return 'Kits';
  
  // Brand-specific
  if (/(elf bar|elfbar)/i.test(lower)) return 'Brand - Elf Bar';
  if (/(lost mary)/i.test(lower)) return 'Brand - Lost Mary';
  if (/(geek bar|geekbar)/i.test(lower)) return 'Brand - Geek Bar';
  
  return 'General';
}

/**
 * Generate a comprehensive SEO improvement plan
 */
export function generateSEOImprovementPlan(
  competitorKeywords: KeywordData[],
  currentSiteKeywords: string[]
): {
  summary: CompetitorKeywordAnalysis;
  opportunities: {
    quickWins: Array<{ keyword: string; reason: string; action: string }>;
    mediumTerm: Array<{ keyword: string; reason: string; action: string }>;
    longTerm: Array<{ keyword: string; reason: string; action: string }>;
  };
  contentGaps: Array<{ category: string; keywords: string[]; priority: 'high' | 'medium' | 'low' }>;
  technicalRecommendations: string[];
} {
  const summary = KeywordOptimizer.analyzeCompetitorKeywords(competitorKeywords);
  const contentSuggestions = KeywordOptimizer.generateContentSuggestions(
    competitorKeywords,
    currentSiteKeywords
  );
  
  // Categorize opportunities by timeline
  const quickWins = contentSuggestions
    .filter(s => s.opportunity === 'high' && s.contentType === 'product')
    .slice(0, 10)
    .map(s => ({
      keyword: s.keyword,
      reason: 'Low competition, high commercial intent',
      action: `Optimize existing product pages for "${s.keyword}"`
    }));
  
  const mediumTerm = contentSuggestions
    .filter(s => s.opportunity === 'medium' && (s.contentType === 'category' || s.contentType === 'blog'))
    .slice(0, 15)
    .map(s => ({
      keyword: s.keyword,
      reason: 'Moderate competition, good search volume',
      action: s.suggestion
    }));
  
  const longTerm = contentSuggestions
    .filter(s => s.contentType === 'guide')
    .slice(0, 10)
    .map(s => ({
      keyword: s.keyword,
      reason: 'Build authority and backlinks',
      action: s.suggestion
    }));
  
  // Identify content gaps by category
  const contentGaps: Array<{ category: string; keywords: string[]; priority: 'high' | 'medium' | 'low' }> = [];
  Object.entries(summary.categoryBreakdown).forEach(([category, count]) => {
    const categoryKeywords = competitorKeywords
      .filter(kw => kw.category === category)
      .map(kw => kw.keyword)
      .slice(0, 10);
    
    if (categoryKeywords.length > 0) {
      contentGaps.push({
        category,
        keywords: categoryKeywords,
        priority: count > 50 ? 'high' : count > 20 ? 'medium' : 'low'
      });
    }
  });
  
  // Technical recommendations
  const technicalRecommendations = [
    'Implement schema.org Product markup on all product pages',
    'Add breadcrumb schema to improve site structure in SERPs',
    'Optimize page load speed (target < 2s LCP)',
    'Implement proper canonical URLs for duplicate content',
    'Add FAQ schema to high-traffic product and category pages',
    'Optimize images with descriptive alt text including target keywords',
    'Implement internal linking strategy using keyword-rich anchor text',
    'Create XML sitemap with priority and changefreq values',
    'Add Open Graph and Twitter Card metadata for social sharing',
    'Implement mobile-first responsive design (already done via Hydrogen)',
    'Use semantic HTML5 elements (article, section, nav) for better crawling',
    'Add meta robots tags to control indexing of search result pages'
  ];
  
  return {
    summary,
    opportunities: {
      quickWins,
      mediumTerm,
      longTerm
    },
    contentGaps,
    technicalRecommendations
  };
}

/**
 * Generate a prioritized keyword implementation roadmap
 */
export function generateKeywordRoadmap(keywords: KeywordData[]): {
  phase1: { title: string; keywords: string[]; timeline: string };
  phase2: { title: string; keywords: string[]; timeline: string };
  phase3: { title: string; keywords: string[]; timeline: string };
} {
  // Sort by opportunity (position, volume, difficulty)
  const sortedKeywords = keywords.sort((a, b) => {
    const scoreA = calculateOpportunityScore(a);
    const scoreB = calculateOpportunityScore(b);
    return scoreB - scoreA;
  });
  
  // Split into phases
  const phase1Keywords = sortedKeywords.slice(0, 20).map(k => k.keyword);
  const phase2Keywords = sortedKeywords.slice(20, 60).map(k => k.keyword);
  const phase3Keywords = sortedKeywords.slice(60, 120).map(k => k.keyword);
  
  return {
    phase1: {
      title: 'Quick Wins (Weeks 1-4)',
      keywords: phase1Keywords,
      timeline: '1 month'
    },
    phase2: {
      title: 'Medium Priority (Months 2-3)',
      keywords: phase2Keywords,
      timeline: '2 months'
    },
    phase3: {
      title: 'Long-term Strategy (Months 4-6)',
      keywords: phase3Keywords,
      timeline: '3 months'
    }
  };
}

/**
 * Calculate opportunity score for a keyword
 */
function calculateOpportunityScore(keyword: KeywordData): number {
  let score = 0;
  
  // Position score (lower is better)
  if (keyword.position) {
    if (keyword.position <= 3) score += 50;
    else if (keyword.position <= 10) score += 30;
    else if (keyword.position <= 20) score += 10;
  }
  
  // Search volume score
  if (keyword.searchVolume) {
    if (keyword.searchVolume > 5000) score += 30;
    else if (keyword.searchVolume > 1000) score += 20;
    else if (keyword.searchVolume > 500) score += 10;
  }
  
  // Difficulty score (lower is better)
  if (keyword.difficulty) {
    if (keyword.difficulty < 30) score += 20;
    else if (keyword.difficulty < 50) score += 10;
  }
  
  // Intent score
  if (keyword.intent === 'transactional') score += 25;
  else if (keyword.intent === 'commercial') score += 15;
  else if (keyword.intent === 'informational') score += 10;
  
  return score;
}

/**
 * Export analysis report as markdown
 */
export function exportAnalysisReport(
  plan: ReturnType<typeof generateSEOImprovementPlan>,
  roadmap: ReturnType<typeof generateKeywordRoadmap>
): string {
  return `# SEO Optimization Plan - Competitor Analysis

## Executive Summary

- **Total Keywords Analyzed**: ${plan.summary.totalKeywords}
- **Top Performers**: ${plan.summary.topPerformers.length} keywords ranking in top 10
- **Categories Identified**: ${Object.keys(plan.summary.categoryBreakdown).length}

## Keyword Distribution by Intent

${Object.entries(plan.summary.intentDistribution)
  .map(([intent, count]) => `- **${intent}**: ${count} keywords`)
  .join('\n')}

## Category Breakdown

${Object.entries(plan.summary.categoryBreakdown)
  .sort(([, a], [, b]) => b - a)
  .map(([category, count]) => `- **${category}**: ${count} keywords`)
  .join('\n')}

## Implementation Roadmap

### ${roadmap.phase1.title}
**Timeline**: ${roadmap.phase1.timeline}

Target Keywords:
${roadmap.phase1.keywords.slice(0, 10).map((k, i) => `${i + 1}. ${k}`).join('\n')}

### ${roadmap.phase2.title}
**Timeline**: ${roadmap.phase2.timeline}

Target Keywords:
${roadmap.phase2.keywords.slice(0, 10).map((k, i) => `${i + 1}. ${k}`).join('\n')}

### ${roadmap.phase3.title}
**Timeline**: ${roadmap.phase3.timeline}

Target Keywords:
${roadmap.phase3.keywords.slice(0, 10).map((k, i) => `${i + 1}. ${k}`).join('\n')}

## Quick Wins (Priority 1)

${plan.opportunities.quickWins.map((item, i) => `
### ${i + 1}. ${item.keyword}
- **Reason**: ${item.reason}
- **Action**: ${item.action}
`).join('\n')}

## Content Gaps

${plan.contentGaps.map(gap => `
### ${gap.category} (${gap.priority} priority)
Keywords: ${gap.keywords.slice(0, 5).join(', ')}
`).join('\n')}

## Technical Recommendations

${plan.technicalRecommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

---
*Generated on ${new Date().toISOString()}*
`;
}
