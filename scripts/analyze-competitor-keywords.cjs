/**
 * Analyze Competitor Keyword Data
 * 
 * Simple Node.js script to process competitor keyword CSV and generate insights
 * 
 * Usage:
 *   node scripts/analyze-competitor-keywords.js [path-to-csv]
 */

const fs = require('fs');
const path = require('path');

// Sample current site keywords
const CURRENT_SITE_KEYWORDS = [
  'vape', 'vaping', 'e-liquid', 'disposable vape', 'vape shop uk',
  'vape juice', 'elf bar', 'lost mary', 'pod kit', 'vape mod'
];

function parseCSV(content) {
  const lines = content.split('\n');
  const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''));
  
  const keywordIdx = headers.findIndex(h => h.includes('keyword'));
  const volumeIdx = headers.findIndex(h => h.includes('volume'));
  const difficultyIdx = headers.findIndex(h => h.includes('difficulty'));
  const positionIdx = headers.findIndex(h => h.includes('position'));
  
  const keywords = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const columns = line.split(',').map(c => c.trim().replace(/"/g, ''));
    const keyword = columns[keywordIdx];
    
    if (keyword) {
      keywords.push({
        keyword,
        searchVolume: volumeIdx >= 0 ? parseInt(columns[volumeIdx]) : 0,
        difficulty: difficultyIdx >= 0 ? parseInt(columns[difficultyIdx]) : 0,
        position: positionIdx >= 0 ? parseInt(columns[positionIdx]) : 0,
        intent: classifyIntent(keyword),
        category: classifyCategory(keyword)
      });
    }
  }
  
  return keywords;
}

function classifyIntent(keyword) {
  const lower = keyword.toLowerCase();
  if (/(buy|shop|purchase|price|cheap|deal|sale)/.test(lower)) return 'transactional';
  if (/(how|what|guide|tutorial|tips)/.test(lower)) return 'informational';
  if (/(best|top|review|vs|compare)/.test(lower)) return 'commercial';
  return 'navigational';
}

function classifyCategory(keyword) {
  const lower = keyword.toLowerCase();
  if (/disposable/i.test(lower)) return 'Disposable Vapes';
  if (/(e-liquid|eliquid|juice|shortfill)/i.test(lower)) return 'E-Liquids';
  if (/(pod|pod kit)/i.test(lower)) return 'Pod Systems';
  if (/(mod|box mod)/i.test(lower)) return 'Mods';
  if (/(tank|atomizer)/i.test(lower)) return 'Tanks';
  if (/(coil|coils)/i.test(lower)) return 'Coils';
  if (/(elf bar|elfbar)/i.test(lower)) return 'Brand - Elf Bar';
  if (/(lost mary)/i.test(lower)) return 'Brand - Lost Mary';
  if (/(geek bar)/i.test(lower)) return 'Brand - Geek Bar';
  return 'General';
}

function analyzeKeywords(keywords) {
  const totalKeywords = keywords.length;
  
  // Top performers (position <= 10)
  const topPerformers = keywords
    .filter(k => k.position <= 10)
    .sort((a, b) => a.position - b.position)
    .slice(0, 20);
  
  // Category breakdown
  const categoryBreakdown = {};
  keywords.forEach(k => {
    categoryBreakdown[k.category] = (categoryBreakdown[k.category] || 0) + 1;
  });
  
  // Intent distribution
  const intentDistribution = {};
  keywords.forEach(k => {
    intentDistribution[k.intent] = (intentDistribution[k.intent] || 0) + 1;
  });
  
  // Quick wins (high volume, low difficulty, good position)
  const quickWins = keywords
    .filter(k => k.position <= 10 && k.difficulty < 55 && k.searchVolume > 500)
    .sort((a, b) => (a.position * a.difficulty) - (b.position * b.difficulty))
    .slice(0, 15);
  
  // Content gaps (keywords competitor ranks for that we don't have)
  const contentGaps = keywords
    .filter(k => {
      const lower = k.keyword.toLowerCase();
      return !CURRENT_SITE_KEYWORDS.some(sk => lower.includes(sk.toLowerCase()) || sk.toLowerCase().includes(lower));
    })
    .filter(k => k.searchVolume > 300)
    .slice(0, 30);
  
  return {
    totalKeywords,
    topPerformers,
    categoryBreakdown,
    intentDistribution,
    quickWins,
    contentGaps
  };
}

