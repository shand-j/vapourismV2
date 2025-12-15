# Shopify Setup Guide - Keyword Gap Implementation

**Implementation Date**: December 2025  
**Pages Deployed**: 7 SEO-optimized pages  
**Expected Impact**: 650k+ monthly searches targeted

---

## Overview

This guide provides step-by-step instructions for configuring Shopify to support the new SEO collection pages created to address the 10,000 keyword gap analysis.

### What's Included

**New Collection Pages:**
1. Nicotine Pouches (main category)
2. Velo Nicotine Pouches (brand)
3. Zyn Nicotine Pouches (brand)
4. Hayati Pro Ultra 25000 (disposable vapes)

**Enhanced Pages:**
5. Homepage (SEO optimized)
6. Payment Methods (new)
7. Delivery Information (enhanced)

---

## Part 1: Product Tagging

All collection pages use tag-based navigation. Products must be tagged correctly in Shopify.

### Required Tags

#### Nicotine Pouches
- `nicotine_pouches` - Main category tag
- `velo` - For Velo brand products
- `zyn` - For Zyn brand products
- `nordic_spirit` - For Nordic Spirit products
- `snus` - Alternative term (some products)

#### Hayati Pro Ultra
- `hayati` - Brand tag
- `pro_ultra` - Product line
- `disposable` - Product type
- `25000_puffs` - Feature tag (optional)

### How to Add Tags

1. **Navigate to Products**
   - Go to Shopify Admin → Products

2. **Bulk Tag Multiple Products**
   - Select products using checkboxes
   - Click "Add tags" in the bulk actions bar
   - Enter tags separated by commas
   - Click "Apply"

3. **Tag Individual Products**
   - Open product page
   - Scroll to "Tags" field
   - Enter tags separated by commas
   - Click "Save"

**Example Tags for a Product:**
```
velo, nicotine_pouches, mint, 10mg, tobacco_free
```

---

## Part 2: Product Inventory Setup

### Nicotine Pouches

If you don't currently stock nicotine pouches, here's what you need:

**Minimum Product Requirements:**
- At least 10-15 products per brand to make pages viable
- Mix of flavors (mint, menthol, fruit)
- Multiple strengths (3mg, 6mg, 10mg, etc.)

**Recommended Brands (Priority Order):**
1. **Velo** - Market leader (27k monthly searches)
2. **Zyn** - Premium brand (22k monthly searches)
3. **Nordic Spirit** - Scandinavian quality
4. **Lyft** - Alternative option
5. **White Fox** - Strong option

**Product Information to Include:**
- Clear product titles (e.g., "Velo Ice Cool Nicotine Pouches 10mg")
- Detailed descriptions (strength, flavor, pouch count)
- High-quality product images
- Vendor name set correctly
- Product type: "Nicotine Pouches"
- Nicotine strength in title/description

### Hayati Pro Ultra

If you don't stock these yet:

**Product Requirements:**
- Hayati Pro Ultra 25000 puff disposable vapes
- Multiple flavors (minimum 8-10)
- Clear product images
- Price point around £12-£15 (typical market rate)

**Note:** If you don't stock Hayati Pro Ultra, the page will show "coming soon" message which is still good for SEO.

---

## Part 3: Product Type Configuration

Ensure product types are set correctly for filtering:

1. **Navigate to Products**
2. **Edit Product**
3. **Set Product Type:**
   - Nicotine pouches: "Nicotine Pouches"
   - Hayati disposables: "Disposable Vape" or "Disposable"
   - E-liquids: "E-Liquid"

**Consistent naming is critical for tag-based search to work properly.**

---

## Part 4: Collection Configuration (Optional)

While the new pages use tag-based search, you can optionally create Smart Collections for Shopify admin organization:

### Create Smart Collection: Nicotine Pouches

1. **Navigate to Collections**
   - Shopify Admin → Products → Collections
   - Click "Create collection"

2. **Collection Settings:**
   - **Title:** `Nicotine Pouches`
   - **Handle:** `nicotine-pouches`
   - **Collection type:** Smart collection

