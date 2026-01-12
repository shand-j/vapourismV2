# NicPowch Theme - Testing Checklist

## SEO & Google Shopping Validation

### Product Page SEO
- [ ] **View Product Page Source**
  - Check that all Google Shopping meta tags are present
  - Verify price format is decimal (e.g., 4.99 not 499)
  - Confirm GTIN/barcode is populated (if product has one)
  - Verify age_group is set to "adult"
  - Check category is "Health & Beauty > Tobacco Products > Nicotine Pouches"

- [ ] **Google Rich Results Test**
  - Visit: https://search.google.com/test/rich-results
  - Test a product URL
  - Verify "Product" schema is detected
  - Check for zero errors
  - Verify warnings are acceptable

- [ ] **Structured Data Validator**
  - Visit: https://validator.schema.org/
  - Paste product page source
  - Verify all JSON-LD validates correctly
  - Check Product, Organization, and BreadcrumbList schemas

- [ ] **Open Graph Tags**
  - Use: https://www.opengraph.xyz/
  - Test product URL
  - Verify image displays correctly
  - Check title, description, and pricing

### Offers Page Functionality
- [ ] **Theme Customizer Access**
  - Go to: Online Store > Themes > Customize
  - Navigate to the Offers page template
  - Verify "Offers Page" section is editable

- [ ] **Block Management**
  - Click "Add block" in Offers Page section
  - Verify "Offer Collection" appears as an option
  - Add a test offer collection
  - Verify collection picker works
  - Set custom offer name
  - Save and preview

- [ ] **Auto-Detection Feature**
  - Toggle "Auto-detect collections starting with 'OFFER:'"
  - Create test collection: "OFFER: Test Sale"
  - Add products to the collection
  - Publish collection
  - Visit offers page
  - Verify collection appears automatically

- [ ] **Display Verification**
  - Offers page shows collection titles
  - Product grids display correctly (2/3/4 columns responsive)
  - "View all" links work
  - Product cards show sale badges if enabled
  - Empty state shows when no offers exist

### Navigation Testing
- [ ] **Desktop Navigation**
  - Shop Pouches dropdown appears on hover
  - All brand links work correctly
  - Strength filter links work correctly
  - Dropdown closes when clicking outside
  - Active states show on current page

- [ ] **Mobile Navigation**
  - Hamburger menu opens smoothly
  - Shop Pouches accordion expands/collapses
  - All links are tappable
  - Menu scrolls if content is tall
  - Menu closes when clicking overlay or X button

- [ ] **Cart Counter**
  - Initially shows cart.item_count
  - Hidden when cart is empty
  - Updates when adding item to cart
  - Animates on cart update
  - Visible and readable on both mobile and desktop

### Product Display & Filtering
- [ ] **Collections Page**
  - Navigate to /collections/all
  - Verify only nicotine pouch products display
  - Check filter sidebar appears on desktop
  - Verify mobile filter toggle works
  - Test brand filters
  - Test strength filters
  - Test price filters

- [ ] **Filter Behavior**
  - Filters with >6 options show dropdown or scrollable list
  - Filters update product display without page reload (if AJAX enabled)
  - URL updates with filter parameters
  - Filter selections persist on page refresh
  - "Clear filters" works correctly

- [ ] **Product Grid**
  - Products display in responsive grid
  - Images load correctly with lazy loading
  - Product cards show vendor badge
  - Prices display correctly
  - Hover effects work smoothly
  - "View product" CTA is visible

### Search Functionality
- [ ] **Search Page**
  - Navigate to /search
  - Search box is visible and functional
  - Results display correctly
  - No results message appears when appropriate
  - Product cards match design
  - Filters work on search results

- [ ] **Search Suggestions**
  - Type in search box
  - Predictive suggestions appear (if enabled)
  - Suggestions are relevant
  - Clicking suggestion goes to correct page

### Cart Page
- [ ] **Cart Display**
  - Cart items show product image
  - Product title and variant details visible
  - Quantity selector works
  - Remove button works
  - Subtotal calculates correctly
  - Shipping threshold message shows (if applicable)

- [ ] **Cart Functionality**
  - Update quantity updates subtotal
  - Removing item updates count badge in header
  - Empty cart shows appropriate message
  - Continue shopping link works
  - Checkout button is prominent

### Mobile Responsiveness
- [ ] **Mobile Layout** (375px width)
  - All text is readable
  - Images scale appropriately
  - Buttons are tappable (min 44x44px)
  - Navigation works smoothly
  - No horizontal scroll
  - Forms are usable

- [ ] **Tablet Layout** (768px width)
  - Layout adapts appropriately
  - Navigation may show desktop or mobile version
  - Product grids show 2-3 columns
  - Filters are accessible

- [ ] **Desktop Layout** (1440px width)
  - Full navigation visible
  - Product grids show 4 columns
  - Filter sidebar visible
  - Content is centered with max-width
  - No awkward whitespace

### Image Optimization
- [ ] **Product Images**
  - Alt text is present and descriptive
  - Multiple sizes load via srcset
  - Lazy loading works
  - Images are sharp and not pixelated
  - Aspect ratio maintained

