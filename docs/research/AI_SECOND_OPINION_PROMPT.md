# AI Second Opinion Prompt - V2 Refactor

## Context
You are reviewing a technical plan for refactoring a Shopify Hydrogen (Remix) storefront from a complex custom architecture to a simplified Shopify-native approach.

---

## Background

**Current Stack:**
- Shopify Hydrogen 2025.1.4 + Remix on Oxygen (Cloudflare Workers)
- Algolia for search (custom integration, SSR workarounds)
- Custom category mapping system (100+ fuzzy-matched categories)
- Basic product images only

**V2 Goals:**
- Replace Algolia with Shopify native search
- Replace category mapping with Shopify collections
- Add brand media pack integration (logos, lifestyle imagery)

**Non-Negotiables:**
- Must use Hydrogen APIs (no direct Shopify API calls)
- Must deploy to Oxygen (Cloudflare Workers)
- Must use Shopify hosted checkout
- Must use Shopify basic subscriptions

---

## Research Documents to Review

Please review these three research documents and provide critical feedback:

### 1. Shopify Search Comparison
**File:** `v2/docs/research/shopify-search-comparison.md`

**Key Claims:**
- Shopify native search is 2-4x slower than Algolia (200-400ms vs 50-100ms)
- But acceptable for UX with proper loading states
- Simpler architecture, zero maintenance, cost savings
- Recommendation: PROCEED

**Questions to Answer:**
- Is 200-400ms search latency acceptable for e-commerce autocomplete?
- Are there hidden limitations in Shopify's search API we're missing?
- What about search analytics - is losing Algolia's dashboard a real problem?
- Any Hydrogen-specific search patterns we should leverage?

### 2. Collections Audit
**File:** `v2/docs/research/collections-audit.md`

**Key Claims:**
- Can map 100+ custom categories to ~70 Shopify collections
- Automated collection rules replace fuzzy matching logic
- Better for non-technical content management
- Recommendation: PROCEED

**Questions to Answer:**
- Will we lose product discoverability with fewer, broader collections?
- Are automated collection rules reliable enough (no false positives/negatives)?
- What about SEO impact from URL structure changes?
- Is 301 redirect strategy sufficient for legacy category URLs?

### 3. Media Pack Integration
**File:** `v2/docs/research/media-pack-integration-plan.md`

**Key Claims:**
- Brand media packs (logos, lifestyle images) will enhance product pages
- 2 confirmed brands, need to acquire 110 more
- Expected 50-70% response rate from email outreach
- Minimal performance impact with lazy loading
- Recommendation: PROCEED

**Questions to Answer:**
- Is relying on brands to provide media realistic (60-80% response rate)?
- What's the fallback if only 20-30% of brands respond?
- Will lifestyle imagery actually increase conversions, or is it just "nice to have"?
- Any legal/rights management risks with third-party brand assets?

---

## Critical Analysis Framework

For each research document, please evaluate:

### 1. **Technical Feasibility**
- Are the proposed solutions technically sound?
- Any Hydrogen/Oxygen-specific constraints overlooked?
- Performance implications realistic or optimistic?

### 2. **Risk Assessment**
- Are risks properly identified and mitigated?
- Any hidden risks not addressed?
- Is the "LOW risk" rating justified?

### 3. **Alternative Approaches**
- Are there better solutions we're not considering?
- Hybrid approaches that might be safer?
- Incremental migration paths we should explore?

### 4. **Evidence & Research**
- Are claims backed by documentation/data?
- Any assumptions that need validation?
- What proof-of-concepts should we build first?

### 5. **Business Impact**
- Conversion rate impact: realistic expectations?
- Maintenance savings: real or exaggerated?
- Time investment: is 16 weeks achievable?

---

## Specific Technical Questions

### Shopify Search API
1. Does Shopify's predictive search support custom ranking/boosting?
2. Can we cache search results at the edge (Oxygen/Cloudflare)?
3. Any rate limits or quotas we need to worry about?
4. How does search quality degrade with 2000+ products?

### Collections Architecture
1. Can automated collections handle complex multi-condition rules reliably?
2. What happens if a product matches multiple collections?
3. How do we handle collection hierarchy (parent/child) in Shopify?
4. Any performance issues with 70+ collections and automated rules?

### Media Pack Strategy
1. WebP conversion + responsive images: CPU intensive for Oxygen workers?
2. Manifest.json approach: should this be in a database instead?
3. Image hosting: Shopify CDN vs Cloudflare CDN pros/cons?
4. How to version/update media packs without breaking product pages?

### Hydrogen/Oxygen Specific
1. Any Hydrogen hooks/utilities we should leverage for search/collections?
2. Oxygen edge caching strategies for collection queries?
3. How to handle cache invalidation when collections update?
4. Build time implications with 70+ collection queries?

---

## Request for Critical Feedback

Please provide:

1. **Red Flags** - Serious concerns that should block the refactor
2. **Yellow Flags** - Moderate risks that need mitigation plans
3. **Green Lights** - Aspects that seem well-researched and sound
4. **Alternative Proposals** - Different approaches worth considering
5. **Proof of Concept Priorities** - What should we validate first before committing?

---

## Output Format

```markdown
# V2 Refactor - Critical Review

## Executive Summary
[Overall assessment: PROCEED / PROCEED WITH CAUTION / RECONSIDER]

## Research Document Reviews

### Shopify Search Comparison
**Rating:** [Strong / Adequate / Weak]
**Key Concerns:**
- [List major issues]
**Alternative Approaches:**
- [Suggestions]

### Collections Audit
**Rating:** [Strong / Adequate / Weak]
**Key Concerns:**
- [List major issues]
**Alternative Approaches:**
- [Suggestions]

### Media Pack Integration
**Rating:** [Strong / Adequate / Weak]
**Key Concerns:**
- [List major issues]
**Alternative Approaches:**
- [Suggestions]

## Critical Risks Identified

### Technical Risks
1. [Risk description + mitigation suggestion]

### Business Risks
1. [Risk description + mitigation suggestion]

### Timeline Risks
1. [Risk description + mitigation suggestion]

## Recommended Next Steps

1. [Immediate action]
2. [Proof of concept to build]
3. [Research to conduct]

## Questions for the Team

1. [Question requiring business decision]
2. [Question requiring technical validation]
```

---

## Context Documents

If you need additional context, here are key files in the current codebase:

**Current implementations to understand:**
- `app/lib/algolia.ts` - Current search implementation
- `app/lib/category-mapping.ts` - Current navigation logic (100+ categories)
- `app/lib/context.ts` - Hydrogen context setup
- `app/lib/fragments.ts` - GraphQL fragments
- `app/lib/shipping-restrictions.ts` - Business logic to preserve
- `app/lib/hooks/useAgeVerification.tsx` - Compliance logic to preserve
- `vite.config.ts` - Current SSR optimizations for Algolia

**Documentation:**
- `.github/copilot-instructions.md` - Full project context and V2 vision
- `public/media_packs/README.md` - Media pack acquisition status
- `scripts/optimize_product_tags_v2.py` - Tag optimization system

---

## Your Task

Review the three research documents with a critical, expert eye. Challenge assumptions, identify gaps, and provide actionable recommendations. Be honest about what could go wrong.

**Remember:** We're looking for reasons NOT to proceed if they exist, not validation of our decisions.