3. **Conditions:**
   - **Condition 1:** Product tag contains `nicotine_pouches`
   - **OR Condition 2:** Product type equals `Nicotine Pouches`

4. **SEO Settings:**
   - **Page title:** `Nicotine Pouches UK | Tobacco-Free Nicotine | Vapourism 2025`
   - **Meta description:** `Shop premium nicotine pouches UK. ✓ Velo ✓ Zyn ✓ Nordic Spirit ✓ Fast UK delivery.`

5. **Click Save**

### Create Smart Collection: Velo Pouches

1. **Collection Settings:**
   - **Title:** `Velo Nicotine Pouches`
   - **Handle:** `velo-nicotine-pouches`
   - **Collection type:** Smart collection

2. **Conditions:**
   - **Condition 1:** Product tag contains `velo` AND Product tag contains `nicotine_pouches`
   - **OR Condition 2:** Product vendor equals `Velo`

3. **SEO Settings:**
   - **Page title:** `Velo Nicotine Pouches UK | Premium Tobacco-Free | Vapourism 2025`
   - **Meta description:** `Shop Velo nicotine pouches UK. ✓ Multiple strengths ✓ Great flavors ✓ Fast delivery.`

### Create Smart Collection: Zyn Pouches

1. **Collection Settings:**
   - **Title:** `Zyn Nicotine Pouches`
   - **Handle:** `zyn-nicotine-pouches`
   - **Collection type:** Smart collection

2. **Conditions:**
   - **Condition 1:** Product tag contains `zyn` AND Product tag contains `nicotine_pouches`
   - **OR Condition 2:** Product vendor equals `Zyn`

3. **SEO Settings:**
   - **Page title:** `Zyn Nicotine Pouches UK | Premium Tobacco-Free | Vapourism 2025`
   - **Meta description:** `Shop Zyn nicotine pouches UK. ✓ Premium US brand ✓ Great flavors ✓ Fast delivery.`

### Create Smart Collection: Hayati Pro Ultra

1. **Collection Settings:**
   - **Title:** `Hayati Pro Ultra`
   - **Handle:** `hayati-pro-ultra`
   - **Collection type:** Smart collection

2. **Conditions:**
   - **Condition 1:** Product tag contains `hayati` AND Product tag contains `pro_ultra`
   - **OR Condition 2:** Product vendor equals `Hayati` AND Product title contains `Pro Ultra`

3. **SEO Settings:**
   - **Page title:** `Hayati Pro Ultra 25000 | Premium Disposable Vapes UK | Vapourism 2025`
   - **Meta description:** `Shop Hayati Pro Ultra 25000 puff disposable vapes. ✓ 25,000 puffs ✓ Fast UK delivery.`

---

## Part 5: Navigation Menu (Optional)

Add new categories to your navigation menu:

1. **Navigate to Navigation**
   - Shopify Admin → Online Store → Navigation

2. **Edit Main Menu**
   - Click on your main menu (usually "Main menu")

3. **Add Menu Items:**

**Nicotine Pouches Section:**
```
Menu Item: Nicotine Pouches
Link: /collections/nicotine-pouches
  Sub-item: Velo → /collections/velo-nicotine-pouches
  Sub-item: Zyn → /collections/zyn-nicotine-pouches
  Sub-item: All Nicotine Pouches → /collections/nicotine-pouches
```

**Disposables Section (add to existing):**
```
Menu Item: Disposable Vapes
  Existing items...
  Sub-item: Hayati Pro Ultra → /collections/hayati-pro-ultra
  Sub-item: Hayati Pro Max → /collections/hayati-pro-max
```

**Information Section:**
```
Menu Item: Information
  Sub-item: Payment Methods → /pages/payment-methods
  Sub-item: Delivery Information → /policies/delivery-information
```

4. **Click Save**

---

## Part 6: Search Configuration

The new pages use Shopify's native search. Ensure search is working:

1. **Test Search Functionality**
   - Go to your storefront
   - Search for "nicotine pouches"
   - Search for "velo"
   - Search for "hayati pro ultra"