- [ ] **Hero Images**
  - Hero banner loads quickly
  - Text overlay is readable
  - CTA buttons are visible
  - Responsive on all devices

### Page Load Performance
- [ ] **PageSpeed Insights**
  - Test homepage: https://pagespeed.web.dev/
  - Mobile score >80
  - Desktop score >90
  - Core Web Vitals pass
  - No major issues reported

- [ ] **GTmetrix**
  - Test key pages
  - Grade B or higher
  - Load time <3 seconds
  - No render-blocking resources

### Accessibility
- [ ] **Keyboard Navigation**
  - Tab through all interactive elements
  - Focus indicators are visible
  - Dropdowns open/close with Enter/Escape
  - Form fields are accessible

- [ ] **Screen Reader**
  - ARIA labels are present
  - Alt text describes images
  - Headings follow proper hierarchy (H1 > H2 > H3)
  - Links have descriptive text

- [ ] **Color Contrast**
  - Text is readable on all backgrounds
  - WCAG AA compliance minimum
  - Use: https://webaim.org/resources/contrastchecker/

### Browser Compatibility
- [ ] **Chrome** (latest)
  - All features work
  - Layout is correct
  - No console errors

- [ ] **Firefox** (latest)
  - All features work
  - Layout is correct
  - No console errors

- [ ] **Safari** (latest)
  - All features work
  - Layout is correct
  - Webkit-specific CSS works

- [ ] **Edge** (latest)
  - All features work
  - Layout is correct
  - No console errors

- [ ] **Mobile Safari** (iOS)
  - Touch interactions work
  - No zoom issues
  - Forms submit correctly

- [ ] **Chrome Mobile** (Android)
  - Touch interactions work
  - No layout issues
  - Fast performance

## Google Merchant Center Integration

### Feed Setup
- [ ] **Product Feed URL**
  - Access: https://[store].myshopify.com/products.xml
  - Verify XML validates
  - Check all products are included
  - Verify product data is accurate

- [ ] **Merchant Center Configuration**
  - Sign in to Google Merchant Center
  - Add new feed (Products > Feeds > Add Feed)
  - Select "Scheduled fetch"
  - Enter feed URL
  - Set schedule to daily
  - Verify initial fetch succeeds

- [ ] **Product Approval**
  - Wait for products to be processed
  - Check for disapprovals
  - Fix any errors/warnings
  - Verify products show "Active"

### Product Data Quality
- [ ] **Required Fields Present**
  - ID (product.id)
  - Title (product.title)
  - Description (product.description)
  - Link (product URL)
  - Image link (product.featured_image)
  - Availability (in stock/out of stock)
  - Price (with currency)
  - Brand (product.vendor)
  - Condition (new)

- [ ] **Optional but Recommended**
  - GTIN (barcode)
  - MPN (SKU)
  - Product category
  - Sale price (if on sale)
  - Additional images
  - Shipping information

### Error Resolution
- [ ] **Common Errors Fixed**
  - Price mismatches resolved
  - Missing GTINs (added or exemption requested)
  - Image quality issues resolved
  - Availability is accurate
  - Links are working

## Deployment Checklist

### Pre-Deployment
- [ ] All changes committed to git
- [ ] Documentation updated
- [ ] Breaking changes documented (none expected)
- [ ] Theme version bumped

### Deployment
- [ ] Create theme backup in Shopify admin
- [ ] Upload theme files via Shopify CLI or admin
- [ ] Verify theme preview
- [ ] Test key functionality in preview
- [ ] Publish theme
- [ ] Clear cache (if applicable)

### Post-Deployment
- [ ] Verify homepage loads correctly
- [ ] Check a product page
- [ ] Test cart functionality
- [ ] Verify offers page works
- [ ] Check mobile view
- [ ] Monitor for errors in Google Search Console
- [ ] Verify Merchant Center feed still works

## Monitoring

### Weekly Checks
- [ ] Google Search Console
  - Check for crawl errors
  - Review search performance
  - Monitor mobile usability

- [ ] Google Merchant Center
  - Check product approval status
  - Review any warnings
  - Monitor disapprovals

- [ ] Shopify Analytics
  - Review conversion rate
  - Check top products
  - Monitor search queries

### Monthly Checks
- [ ] Update product images if needed
- [ ] Add new product reviews (if available)
- [ ] Optimize underperforming pages
- [ ] Review and update SEO meta tags
- [ ] Check for broken links
- [ ] Update sitemap if needed

## Issue Reporting

If you encounter issues during testing, document:
1. **Issue Description**: What went wrong?
2. **Steps to Reproduce**: How to recreate the issue?
3. **Expected Behavior**: What should happen?
4. **Actual Behavior**: What actually happened?
5. **Browser/Device**: Where did it occur?
6. **Screenshots**: Visual evidence of the issue
7. **Priority**: Critical / High / Medium / Low

---

**Testing Date**: ___________  
**Tester Name**: ___________  
**Theme Version**: 1.1.0  
**Status**: ☐ Pass  ☐ Fail  ☐ Needs Review
