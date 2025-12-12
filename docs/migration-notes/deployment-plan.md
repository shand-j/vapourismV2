# V2 Deployment Plan

## Overview
This document outlines the strategy for deploying V2 architecture changes to production, including rollout phases, rollback procedures, and validation steps.

## Pre-Deployment Checklist

### 1. Environment Configuration

**Required Environment Variables:**
- [ ] `SESSION_SECRET` - Secure random string for session encryption (required)
- [ ] `PUBLIC_STORE_DOMAIN` - Your Shopify store domain (e.g., your-store.myshopify.com)
- [ ] `PRIVATE_SHOPIFY_ADMIN_TOKEN` or `SHOPIFY_ADMIN_TOKEN` - Admin API access token
- [ ] `USE_SHOPIFY_SEARCH=true` - Enable Shopify-native search
- [ ] `SHOPIFY_SEARCH_ROLLOUT=100` - Full rollout percentage (0-100)
- [ ] `COLLECTIONS_NAV_ROLLOUT=100` - Collections navigation rollout (0-100)
- [ ] `ENABLE_BRAND_ASSETS=true` - Enable brand media packs on PDPs

**Optional Environment Variables:**
- [ ] `PUBLIC_CHECKOUT_DOMAIN` - Custom checkout domain (if different from store domain)
- [ ] `AGEVERIF_PUBLIC_KEY` - JWT public key for AgeVerif integration
- [ ] `AGEVERIF_WEBHOOK_SECRET` - HMAC secret for AgeVerif webhooks
- [ ] `AGE_VERIF_METAFIELD_NAMESPACE` - Metafield namespace (default: vapourism)
- [ ] `AGE_VERIF_METAFIELD_KEY` - Metafield key (default: age_verification)
- [ ] `AGEVERIF_CREATE_CUSTOMER=false` - Auto-create customer from guest orders
- [ ] `AGEVERIF_DEBUG=false` - Enable debug logging

**Oxygen Environment Setup:**
```bash
# Set environment variables in Oxygen dashboard or via CLI
oxygen env set SESSION_SECRET "your-secure-random-string"
oxygen env set PUBLIC_STORE_DOMAIN "your-store.myshopify.com"
oxygen env set PRIVATE_SHOPIFY_ADMIN_TOKEN "shpat_xxxxx"
oxygen env set USE_SHOPIFY_SEARCH "true"
oxygen env set SHOPIFY_SEARCH_ROLLOUT "100"
oxygen env set COLLECTIONS_NAV_ROLLOUT "100"
oxygen env set ENABLE_BRAND_ASSETS "true"
```

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
- [ ] Measure current Shopify search latency
- [ ] Measure current page load times
- [ ] Document Core Web Vitals (LCP, FID, CLS)
- [ ] Establish acceptable performance thresholds

**Note:** Legacy Algolia has been removed from V2. All search functionality now uses Shopify Storefront API.

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

### Phase 2: GTM Production Deployment
**Goal:** Deploy V2 with full Shopify-native search and collections navigation

**Status:** ✅ Legacy Algolia removed - V2 is Shopify-native only

**Implementation:**
```typescript
// Environment variables for full production deployment
USE_SHOPIFY_SEARCH=true
SHOPIFY_SEARCH_ROLLOUT=100  // 100% of traffic
COLLECTIONS_NAV_ROLLOUT=100  // 100% of traffic
ENABLE_BRAND_ASSETS=true
```

**Pre-Deployment Verification:**
- Verify all environment variables are set in Oxygen
- Confirm Shopify collections are created and populated
- Test search functionality on staging
- Validate brand media packs are loading correctly
- Run full regression test suite

**Monitoring:**
- Track search query success rates
- Monitor search latency (p50, p95, p99)
- Watch for error rates
- Monitor conversion rates
- Track Core Web Vitals

**Success Criteria:**
- Search success rate > 98%
- p95 latency < 500ms
- Error rate < 0.5%
- Core Web Vitals in "Good" range
- No increase in cart abandonment

**Rollback:** Revert deployment via Oxygen dashboard if critical issues detected

---

### Phase 3: Post-Launch Monitoring (Week 1-2)
**Goal:** Monitor production performance and user experience

**Key Metrics:**
- Search performance (latency, success rate, zero-results)
- Navigation metrics (CTR, page load times)
- Business metrics (conversion rate, AOV, cart abandonment)
- Error rates and logs
- Core Web Vitals (LCP, FID, CLS)
- User feedback and support tickets

**Daily Actions:**
- Review error logs for patterns
- Monitor conversion funnel
- Check search analytics in GA4
- Track any 404 errors or broken redirects
- Review user feedback and complaints

**Success Criteria:**
- All metrics within expected ranges
- No critical bugs reported
- User feedback positive
- Conversion rate stable or improved

---

### Phase 4: Optimization Phase (Week 3-4)
**Goal:** Fine-tune performance and user experience based on production data

**Potential Optimizations:**
- Adjust search ranking algorithms if needed
- Optimize collection page performance
- Fine-tune brand media pack loading
- Improve cache strategies
- Update product tags for better search results

**Actions:**
- Analyze search query data for gaps
- Review slow-loading pages
- Optimize image loading strategies
- Consider A/B testing opportunities

---

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
# Disable Shopify search (fallback to basic search)
oxygen env set SHOPIFY_SEARCH_ROLLOUT 0

# Disable collections navigation (fallback to basic nav)
oxygen env set COLLECTIONS_NAV_ROLLOUT 0

# Disable brand assets
oxygen env set ENABLE_BRAND_ASSETS false
```

**Note:** V2 is fully Shopify-native with no legacy Algolia fallback. Emergency rollback should revert to the last stable deployment.

### Partial Rollback (Feature-Specific)
**Use when:** One feature is problematic, others are stable

**Search Issues:**
- Set `SHOPIFY_SEARCH_ROLLOUT=0` to disable advanced search features
- Investigate and fix issues in staging
- Re-enable gradually

**Navigation Issues:**
- Set `COLLECTIONS_NAV_ROLLOUT=0` to simplify navigation
- Verify collection redirects are working
- Fix collection setup in Shopify admin
- Re-enable gradually

**Brand Assets Issues:**
- Set `ENABLE_BRAND_ASSETS=false` temporarily
- Fix manifest or image loading issues
- Re-enable after verification

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
