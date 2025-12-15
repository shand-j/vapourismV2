# Manual Testing Plan - Week 1 SEO Collection Pages

**Version**: 1.0  
**Date**: December 15, 2025  
**Pages to Test**: 6 collection pages (aligned with inventory)  
**Estimated Testing Time**: 4-6 hours (including Shopify setup)

---

## 📋 Testing Overview

This manual testing plan covers:
1. **Shopify Configuration** (Collections, Products, Tags)
2. **Frontend Testing** (Page loads, SEO, responsiveness)
3. **Integration Testing** (Search, links, navigation)
4. **Performance & Security** (Load times, security headers)
5. **SEO Validation** (Meta tags, structured data, indexability)

---

## Phase 1: Pre-Testing Setup (Shopify Configuration)

### 1.1 Shopify Server Configuration

**No server-side configuration required.** This is a Hydrogen storefront that uses:
- Shopify Storefront API (already configured via environment variables)
- No custom server-side routes or webhooks needed for these collection pages
- Collections are managed via Shopify Admin UI

**Environment Variables to Verify:**
```bash
# Check these exist in .env file
SESSION_SECRET=<exists>
PUBLIC_STOREFRONT_API_TOKEN=<exists>
PUBLIC_STORE_DOMAIN=<exists>
```

**Verification:**
```bash
# From project root
cat .env | grep -E "(SESSION_SECRET|PUBLIC_STOREFRONT_API_TOKEN|PUBLIC_STORE_DOMAIN)"
```

✅ **Expected Result**: All three variables should be present

---

### 1.2 Smart Collections Creation

**Time Required**: 30-45 minutes

#### Collection 1: Hayati Pro Max E-Liquids

**Shopify Admin Steps:**
1. Navigate to `Products` → `Collections` → `Create collection`
2. Select **Smart collection**
3. Configure:
   - **Title**: `Hayati Pro Max E-Liquids`
   - **Handle**: `hayati-pro-max` ⚠️ **CRITICAL: Must match exactly**
   - **Description**: `Shop the complete Hayati Pro Max e-liquid range. Premium formulations with authentic flavors and smooth nicotine salt delivery. Perfect for all-day vaping with Hayati X4 and Remix devices.`
   
4. **Collection Conditions**:
   - Set to: Product tag contains `hayati` **AND** Product tag contains `pro_max` **AND** Product type equals `E-Liquid`
   - Alternative: Product vendor equals `Hayati` **AND** Product title contains `Pro Max` **AND** Product type equals `E-Liquid`

5. **SEO Settings**:
   - **Page title**: `Hayati Pro Max E-Liquids | Premium Vape Juice UK`
   - **Meta description**: `Shop Hayati Pro Max e-liquids. ✓ Premium formulations ✓ Nicotine salt ✓ 50/50 VG/PG ✓ Works with X4 & Remix devices. Fast UK delivery.`

6. **Sort Order**: Best selling
7. Click **Save**

**Verification Checklist:**
- [ ] Collection created successfully
- [ ] Handle is exactly `hayati-pro-max` (no spaces, lowercase)
- [ ] At least 5 products match the collection conditions
- [ ] Collection is set to "Online Store" visibility
- [ ] SEO title and description are set

---

#### Collection 2: Hayati X4 Device

**Shopify Admin Steps:**
1. Navigate to `Products` → `Collections` → `Create collection`
2. Select **Smart collection**
3. Configure:
   - **Title**: `Hayati X4`
   - **Handle**: `hayati-x4` ⚠️ **CRITICAL: Must match exactly**
   - **Description**: `Experience the Hayati X4 pod system - a versatile, refillable device designed for use with Hayati Pro Max e-liquids. Compact design with powerful performance and long battery life.`
   
4. **Collection Conditions**:
   - Set to: Product tag contains `hayati` **AND** Product tag contains `x4`
   - Alternative: Product vendor equals `Hayati` **AND** Product title contains `X4`

5. **SEO Settings**:
   - **Page title**: `Hayati X4 Pod System | Refillable Vape Device UK`
   - **Meta description**: `Shop Hayati X4 pod system. ✓ 650mAh battery ✓ 2ml pods ✓ Refillable ✓ Cost-effective. Compatible with Hayati Pro Max e-liquids. UK stock.`

6. **Sort Order**: Best selling
7. Click **Save**

**Verification Checklist:**
- [ ] Collection created successfully
- [ ] Handle is exactly `hayati-x4` (no spaces, lowercase)
- [ ] At least 2-3 products match (kits, pods, coils)
- [ ] Collection is set to "Online Store" visibility
- [ ] SEO title and description are set

---

#### Collection 3: Hayati Remix Device

**Shopify Admin Steps:**
1. Navigate to `Products` → `Collections` → `Create collection`
2. Select **Smart collection**
3. Configure:
   - **Title**: `Hayati Remix`
   - **Handle**: `hayati-remix` ⚠️ **CRITICAL: Must match exactly**
   - **Description**: `Discover the Hayati Remix - an advanced pod system with premium features and exceptional performance. Enhanced battery life, LED indicator, and multiple coil options.`
   
4. **Collection Conditions**:
   - Set to: Product tag contains `hayati` **AND** Product tag contains `remix`
   - Alternative: Product vendor equals `Hayati` **AND** Product title contains `Remix`

5. **SEO Settings**:
   - **Page title**: `Hayati Remix Pod System | Advanced Vape Device UK`
   - **Meta description**: `Shop Hayati Remix pod system. ✓ 800mAh battery ✓ LED indicator ✓ Multiple coils ✓ Premium design. Works with Hayati Pro Max e-liquids. UK delivery.`

