/**
 * Process Competitor Keyword Data
 * 
 * This script processes competitor keyword data and generates an SEO improvement plan
 * 
 * Usage:
 *   npx tsx scripts/process-competitor-keywords.ts [path-to-csv]
 */

import * as fs from 'fs';
import * as path from 'path';
import { 
  parseCompetitorKeywords, 
  generateSEOImprovementPlan, 
  generateKeywordRoadmap,
  exportAnalysisReport 
} from '../app/lib/competitor-analysis';

// Example current site keywords (update this with actual site keywords)
const CURRENT_SITE_KEYWORDS = [
  'vape',
  'vaping',
  'e-liquid',
  'disposable vape',
  'vape shop uk',
  'vape juice',
  'elf bar',
  'lost mary',
  'pod kit',
  'vape mod',
  'vape tank',
  'vape coils',
  'nicotine salt',
  'shortfill',
  'uk vaping',
];

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: npx tsx scripts/process-competitor-keywords.ts <path-to-csv>');
    console.log('\nExample:');
    console.log('  npx tsx scripts/process-competitor-keywords.ts ./competitor-keywords.csv');
    process.exit(1);
  }
  
  const csvPath = args[0];
  
  if (!fs.existsSync(csvPath)) {
    console.error(`Error: File not found: ${csvPath}`);
    process.exit(1);
  }
  
  console.log(`Processing competitor keyword data from: ${csvPath}`);
  console.log('');
  
  // Read CSV file
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  
  // Parse keywords
  console.log('Parsing keywords...');
  const keywords = parseCompetitorKeywords(csvContent);
  console.log(`✓ Parsed ${keywords.length} keywords`);
  console.log('');
  
  // Generate improvement plan
  console.log('Generating SEO improvement plan...');
  const plan = generateSEOImprovementPlan(keywords, CURRENT_SITE_KEYWORDS);
  console.log(`✓ Identified ${plan.opportunities.quickWins.length} quick wins`);
  console.log(`✓ Identified ${plan.opportunities.mediumTerm.length} medium-term opportunities`);
  console.log(`✓ Identified ${plan.opportunities.longTerm.length} long-term opportunities`);
  console.log('');
  
  // Generate roadmap
  console.log('Generating implementation roadmap...');
  const roadmap = generateKeywordRoadmap(keywords);
  console.log(`✓ Phase 1: ${roadmap.phase1.keywords.length} keywords (${roadmap.phase1.timeline})`);
  console.log(`✓ Phase 2: ${roadmap.phase2.keywords.length} keywords (${roadmap.phase2.timeline})`);
  console.log(`✓ Phase 3: ${roadmap.phase3.keywords.length} keywords (${roadmap.phase3.timeline})`);
  console.log('');
  
  // Export report
  console.log('Generating analysis report...');
  const report = exportAnalysisReport(plan, roadmap);
  
  const outputPath = path.join(process.cwd(), 'docs', 'seo-competitor-analysis.md');
  fs.writeFileSync(outputPath, report, 'utf-8');
  console.log(`✓ Report saved to: ${outputPath}`);
  console.log('');
  
  // Display summary
  console.log('=== ANALYSIS SUMMARY ===');
  console.log('');
  console.log(`Total Keywords: ${plan.summary.totalKeywords}`);
  console.log(`Top Performers: ${plan.summary.topPerformers.length}`);
  console.log('');
  
  console.log('Top 10 Keywords by Opportunity:');
  plan.summary.topPerformers.slice(0, 10).forEach((kw, i) => {
    console.log(`  ${i + 1}. ${kw.keyword} (Position: ${kw.position}, Volume: ${kw.searchVolume || 'N/A'})`);
  });
  console.log('');
  
  console.log('Intent Distribution:');
  Object.entries(plan.summary.intentDistribution).forEach(([intent, count]) => {
    console.log(`  ${intent}: ${count} keywords (${((count / plan.summary.totalKeywords) * 100).toFixed(1)}%)`);
  });
  console.log('');
  
  console.log('Top 5 Quick Wins:');
  plan.opportunities.quickWins.slice(0, 5).forEach((item, i) => {
    console.log(`  ${i + 1}. ${item.keyword}`);
    console.log(`     Action: ${item.action}`);
  });
  console.log('');
  
  console.log('✓ Analysis complete! Review the full report at:');
  console.log(`  ${outputPath}`);
}

main().catch(error => {
  console.error('Error processing keywords:', error);
  process.exit(1);
});