function generateReport(analysis) {
  const timestamp = new Date().toISOString();
  
  let report = `# SEO Competitor Analysis Report

Generated: ${timestamp}

## Executive Summary

- **Total Keywords Analyzed**: ${analysis.totalKeywords}
- **Top 10 Positions**: ${analysis.topPerformers.length} keywords
- **Quick Win Opportunities**: ${analysis.quickWins.length} keywords
- **Content Gap Opportunities**: ${analysis.contentGaps.length} keywords

## Keyword Distribution by Intent

`;

  Object.entries(analysis.intentDistribution).forEach(([intent, count]) => {
    const percentage = ((count / analysis.totalKeywords) * 100).toFixed(1);
    report += `- **${intent}**: ${count} keywords (${percentage}%)\n`;
  });

  report += `\n## Category Breakdown\n\n`;

  Object.entries(analysis.categoryBreakdown)
    .sort(([, a], [, b]) => b - a)
    .forEach(([category, count]) => {
      report += `- **${category}**: ${count} keywords\n`;
    });

  report += `\n## Top 20 Keywords by Position\n\n`;
  report += `| Rank | Keyword | Position | Volume | Difficulty | Intent |\n`;
  report += `|------|---------|----------|--------|------------|--------|\n`;
  
  analysis.topPerformers.slice(0, 20).forEach((k, i) => {
    report += `| ${i + 1} | ${k.keyword} | ${k.position} | ${k.searchVolume.toLocaleString()} | ${k.difficulty} | ${k.intent} |\n`;
  });

  report += `\n## Quick Wins (Priority 1)\n\n`;
  report += `These keywords offer the best opportunity for quick ranking improvements.\n\n`;
  report += `| Keyword | Position | Volume | Difficulty | Category |\n`;
  report += `|---------|----------|--------|------------|----------|\n`;
  
  analysis.quickWins.forEach(k => {
    report += `| ${k.keyword} | ${k.position} | ${k.searchVolume.toLocaleString()} | ${k.difficulty} | ${k.category} |\n`;
  });

  report += `\n### Recommended Actions for Quick Wins:\n\n`;
  analysis.quickWins.slice(0, 10).forEach((k, i) => {
    report += `${i + 1}. **${k.keyword}**: Optimize existing ${k.category} pages with this keyword in title, description, and H1\n`;
  });

  report += `\n## Content Gaps (Priority 2)\n\n`;
  report += `Keywords the competitor ranks for that we should target.\n\n`;
  report += `| Keyword | Volume | Position | Category | Opportunity |\n`;
  report += `|---------|--------|----------|----------|-------------|\n`;
  
  analysis.contentGaps.slice(0, 20).forEach(k => {
    const opportunity = k.searchVolume > 1000 ? 'High' : k.searchVolume > 500 ? 'Medium' : 'Low';
    report += `| ${k.keyword} | ${k.searchVolume.toLocaleString()} | ${k.position} | ${k.category} | ${opportunity} |\n`;
  });

  report += `\n## Implementation Roadmap

### Phase 1: Quick Wins (Weeks 1-4)

Focus on optimizing existing pages for quick win keywords:

`;

  analysis.quickWins.slice(0, 10).forEach((k, i) => {
    report += `${i + 1}. Optimize for "${k.keyword}" (Position: ${k.position}, Volume: ${k.searchVolume.toLocaleString()})\n`;
  });

  report += `\n### Phase 2: Content Creation (Months 2-3)

Create new content targeting content gap keywords:

`;

  analysis.contentGaps.slice(0, 15).forEach((k, i) => {
    report += `${i + 1}. Create content for "${k.keyword}" (${k.category})\n`;
  });

  report += `\n### Phase 3: Authority Building (Months 4-6)

Create comprehensive guides and resources:

`;

  const informationalKeywords = analysis.contentGaps.filter(k => k.intent === 'informational').slice(0, 10);
  informationalKeywords.forEach((k, i) => {
    report += `${i + 1}. Write guide: "${k.keyword}"\n`;
  });

  report += `\n## Technical SEO Recommendations

1. **Schema Markup**: Implement Product, BreadcrumbList, and FAQ schema on all relevant pages
2. **Meta Tags**: Optimize title tags to include primary keywords (max 60 chars)
3. **Meta Descriptions**: Write compelling descriptions with keywords (max 155 chars)
4. **URL Structure**: Use keyword-rich, clean URLs
5. **Internal Linking**: Link between related products and categories using keyword anchors
6. **Image Optimization**: Add keyword-rich alt text to all product images
7. **Page Speed**: Ensure fast loading times (< 2s LCP)
8. **Mobile Optimization**: Ensure mobile-first responsive design
9. **Canonical Tags**: Implement proper canonical URLs
10. **XML Sitemap**: Submit updated sitemap with all optimized pages

## Content Creation Strategy

### Product Pages
- Include primary keyword in H1, title tag, meta description
- Add secondary keywords naturally in product description
- Include structured data (Product schema)
- Add customer reviews section for user-generated content
- Link to related products using keyword anchors

### Category Pages
- Optimize for category + modifier keywords (e.g., "buy disposable vape")
- Include descriptive intro text with keywords
- Add filter facets for better UX and keyword targeting
- Implement breadcrumb navigation
- Link to top products and guides

### Blog/Guide Content
- Target informational keywords with comprehensive guides
- Use keyword-rich headings (H2, H3)
- Include images with descriptive alt text
- Add internal links to products and categories
- Implement FAQ schema for question-based keywords

## Monitoring & Measurement

Track these metrics monthly:
- Organic traffic by landing page
- Keyword rankings for target keywords
- Click-through rates from SERPs
- Conversion rates by keyword intent
- Page engagement metrics (time on page, bounce rate)

---

*Analysis complete. Review recommendations and prioritize based on business goals.*
`;

  return report;
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node scripts/analyze-competitor-keywords.js <path-to-csv>');
    console.log('\nExample:');
    console.log('  node scripts/analyze-competitor-keywords.js ./docs/competitor-keywords-sample.csv');
    process.exit(1);
  }
  
  const csvPath = args[0];
  
  if (!fs.existsSync(csvPath)) {
    console.error(`Error: File not found: ${csvPath}`);
    process.exit(1);
  }
  
  console.log(`\nProcessing competitor keyword data from: ${csvPath}\n`);
  
  // Read and parse CSV
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const keywords = parseCSV(csvContent);
  console.log(`✓ Parsed ${keywords.length} keywords`);
  
  // Analyze keywords
  const analysis = analyzeKeywords(keywords);
  console.log(`✓ Found ${analysis.topPerformers.length} top performers`);
  console.log(`✓ Identified ${analysis.quickWins.length} quick wins`);
  console.log(`✓ Found ${analysis.contentGaps.length} content gaps`);
  
  // Generate report
  const report = generateReport(analysis);
  const outputPath = path.join(process.cwd(), 'docs', 'seo-competitor-analysis.md');
  fs.writeFileSync(outputPath, report, 'utf-8');
  
  console.log(`\n✓ Analysis complete!`);
  console.log(`✓ Report saved to: ${outputPath}\n`);
  
  // Display summary
  console.log('=== QUICK SUMMARY ===\n');
  console.log(`Total Keywords: ${analysis.totalKeywords}`);
  console.log(`Top 10 Positions: ${analysis.topPerformers.length}`);
  console.log(`Quick Wins: ${analysis.quickWins.length}`);
  console.log(`Content Gaps: ${analysis.contentGaps.length}\n`);
  
  console.log('Top 5 Quick Win Keywords:');
  analysis.quickWins.slice(0, 5).forEach((k, i) => {
    console.log(`  ${i + 1}. "${k.keyword}" (Pos: ${k.position}, Vol: ${k.searchVolume.toLocaleString()}, Diff: ${k.difficulty})`);
  });
  
  console.log('\nReview the full report for detailed analysis and recommendations.');
}

main();
