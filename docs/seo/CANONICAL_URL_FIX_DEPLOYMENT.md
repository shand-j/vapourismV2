# Canonical URL Fix - Deployment Guide

## Overview
This document describes the fix for canonical URL issues identified in the SEO audit where product and collection pages were showing `vapourism.myshopify.com` canonical URLs instead of the production domain `www.vapourism.co.uk`.

## Problem Statement
The SearchAtlas OTTO SEO audit identified 100+ pages with incorrect canonical URLs:
- **Current (incorrect)**: `https://vapourism.myshopify.com/products/...`
- **Expected (correct)**: `https://www.vapourism.co.uk/products/...`

This was causing SEO issues because search engines were seeing the wrong canonical URL.

## Root Cause
In `app/root.tsx`, the canonical URL was built using `data.shop?.primaryDomain?.url` from Shopify's Storefront API, which returns the myshopify.com domain instead of the custom production domain.

## Solution Implemented
1. Added `PRODUCTION_DOMAIN` environment variable to override Shopify's domain
2. Updated all route files to use `www.vapourism.co.uk` consistently
3. Updated Schema.org structured data across all pages
4. Added unit tests to prevent regressions

## Files Changed
- `app/root.tsx` - Canonical URL generation logic
- `env.d.ts` - Added PRODUCTION_DOMAIN type
- `.env.example` - Documented new environment variable
- `app/preserved/seo-automation.ts` - Breadcrumb URLs
- 14 route files - Hardcoded URLs updated
- `tests/unit/canonical-urls.test.tsx` - New test suite

## Deployment Steps

### 1. Set Environment Variable (CRITICAL)
In your Shopify Oxygen deployment settings, add:
```
PRODUCTION_DOMAIN=https://www.vapourism.co.uk
```

**Important**: If this variable is not set, the system will use the hardcoded fallback `https://www.vapourism.co.uk`, so the fix will still work.

### 2. Deploy to Production
```bash
# Deploy using Shopify CLI
shopify hydrogen deploy

# Or through GitHub Actions (if configured)
git push origin main
```

### 3. Verification Steps

#### A. Check Canonical Tags (Sample Pages)
```bash
# Product page
curl -s https://www.vapourism.co.uk/products/geekvape-q-side-fill-replacement-pods-xl-0-4ohm-0-6ohm-0-8ohm-1-2ohm | grep canonical

# Expected output:
# <link rel="canonical" href="https://www.vapourism.co.uk/products/geekvape-q-side-fill-replacement-pods-xl-0-4ohm-0-6ohm-0-8ohm-1-2ohm" />

# Collection page
curl -s https://www.vapourism.co.uk/collections/hayati-x4 | grep canonical

# Expected output:
# <link rel="canonical" href="https://www.vapourism.co.uk/collections/hayati-x4" />
```

#### B. Check Schema.org Structured Data
```bash
curl -s https://www.vapourism.co.uk/products/10mg-maryliq-nic-salt-by-lost-mary-10ml-50vg-50pg | grep -o 'vapourism.myshopify.com'

# Expected output: (empty - no myshopify.com references)
```

#### C. Manual Browser Check
1. Open any product page: https://www.vapourism.co.uk/products/voopoo-argus-z2-pod-vape-kit-20w
2. View page source (Ctrl+U or Cmd+Option+U)
3. Search for `canonical` - should show `www.vapourism.co.uk`
4. Search for `myshopify.com` - should find **0 results**

#### D. Run Unit Tests (Optional)
```bash
npm test -- tests/unit/canonical-urls.test.tsx
```

### 4. Post-Deployment Monitoring

#### Search Console
1. Log into Google Search Console
2. Go to Coverage Report
3. Monitor for canonical URL updates over next 7-14 days
4. Verify no new canonical errors appear

#### OTTO SEO Tool
1. Re-run the SearchAtlas OTTO scan
2. Verify canonical link issues are resolved
3. Compare before/after report

## Affected Pages
All pages on the site, including but not limited to:
- ✅ Product pages (~1000+ pages)
- ✅ Collection pages (11 custom collection pages)
- ✅ Homepage
- ✅ About, Contact, FAQ pages
- ✅ Guide pages (age verification, certifications, sustainability)
- ✅ Policy pages
- ✅ Blog pages

## Rollback Plan
If issues arise:

1. **Option A** - Remove environment variable:
   - The system will fall back to hardcoded `https://www.vapourism.co.uk`
   - No code rollback needed

2. **Option B** - Full rollback:
   ```bash
   git revert <commit-hash>
   shopify hydrogen deploy
   ```

## Testing Results
✅ Unit tests created covering:
- Canonical URL generation logic
- Environment variable fallback behavior
- Schema.org URL consistency
- CSV report issue validation

✅ Code review passed with 1 minor fix applied

✅ Security scan: No vulnerabilities introduced

## Success Metrics
- **Before**: 100+ pages with wrong canonical URLs
- **After**: 0 pages with wrong canonical URLs
- **Impact**: Improved SEO, better search engine indexing

## Support & Troubleshooting

### Issue: Canonical still shows myshopify.com
**Solution**: 
1. Check environment variable is set in Oxygen
2. Clear CDN cache
3. Verify deployment completed successfully

### Issue: Pages return 404 after deployment
**Solution**: 
- This fix only changes URL strings in HTML output
- URLs themselves are unchanged
- Check for unrelated deployment issues

### Issue: Tests fail locally
**Solution**:
```bash
npm ci  # Reinstall dependencies
npm test -- tests/unit/canonical-urls.test.tsx
```

## Related Documents
- SEO Audit Report: `docs/seo/issues/OTTO Project Fixes - canonical_link.csv`
- Original Issue: GitHub issue #[number]
- PR: #[number]

## Questions?
Contact: engineering team or SEO team

---
Last Updated: 2025-12-16
