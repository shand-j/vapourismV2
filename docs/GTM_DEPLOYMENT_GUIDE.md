# VapourismV2 GTM Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying VapourismV2 to production for Go-To-Market (GTM) launch. The V2 architecture uses Shopify-native search and collections navigation, with no legacy Algolia dependencies.

## Prerequisites

### Automated CI Testing
Every push to the repository automatically runs:
- ✅ **Unit Tests** - 77 tests validate core functionality
- ✅ **Type Checking** - TypeScript compilation verification
- ✅ **Deployment Gate** - Deployment only proceeds if tests pass

**To verify CI status:** Go to GitHub repository → Actions tab → Check workflow runs

### GitHub Secrets Configuration
Ensure the following secret is configured in your GitHub repository:
- `OXYGEN_DEPLOYMENT_TOKEN_1000039061` - Token for deploying to Shopify Oxygen

**To verify:** Go to GitHub repository → Settings → Secrets and variables → Actions

### Shopify Admin Setup
- [ ] Shopify store is configured with products
- [ ] Collections are created and organized
- [ ] Product tags are optimized (see `scripts/` for tagging utilities)
- [ ] Brand media packs are prepared (see `public/media_packs/`)

## Environment Variables

### Required Variables (Production)
Set these in your Oxygen environment:

```bash
# Core Authentication
SESSION_SECRET="[secure-random-string-min-32-chars]"
PUBLIC_STORE_DOMAIN="your-store.myshopify.com"
PRIVATE_SHOPIFY_ADMIN_TOKEN="shpat_xxxxx"

# V2 Feature Flags (Full Rollout)
USE_SHOPIFY_SEARCH="true"
SHOPIFY_SEARCH_ROLLOUT="100"
COLLECTIONS_NAV_ROLLOUT="100"
ENABLE_BRAND_ASSETS="true"
```

### Optional Variables
```bash
# Checkout Configuration
PUBLIC_CHECKOUT_DOMAIN="checkout.your-domain.com"

# Age Verification Integration
AGEVERIF_PUBLIC_KEY="[PEM-format-public-key]"
AGEVERIF_WEBHOOK_SECRET="[webhook-hmac-secret]"
AGE_VERIF_METAFIELD_NAMESPACE="vapourism"
AGE_VERIF_METAFIELD_KEY="age_verification"
AGEVERIF_CREATE_CUSTOMER="false"
AGEVERIF_DEBUG="false"
```

### Setting Environment Variables in Oxygen

**Via Shopify CLI:**
```bash
npx shopify hydrogen env set SESSION_SECRET "your-secure-secret"
npx shopify hydrogen env set PUBLIC_STORE_DOMAIN "your-store.myshopify.com"
npx shopify hydrogen env set PRIVATE_SHOPIFY_ADMIN_TOKEN "shpat_xxxxx"
npx shopify hydrogen env set USE_SHOPIFY_SEARCH "true"
npx shopify hydrogen env set SHOPIFY_SEARCH_ROLLOUT "100"
npx shopify hydrogen env set COLLECTIONS_NAV_ROLLOUT "100"
npx shopify hydrogen env set ENABLE_BRAND_ASSETS "true"
```

**Via Shopify Admin Dashboard:**
1. Navigate to Settings → Hydrogen
2. Select your storefront
3. Go to Environment Variables section
4. Add each variable with its corresponding value

## Deployment Steps

### 1. Pre-Deployment Verification

```bash
# Clone the repository
git clone https://github.com/shand-j/vapourismV2.git
cd vapourismV2

# Install dependencies
npm ci

# Run tests
npm test

# Verify build (requires proper Shopify credentials)
npm run build
```

### 2. Deploy to Production

**Option A: Automatic Deployment via CI/CD (Recommended)**
1. Push to the `main` branch or configured deployment branch
2. GitHub Actions automatically:
   - Runs unit tests (77 tests)
   - Performs TypeScript type checking
   - Deploys to Oxygen only if all tests pass
3. Monitor workflow: GitHub repository → Actions tab
4. Deployment typically completes in 5-10 minutes

**CI Pipeline Flow:**
```
Push to branch → Install dependencies → Run tests → Type check → Deploy to Oxygen
                                           ↓ (if tests fail)
                                    ❌ Deployment blocked
```

**Option B: Manual Deployment**
```bash
# Ensure you're on the correct branch
git checkout main

# Run tests locally first
npm test

# Deploy using Shopify CLI
npx shopify hydrogen deploy

# Follow the prompts to select your environment
```

### 3. Post-Deployment Verification

#### Smoke Tests
Test the following critical paths after deployment:

1. **Homepage**
   - [ ] Page loads without errors
   - [ ] Navigation menu displays correctly
   - [ ] Featured products/collections visible

2. **Search Functionality**
   - [ ] Search bar is responsive
   - [ ] Autocomplete suggestions appear
   - [ ] Search results page displays products
   - [ ] Filters and facets work correctly

3. **Collections Navigation**
   - [ ] Collections menu loads
   - [ ] Collection pages display products
   - [ ] Product counts are accurate
   - [ ] Legacy category URLs redirect properly (301)

4. **Product Pages**
   - [ ] Product details display correctly
   - [ ] Images load properly
   - [ ] Brand assets display (if available)
   - [ ] Add to cart functions
   - [ ] Variant selection works

5. **Cart & Checkout**
   - [ ] Cart drawer opens and displays items
   - [ ] Cart updates work (quantity, remove)
   - [ ] Shipping restrictions validate correctly
   - [ ] Checkout redirects to Shopify checkout

6. **Compliance Features**
   - [ ] Age verification modal appears for new sessions
   - [ ] Age verification persists for verified users
   - [ ] Shipping restrictions prevent invalid orders