6. **Sort Order**: Best selling
7. Click **Save**

**Verification Checklist:**
- [ ] Collection created successfully
- [ ] Handle is exactly `hayati-remix` (no spaces, lowercase)
- [ ] At least 2-3 products match (kits, pods, coils)
- [ ] Collection is set to "Online Store" visibility
- [ ] SEO title and description are set

---

#### Collection 4: Lost Mary BM6000

**Shopify Admin Steps:**
1. Navigate to `Products` → `Collections` → `Create collection`
2. Select **Smart collection**
3. Configure:
   - **Title**: `Lost Mary BM6000`
   - **Handle**: `lost-mary-bm6000` ⚠️ **CRITICAL: Must match exactly**
   - **Description**: `Explore the Lost Mary BM6000 collection - premium 6000 puff disposable vapes with mesh coil technology and rechargeable battery. Authentic flavours and consistent performance.`
   
4. **Collection Conditions**:
   - Set to: Product tag contains `lost_mary` **AND** Product tag contains `bm6000`
   - Alternative: Product vendor equals `Lost Mary` **AND** Product title contains `BM6000`

5. **SEO Settings**:
   - **Page title**: `Lost Mary BM6000 | 6000 Puff Disposable Vapes UK`
   - **Meta description**: `Shop Lost Mary BM6000 disposable vapes. ✓ 6000 puffs ✓ Rechargeable ✓ Mesh coil ✓ 20mg nic salt. Premium flavors available. Fast UK delivery.`

6. **Sort Order**: Best selling
7. Click **Save**

**Verification Checklist:**
- [ ] Collection created successfully
- [ ] Handle is exactly `lost-mary-bm6000` (no spaces, lowercase, underscores in tags)
- [ ] At least 10+ products match (all BM6000 flavors)
- [ ] Collection is set to "Online Store" visibility
- [ ] SEO title and description are set

---

#### Collection 5: Crystal Bar

**Shopify Admin Steps:**
1. Navigate to `Products` → `Collections` → `Create collection`
2. Select **Smart collection**
3. Configure:
   - **Title**: `Crystal Bar`
   - **Handle**: `crystal-bar` ⚠️ **CRITICAL: Must match exactly**
   - **Description**: `Shop Crystal Bar disposable vapes - premium quality with crystal clear flavour delivery. Reliable performance and authentic taste in every puff.`
   
4. **Collection Conditions**:
   - Set to: Product tag contains `crystal` **AND** Product type equals `Disposable Vape`
   - Alternative: Product vendor equals `Crystal` **OR** Product vendor equals `Crystal Bar`

5. **SEO Settings**:
   - **Page title**: `Crystal Bar Disposable Vapes | Premium Vapes UK`
   - **Meta description**: `Shop Crystal Bar disposable vapes. ✓ Premium quality ✓ Crystal clear flavor ✓ Reliable performance ✓ Multiple strengths. Fast UK shipping available.`

6. **Sort Order**: Best selling
7. Click **Save**

**Verification Checklist:**
- [ ] Collection created successfully
- [ ] Handle is exactly `crystal-bar` (no spaces, lowercase)
- [ ] At least 5+ products match
- [ ] Collection is set to "Online Store" visibility
- [ ] SEO title and description are set

---

#### Collection 6: Elux Legend

**Shopify Admin Steps:**
1. Navigate to `Products` → `Collections` → `Create collection`
2. Select **Smart collection**
3. Configure:
   - **Title**: `Elux Legend`
   - **Handle**: `elux-legend` ⚠️ **CRITICAL: Must match exactly**
   - **Description**: `Discover Elux Legend disposable vapes - legendary performance with exceptional flavor quality. Available in multiple puff counts and nicotine strengths.`
   
4. **Collection Conditions**:
   - Set to: Product tag contains `elux` **AND** Product tag contains `legend`
   - Alternative: Product vendor equals `Elux` **AND** Product title contains `Legend`

5. **SEO Settings**:
   - **Page title**: `Elux Legend Disposable Vapes | Premium Vapes UK`
   - **Meta description**: `Shop Elux Legend disposables. ✓ Legendary performance ✓ Premium flavors ✓ 600 & 3500 puff options ✓ TPD compliant. Fast UK delivery available.`

6. **Sort Order**: Best selling
7. Click **Save**

**Verification Checklist:**
- [ ] Collection created successfully
- [ ] Handle is exactly `elux-legend` (no spaces, lowercase)
- [ ] At least 5+ products match
- [ ] Collection is set to "Online Store" visibility
- [ ] SEO title and description are set

---

#### Collection 7: Riot Squad

**Shopify Admin Steps:**
1. Navigate to `Products` → `Collections` → `Create collection`
2. Select **Smart collection**
3. Configure:
   - **Title**: `Riot Squad`
   - **Handle**: `riot-squad` ⚠️ **CRITICAL: Must match exactly**
   - **Description**: `Explore Riot Squad e-liquids - premium UK-made vape juice with bold, authentic flavours. Available in shortfills and nic salts for all-day vaping.`
   
4. **Collection Conditions**:
   - Set to: Product vendor equals `Riot Squad`
   - Alternative: Product tag contains `riot_squad`

5. **SEO Settings**:
   - **Page title**: `Riot Squad E-Liquids | Premium Vape Juice UK`
   - **Meta description**: `Shop Riot Squad e-liquids. ✓ UK-made ✓ Bold flavours ✓ 50ml shortfills ✓ 10ml nic salts ✓ Premium quality. Fast UK delivery on all orders.`

