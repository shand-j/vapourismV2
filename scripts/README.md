# Scripts Directory

This directory contains utility scripts for managing and optimizing the Vapourism storefront.

## SEO & Keyword Analysis

### analyze-competitor-keywords.cjs

Analyzes competitor keyword data from CSV files and generates actionable SEO improvement plans.

**Usage:**
```bash
node scripts/analyze-competitor-keywords.cjs <path-to-csv>
```

**Example:**
```bash
node scripts/analyze-competitor-keywords.cjs ./docs/competitor-keywords-sample.csv
```

**CSV Format:**

The script expects a CSV file with the following columns:
- `keyword` - The search keyword/phrase
- `search_volume` - Monthly search volume
- `difficulty` - Keyword difficulty score (0-100)
- `position` - Current ranking position

Example CSV:
```csv
keyword,search_volume,difficulty,position
"disposable vape",33100,65,1
"elf bar",27100,70,2
"vape shop",12100,60,8
```

**Output:**

The script generates a comprehensive analysis report saved to `docs/seo-competitor-analysis.md` including:

1. **Executive Summary** - Overview of total keywords, top performers, opportunities
2. **Intent Distribution** - Breakdown by search intent (transactional, informational, commercial, navigational)
3. **Category Breakdown** - Keywords grouped by product category
4. **Top Keywords** - Highest ranking keywords with metrics
5. **Quick Wins** - Low-hanging fruit opportunities (low difficulty, good position)
6. **Content Gaps** - Keywords competitors rank for that you don't target
7. **Implementation Roadmap** - Phased approach for keyword optimization
8. **Technical Recommendations** - SEO best practices checklist

**Console Output:**

The script provides real-time progress updates and a summary:
```
Processing competitor keyword data from: ./docs/competitor-keywords-sample.csv

✓ Parsed 96 keywords
✓ Found 20 top performers
✓ Identified 15 quick wins
✓ Found 29 content gaps

✓ Analysis complete!
✓ Report saved to: /path/to/docs/seo-competitor-analysis.md

=== QUICK SUMMARY ===

Total Keywords: 96
Top 10 Positions: 20
Quick Wins: 15
Content Gaps: 29

Top 5 Quick Win Keywords:
  1. "nic shot" (Pos: 1, Vol: 890, Diff: 35)
  2. "50ml shortfill" (Pos: 2, Vol: 1,200, Diff: 40)
  ...
```

### process-competitor-keywords.ts

TypeScript version of the keyword analysis script (requires tsx runtime).

**Usage:**
```bash
npx tsx scripts/process-competitor-keywords.ts <path-to-csv>
```

This version provides the same functionality as the `.cjs` version but uses TypeScript for type safety.

## Product Tagging Scripts

### optimize_product_tags_v2.py

Python script for enriching Shopify products with optimized tags.

See the script's inline documentation for usage details.

### validate_optimized_tags_v2.py

Validates product tag data quality.

## Getting Competitor Keyword Data

### Recommended Tools

1. **Ahrefs**
   - Go to Site Explorer
   - Enter competitor domain
   - Navigate to "Organic Keywords"
   - Export to CSV

2. **SEMrush**
   - Enter competitor domain
   - Go to "Organic Research"
   - Export keyword data

3. **Moz**
   - Use Keyword Explorer
   - Analyze competitor rankings
   - Export results

### What to Export

When exporting competitor data, ensure you include:
- **Keyword** - The actual search term
- **Search Volume** - Monthly searches
- **Keyword Difficulty** - Competition score
- **Position/Rank** - Where competitor ranks
- **URL** (optional) - Landing page

### Sample Data Structure

For reference, a sample competitor keyword file is provided:
- Location: `docs/competitor-keywords-sample.csv`
- Contains: 96 real-world vaping industry keywords
- Use as template for formatting your own data

## Workflow: SEO Optimization Based on Competitor Analysis

### Step 1: Collect Data

Export competitor keyword rankings from your SEO tool of choice.

### Step 2: Analyze

Run the analysis script:
```bash
node scripts/analyze-competitor-keywords.cjs ./path/to/competitor-data.csv
```

### Step 3: Review Report

Open `docs/seo-competitor-analysis.md` and review:
- Quick wins (immediate opportunities)
- Content gaps (new content to create)
- Technical recommendations

### Step 4: Implement Changes

Based on the report:

**Week 1-4: Quick Wins**
- Update meta titles for top product pages
- Optimize meta descriptions with target keywords
- Add missing keywords to product descriptions
- Implement structured data (schema.org)

**Month 2-3: Content Gaps**
- Create category pages for high-volume keywords
- Write blog posts for informational keywords
- Build landing pages for commercial keywords
- Add FAQ sections for question-based keywords

**Month 4-6: Long-term Strategy**
- Develop comprehensive guides
- Build internal linking structure
- Monitor rankings and adjust
- Iterate based on performance data

### Step 5: Monitor & Refine

- Track keyword rankings weekly
- Monitor organic traffic in Google Analytics
- Review Google Search Console for new opportunities
- Re-run analysis quarterly to identify new keywords

## Best Practices

### Data Quality

- Use recent data (last 30-90 days)
- Include at least 50-100 keywords
- Focus on keywords where competitors rank in top 20
- Prioritize keywords with search volume > 100

### Analysis Frequency

- **Initial Analysis**: Comprehensive review of top 3-5 competitors
- **Monthly**: Quick check of top 20-30 keywords
- **Quarterly**: Full re-analysis with updated data
- **After Major Changes**: Whenever competitor makes significant changes

### Competitor Selection

Choose competitors that are:
- Similar size/market position
- Targeting same geographic region (UK)
- Similar product range
- Strong organic presence (>10k organic traffic/month)

For UK vaping industry, suggested competitors:
- Major online vape retailers
- Multi-brand vape shops
- Direct-to-consumer vape brands with strong SEO

### Integration with Site Updates

After running analysis:
1. Update `app/lib/keyword-optimizer.ts` with new high-value keywords
2. Refresh `VAPING_KEYWORDS` database if industry trends shift
3. Update category keyword mappings
4. Add new keywords to product tagging system
5. Update internal linking strategy

## Troubleshooting

### "File not found" error

Ensure the CSV file path is correct. Use absolute or relative path from project root.

### "Cannot find module" error

The `.cjs` script uses CommonJS and should work with Node.js without additional dependencies. If you see this error, ensure you're in the project root directory.

### Empty or incorrect analysis

Check CSV format:
- Headers must include: keyword, search_volume, difficulty, position
- Values must be properly quoted if they contain commas
- No empty rows between data

### Script runs but no keywords parsed

Verify CSV structure matches expected format. The script looks for specific column names (case-insensitive):
- "keyword"
- "search_volume" or "volume" or "searches"
- "difficulty" or "competition"
- "position" or "rank"

## Future Enhancements

Planned improvements:
- [ ] Automated competitor monitoring
- [ ] Integration with Google Search Console API
- [ ] Real-time rank tracking
- [ ] Automated content recommendations
- [ ] Keyword trend analysis
- [ ] Seasonal keyword identification
- [ ] Local search optimization (city-specific keywords)

## Contributing

When adding new scripts:
1. Add clear documentation in this README
2. Include usage examples
3. Document expected inputs/outputs
4. Add error handling
5. Provide sample data files

## Support

For issues or questions:
1. Check this README first
2. Review sample data files in `docs/`
3. Consult the main SEO documentation: `docs/seo-optimization-guide.md`
4. Check inline script comments for detailed functionality

---

**Last Updated**: December 2025