#### Performance Checks
```bash
# Test key pages with Lighthouse
- Homepage: https://your-store.myshopify.com
- Search: https://your-store.myshopify.com/search?q=vape
- Collection: https://your-store.myshopify.com/collections/[handle]
- Product: https://your-store.myshopify.com/products/[handle]
```

**Expected Metrics:**
- Performance Score: > 80
- First Contentful Paint (FCP): < 2s
- Largest Contentful Paint (LCP): < 2.5s
- Total Blocking Time (TBT): < 300ms

## Monitoring & Alerts

### Key Metrics to Monitor (First 48 Hours)

1. **Error Rates**
   - Client-side errors (browser console)
   - Server-side errors (Oxygen logs)
   - API failures (Shopify Storefront API)

2. **Performance**
   - Page load times (p50, p95, p99)
   - Search latency
   - Time to Interactive (TTI)
   - Core Web Vitals

3. **Business Metrics**
   - Traffic volume
   - Conversion rate
   - Cart abandonment rate
   - Average order value
   - Search usage

4. **User Experience**
   - 404 error rate
   - Search zero-results rate
   - Support ticket volume
   - User feedback

### Where to Monitor

**Oxygen Dashboard:**
- Deployment status and health
- Runtime errors and logs
- Performance metrics

**Google Analytics 4:**
- Traffic patterns
- User behavior
- Conversion funnel
- Search analytics

**Shopify Admin:**
- Order volume
- Revenue metrics
- Customer data

## Rollback Procedures

### Emergency Rollback (Critical Issues)

**Via Oxygen Dashboard:**
1. Log into Shopify Admin
2. Navigate to Settings → Hydrogen
3. Select your storefront
4. Click "Deployments" tab
5. Select previous stable deployment
6. Click "Rollback to this version"
7. Confirm rollback

**Expected Time:** < 5 minutes

### Feature Flag Rollback (Partial Issues)

If only specific features are problematic:

```bash
# Disable advanced search features
npx shopify hydrogen env set SHOPIFY_SEARCH_ROLLOUT "0"

# Disable collections navigation
npx shopify hydrogen env set COLLECTIONS_NAV_ROLLOUT "0"

# Disable brand assets
npx shopify hydrogen env set ENABLE_BRAND_ASSETS "false"
```

**Note:** Environment variable changes take effect immediately without redeployment.

## Troubleshooting

### Common Issues

#### Issue: Search not returning results
**Symptoms:** Search queries return empty results or errors

**Solutions:**
1. Verify `USE_SHOPIFY_SEARCH` is set to "true"
2. Check Shopify Storefront API credentials
3. Ensure products have proper tags and descriptions
4. Review search query in Oxygen logs

#### Issue: Collections navigation not displaying
**Symptoms:** Navigation menu is empty or shows errors

**Solutions:**
1. Verify collections exist in Shopify Admin
2. Check `COLLECTIONS_NAV_ROLLOUT` is set to "100"
3. Ensure collections have products assigned
4. Review `app/lib/collections.ts` for configuration

#### Issue: Brand assets not loading
**Symptoms:** Product pages missing brand logos/images

**Solutions:**
1. Verify `ENABLE_BRAND_ASSETS` is "true"
2. Check `public/media_packs/manifest.json` exists
3. Ensure brand vendor names match manifest entries
4. Review browser console for image loading errors

#### Issue: Age verification not working
**Symptoms:** Modal not appearing or verification failing

**Solutions:**
1. Check browser localStorage for `vapourism_age_verified` key
2. Verify `useAgeVerification` hook is imported correctly
3. Review age verification route handlers
4. Check AgeVerif integration credentials (if using external service)

#### Issue: High error rates
**Symptoms:** 500 errors, broken pages, functionality not working

**Actions:**
1. Check Oxygen logs for error details
2. Review recent code changes in deployment
3. Verify environment variables are set correctly
4. Consider immediate rollback if critical

## Success Criteria

The GTM launch is considered successful when:

✅ **Availability:** 99.9% uptime in first week  
✅ **Performance:** Core Web Vitals in "Good" range  
✅ **Functionality:** All smoke tests passing  
✅ **Errors:** < 0.5% error rate  
✅ **Business:** Conversion rate stable or improved  
✅ **User Experience:** Positive feedback, low support volume

## Post-Launch Optimization

### Week 1-2: Monitor and Stabilize
- Review metrics daily
- Address any bugs or issues quickly
- Collect user feedback
- Document any learnings

### Week 3-4: Optimize
- Analyze search query patterns
- Optimize slow-loading pages
- Fine-tune product tags for better search results
- A/B test opportunities

### Month 2+: Enhance
- Add more brand media packs
- Improve search relevance algorithms
- Optimize conversion funnel
- Plan new features based on user behavior

## Support Contacts

**Deployment Issues:**
- GitHub Repository: https://github.com/shand-j/vapourismV2
- Create an issue with `deployment` label

**Shopify/Oxygen Support:**
- Shopify Partner Dashboard
- Oxygen documentation: https://shopify.dev/docs/custom-storefronts/oxygen

## References

- [Full Deployment Plan](./migration-notes/deployment-plan.md)
- [V2 Implementation Guide](./implementation-guide.md)
- [Product Tagging Reference](./tagging-reference.md)
- [Environment Variables Reference](../.env.example)
- [Shopify Hydrogen Docs](https://shopify.dev/docs/custom-storefronts/hydrogen)
- [Oxygen Deployment Guide](https://shopify.dev/docs/custom-storefronts/oxygen/deployment)

---

**Last Updated:** December 2024  
**Version:** V2 GTM Launch
