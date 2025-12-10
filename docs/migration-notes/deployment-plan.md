# V2 Deployment Plan

## Overview
This document outlines the strategy for deploying V2 architecture changes to production, including rollout phases, rollback procedures, and validation steps.

## Pre-Deployment Checklist

### 1. Environment Configuration
- [ ] Set `USE_SHOPIFY_SEARCH=true` in Oxygen environment variables
- [ ] Verify `SESSION_SECRET` is configured
- [ ] Confirm Shopify Storefront API credentials are valid
- [ ] Test Oxygen runtime compatibility (no Node.js APIs used)

### 2. Shopify Admin Setup
- [ ] Create main collections (9 categories)
- [ ] Create subcollections (60+ subcollections)
- [ ] Create smart/featured collections (15 curated)
- [ ] Verify automated collection rules are working
- [ ] Test collection product counts and visibility

### 3. Code Quality
- [ ] All unit tests passing (`npm run test` in v2/)
- [ ] Integration tests passing
- [ ] ESLint checks passing
- [ ] TypeScript compilation successful
- [ ] Code review completed
- [ ] Security scanning (CodeQL) passed

### 4. Performance Baselines
- [ ] Measure current Algolia search latency
- [ ] Measure current page load times
- [ ] Document Core Web Vitals (LCP, FID, CLS)
- [ ] Establish acceptable performance thresholds

## Phased Rollout Strategy

### Phase 1: Staging Deployment (Week 1)
**Goal:** Validate V2 functionality in non-production environment

**Steps:**
1. Deploy V2 code to staging Oxygen environment
2. Run smoke tests on all major routes:
   - Search functionality
   - Collection navigation
   - Product pages with brand assets
   - Age verification flow
   - Shipping restrictions validation
3. Performance testing:
   - Lighthouse scores
   - Search latency measurements
   - Navigation rendering time
4. SEO validation:
   - Meta tags generation
   - Sitemap accuracy
   - Redirect functionality

**Success Criteria:**
- All smoke tests pass
- Performance within 10% of baseline
- No console errors or warnings
- SEO metadata complete and accurate

**Rollback:** N/A (staging environment)

---

### Phase 2: Feature Flag Rollout - Search (Week 2)
**Goal:** Enable Shopify search for 10% of production traffic

**Implementation:**
```typescript
// In v2/app/lib/shopify-search.ts
export function useShopifySearch(env?: any): boolean {
  const rolloutPercent = parseFloat(env?.SHOPIFY_SEARCH_ROLLOUT || '10');
  const userRandom = Math.random() * 100;
  
  if (userRandom < rolloutPercent) {
    return true; // Use Shopify search
  }
  return false; // Use Algolia fallback
}
```

**Monitoring:**
- Track search query success rates
- Monitor search latency (p50, p95, p99)
- Watch for error rates
- Collect user feedback

**Success Criteria:**
- Search success rate > 98%
- p95 latency < 500ms
- Error rate < 0.5%
- No user complaints

**Rollback:** Set `SHOPIFY_SEARCH_ROLLOUT=0` in Oxygen env vars

---

### Phase 3: Feature Flag Rollout - Collections Navigation (Week 3)
**Goal:** Enable collections-based navigation for 25% of traffic

**Implementation:**
```typescript
// In v2/app/routes/_index.tsx
export function useCollectionsNav(env?: any): boolean {
  const rolloutPercent = parseFloat(env?.COLLECTIONS_NAV_ROLLOUT || '25');
  const userRandom = Math.random() * 100;
  
  return userRandom < rolloutPercent;
}
```

**Monitoring:**
- Track navigation click-through rates
- Monitor collection page load times
- Watch for 404 errors (redirect failures)
- Measure conversion rates

**Success Criteria:**
- Navigation CTR maintains or improves baseline
- Collection page p95 load < 2s
- 404 rate < 0.1%
- Conversion rate within 5% of baseline

**Rollback:** Set `COLLECTIONS_NAV_ROLLOUT=0`

---

### Phase 4: Full Search Rollout (Week 4)
**Goal:** 100% Shopify search, remove Algolia

**Steps:**
1. Set `SHOPIFY_SEARCH_ROLLOUT=100`
2. Monitor for 48 hours
3. If stable, remove Algolia dependencies:
   - `npm uninstall algoliasearch react-instantsearch`
   - Delete `app/lib/algolia.ts`
   - Delete `app/components/AlgoliaHeaderSearch.tsx`
4. Deploy cleanup changes

**Success Criteria:**
- No increase in error rates
- Search metrics maintain Phase 2 levels
- User feedback remains positive

**Rollback:** 
1. Redeploy previous version with Algolia
2. Set `SHOPIFY_SEARCH_ROLLOUT=0`
3. Investigate issues before retry

---

### Phase 5: Full Collections Navigation (Week 5)
**Goal:** 100% collections navigation, remove category-mapping

**Steps:**
1. Set `COLLECTIONS_NAV_ROLLOUT=100`
2. Monitor for 48 hours
3. If stable, remove legacy code:
   - Delete `app/lib/category-mapping.ts`
   - Update header component to remove legacy nav
4. Deploy cleanup changes

**Success Criteria:**
- Navigation metrics maintain Phase 3 levels
- No increase in bounce rate
- SEO traffic stable or improved

**Rollback:**
1. Redeploy previous version with category-mapping
2. Set `COLLECTIONS_NAV_ROLLOUT=0`
3. Investigate redirect issues

---

### Phase 6: Brand Media Pack Rollout (Week 6)
**Goal:** Display brand assets on product pages