6. **Sort Order**: Best selling
7. Click **Save**

**Verification Checklist:**
- [ ] Collection created successfully
- [ ] Handle is exactly `riot-squad` (no spaces, lowercase)
- [ ] At least 10+ products match (shortfills and nic salts)
- [ ] Collection is set to "Online Store" visibility
- [ ] SEO title and description are set

---

### 1.3 Product Tagging Strategy

**Time Required**: 1-2 hours (depending on number of products)

#### Tagging Requirements by Collection

**For Hayati Pro Max E-Liquids:**
```
Required Tags: hayati, pro_max, e-liquid, nic_salt (or nicotine_salt), 10ml
Product Type: E-Liquid
Vendor: Hayati
Example: "Hayati Pro Max Strawberry Ice 10ml 20mg Nic Salt"
```

**For Hayati X4 Devices:**
```
Required Tags: hayati, x4, device, pod_system, refillable
Product Type: Vape Device (or Pod System)
Vendor: Hayati
Examples: 
  - "Hayati X4 Pod System Starter Kit"
  - "Hayati X4 Replacement Pods (2 Pack)"
  - "Hayati X4 Replacement Coils"
```

**For Hayati Remix Devices:**
```
Required Tags: hayati, remix, device, pod_system, refillable
Product Type: Vape Device (or Pod System)
Vendor: Hayati
Examples:
  - "Hayati Remix Pod System Kit"
  - "Hayati Remix Replacement Pods"
  - "Hayati Remix Coils (1.0Ω/1.2Ω)"
```

**For Lost Mary BM6000:**
```
Required Tags: lost_mary, bm6000, disposable, 6000_puff, rechargeable
Product Type: Disposable Vape
Vendor: Lost Mary
Example: "Lost Mary BM6000 Blue Razz Ice"
```

**For Crystal Bar:**
```
Required Tags: crystal, disposable, crystal_bar
Product Type: Disposable Vape
Vendor: Crystal or Crystal Bar
Example: "Crystal Bar 600 Strawberry Ice"
```

**For Elux Legend:**
```
Required Tags: elux, legend, disposable
Product Type: Disposable Vape
Vendor: Elux
Example: "Elux Legend 3500 Grape"
```

**For Riot Squad:**
```
Required Tags: riot_squad, e-liquid, shortfill (or nic_salt)
Product Type: E-Liquid
Vendor: Riot Squad
Examples:
  - "Riot Squad 50ml Shortfill Pink Grenade"
  - "Riot Squad 10ml Nic Salt Strawberry Scream"
```

#### Bulk Tagging Process

**Option 1: Shopify Admin UI**
1. Go to `Products` → Select multiple products (checkbox)
2. Click `More actions` → `Add tags`
3. Add required tags (comma-separated)
4. Click `Save`

**Option 2: CSV Import/Export**
1. Export products to CSV
2. Add tags in Excel/Google Sheets (comma-separated in Tags column)
3. Re-import CSV to Shopify

**Verification:**
- [ ] All Hayati Pro Max e-liquids have correct tags
- [ ] All Hayati X4 products have correct tags
- [ ] All Hayati Remix products have correct tags
- [ ] All Lost Mary BM6000 products have correct tags
- [ ] All Crystal Bar products have correct tags
- [ ] All Elux Legend products have correct tags
- [ ] All Riot Squad products have correct tags

---

### 1.4 Product Upload/Configuration

