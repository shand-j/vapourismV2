# Blog Implementation - Manual Testing Plan

## Overview
This document provides a comprehensive manual testing plan for the blog feature implementation. Follow these steps to verify that the blog functionality works correctly.

## Prerequisites
- Local development server running (`npm run dev`) OR deployed to a test/production environment
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Browser developer tools available

## Test Environment URLs

### Local Development
- Blog Index: `http://localhost:3000/blog`
- Sample Article: `http://localhost:3000/blog/nicotine-pouches-risks-and-benefits`
- Homepage (for footer test): `http://localhost:3000`

### Production/Staging
Replace `localhost:3000` with your deployed domain (e.g., `https://vapourism.co.uk`)

---

## Test Cases

### TC-001: Blog Index Page - Basic Functionality
**Priority**: High  
**URL**: `/blog`

**Steps**:
1. Navigate to `/blog`
2. Wait for page to fully load

**Expected Results**:
- ✅ Page loads without errors (check browser console - F12)
- ✅ Page title is "Vapourism Blog"
- ✅ Page description text is visible below title
- ✅ At least one article card is displayed
- ✅ No 404 or 500 errors
- ✅ Page loads within 3 seconds

**Pass/Fail**: ________  
**Notes**: ________________________________________

---

### TC-002: Blog Index Page - Article Card Content
**Priority**: High  
**URL**: `/blog`

**Steps**:
1. Navigate to `/blog`
2. Examine the nicotine pouches article card

**Expected Results**:
- ✅ Category badge displays "Education" with violet background
- ✅ Published date shows "15 December 2024" (or similar format)
- ✅ Article title: "Nicotine Pouches Explained: Risks vs. Benefits"
- ✅ Meta description preview is visible (truncated at 3 lines)
- ✅ Up to 3 tags are visible at bottom of card
- ✅ Card has hover effect (shadow increases on hover)

**Pass/Fail**: ________  
**Notes**: ________________________________________

---

### TC-003: Blog Index Page - SEO Metadata
**Priority**: High  
**URL**: `/blog`

**Steps**:
1. Navigate to `/blog`
2. Right-click page → "View Page Source"
3. Search for the following in the HTML:
   - `<title>`
   - `<meta name="description"`
   - `<meta property="og:title"`

**Expected Results**:
- ✅ Title tag contains "Blog | Vapourism"
- ✅ Meta description mentions "vaping guides" or "educational content"
- ✅ Open Graph title tag is present
- ✅ Open Graph type is "website"

**Pass/Fail**: ________  
**Notes**: ________________________________________

---

### TC-004: Individual Article Page - Navigation
**Priority**: High  
**URL**: `/blog` → click article

**Steps**:
1. Navigate to `/blog`
2. Click on the "Nicotine Pouches Explained" article card
3. Verify navigation to `/blog/nicotine-pouches-risks-and-benefits`

**Expected Results**:
- ✅ Successfully navigates to article page
- ✅ No errors in console
- ✅ URL changes to `/blog/nicotine-pouches-risks-and-benefits`
- ✅ Page loads within 2 seconds
- ✅ Browser back button works correctly

**Pass/Fail**: ________  
**Notes**: ________________________________________

---

### TC-005: Individual Article Page - Breadcrumb Navigation
**Priority**: Medium  
**URL**: `/blog/nicotine-pouches-risks-and-benefits`

**Steps**:
1. Navigate directly to article URL
2. Examine the breadcrumb at the top of the page

**Expected Results**:
- ✅ Breadcrumb shows: "Home • Blog • [Article Title]"
- ✅ "Home" link is clickable and navigates to homepage
- ✅ "Blog" link is clickable and navigates to `/blog`
- ✅ Article title is displayed (not a link)
- ✅ Breadcrumb is visible and properly styled

**Pass/Fail**: ________  
**Notes**: ________________________________________

---

### TC-006: Individual Article Page - Article Header
**Priority**: High  
**URL**: `/blog/nicotine-pouches-risks-and-benefits`

**Steps**:
1. Navigate to article page
2. Examine the header section

**Expected Results**:
- ✅ Category badge shows "Education"
- ✅ Published date is displayed
- ✅ Author "Vapourism Team" is shown
- ✅ Main title is large and prominent (H1 heading)
- ✅ Meta description appears below title
- ✅ All text is readable and properly formatted

**Pass/Fail**: ________  
**Notes**: ________________________________________

---

### TC-007: Individual Article Page - Content Rendering
**Priority**: High  
**URL**: `/blog/nicotine-pouches-risks-and-benefits`

**Steps**:
1. Navigate to article page
2. Scroll through entire article
3. Check content formatting