**Implementation:**
- Brand assets load for brands with media packs (currently 2)
- Lazy loading prevents performance impact
- Graceful fallbacks for brands without assets

**Monitoring:**
- Measure PDP (Product Detail Page) load times
- Track image load failures
- Monitor conversion rates on pages with/without brand assets

**Success Criteria:**
- PDP load time increase < 200ms
- Image load success rate > 95%
- Conversion rate on brand asset pages maintains or improves

**Rollback:** Remove `<BrandSection>` component from PDP template

---

## Rollback Procedures

### Emergency Rollback (< 5 minutes)
**Use when:** Critical production issues detected

**Steps:**
1. Access Oxygen dashboard
2. Revert to previous stable deployment
3. Notify team of rollback
4. Begin incident investigation

**Alternative - Feature Flag Disable:**
```bash
# Disable Shopify search
oxygen env set SHOPIFY_SEARCH_ROLLOUT 0

# Disable collections navigation
oxygen env set COLLECTIONS_NAV_ROLLOUT 0
```

### Partial Rollback (Feature-Specific)
**Use when:** One feature is problematic, others are stable

**Search Issues:**
- Set `SHOPIFY_SEARCH_ROLLOUT=0`
- Monitor Algolia fallback performance
- Fix search issues offline
- Re-enable with lower percentage

**Navigation Issues:**
- Set `COLLECTIONS_NAV_ROLLOUT=0`
- Verify legacy URLs working
- Fix collection setup in Shopify admin
- Re-enable gradually

**Brand Assets Issues:**
- Remove `<BrandSection>` component temporarily
- Fix manifest or image loading
- Redeploy with fixes

---

## Monitoring & Alerts

### Key Metrics to Track

**Search Performance:**
- Query latency (p50, p95, p99)
- Success rate (results returned / queries)
- Zero-result rate
- Click-through rate on results

**Navigation Performance:**
- Collection page load time
- Navigation menu render time
- 404 error rate
- Bounce rate by collection

**Business Metrics:**
- Conversion rate
- Average order value
- Cart abandonment rate
- Session duration

**Technical Metrics:**
- Server error rate (5xx)
- Client error rate (4xx)
- API response times
- Cache hit rates

### Alert Thresholds

**Critical (immediate action):**
- Error rate > 5%
- p95 latency > 3s
- Conversion rate drop > 20%
- Complete feature failure

**Warning (investigate within 1 hour):**
- Error rate > 1%
- p95 latency > 1s
- Conversion rate drop > 10%
- Increased 404 rate

**Info (review daily):**
- Error rate > 0.5%
- p95 latency > 500ms
- Any metric trending negative

---

## SEO Preservation

### 301 Redirects
All legacy category URLs redirect to new collection URLs with 301 status:

```typescript
// Implemented in v2/app/lib/collections.ts
export const LEGACY_CATEGORY_REDIRECTS = {
  '/search?category=nic-salts': '/collections/e-liquids-nic-salts',
  '/search?category=disposable-vapes': '/collections/disposable-vapes',
  // ... 100+ more mappings
};
```

**Verification:**
- Test top 50 category URLs return 301
- Verify Google Search Console shows redirects
- Monitor organic traffic for drops

### Sitemap Updates
- Update sitemap.xml with collection URLs
- Submit updated sitemap to Google Search Console
- Monitor indexing status

### Meta Tag Migration
- Verify meta titles and descriptions on collections
- Ensure Open Graph tags present
- Validate schema.org markup

---

## Post-Deployment Validation

### Week 1 After Full Rollout
- [ ] Run full regression test suite
- [ ] Verify all SEO redirects working
- [ ] Check Core Web Vitals scores
- [ ] Review error logs for patterns
- [ ] Collect user feedback
- [ ] Compare business metrics to baseline

### Week 2-4
- [ ] Monitor long-term performance trends
- [ ] Analyze search analytics (GA4)
- [ ] Review conversion funnel changes
- [ ] Identify optimization opportunities

### Month 2
- [ ] Comprehensive performance audit
- [ ] User satisfaction survey
- [ ] SEO ranking analysis
- [ ] Plan optimizations for Month 3

---

## Success Criteria (Overall)

V2 deployment considered successful when:

1. **Performance:**
   - Search latency p95 < 500ms
   - Collection page load p95 < 2s
   - Core Web Vitals in "Good" range
   - No degradation from V1 baseline

2. **Reliability:**
   - Error rate < 0.5%
   - 99.9% uptime maintained
   - Zero SEO traffic loss

3. **Business Impact:**
   - Conversion rate within 5% of baseline
   - No increase in cart abandonment
   - User feedback positive (> 4/5 rating)

4. **Operational:**
   - Reduced maintenance overhead (no Algolia sync)
   - Faster deployment cycles
   - Easier content management (Shopify admin)

---

## Contact & Escalation

**Deployment Lead:** [Name]  
**Technical Lead:** [Name]  
**On-Call Engineer:** [Rotation]

**Escalation Path:**
1. Slack: #vapourism-deployments
2. PagerDuty: Critical alerts
3. Phone: [On-call number]

**Post-Mortem Template:**
- What happened?
- Root cause
- Impact (users, revenue, time)
- Resolution steps
- Prevention measures
- Action items

---

## Appendix

### A. Testing Checklist
See `v2/docs/migration-notes/testing-checklist.md`

### B. Performance Benchmarks
See `v2/docs/migration-notes/performance-benchmarks.md`

### C. SEO Redirect Map
Full list in `v2/app/lib/collections.ts`
