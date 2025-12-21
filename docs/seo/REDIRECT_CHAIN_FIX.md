# Redirect Chain Fix - Implementation Guide

## Issue Summary
Semrush site audit identified redirect chains on the Vapourism website. Redirect chains harm SEO by:
- Wasting crawl budget
- Slowing page load times
- Potentially causing indexing issues
- Negatively impacting user experience

**Semrush Recommendation:** Do not use more than three redirects in a chain. Ideally, redirect directly to the final destination.

## Root Cause Analysis

### Issue 1: `/track-order` Redirect Chain
**Status:** ✅ FIXED

**Problem:** The `/track-order` route was causing a 3-4 redirect chain:
```
1. vapourism.co.uk/track-order 
   → www.vapourism.co.uk/track-order (Shopify primary domain redirect)

2. www.vapourism.co.uk/track-order 
   → b2xxju-ui.myshopify.com/account/orders (app redirect to myshopify domain)

3. b2xxju-ui.myshopify.com/account/orders 
   → shopify.com/90136969543/account (Shopify internal redirect)

4. Final destination with potential errors
```

**Root Cause:** The `track-order.tsx` loader was using:
```typescript
const shopDomain = context.env?.PUBLIC_STORE_DOMAIN || 'vapourism.co.uk';
return redirect(`https://${shopDomain}/account/orders`, { status: 301 });
```

Where `PUBLIC_STORE_DOMAIN` is set to the Shopify myshopify.com domain, causing an external redirect that Shopify then redirects again.

**Solution:** Changed to use a relative URL redirect:
```typescript
return redirect('/account/orders', { status: 301 });
```

**Result:** Reduced to just 2 redirects (one from Shopify for primary domain):
```
1. vapourism.co.uk/track-order 
   → www.vapourism.co.uk/track-order (Shopify primary domain - unavoidable)

2. www.vapourism.co.uk/track-order 
   → www.vapourism.co.uk/account/orders (app redirect - direct to final destination)
```

## Files Changed

### 1. `app/routes/track-order.tsx`
- Changed from external redirect to relative redirect
- Updated comments to document the fix
- Commit: `3b054ad`

## Testing Procedures

### 1. Test Individual URLs
Use curl to test redirect chains:

```bash
# Test with www (should be 1 redirect)
curl -sI -L --max-redirs 5 https://www.vapourism.co.uk/track-order | grep -E "(HTTP|location:)"

# Test without www (should be 2 redirects)
curl -sI -L --max-redirs 5 https://vapourism.co.uk/track-order | grep -E "(HTTP|location:)"
```

**Expected Results:**
- www version: 1 redirect (301 to /account/orders)
- non-www version: 2 redirects (301 to www, then 301 to /account/orders)
- Final status: 200 OK (or 302 for login redirect)

### 2. Test URL Normalization
Test that percent-encoded URLs don't create chains:

```bash
# Test uppercase hex digits (should normalize with 1 redirect)
curl -sI https://www.vapourism.co.uk/products/test%2FPath | grep -E "(HTTP|location:)"

# Test already-normalized URL (should not redirect)
curl -sI https://www.vapourism.co.uk/products/test%2fpath | grep -E "(HTTP|location:)"
```

**Expected Results:**
- Uppercase hex: 1 redirect (301 to lowercase hex)
- Already normalized: No redirect (200 OK)

### 3. Verify in Browser
1. Open browser developer tools (Network tab)
2. Visit `https://vapourism.co.uk/track-order`
3. Check the network waterfall for redirect count
4. Should see at most 2 redirects total

### 4. Check Shopify Admin Redirects
⚠️ **IMPORTANT:** Check Shopify Admin for any URL redirects that might cause chains.

1. Log into Shopify Admin
2. Navigate to: Settings → Apps and sales channels → Online Store → URL Redirects
3. Look for any redirects that could chain with our app redirects
4. Common patterns to check:
   - `/track-order` → should NOT be configured (handled by app)
   - `/account/*` paths → verify they don't redirect
   - Any `/collections/*` redirects
   - Product handle redirects

**Action:** Remove any Shopify admin redirects for URLs handled by the app.

### 5. Monitor Semrush Audit
1. Wait for next Semrush crawl (typically 24-48 hours after deployment)
2. Review audit results at: https://www.semrush.com/siteaudit/campaign/27614008
3. Check the "Redirect chains and loops" issue
4. Should see reduction or elimination of reported issues

## Potential Additional Issues

### URL Normalization in server.ts
**Status:** ✅ REVIEWED - No issues found

The `normalizeUrl()` function in `server.ts` normalizes percent-encoded characters to lowercase (SEO best practice). This could theoretically create a chain if:
- A URL needs normalization AND
- The normalized URL triggers another redirect

**Analysis:** This is not an issue because:
1. Normalization returns early with a 301 redirect
2. The normalized URL is cached (immutable cache header)
3. Subsequent requests use the normalized URL directly
4. No additional redirects are triggered

**No action needed.**

### storefrontRedirect for 404s
**Status:** ✅ REVIEWED - Working correctly

The `storefrontRedirect()` function in `server.ts` handles 404 errors by checking Shopify's redirect configuration. This could theoretically create a chain if:
- A URL returns 404 AND
- Shopify has a redirect configured AND
- That redirect also returns 404

**Analysis:** This is acceptable because:
1. It's Shopify's built-in redirect feature
2. Shopify redirects are managed in admin (not our code)
3. Used for legacy URLs and product handle changes
4. Should not create long chains if configured correctly

**Action:** Audit Shopify admin redirects (see test #4 above)

## Deployment Checklist

- [x] Code changes committed and pushed
- [ ] Changes deployed to production (Oxygen)
- [ ] Testing completed (see procedures above)
- [ ] Shopify admin redirects audited
- [ ] Semrush audit monitored
- [ ] Results documented

## Success Metrics

After deployment and Semrush re-crawl, we should see:
- ✅ Reduction in "Redirect chains and loops" errors
- ✅ Improved crawl efficiency
- ✅ No increase in 404 errors
- ✅ Maintained or improved page load times

## Additional Recommendations

### 1. Use Environment Variables Correctly
- `PUBLIC_STORE_DOMAIN`: Shopify myshopify.com domain (for admin API calls)
- `PRODUCTION_DOMAIN`: Public-facing domain (for canonical URLs)
- For customer-facing redirects: **Use relative URLs** whenever possible

### 2. Avoid External Redirects
- Use relative URLs for same-domain redirects
- Only use absolute URLs when redirecting to external sites
- This avoids chains caused by domain canonicalization

### 3. Monitor Regularly
- Set up Semrush alerts for redirect chain issues
- Include redirect chain testing in CI/CD pipeline
- Review Shopify admin redirects quarterly

### 4. Document Redirects
- Maintain a list of intentional redirects
- Document the reason for each redirect
- Review and clean up obsolete redirects

## References

- Semrush Audit: https://www.semrush.com/siteaudit/campaign/27614008
- Semrush Issue Details: `docs/seo/SEMrush _Issues/7f16a0cbf78b1c189c8bdca3e2357c34bea6388c`
- GitHub PR: See pull request for this branch in the repository
- Shopify Redirect Docs: https://help.shopify.com/en/manual/online-store/menus-and-links/url-redirect

## Contact

For questions or issues related to this fix:
- Review PR comments
- Check Semrush audit results
- Test redirects using curl commands above