**Expected Results**:
- ✅ Main heading "Nicotine Pouches: Risks and Benefits Explained" is visible
- ✅ Multiple section headings (H2) are present
- ✅ Subsection headings (H3) are present
- ✅ Bullet points render correctly
- ✅ Bold text is emphasized
- ✅ Paragraphs have proper spacing
- ✅ Content is readable (no overlapping text)
- ✅ No raw markdown symbols visible (e.g., **, ##, *)

**Pass/Fail**: ________  
**Notes**: ________________________________________

---

### TC-008: Individual Article Page - Footer Section
**Priority**: Medium  
**URL**: `/blog/nicotine-pouches-risks-and-benefits`

**Steps**:
1. Navigate to article page
2. Scroll to bottom
3. Examine tags and back link

**Expected Results**:
- ✅ "Tags:" label is visible
- ✅ At least 4 tags are displayed
- ✅ Tags include: "nicotine pouches", "health", "tobacco alternatives", "harm reduction"
- ✅ "← Back to Blog" link is visible
- ✅ Clicking "Back to Blog" navigates to `/blog`

**Pass/Fail**: ________  
**Notes**: ________________________________________

---

### TC-009: Individual Article Page - SEO Metadata
**Priority**: High  
**URL**: `/blog/nicotine-pouches-risks-and-benefits`

**Steps**:
1. Navigate to article page
2. View page source
3. Search for meta tags and structured data

**Expected Results**:
- ✅ Title tag contains article title + "| Vapourism Blog"
- ✅ Meta description contains article description
- ✅ Open Graph tags present (og:title, og:description, og:type)
- ✅ og:type is "article"
- ✅ article:published_time tag present
- ✅ Twitter Card tags present
- ✅ JSON-LD structured data present (search for `<script type="application/ld+json">`)
- ✅ Structured data includes @type: "Article"
- ✅ Structured data includes headline, datePublished, author

**Pass/Fail**: ________  
**Notes**: ________________________________________

---

### TC-010: Footer Blog Link - Homepage
**Priority**: High  
**URL**: `/` (homepage)

**Steps**:
1. Navigate to homepage
2. Scroll to footer
3. Locate the "Legal" section (4th column)
4. Find "Blog" link

**Expected Results**:
- ✅ "Blog" link appears in Legal section
- ✅ Link is styled consistently with other footer links
- ✅ Link text is gray (#d1d5db)
- ✅ Link turns white on hover
- ✅ Clicking link navigates to `/blog`

**Pass/Fail**: ________  
**Notes**: ________________________________________

---

### TC-011: Footer Blog Link - Visibility Across Site
**Priority**: Medium  
**URLs**: Various pages

**Steps**:
1. Visit the following pages and verify blog link in footer:
   - Homepage (`/`)
   - About page (if exists)
   - Contact page (`/contact`)
   - Any product page
   - Search page (`/search`)

**Expected Results**:
- ✅ Blog link appears in footer on all pages
- ✅ Link is consistently placed in Legal section
- ✅ Link functions correctly on all pages tested

**Pass/Fail**: ________  
**Notes**: ________________________________________

---

### TC-012: Mobile Responsiveness - Blog Index
**Priority**: High  
**URL**: `/blog`

**Steps**:
1. Open browser dev tools (F12)
2. Switch to device toolbar (Ctrl+Shift+M / Cmd+Shift+M)
3. Select "iPhone SE" or similar mobile device
4. Navigate to `/blog`

**Expected Results**:
- ✅ Article cards stack in single column
- ✅ Card images (if any) maintain aspect ratio
- ✅ Text is readable without zooming
- ✅ No horizontal scrolling required
- ✅ Spacing between cards is adequate
- ✅ Touch targets are appropriately sized

**Pass/Fail**: ________  
**Notes**: ________________________________________

---

### TC-013: Mobile Responsiveness - Article Page
**Priority**: High  
**URL**: `/blog/nicotine-pouches-risks-and-benefits`

**Steps**:
1. Open browser dev tools (F12)
2. Switch to device toolbar
3. Select "iPhone SE" or similar mobile device
4. Navigate to article page

**Expected Results**:
- ✅ Article title fits on screen without overflow
- ✅ Breadcrumb navigation is readable
- ✅ Content is properly formatted
- ✅ Lists display correctly
- ✅ No text overlaps or runs off screen
- ✅ Footer blog link is accessible
- ✅ Back to Blog link is easily clickable

**Pass/Fail**: ________  
**Notes**: ________________________________________

---

### TC-014: Tablet Responsiveness
**Priority**: Medium  
**URL**: `/blog` and article page

**Steps**:
1. Set viewport to tablet size (768px width)
2. Test both blog index and article pages

**Expected Results**:
- ✅ Blog index shows 2 columns of articles
- ✅ Article content has appropriate margins
- ✅ Navigation is easy to use
- ✅ Footer is properly formatted

**Pass/Fail**: ________  
**Notes**: ________________________________________

---

### TC-015: Browser Compatibility - Chrome
**Priority**: High  
**URLs**: `/blog` and article page

**Steps**:
1. Open Google Chrome (latest version)
2. Test blog index and article pages
3. Check console for errors

**Expected Results**:
- ✅ Pages load correctly
- ✅ No JavaScript errors
- ✅ Styling renders properly
- ✅ Interactions work smoothly

**Pass/Fail**: ________  
**Notes**: ________________________________________

---

### TC-016: Browser Compatibility - Firefox
**Priority**: High  
**URLs**: `/blog` and article page

**Steps**:
1. Open Firefox (latest version)
2. Test blog index and article pages
3. Check console for errors

**Expected Results**:
- ✅ Pages load correctly
- ✅ No JavaScript errors
- ✅ Styling renders properly
- ✅ Interactions work smoothly

**Pass/Fail**: ________  
**Notes**: ________________________________________

---

### TC-017: Browser Compatibility - Safari
**Priority**: Medium (if on Mac)  
**URLs**: `/blog` and article page

**Steps**:
1. Open Safari (latest version)
2. Test blog index and article pages
3. Check console for errors

**Expected Results**:
- ✅ Pages load correctly
- ✅ No JavaScript errors
- ✅ Styling renders properly
- ✅ Interactions work smoothly

**Pass/Fail**: ________  
**Notes**: ________________________________________

---

### TC-018: Performance - Page Load Time
**Priority**: Medium  
**URLs**: `/blog` and article page

**Steps**:
1. Open browser dev tools (F12)
2. Go to Network tab
3. Navigate to `/blog`
4. Note the load time
5. Repeat for article page

**Expected Results**:
- ✅ Blog index loads in < 3 seconds
- ✅ Article page loads in < 2 seconds
- ✅ No failed network requests
- ✅ Images load efficiently (if any)

**Pass/Fail**: ________  
**Load Times**: Blog: ____s, Article: ____s

---

### TC-019: Accessibility - Keyboard Navigation
**Priority**: Medium  
**URLs**: `/blog` and article page

**Steps**:
1. Navigate to `/blog`
2. Use Tab key to navigate through page
3. Use Enter key to activate links
4. Navigate to article page and repeat

**Expected Results**:
- ✅ Can navigate to all article cards using Tab
- ✅ Article cards have visible focus state
- ✅ Can activate links using Enter key
- ✅ Focus order is logical
- ✅ Back to Blog link is keyboard accessible

**Pass/Fail**: ________  
**Notes**: ________________________________________

---

### TC-020: Content Accuracy
**Priority**: High  
**URL**: `/blog/nicotine-pouches-risks-and-benefits`

**Steps**:
1. Navigate to article
2. Read through content
3. Verify key sections are present

**Expected Results**:
- ✅ Article includes "What Are Nicotine Pouches?" section
- ✅ Article includes "How Do Nicotine Pouches Work?" section
- ✅ Article includes "Popular Brands" section
- ✅ Article includes "Benefits" section
- ✅ Article includes "Risks and Side Effects" section
- ✅ Article includes "Oral Health Concerns" section
- ✅ Disclaimer is present at the end

**Pass/Fail**: ________  
**Notes**: ________________________________________

---

## Regression Testing

### After Code Changes
If you make changes to the blog implementation, re-run the following critical tests:
- TC-001 (Blog Index Basic)
- TC-004 (Article Navigation)
- TC-007 (Content Rendering)
- TC-009 (SEO Metadata)
- TC-010 (Footer Link)

---

## Test Summary

**Date Tested**: __________________  
**Tester Name**: __________________  
**Environment**: ☐ Local  ☐ Staging  ☐ Production  

**Total Tests**: 20  
**Passed**: ______  
**Failed**: ______  
**Blocked/Skipped**: ______  

**Critical Issues Found**:
_____________________________________________
_____________________________________________
_____________________________________________

**Recommendations**:
_____________________________________________
_____________________________________________
_____________________________________________

**Sign-off**: ☐ Approved for Production  ☐ Needs Fixes

---

## Known Limitations

1. **Markdown Rendering**: The current implementation uses a basic markdown-to-HTML converter. Complex markdown features may not render correctly.
2. **Images**: No images are currently included in the article. Featured images can be added via the `featuredImage` property.
3. **Search**: There is no search functionality within the blog yet.
4. **Categories/Tags**: Filtering by category or tag is not yet implemented on the UI.

---

## Next Steps After Successful Testing

1. Submit blog sitemap to Google Search Console
2. Share article on social media to test OpenGraph tags
3. Monitor Google Analytics for blog traffic
4. Add more articles following the same pattern
5. Consider implementing blog search and filtering features

---

**Document Version**: 1.0  
**Last Updated**: December 15, 2024
