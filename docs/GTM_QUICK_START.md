# VapourismV2 GTM Quick Start

## 🚀 Immediate Actions for Deployment

### 1. Set Environment Variables in Oxygen (5 minutes)

```bash
# Required - Set these via Shopify Admin or CLI
SESSION_SECRET="[generate-secure-32-char-string]"
PUBLIC_STORE_DOMAIN="your-store.myshopify.com"
PRIVATE_SHOPIFY_ADMIN_TOKEN="shpat_xxxxx"

# V2 Feature Flags - Full Production
USE_SHOPIFY_SEARCH="true"
SHOPIFY_SEARCH_ROLLOUT="100"
COLLECTIONS_NAV_ROLLOUT="100"
ENABLE_BRAND_ASSETS="true"
```

**Generate SESSION_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2. Deploy to Production (Auto via GitHub CI)

**Method 1: Push to Main Branch (Recommended)**
```bash
git checkout main
git merge copilot/start-implementation-vapourism-v2
git push origin main
```

**What happens automatically:**
1. ✅ GitHub Actions runs 77 unit tests
2. ✅ TypeScript type checking
3. ✅ Deploys to Oxygen (only if tests pass)
4. ⏱️ Total time: ~5-10 minutes

**Monitor deployment:** GitHub repo → Actions tab

**Method 2: Manual Deployment via CLI**
```bash
# Run tests first
npm test

# Then deploy
npx shopify hydrogen deploy
```

### 3. Verify Deployment (15 minutes)

Visit these URLs and verify:
- ✅ https://your-store.myshopify.com (homepage loads)
- ✅ https://your-store.myshopify.com/search?q=vape (search works)
- ✅ https://your-store.myshopify.com/collections (collections display)
- ✅ https://your-store.myshopify.com/products/[any-handle] (product pages work)

### 4. Monitor First 24 Hours

**Key Metrics:**
- Error rate < 0.5%
- Search working for all queries
- No broken collections or products
- Age verification modal appearing
- Checkout flow working

**Where to Monitor:**
- Shopify Admin → Settings → Hydrogen → Logs
- Google Analytics 4
- Support ticket volume

## 🆘 Emergency Contacts

**Rollback if Critical Issues:**
1. Shopify Admin → Settings → Hydrogen
2. Click "Deployments" tab
3. Select previous version
4. Click "Rollback"

**Support:**
- GitHub Issues: https://github.com/shand-j/vapourismV2/issues
- Tag issues with `production` or `urgent`

## 📚 Full Documentation

- **[Complete GTM Guide](./GTM_DEPLOYMENT_GUIDE.md)** - Full deployment procedures
- **[Deployment Plan](./migration-notes/deployment-plan.md)** - Detailed strategy
- **[README](../README.md)** - Developer documentation

## ✅ Pre-Launch Checklist

- [ ] Environment variables set in Oxygen
- [ ] SESSION_SECRET is secure (32+ chars)
- [ ] Shopify Admin token has correct permissions
- [ ] GitHub Actions workflow has deployment token
- [ ] **CI tests passing (check Actions tab)**
- [ ] Collections created in Shopify Admin
- [ ] Products have proper tags
- [ ] Team knows rollback procedure
- [ ] Monitoring tools are ready

---

**Status:** ✅ Ready for GTM Deployment  
**Last Updated:** December 2024