**Time Required**: 30-60 minutes (if products don't exist)

#### Minimum Products Required

To properly test each collection page:
- **Hayati Pro Max E-Liquids**: Minimum 5 products (different flavors)
- **Hayati X4**: Minimum 2 products (1 kit, 1 pods/coils)
- **Hayati Remix**: Minimum 2 products (1 kit, 1 pods/coils)
- **Lost Mary BM6000**: Minimum 10 products (different flavors)
- **Crystal Bar**: Minimum 5 products (different flavors)
- **Elux Legend**: Minimum 5 products (different flavors)
- **Riot Squad**: Minimum 10 products (mix of shortfills and nic salts)

#### Product Configuration Checklist (Per Product)

- [ ] **Title**: Clear, descriptive (includes brand, model, flavor)
- [ ] **Vendor**: Correctly set to brand name
- [ ] **Product Type**: Correctly categorized (E-Liquid, Disposable Vape, Vape Device)
- [ ] **Tags**: All required tags applied (see section 1.3)
- [ ] **Images**: High-quality product images uploaded
- [ ] **Price**: Correctly set (including VAT if applicable)
- [ ] **Inventory**: Stock quantity set, track inventory enabled
- [ ] **Status**: Active (published to Online Store)
- [ ] **Description**: Detailed product description with specs
- [ ] **Variants**: Set up if multiple options (flavors, strengths, sizes)
- [ ] **SEO**: Meta title and description set (optional but recommended)

---

## Phase 2: Frontend Testing

### 2.1 Page Load Testing

**Time Required**: 15 minutes

Test each collection page loads correctly in development and production.

#### Test URLs

**Development (Local):**
```
http://localhost:3000/collections/hayati-pro-max
http://localhost:3000/collections/hayati-x4
http://localhost:3000/collections/hayati-remix
http://localhost:3000/collections/lost-mary-bm6000
http://localhost:3000/collections/crystal-bar
http://localhost:3000/collections/elux-legend
http://localhost:3000/collections/riot-squad
```

**Production:**
```
https://vapourism.co.uk/collections/hayati-pro-max
https://vapourism.co.uk/collections/hayati-x4
https://vapourism.co.uk/collections/hayati-remix
https://vapourism.co.uk/collections/lost-mary-bm6000
https://vapourism.co.uk/collections/crystal-bar
https://vapourism.co.uk/collections/elux-legend
https://vapourism.co.uk/collections/riot-squad
```

#### Test Checklist (Per Page)

- [ ] Page loads without errors (200 status code)
- [ ] No JavaScript console errors
- [ ] No 404 errors for assets (images, CSS, JS)
- [ ] Page title displays correctly in browser tab
- [ ] Favicon loads correctly
- [ ] Loading states display correctly (if products take time to load)
- [ ] If no products match collection, "coming soon" message displays gracefully

**How to Test:**
```bash
# Start dev server
npm run dev

# Open browser and navigate to each URL
# Check browser console (F12) for errors
```

---

### 2.2 Content Verification

**Time Required**: 30 minutes

Verify all page content displays correctly.

#### Per-Page Content Checklist

**Hayati Pro Max E-Liquids:**
- [ ] H1 heading: "Hayati Pro Max E-Liquids"
- [ ] Hero section with description present
- [ ] "Why Choose Pro Max E-Liquids" section displays
- [ ] Specifications table displays correctly
- [ ] "Perfect For" list displays with checkmarks
- [ ] "Works With" section shows X4 and Remix device links
- [ ] Product grid displays (2-4 column responsive)
- [ ] Products show: image, title, price, vendor
- [ ] "Shop All Disposable Vapes" link present

**Hayati X4 Device:**
- [ ] H1 heading: "Hayati X4 Pod System"
- [ ] Hero section with description present
- [ ] "Key Features" section displays
- [ ] Specifications table displays correctly
- [ ] "What's Included" list displays
- [ ] "How to Use" 5-step guide displays
- [ ] Compatible e-liquids section links to Pro Max
- [ ] Product grid displays correctly
- [ ] Related links present

**Hayati Remix Device:**
- [ ] H1 heading: "Hayati Remix Pod System"
- [ ] Hero section with description present
- [ ] "Key Features" section displays
- [ ] X4 vs Remix comparison table displays
- [ ] Specifications table displays correctly
- [ ] "What's Included" list displays
- [ ] "How to Use" guide displays
- [ ] Compatible e-liquids section links to Pro Max
- [ ] Product grid displays correctly
- [ ] Related links present

**Lost Mary BM6000:**
- [ ] H1 heading: "Lost Mary BM6000"
- [ ] Hero section with description present
- [ ] "Key Features" section displays
- [ ] Specifications table displays correctly
- [ ] "How to Use Your BM6000" 5-step guide displays
- [ ] Product grid displays correctly (all BM6000 flavors)
- [ ] Products show proper images and pricing
- [ ] Related collections links present

**Crystal Bar:**
- [ ] H1 heading: "Crystal Bar Disposable Vapes"
- [ ] Hero section with "Crystal Clear Experience" present
- [ ] "Why Choose Crystal Bar" section displays
- [ ] "Premium Features" list displays
- [ ] Brand story section displays
- [ ] Product grid displays correctly
- [ ] Products show proper images and pricing
- [ ] Related collections links present

**Elux Legend:**
- [ ] H1 heading: "Elux Legend Disposable Vapes"
- [ ] Hero section with "Legendary Performance" present
- [ ] "The Legend Range" comparison table displays
- [ ] "Why Choose Elux Legend" section displays
- [ ] Premium features list displays
- [ ] Product grid displays correctly (600 and 3500 puff models)
- [ ] Products show proper images and pricing
- [ ] Related collections links present

**Riot Squad:**
- [ ] H1 heading: "Riot Squad E-Liquids"
- [ ] Hero section with brand story present
- [ ] "Why Choose Riot Squad" section displays
- [ ] "Our Ranges" section (50ml Shortfills, 10ml Nic Salts)
- [ ] "Popular Punx Series" section displays
- [ ] Flavor profiles list displays
- [ ] Product grid displays correctly (mix of products)
- [ ] Products show proper images and pricing
- [ ] Related collections links present

---

### 2.3 Responsive Design Testing

**Time Required**: 30 minutes

Test each page on different screen sizes.

#### Devices to Test

**Desktop:**
- [ ] 1920x1080 (Full HD)
- [ ] 1366x768 (Standard laptop)

**Tablet:**
- [ ] 768x1024 (iPad portrait)
- [ ] 1024x768 (iPad landscape)

**Mobile:**
- [ ] 375x667 (iPhone SE)
- [ ] 390x844 (iPhone 12/13/14)
- [ ] 360x640 (Android standard)

#### Responsive Checklist (Per Page)

**Desktop (1920px+):**
- [ ] Product grid displays in 4 columns
- [ ] Content sections use full width appropriately
- [ ] Navigation menu displays correctly
- [ ] All images scale properly
- [ ] Text is readable without zooming

**Tablet (768px-1024px):**
- [ ] Product grid displays in 3 columns
- [ ] Content sections stack appropriately
- [ ] Navigation menu responsive (hamburger or condensed)
- [ ] All images scale properly
- [ ] Text is readable without zooming
- [ ] Tables scroll horizontally if needed

**Mobile (320px-767px):**
- [ ] Product grid displays in 2 columns
- [ ] Content sections stack vertically
- [ ] Navigation menu collapses to hamburger
- [ ] All images scale properly (no horizontal scroll)
- [ ] Text is readable without zooming
- [ ] Tables scroll horizontally
- [ ] Buttons are tap-friendly (min 44x44px)
- [ ] No content overflow

**How to Test:**
```bash
# Chrome DevTools
# 1. Open page
# 2. Press F12
# 3. Click device toolbar icon (or Ctrl+Shift+M)
# 4. Select different devices from dropdown
# 5. Test interactions on each size
```

---

### 2.4 Product Display Testing

**Time Required**: 20 minutes

Verify product data displays correctly from Shopify.

#### Product Card Checklist (Per Collection)

- [ ] Product images load correctly
- [ ] Product titles display fully (no truncation)
- [ ] Vendor/brand name displays
- [ ] Price displays correctly (with currency symbol)
- [ ] "Out of stock" indicator shows if applicable
- [ ] Product links work (click takes to product page)
- [ ] Hover states work on product cards
- [ ] Product grid maintains proper spacing
- [ ] Products sort correctly (best selling order)
- [ ] If >12 products, pagination/load more works

**Empty State Testing:**
- [ ] If collection has 0 products, graceful "coming soon" message displays
- [ ] No broken product cards or errors
- [ ] Related collections still display

---

### 2.5 Link Testing

**Time Required**: 20 minutes

Verify all internal and external links work correctly.

#### Links to Test (Per Page)

**Internal Links:**
- [ ] Logo in header links to homepage
- [ ] Navigation menu links work
- [ ] "Shop All Disposable Vapes" links work
- [ ] Related collection links work (bottom of page)
- [ ] Cross-sell links work (e.g., Pro Max → X4 device)
- [ ] Product card links to product detail pages work
- [ ] Breadcrumb links work (if implemented)

**Footer Links:**
- [ ] Footer navigation links work
- [ ] Social media links work
- [ ] Policy pages links work

**Verification:**
```bash
# Use browser dev tools
# 1. Right-click any link
# 2. Inspect element
# 3. Check href attribute matches expected destination
# 4. Click link and verify navigation
```

---

## Phase 3: SEO Testing

### 3.1 Meta Tags Verification

**Time Required**: 30 minutes

Verify all SEO meta tags are correctly implemented.

#### SEO Checklist (Per Page)

**Required Meta Tags:**
- [ ] `<title>` tag exists and is 50-60 characters
- [ ] `<meta name="description">` exists and is 150-155 characters
- [ ] `<meta name="keywords">` exists with relevant keywords
- [ ] `<link rel="canonical">` points to correct URL
- [ ] `<html lang="en">` attribute set

**Open Graph Tags (Social Media):**
- [ ] `<meta property="og:title">` exists
- [ ] `<meta property="og:description">` exists
- [ ] `<meta property="og:type">` set to "website"
- [ ] `<meta property="og:url">` exists
- [ ] `<meta property="og:image">` exists (optional)

**Twitter Card Tags:**
- [ ] `<meta name="twitter:card">` set to "summary_large_image"
- [ ] `<meta name="twitter:title">` exists
- [ ] `<meta name="twitter:description">` exists

**How to Test:**
```bash
# Method 1: View Page Source
# Right-click page → View Page Source → Search for <head>

# Method 2: Browser DevTools
# F12 → Elements tab → Expand <head> → Check meta tags

# Method 3: SEO Browser Extension
# Install "SEO Meta in 1 Click" Chrome extension
# Click extension icon on each page
```

**Expected Meta Tags Example (Hayati Pro Max):**
```html
<title>Hayati Pro Max E-Liquids | Premium Vape Juice UK</title>
<meta name="description" content="Shop Hayati Pro Max e-liquids. ✓ Premium formulations ✓ Nicotine salt ✓ 50/50 VG/PG ✓ Works with X4 & Remix devices. Fast UK delivery." />
<meta name="keywords" content="hayati pro max, hayati e-liquid, nic salt, 10ml e-liquid, vape juice uk" />
<link rel="canonical" href="https://vapourism.co.uk/collections/hayati-pro-max" />
```

---

### 3.2 Structured Data (Schema.org) Testing

**Time Required**: 20 minutes

Verify structured data is correctly implemented.

#### Schema.org Testing

**Expected Schema Types:**
- Organization schema (site-wide)
- WebSite schema (site-wide)
- BreadcrumbList schema (if implemented)
- CollectionPage schema (optional)

**How to Test:**

**Method 1: Google Rich Results Test**
1. Go to https://search.google.com/test/rich-results
2. Enter collection page URL
3. Wait for analysis
4. Check for errors or warnings

**Method 2: View Page Source**
```bash
# Look for <script type="application/ld+json"> in page source
# Verify JSON-LD is valid and includes expected schema types
```

**Method 3: Schema Markup Validator**
1. Go to https://validator.schema.org/
2. Enter page URL
3. Check validation results

**Verification Checklist:**
- [ ] No schema errors detected
- [ ] No missing required properties
- [ ] Schema correctly represents page content
- [ ] JSON-LD syntax is valid

---

### 3.3 Mobile-Friendliness Testing

**Time Required**: 15 minutes

Verify pages are mobile-friendly for SEO.

#### Google Mobile-Friendly Test

1. Go to https://search.google.com/test/mobile-friendly
2. Enter each collection page URL
3. Wait for analysis

**Checklist (Per Page):**
- [ ] Page passes mobile-friendly test
- [ ] No "text too small to read" errors
- [ ] No "clickable elements too close together" errors
- [ ] No "content wider than screen" errors
- [ ] Page loads quickly on mobile (<3 seconds)

---

### 3.4 Indexability Testing

**Time Required**: 10 minutes

Verify pages can be indexed by search engines.

#### Robots.txt Check

```bash
# Check robots.txt allows collection pages
curl https://vapourism.co.uk/robots.txt

# Verify:
# - No "Disallow: /collections/" directive
# - Collections are allowed for Googlebot
```

**Verification:**
- [ ] robots.txt allows /collections/ paths
- [ ] robots.txt allows Googlebot
- [ ] No noindex meta tag in page <head>

#### Meta Robots Tag Check

```bash
# View page source and search for:
<meta name="robots" content="index, follow" />

# OR ensure no:
<meta name="robots" content="noindex" />
```

**Verification:**
- [ ] No `noindex` directive present
- [ ] `index, follow` explicitly set (or default)

---

## Phase 4: Performance Testing

### 4.1 Page Load Speed

**Time Required**: 20 minutes

Test page load performance for SEO and UX.

#### Tools to Use

**1. Google PageSpeed Insights**
- URL: https://pagespeed.web.dev/
- Test each collection page URL
- Check both Mobile and Desktop scores

**2. Chrome DevTools Network Tab**
```bash
# 1. Open page in Chrome
# 2. Press F12 → Network tab
# 3. Refresh page (Ctrl+R)
# 4. Check:
#    - Total page size
#    - Number of requests
#    - DOMContentLoaded time
#    - Load time
```

#### Performance Checklist (Per Page)

**PageSpeed Insights:**
- [ ] Mobile score: >50 (minimum acceptable)
- [ ] Desktop score: >70 (minimum acceptable)
- [ ] First Contentful Paint (FCP): <2.5s
- [ ] Largest Contentful Paint (LCP): <4s
- [ ] Cumulative Layout Shift (CLS): <0.25
- [ ] Time to Interactive (TTI): <5s

**Network Performance:**
- [ ] Total page size: <3MB
- [ ] Number of requests: <100
- [ ] DOMContentLoaded: <2s
- [ ] Full page load: <4s
- [ ] No failed requests (404, 500 errors)

**Image Optimization:**
- [ ] Product images are compressed
- [ ] Images use lazy loading (loading="lazy")
- [ ] Images have proper dimensions (no massive oversizing)

---

### 4.2 Lighthouse Audit

**Time Required**: 15 minutes

Run comprehensive Lighthouse audits.

#### How to Run Lighthouse

```bash
# Method 1: Chrome DevTools
# 1. Open page
# 2. F12 → Lighthouse tab
# 3. Select categories: Performance, Accessibility, Best Practices, SEO
# 4. Click "Generate report"
# 5. Review scores and recommendations

# Method 2: CLI (optional)
npm install -g lighthouse
lighthouse https://vapourism.co.uk/collections/hayati-pro-max --view
```

#### Lighthouse Score Targets (Per Page)

- [ ] **Performance**: >50 (minimum acceptable)
- [ ] **Accessibility**: >90 (target: 100)
- [ ] **Best Practices**: >90 (target: 100)
- [ ] **SEO**: >90 (target: 100)

**Critical Issues to Fix:**
- Any red (0-49) scores
- Any "Failing Audits" in SEO category
- Missing alt text on images
- Missing meta descriptions
- HTTP instead of HTTPS

---

## Phase 5: Integration Testing

### 5.1 Search Functionality

**Time Required**: 15 minutes

Test that collection pages integrate correctly with search.

#### Search Integration Tests

**From Collection Page:**
1. Navigate to collection page (e.g., /collections/hayati-pro-max)
2. Use site search to search for brand (e.g., "hayati")
3. Verify collection page or products from that collection appear in results

**Search Results to Collection:**
1. Use site search to search for product type (e.g., "disposable vapes")
2. Click on a product from search results
3. Navigate back to collection via breadcrumbs or related links
4. Verify navigation works seamlessly

**Verification Checklist:**
- [ ] Collection pages indexed by internal search
- [ ] Products from collections appear in search results
- [ ] Search results link correctly to collection pages
- [ ] No broken search result links

---

### 5.2 Cart Integration

**Time Required**: 10 minutes

Test adding products to cart from collection pages.

#### Cart Flow Testing

**Test Steps (Per Collection):**
1. Navigate to collection page
2. Click on a product from the grid
3. On product detail page, click "Add to Cart"
4. Verify product adds to cart successfully
5. Check cart icon updates with item count
6. View cart and verify product details are correct
7. Proceed to checkout (test up to checkout page, don't complete)

**Verification Checklist:**
- [ ] "Add to Cart" buttons work on product pages
- [ ] Cart icon updates with correct count
- [ ] Cart displays correct product info (title, price, image)
- [ ] Cart totals calculate correctly
- [ ] Checkout flow works (up to payment)
- [ ] Can return to collection page from cart

---

### 5.3 Cross-Selling Links

**Time Required**: 15 minutes

Test cross-selling links between related collections.

#### Cross-Sell Testing Matrix

**Hayati Pro Max E-Liquids:**
- [ ] "Works With" section links to X4 device collection
- [ ] "Works With" section links to Remix device collection
- [ ] "Related" section links to other e-liquid brands

**Hayati X4 Device:**
- [ ] "Compatible E-Liquids" links to Pro Max collection
- [ ] "Related" section links to Hayati Remix
- [ ] Navigation back to e-liquids works

**Hayati Remix Device:**
- [ ] "Compatible E-Liquids" links to Pro Max collection
- [ ] "Related" section links to Hayati X4
- [ ] Navigation back to e-liquids works

**Disposable Collections (Lost Mary, Crystal, Elux):**
- [ ] "Shop All Disposable Vapes" link present
- [ ] Links to other disposable brand collections work
- [ ] "Related Collections" section displays

**Riot Squad E-Liquids:**
- [ ] Links to other e-liquid brands work
- [ ] "Related Collections" section displays

**Verification:**
- [ ] All cross-sell links work correctly
- [ ] Links open in same tab (not new tab)
- [ ] No broken links (404 errors)
- [ ] Related products make logical sense

---

## Phase 6: Security & Compliance

### 6.1 HTTPS Verification

**Time Required**: 5 minutes

Ensure all pages load over HTTPS.

#### HTTPS Checklist

- [ ] All collection page URLs use https:// (not http://)
- [ ] Browser shows padlock icon (secure connection)
- [ ] No mixed content warnings (HTTP resources on HTTPS page)
- [ ] SSL certificate is valid and not expired
- [ ] No certificate errors in browser console

**How to Test:**
```bash
# Check SSL certificate
curl -I https://vapourism.co.uk/collections/hayati-pro-max | grep -i "HTTP"

# Expected: HTTP/2 200 (or HTTP/1.1 200)
```

---

### 6.2 Age Verification Compliance

**Time Required**: 10 minutes

Verify age verification works on collection pages.

#### Age Verification Flow

**Test Steps:**
1. Clear browser cookies/local storage
2. Navigate to collection page
3. Verify age verification modal appears (if implemented)
4. Complete age verification flow
5. Verify collection page loads after verification
6. Close browser and re-open
7. Verify age verification persists (localStorage)

**Verification Checklist:**
- [ ] Age verification modal appears for new visitors
- [ ] Modal cannot be bypassed without verification
- [ ] Verification persists across page navigation
- [ ] Verification persists in localStorage (30 days)
- [ ] No access to products without verification

---

## Phase 7: Analytics & Tracking

### 7.1 Google Analytics Integration

**Time Required**: 10 minutes

Verify GA4 tracking is working on collection pages.

#### GA4 Testing

**Method 1: Real-Time Reports**
1. Open Google Analytics
2. Go to Reports → Realtime
3. Navigate to collection page in another tab
4. Verify page view appears in Real-Time report

**Method 2: Chrome Extension**
1. Install "Google Analytics Debugger" extension
2. Enable debugger
3. Navigate to collection page
4. Check browser console for GA4 events

**Events to Verify:**
- [ ] `page_view` event fires on page load
- [ ] `view_item_list` event fires (collection viewed)
- [ ] `select_item` event fires when product clicked
- [ ] Events include correct parameters (collection name, products, etc.)

---

### 7.2 Conversion Tracking

**Time Required**: 5 minutes

Verify e-commerce tracking is set up.

#### E-commerce Events to Check

- [ ] `view_item_list` - Collection page viewed
- [ ] `select_item` - Product clicked from collection
- [ ] `add_to_cart` - Product added to cart
- [ ] `begin_checkout` - Checkout initiated
- [ ] `purchase` - Order completed (test in staging, not production)

**How to Test:**
```bash
# Check for Google Tag Manager container
# View page source → Search for "gtm.js" or "GTM-"

# OR check for GA4 config
# View page source → Search for "gtag" or "G-"
```

---

## Phase 8: User Acceptance Testing (UAT)

### 8.1 User Flow Testing

**Time Required**: 30 minutes

Test complete user journeys.

#### User Journey 1: Browse E-Liquids → Add Device to Cart

**Steps:**
1. Start at homepage
2. Navigate to Hayati Pro Max E-Liquids collection
3. Browse e-liquids
4. Click "Works With X4 Device" link
5. Browse X4 devices
6. Add X4 starter kit to cart
7. View cart
8. Return to Pro Max e-liquids
9. Add an e-liquid to cart
10. Proceed to checkout

**Verification:**
- [ ] All navigation works smoothly
- [ ] Cross-sell links work correctly
- [ ] Products add to cart successfully
- [ ] Cart shows correct items and totals

#### User Journey 2: Browse Disposables → Compare Brands

**Steps:**
1. Navigate to Lost Mary BM6000 collection
2. Browse products
3. Click "Related Collections" → Crystal Bar
4. Browse Crystal Bar products
5. Click "Related Collections" → Elux Legend
6. Browse Elux Legend products
7. Select a product and view details
8. Add to cart

**Verification:**
- [ ] Collection switching works seamlessly
- [ ] Product grids load correctly
- [ ] Images and pricing display correctly
- [ ] Add to cart works from any collection

#### User Journey 3: Search → Collection → Product

**Steps:**
1. Use site search: "riot squad"
2. Click on Riot Squad collection from results
3. Browse Riot Squad products
4. Filter by shortfills (if filters implemented)
5. Select a product
6. View product details
7. Add to cart

**Verification:**
- [ ] Search finds collection page
- [ ] Collection page loads correctly
- [ ] Products display correctly
- [ ] Product detail page works
- [ ] Add to cart works

---

### 8.2 Error Handling Testing

**Time Required**: 15 minutes

Test how pages handle errors gracefully.

#### Error Scenarios to Test

**1. Collection with No Products:**
- Navigate to: /collections/hayati-x4 (if no products exist)
- **Expected**: Graceful "coming soon" message, no broken UI
- **Verification**: [ ] Error handled gracefully

**2. Invalid Collection Handle:**
- Navigate to: /collections/invalid-collection-name
- **Expected**: 404 page or redirect to collections index
- **Verification**: [ ] Error handled gracefully

**3. Slow Network:**
- Use Chrome DevTools → Network tab → Throttle to "Slow 3G"
- Navigate to collection page
- **Expected**: Loading states display, page eventually loads
- **Verification**: [ ] Loading states work, no timeout errors

**4. JavaScript Disabled:**
- Disable JavaScript in browser
- Navigate to collection page
- **Expected**: Basic content still accessible (SSR)
- **Verification**: [ ] Page content accessible without JS

---

## Phase 9: Post-Launch Monitoring

### 9.1 Google Search Console Submission

**Time Required**: 10 minutes

Submit new collection pages to Google for indexing.

#### Steps:

1. **Log in to Google Search Console**
   - Go to: https://search.google.com/search-console

2. **Submit URLs for Indexing**
   - Click "URL Inspection" in left sidebar
   - Enter collection page URL (e.g., https://vapourism.co.uk/collections/hayati-pro-max)
   - Click "Request Indexing"
   - Repeat for all 6 collection pages

3. **Submit Sitemap (if updated)**
   - Go to Sitemaps section
   - Add sitemap URL: https://vapourism.co.uk/sitemap.xml
   - Click "Submit"

**Verification:**
- [ ] All 6 collection URLs submitted to Google
- [ ] No crawl errors reported
- [ ] Sitemap submitted successfully
- [ ] No mobile usability issues reported

---

### 9.2 Monitoring Checklist (Week 1)

**Time Required**: Ongoing

Set up monitoring for the first week after launch.

#### Metrics to Monitor Daily (First Week)

**Traffic Metrics:**
- [ ] Page views per collection
- [ ] Unique visitors per collection
- [ ] Bounce rate per collection
- [ ] Average time on page

**SEO Metrics:**
- [ ] Google Search impressions (Search Console)
- [ ] Google Search clicks (Search Console)
- [ ] Average position for target keywords
- [ ] Crawl errors (Search Console)

**Performance Metrics:**
- [ ] Page load times (Google Analytics)
- [ ] Core Web Vitals (Search Console)
- [ ] Server errors (500 errors)
- [ ] Failed product lookups

**Business Metrics:**
- [ ] Products added to cart from collections
- [ ] Conversion rate per collection
- [ ] Revenue attributed to collections
- [ ] Average order value from collection traffic

---

## Test Results Documentation

### Test Completion Checklist

**Phase 1: Shopify Configuration**
- [ ] 6 Smart Collections created
- [ ] Products tagged correctly
- [ ] Minimum products per collection uploaded
- [ ] Collections verified in Shopify Admin

**Phase 2: Frontend Testing**
- [ ] All 6 pages load without errors
- [ ] Content displays correctly on all pages
- [ ] Responsive design works on all screen sizes
- [ ] Products display correctly from Shopify
- [ ] All links work correctly

**Phase 3: SEO Testing**
- [ ] Meta tags correct on all pages
- [ ] Structured data implemented correctly
- [ ] Mobile-friendly test passed
- [ ] Pages are indexable (no noindex)

**Phase 4: Performance Testing**
- [ ] PageSpeed scores acceptable (>50 mobile, >70 desktop)
- [ ] Lighthouse scores meet targets
- [ ] No critical performance issues

**Phase 5: Integration Testing**
- [ ] Search functionality works
- [ ] Cart integration works
- [ ] Cross-selling links work correctly

**Phase 6: Security & Compliance**
- [ ] HTTPS working correctly
- [ ] Age verification working (if applicable)

**Phase 7: Analytics & Tracking**
- [ ] Google Analytics tracking working
- [ ] E-commerce events firing correctly

**Phase 8: UAT**
- [ ] User journeys work end-to-end
- [ ] Error handling works correctly

**Phase 9: Post-Launch**
- [ ] URLs submitted to Google Search Console
- [ ] Monitoring set up

---

## Issues Log Template

If you encounter issues during testing, document them here:

| Issue # | Page | Issue Description | Severity | Status | Resolution |
|---------|------|-------------------|----------|--------|------------|
| 1 | | | | Open | |
| 2 | | | | Open | |
| 3 | | | | Open | |

**Severity Levels:**
- **Critical**: Page doesn't load, major functionality broken
- **High**: Important feature doesn't work, SEO issue
- **Medium**: Minor functionality issue, visual bug
- **Low**: Cosmetic issue, nice-to-have

---

## Sign-Off

### Testing Completed By

**Name**: ___________________________  
**Date**: ___________________________  
**Signature**: ___________________________

### Test Results Summary

**Total Tests**: ___ / ___  
**Passed**: ___ 
**Failed**: ___  
**Blocked**: ___

**Ready for Production**: [ ] YES [ ] NO

**Notes**:
_______________________________________________________________________
_______________________________________________________________________
_______________________________________________________________________

---

## Additional Resources

**Documentation:**
- Full setup guide: `docs/SHOPIFY_SETUP_WEEK1.md`
- Implementation summary: `docs/WEEK1_IMPLEMENTATION_SUMMARY.md`
- SEO optimization guide: `docs/seo-optimization-guide.md`

**Support:**
- Shopify Help Center: https://help.shopify.com
- Hydrogen Docs: https://shopify.dev/docs/custom-storefronts/hydrogen
- Google Search Console: https://search.google.com/search-console

---

**End of Manual Testing Plan**