2. **Verify Results**
   - Products should appear if they're published and tagged correctly
   - If no results, check:
     - Products are published to "Online Store" channel
     - Tags are applied correctly
     - Products are in stock (or allow backorders)

---

## Part 7: Age Verification

Since you're adding nicotine pouches (age-restricted):

1. **Verify Age Gate**
   - Ensure age verification modal is active
   - Test the flow on checkout

2. **Product Age Restrictions**
   - Nicotine pouches must require age verification
   - This may need to be configured in your age verification app

---

## Part 8: Payment Methods Setup

The new payment methods page references:

### Clearpay
1. **Install Clearpay App** (if not already installed)
   - Shopify Admin → Apps → Visit App Store
   - Search for "Clearpay" or "Afterpay"
   - Install and configure

2. **Enable at Checkout**
   - Ensure Clearpay is enabled as a payment method

### PayPal
1. **Verify PayPal Integration**
   - Shopify Admin → Settings → Payments
   - Ensure PayPal is enabled

### Klarna
1. **Install Klarna** (optional, if you want this)
   - Shopify Admin → Apps → Visit App Store
   - Search for "Klarna"
   - Install and configure

---

## Part 9: Verification Checklist

Before going live, verify:

- [ ] All products tagged correctly with required tags
- [ ] Nicotine pouches products added (or pages show "coming soon")
- [ ] Product types set consistently
- [ ] Smart collections created and working (optional)
- [ ] Navigation menu updated (optional)
- [ ] Search functionality tested
- [ ] Age verification working for nicotine pouches
- [ ] Payment methods (Clearpay, PayPal) enabled
- [ ] All pages accessible (test each URL)

---

## Part 10: Testing URLs

Test these URLs work on your store:

**New Collection Pages:**
- `https://your-store.myshopify.com/collections/nicotine-pouches`
- `https://your-store.myshopify.com/collections/velo-nicotine-pouches`
- `https://your-store.myshopify.com/collections/zyn-nicotine-pouches`
- `https://your-store.myshopify.com/collections/hayati-pro-ultra`

**Enhanced Pages:**
- `https://your-store.myshopify.com/` (homepage)
- `https://your-store.myshopify.com/pages/payment-methods`
- `https://your-store.myshopify.com/policies/delivery-information`

---

## Part 11: Going Live

**Deployment Order:**

1. **Deploy Code First**
   - Merge PR to main branch
   - Deploy to Oxygen

2. **Configure Shopify Second**
   - Add product tags
   - Create collections (optional)
   - Update navigation (optional)

3. **Test Everything**
   - Verify all URLs work
   - Check products display correctly
   - Test internal links

4. **Monitor Initial Performance**
   - Check Google Search Console
   - Monitor page views in analytics
   - Track keyword rankings (give it 2-4 weeks)

---

## Expected Timeline

- **Week 1:** Initial indexing by Google
- **Week 2-4:** Gradual ranking improvements
- **Week 4-8:** Stabilization and traffic growth
- **Week 8-12:** Peak performance (estimated 55k-110k monthly visits)

---

## Support

If you encounter issues:

1. **Check product tags** - Most common issue
2. **Verify products are published** - Must be visible on "Online Store" channel
3. **Test search** - Ensure Shopify search returns results
4. **Review page content** - Pages should load even with 0 products (graceful degradation)

---

## Next Steps

After completing this setup, consider:

1. **Add more products** - More inventory = better conversion
2. **Create guides** - Nicotine pouches buying guide, comparison articles
3. **Build backlinks** - Share pages on social media, forums
4. **Monitor rankings** - Use Google Search Console to track progress
5. **Expand categories** - Add more brand pages based on performance

---

## Summary

This implementation targets **650k+ monthly searches** with minimal setup:

- 7 new/enhanced pages
- Tag-based navigation (no complex collection rules)
- Graceful degradation (works even without products)
- SEO-optimized content
- Internal linking structure
- Mobile-responsive design

**Estimated Impact:** 55k-110k monthly organic visits within 12 weeks.
