# Manual Testing Plan - Keyword Gap SEO Implementation

**Version**: 1.0  
**Date**: December 2025  
**Pages to Test**: 7 pages (4 new collection pages, 1 new static page, 2 enhanced pages)  
**Estimated Testing Time**: 3-4 hours

---

## Testing Overview

This manual testing plan covers the SEO keyword gap implementation, focusing on:

1. **Functionality** - Pages load correctly, search works, links function
2. **SEO** - Meta tags, structured data, keywords
3. **Responsiveness** - Mobile, tablet, desktop views
4. **Performance** - Load times, no errors
5. **Integration** - Internal links, navigation

---

## Pre-Testing Setup

### Environment Preparation

1. **Local Development Testing**
   ```bash
   cd /path/to/vapourismV2
   npm run dev
   ```
   Wait for server to start (usually http://localhost:3000)

2. **Or Test on Deployed Environment**
   - Staging: `https://your-preview-url.oxygen.shopifyapps.com`
   - Production: `https://vapourism.co.uk`

3. **Clear Browser Cache**
   - Chrome: Ctrl+Shift+Delete → Clear browsing data
   - Use incognito/private mode for clean testing

4. **Prepare Testing Tools**
   - Browser DevTools (F12)
   - Lighthouse (Chrome DevTools → Lighthouse tab)
   - [Google Rich Results Test](https://search.google.com/test/rich-results)
   - Mobile device or browser responsive mode

---

## Test Suite 1: New Collection Pages

### 1.1 Nicotine Pouches Main Category

**URL:** `/collections/nicotine-pouches`

#### Functional Tests

- [ ] **Page loads successfully**
  - No 404 or 500 errors
  - Page renders completely (no blank areas)
  
- [ ] **Hero section displays correctly**
  - H1 title: "Nicotine Pouches UK | Tobacco-Free Nicotine"
  - Description paragraph visible
  
- [ ] **Key benefits section renders**
  - 4 benefit cards displayed in grid
  - Icons/text visible
  
- [ ] **Content sections present**
  - "What Are Nicotine Pouches?" section
  - "How to Use" section
  - "Popular Brands" section
  - "Strength Guide" table
  - FAQ section
  
- [ ] **Products grid**
  - If products exist: Grid displays with images, titles, prices
  - If no products: "Coming soon" message displays
  
- [ ] **Internal links work**
  - "Shop Velo →" link goes to `/collections/velo-nicotine-pouches`
  - "Shop Zyn →" link goes to `/collections/zyn-nicotine-pouches`
  - Footer links work (Disposable Vapes, E-Liquids)

#### SEO Tests

- [ ] **Meta tags (View Page Source)**
  - Title tag: "Nicotine Pouches UK | Tobacco-Free Nicotine | Vapourism 2025"
  - Meta description present and relevant
  - Keywords meta tag includes "nicotine pouches", "snus", "velo", "zyn"
  
- [ ] **Open Graph tags**
  - og:title present
  - og:description present
  - og:type = "website"
  
- [ ] **H1 tag**
  - Only one H1 on page
  - Contains primary keywords

#### Responsive Tests

- [ ] **Desktop (1920x1080)**
  - Layout is wide and spacious
  - Grid shows 4 columns
  
- [ ] **Tablet (768x1024)**
  - Layout adjusts appropriately
  - Grid shows 2-3 columns
  
- [ ] **Mobile (375x667)**
  - Single column layout
  - All text readable
  - Buttons/links easily tappable
  - No horizontal scrolling

#### Performance Tests

- [ ] **Lighthouse Score**
  - Performance: >85
  - SEO: >90
  - Accessibility: >85
  
- [ ] **Load time**
  - Page loads in <3 seconds
  - Images lazy load
  
- [ ] **No console errors**
  - Open DevTools → Console tab
  - No red errors present

**Notes:**

---

### 1.2 Velo Nicotine Pouches

**URL:** `/collections/velo-nicotine-pouches`

#### Functional Tests

- [ ] Page loads successfully
- [ ] H1 title: "Velo Nicotine Pouches UK | Premium Tobacco-Free"
- [ ] 4 feature cards display
- [ ] "About Velo" content section renders
- [ ] "Popular Velo Flavors" section with 3 flavor cards
- [ ] Strength guide table displays
- [ ] Products grid or "coming soon" message
- [ ] Internal links to main nicotine pouches page work
- [ ] Link to Zyn page works

#### SEO Tests

- [ ] Title tag: "Velo Nicotine Pouches UK | Premium Tobacco-Free | Vapourism 2025"
- [ ] Meta description includes "velo", "tobacco-free", "UK"
- [ ] Keywords include "velo", "velo nicotine pouches", "velo pouches uk"
- [ ] Open Graph tags present

#### Responsive Tests

- [ ] Desktop layout correct
- [ ] Tablet layout adjusts
- [ ] Mobile layout single column

#### Performance Tests

- [ ] Lighthouse SEO score >90
- [ ] No console errors

**Notes:**

---

### 1.3 Zyn Nicotine Pouches

**URL:** `/collections/zyn-nicotine-pouches`

#### Functional Tests

- [ ] Page loads successfully
- [ ] H1 title: "Zyn Nicotine Pouches UK | Premium Tobacco-Free Nicotine"
- [ ] 4 feature cards display
- [ ] "About Zyn" content section renders
- [ ] "Popular Zyn Flavors" section with 3 flavor cards
- [ ] Strength guide table with note about Zyn's unique formulation
- [ ] "Zyn vs Other Brands" comparison table
- [ ] Products grid or "coming soon" message
- [ ] Internal links work (main nicotine pouches, Velo, Nordic Spirit)

#### SEO Tests

- [ ] Title tag: "Zyn Nicotine Pouches UK | Premium Tobacco-Free Nicotine | Vapourism 2025"
- [ ] Meta description includes "zyn", "premium us brand"
- [ ] Keywords include "zyn", "zyn nicotine pouches", "zyn pouches uk"
- [ ] Open Graph tags present

#### Responsive Tests

- [ ] Desktop layout correct
- [ ] Tablet layout adjusts
- [ ] Mobile layout single column, comparison table scrolls horizontally

#### Performance Tests

- [ ] Lighthouse SEO score >90
- [ ] No console errors

**Notes:**

---

### 1.4 Hayati Pro Ultra 25000

**URL:** `/collections/hayati-pro-ultra`

#### Functional Tests

- [ ] Page loads successfully
- [ ] H1 title: "Hayati Pro Ultra 25000 | Premium Disposable Vapes UK"
- [ ] 4 feature cards display (25,000 Puffs, Rechargeable, Premium Flavors, Best Value)
- [ ] "What Makes Pro Ultra Special" content section
- [ ] "How to Use" numbered list (6 steps)
- [ ] Specifications table displays correctly
- [ ] Products grid or "coming soon" message
- [ ] "Why Choose Pro Ultra" benefits list
- [ ] Comparison table: Pro Ultra vs Standard Disposables
- [ ] FAQ section with 4 questions
- [ ] Internal links work (Hayati Pro Max, Lost Mary BM6000, Crystal Bar)

#### SEO Tests

- [ ] Title tag: "Hayati Pro Ultra 25000 | Premium Disposable Vapes UK | Vapourism 2025"
- [ ] Meta description includes "25,000 puffs", "rechargeable", "fast UK delivery"
- [ ] Keywords include "hayati pro ultra", "hayati pro ultra 25000", "hayati 25000 puffs"
- [ ] Open Graph tags present

#### Responsive Tests

- [ ] Desktop layout correct
- [ ] Tablet layout adjusts
- [ ] Mobile layout single column
- [ ] Tables scroll horizontally on mobile

#### Performance Tests

- [ ] Lighthouse SEO score >90
- [ ] No console errors
- [ ] Page loads in <3 seconds

**Notes:**

---

## Test Suite 2: Enhanced Pages

### 2.1 Homepage

**URL:** `/`

#### Functional Tests

- [ ] Page loads successfully
- [ ] Homepage content renders (hero, featured products, etc.)
- [ ] All existing functionality works
- [ ] No broken elements from SEO changes

#### SEO Tests

- [ ] **Updated Title Tag**: "Vape Shop UK | Premium Vaping Products | Vapourism 2025"
  - Before: "Vapourism | Premium UK Vape Shop | E-Liquids, Vape Kits & Accessories"
  - After should emphasize "Vape Shop UK" first
  
- [ ] **Updated Meta Description**: Contains "UK's leading vape shop", "Disposable Vapes", "E-Liquids", "Nicotine Pouches"
  
- [ ] **Updated Keywords**: Includes "vape shop", "vape uk", "vape shop uk", "vapes", "vaping"
  
- [ ] **Open Graph tags updated** to match new title/description

#### Responsive Tests

- [ ] Desktop layout unchanged
- [ ] Mobile layout unchanged
- [ ] No regressions from SEO updates

#### Performance Tests

- [ ] Lighthouse SEO score improved or maintained (target >90)
- [ ] No new console errors

**Notes:**

---

### 2.2 Payment Methods Page (NEW)

**URL:** `/pages/payment-methods`

#### Functional Tests

- [ ] Page loads successfully
- [ ] H1 title: "Payment Methods | Buy Now Pay Later"
- [ ] 4 payment method cards display (Clearpay, PayPal, Klarna, Cards)
- [ ] Each card has:
  - Icon/badge
  - Description
  - Benefits list with checkmarks
  - Example/info box
  
- [ ] Security section displays with 3 cards (SSL, PCI, 3D Secure)
- [ ] "How Buy Now Pay Later Works" - 4 step process displayed
- [ ] FAQ section with 5 questions/answers
- [ ] CTA section with "Start Shopping" and "Disposable Vapes" buttons
- [ ] CTA buttons are clickable and go to correct URLs
- [ ] Footer links work (Delivery, Returns, Terms)

#### SEO Tests

- [ ] Title tag: "Payment Methods | Buy Now Pay Later | Clearpay & PayPal | Vapourism"
- [ ] Meta description includes "clearpay", "paypal", "buy now pay later"
- [ ] Keywords include "clearpay", "paypal uk", "klarna"
- [ ] Open Graph tags present

#### Responsive Tests

- [ ] Desktop layout - 2 column grid for payment methods
- [ ] Tablet layout adjusts appropriately
- [ ] Mobile layout - single column, cards stack
- [ ] All text readable on mobile

#### Performance Tests

- [ ] Lighthouse SEO score >90
- [ ] Accessibility score >85 (important for payment info)
- [ ] No console errors

**Notes:**

---

### 2.3 Delivery Information Page (ENHANCED)

**URL:** `/policies/delivery-information`

#### Functional Tests

- [ ] Page loads successfully
- [ ] **Updated H1**: "Delivery Information | Fast UK Delivery via DPD"
- [ ] Lead paragraph mentions DPD Local and Royal Mail
- [ ] Enhanced delivery options section with details
- [ ] **New section**: "DPD Local Tracking" with 5 bullet points
- [ ] **Enhanced**: "Order Processing" with cut-off times
- [ ] **New section**: "UK Delivery Coverage" with regions list
- [ ] **Enhanced**: "Tracking Your Order" with carrier links
  - DPD link: https://www.dpd.co.uk/tracking
  - Royal Mail link: https://www.royalmail.com/track-your-item
- [ ] External links open in new tab
- [ ] **New section**: "Delivery FAQs" with 3 questions
- [ ] All sections render correctly

#### SEO Tests

- [ ] **Updated Title**: "Delivery Information | Fast UK Delivery | DPD & Royal Mail | Vapourism"
- [ ] **Updated Meta Description**: Includes "DPD Local", "Royal Mail", "free delivery over £20"
- [ ] **Updated Keywords**: Includes "dpd local", "dpd tracking"
- [ ] Open Graph tags updated

#### Responsive Tests

- [ ] Desktop layout correct
- [ ] Tablet layout readable
- [ ] Mobile layout - lists and sections format properly

#### Performance Tests

- [ ] Lighthouse SEO score >90
- [ ] No console errors

**Notes:**

---

## Test Suite 3: Integration Tests

### 3.1 Internal Navigation

**Test internal links between pages:**

- [ ] Homepage → Nicotine Pouches page
  - Add link to homepage if not present
  
- [ ] Nicotine Pouches → Velo page → works
- [ ] Nicotine Pouches → Zyn page → works
- [ ] Velo page → Zyn page → works
- [ ] Velo page → Nicotine Pouches main → works

- [ ] Hayati Pro Ultra → Hayati Pro Max → works
- [ ] Hayati Pro Ultra → Lost Mary BM6000 → works
- [ ] Hayati Pro Ultra → Crystal Bar → works

- [ ] Payment Methods → Homepage → works
- [ ] Payment Methods → Disposable Vapes search → works
- [ ] Payment Methods → Delivery Information → works
- [ ] Payment Methods → Returns Policy → works
- [ ] Payment Methods → Terms of Service → works

- [ ] Delivery Information → other policy pages → work

### 3.2 Search Integration

**Test that pages can be found via search:**

- [ ] Search for "nicotine pouches" returns relevant products (if tagged)
- [ ] Search for "velo" returns Velo products (if they exist)
- [ ] Search for "zyn" returns Zyn products (if they exist)
- [ ] Search for "hayati pro ultra" returns Hayati products (if they exist)

### 3.3 404 Handling

**Test that non-existent routes show 404:**

- [ ] `/collections/does-not-exist` → 404 page
- [ ] `/pages/does-not-exist` → 404 page
- [ ] 404 page has link back to homepage

---

## Test Suite 4: SEO Technical Tests

### 4.1 Meta Tags Validation

**Use "View Page Source" (Ctrl+U) for each page:**

- [ ] Each page has unique title tag
- [ ] Each page has unique meta description
- [ ] No duplicate meta tags
- [ ] No missing required tags

### 4.2 Structured Data

**Test using [Google Rich Results Test](https://search.google.com/test/rich-results):**

- [ ] Homepage - Organization schema valid
- [ ] Homepage - Website schema valid
- [ ] Collection pages - BreadcrumbList valid (if implemented)
- [ ] No structured data errors

### 4.3 Robots.txt & Sitemap

- [ ] `/robots.txt` is accessible
- [ ] Robots.txt allows search engines to crawl new pages
- [ ] `/sitemap.xml` includes new collection pages (or will after rebuild)

### 4.4 Canonical URLs

- [ ] Each page has canonical link tag
- [ ] Canonical URLs are absolute (include domain)
- [ ] No canonical conflicts

---

## Test Suite 5: Performance Tests

### 5.1 Lighthouse Audit

**Run for each new/enhanced page:**

1. Open page in Chrome
2. Open DevTools (F12)
3. Go to Lighthouse tab
4. Select "Navigation" mode
5. Check all categories
6. Click "Analyze page load"

**Target Scores:**
- Performance: >85
- Accessibility: >85
- Best Practices: >85
- SEO: >90

**Record scores:**

| Page | Performance | Accessibility | Best Practices | SEO |
|------|-------------|---------------|----------------|-----|
| Nicotine Pouches | | | | |
| Velo Pouches | | | | |
| Zyn Pouches | | | | |
| Hayati Pro Ultra | | | | |
| Payment Methods | | | | |
| Delivery Info | | | | |
| Homepage | | | | |

### 5.2 Load Time Tests

**Measure load time with DevTools Network tab:**

- [ ] All pages load in <3 seconds on 3G connection
- [ ] Images are optimized and lazy loaded
- [ ] No render-blocking resources

### 5.3 Console Errors

- [ ] No JavaScript errors in console
- [ ] No failed network requests
- [ ] No 404s for assets

---

## Test Suite 6: Mobile-Specific Tests

**Test on real mobile device or browser responsive mode (375x667):**

### 6.1 Nicotine Pouches Page

- [ ] Readable without zooming
- [ ] Buttons/links easy to tap (48x48px minimum)
- [ ] No horizontal scrolling (except tables)
- [ ] Images scale appropriately
- [ ] Tables scroll horizontally with visual indicator

### 6.2 Payment Methods Page

- [ ] Payment method cards stack vertically
- [ ] All content readable
- [ ] CTA buttons large and tappable

### 6.3 Delivery Information Page

- [ ] Long content sections readable
- [ ] Lists format correctly
- [ ] External links easy to tap

---

## Test Suite 7: Cross-Browser Tests

**Test in multiple browsers:**

- [ ] **Chrome** (latest) - All functionality works
- [ ] **Firefox** (latest) - All functionality works
- [ ] **Safari** (latest) - All functionality works
- [ ] **Edge** (latest) - All functionality works
- [ ] **Mobile Safari** (iOS) - All functionality works
- [ ] **Mobile Chrome** (Android) - All functionality works

---

## Test Suite 8: Accessibility Tests

### 8.1 Keyboard Navigation

- [ ] Tab through all interactive elements
- [ ] All links and buttons are focusable
- [ ] Focus indicator visible
- [ ] Can navigate entire page with keyboard only

### 8.2 Screen Reader

**Test with NVDA (Windows) or VoiceOver (Mac):**

- [ ] Page title announced correctly
- [ ] Headings hierarchy makes sense (H1 → H2 → H3)
- [ ] Link text is descriptive
- [ ] Images have alt text (if applicable)
- [ ] Tables have proper headers

### 8.3 Color Contrast

- [ ] Text has sufficient contrast (4.5:1 minimum for normal text)
- [ ] Links are distinguishable
- [ ] Important information not conveyed by color alone

---

## Test Suite 9: Analytics & Tracking

### 9.1 Google Analytics

- [ ] Page views tracked correctly
- [ ] Events fire as expected
- [ ] Goals/conversions tracked

### 9.2 Search Console

- [ ] Pages are discoverable (after deployment)
- [ ] No crawl errors
- [ ] Sitemap submitted

---

## Post-Deployment Checklist

**After deploying to production:**

- [ ] All URLs work on production domain
- [ ] SSL certificate valid (https://)
- [ ] No mixed content warnings
- [ ] Google Search Console verified
- [ ] Submit sitemap to Google
- [ ] Monitor for 404 errors
- [ ] Check analytics for traffic
- [ ] Monitor search rankings (use Google Search Console after 2-4 weeks)

---

## Bug Reporting Template

**If you find issues, document them:**

```
**Page:** [URL]
**Issue:** [Description]
**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
**Expected:** [What should happen]
**Actual:** [What actually happened]
**Browser:** [Chrome/Firefox/Safari/etc]
**Device:** [Desktop/Mobile/Tablet]
**Screenshot:** [If applicable]
**Priority:** [High/Medium/Low]
```

---

## Success Criteria

All pages pass if:

✅ **Functional:** All pages load, content displays, links work  
✅ **SEO:** Title tags optimized, meta descriptions present, keywords targeted  
✅ **Responsive:** Works on desktop, tablet, mobile  
✅ **Performance:** Lighthouse SEO score >90, load time <3s  
✅ **Accessible:** Keyboard navigable, screen reader friendly  
✅ **Cross-browser:** Works in all major browsers  

---

## Timeline for Testing

**Recommended Schedule:**

- **Day 1:** Functional tests (Test Suites 1-2) - 2 hours
- **Day 2:** Integration, SEO, Performance tests (Test Suites 3-5) - 2 hours
- **Day 3:** Mobile, cross-browser, accessibility tests (Test Suites 6-8) - 2 hours
- **Day 4:** Post-deployment verification - 1 hour

**Total: ~7 hours of thorough testing**

---

## Summary

This implementation adds 7 new/enhanced pages targeting **650k+ monthly searches**:

✅ 3 Nicotine Pouches pages (Velo, Zyn, main category)  
✅ 1 Hayati Pro Ultra page  
✅ 1 Payment Methods page (NEW)  
✅ 1 Enhanced Delivery page  
✅ 1 Optimized Homepage  

**Expected Impact:** 55k-110k monthly organic visits within 12 weeks.
