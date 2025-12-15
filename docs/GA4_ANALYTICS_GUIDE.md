# Google Analytics 4 (GA4) Implementation Guide

## Overview

Vapourism V2 includes comprehensive GA4 tracking for e-commerce and user behavior analytics. All tracking respects GDPR/cookie consent preferences managed through the `CookieConsent` component.

**Status**: ✅ Fully Implemented  
**Compliance**: GDPR-compliant with consent management  
**Coverage**: 50+ routes with page view and e-commerce tracking

---

## Quick Start

### 1. Set Up GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property (or use existing)
3. Set up a Web Data Stream
4. Copy your Measurement ID (format: `G-XXXXXXXXXX`)

### 2. Configure Environment Variable

Add to your `.env` file:

```bash
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Important**: This variable is exposed to the client via `window.ENV` in `root.tsx` for browser-side tracking.

### 3. Deploy and Verify

1. Deploy to production (or test locally with `npm run dev`)
2. Open your site in a browser
3. Accept cookies when prompted
4. Check GA4 Real-time view to see events flowing in

---

## Architecture

### Components

#### 1. Analytics Library (`app/lib/analytics.ts`)

Core tracking functions:
- `trackPageView()` - Page navigation
- `trackViewItem()` - Product detail views
- `trackAddToCart()` - Add to cart events
- `trackRemoveFromCart()` - Remove from cart
- `trackViewCart()` - Cart page views
- `trackBeginCheckout()` - Checkout initiation
- `trackPurchase()` - Completed purchases
- `trackSearch()` - Search queries
- `trackViewItemList()` - Collection/category views
- `trackSelectItem()` - Product clicks from lists

#### 2. Analytics Component (`app/components/Analytics.tsx`)

React component that:
- Loads Google Analytics gtag.js script
- Initializes GA4 with your Measurement ID
- Sets consent defaults (all denied until user accepts)
- Enables anonymized IP tracking

#### 3. Cookie Consent (`app/components/CookieConsent.tsx`)

GDPR-compliant cookie banner that:
- Blocks analytics until user consents
- Updates consent state via `updateGtagConsent()`
- Stores preference in localStorage
- Shows acceptance status persistently

#### 4. Consent Management

All tracking respects user consent:
```typescript
export function hasAnalyticsConsent(): boolean {
  // Check localStorage for user consent
  const consent = localStorage.getItem('vapourism_cookie_consent');
  return JSON.parse(consent)?.analytics === true;
}
```

**Critical**: No analytics events fire until user accepts cookies.

---

## Tracking Coverage

### Global Tracking

**Page Views** (`app/root.tsx`)
- Automatically tracks all route changes
- Includes page path and title
- Fires on initial load and navigation

```typescript
// Implemented in App component
useEffect(() => {
  trackPageView(location.pathname + location.search, document.title);
}, [location.pathname, location.search]);
```

### Homepage (`app/routes/_index.tsx`)

**Events Tracked:**
- `page_view` - Homepage load
- `view_item_list` - Featured products section

```typescript
trackViewItemList(ga4Items, 'homepage_featured', 'Homepage Featured Products');
```

### Product Pages (`app/routes/products.$handle.tsx`)

**Events Tracked:**
- `page_view` - Product detail page view
- `view_item` - Product impression (includes price, brand, category)
- `add_to_cart` - When user adds product to cart

```typescript
// Product view
trackViewItem({
  currency: 'GBP',
  value: displayPrice,
  items: [ga4Item],
});

// Add to cart
trackAddToCart({
  currency: 'GBP',
  value: displayPrice * quantity,
  items: [ga4Item],
});
```

### Collection Pages (11 routes)

**Routes with Tracking:**
- `/collections/hayati-pro-ultra`
- `/collections/hayati-pro-max`
- `/collections/lost-mary-bm6000`
- `/collections/nicotine-pouches`
- `/collections/velo-nicotine-pouches`
- `/collections/zyn-nicotine-pouches`
- `/collections/crystal-bar`
- `/collections/elux-legend`
- `/collections/riot-squad`
- `/collections/hayati-x4`
- `/collections/hayati-remix`

**Events Tracked:**
- `page_view` - Collection page view
- `view_item_list` - Products in collection (up to 48 products)

**Implementation:**
```typescript
useCollectionTracking({
  products,
  listId: 'collection_hayati_pro_ultra',
  listName: 'Hayati Pro Ultra Collection',
});
```

### Search Page (`app/routes/search.tsx`)

**Events Tracked:**
- `page_view` - Search results page view
- `search` - Search query submitted
- `view_item_list` - Search results displayed

```typescript
trackSearchEvent(query, totalCount);
```

### Cart Page (`app/routes/cart.tsx`)

**Events Tracked:**
- `page_view` - Cart page view
- `view_cart` - Cart contents viewed
- `remove_from_cart` - Item removed from cart
- `begin_checkout` - Checkout button clicked

### Blog (`app/routes/blog.*`)

**Events Tracked:**
- `page_view` - Blog index and article pages
- Custom engagement metrics (time on page tracked by GA4 automatically)

---

## E-Commerce Events

### Standard GA4 E-commerce Schema

All product events follow GA4 e-commerce spec:

```typescript
interface GA4Product {
  item_id: string;           // Shopify product/variant ID
  item_name: string;         // Product title
  item_brand?: string;       // Product vendor
  item_category?: string;    // Product type
  price?: number;            // Price (inc. VAT)
  quantity?: number;         // Quantity
  item_variant?: string;     // Variant title
  currency?: string;         // Currency code (GBP)
}
```

### Conversion Flow Tracking

Complete funnel from discovery to purchase:

1. **Discovery**: `view_item_list` (homepage, collections, search)
2. **Interest**: `select_item` (click product from list)
3. **Engagement**: `view_item` (product detail page)
4. **Intent**: `add_to_cart` (add to cart)
5. **Review**: `view_cart` (cart page)
6. **Commitment**: `begin_checkout` (start checkout)
7. **Conversion**: `purchase` (order complete)

### Helper Function

Convert Shopify products to GA4 format:

```typescript
import {shopifyProductToGA4Item} from '~/lib/analytics';

const ga4Item = shopifyProductToGA4Item({
  id: product.id,
  title: product.title,
  vendor: product.vendor,
  productType: product.productType,
  price: product.priceRange?.minVariantPrice,
});
```

---

## Custom Hooks

### useCollectionTracking

Reusable hook for collection pages:

```typescript
import {useCollectionTracking} from '~/lib/hooks/useCollectionTracking';

function CollectionPage() {
  const {products} = useLoaderData();
  
  useCollectionTracking({
    products,
    listId: 'collection_unique_id',
    listName: 'Human Readable Collection Name',
  });
  
  return (/* JSX */);
}
```

**Parameters:**
- `products` - Array of products in collection
- `listId` - Unique identifier (e.g., `collection_hayati_pro_ultra`)
- `listName` - Display name (e.g., `Hayati Pro Ultra Collection`)

---

## Testing Analytics

### Local Testing

1. Start dev server: `npm run dev`
2. Open browser to `http://localhost:3000`
3. Open browser DevTools Console
4. Accept cookies when prompted
5. Navigate around the site
6. Check console for gtag calls (if debugging enabled)

### Production Testing

1. Deploy to production
2. Open site in browser
3. Accept cookies
4. Open GA4 Real-time report
5. Verify events appearing:
   - Page views
   - E-commerce events
   - Custom events

### Event Verification Checklist

Test each major route:

- [ ] Homepage loads → `page_view` + `view_item_list`
- [ ] Product page → `page_view` + `view_item`
- [ ] Add to cart → `add_to_cart`
- [ ] Collection page → `page_view` + `view_item_list`
- [ ] Search → `page_view` + `search` + `view_item_list`
- [ ] Cart page → `page_view` + `view_cart`
- [ ] Blog index → `page_view`
- [ ] Blog article → `page_view`

### Browser Console Testing

Check if gtag is loaded:
```javascript
typeof window.gtag === 'function'  // Should be true after accepting cookies
```

Check consent state:
```javascript
localStorage.getItem('vapourism_cookie_consent')
```

Manual event test:
```javascript
window.gtag('event', 'test_event', {test_param: 'test_value'});
```

---

## GDPR Compliance

### Consent Management

**Default State**: All tracking denied until explicit consent

```typescript
gtag('consent', 'default', {
  'analytics_storage': 'denied',
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
});
```

**After User Accepts**:
```typescript
updateGtagConsent(true, false);  // Analytics: granted, Marketing: denied
```

### Cookie Banner

Component: `app/components/CookieConsent.tsx`

**Features:**
- Non-intrusive banner at bottom of screen
- Clear accept/decline options
- Persistent across sessions
- Respects user choice on every page load

**User Actions:**
- **Accept All** → Enables analytics (analytics_storage: granted)
- **Decline** → Disables all tracking (analytics_storage: denied)
- **Close without action** → No consent, no tracking

### Data Protection

**Privacy Features:**
- IP anonymization enabled (`anonymize_ip: true`)
- No tracking without explicit consent
- localStorage for consent (not cookies)
- Consent state checked before every tracking call

---

## Troubleshooting

### Analytics Not Loading

**Check:**
1. GA4_MEASUREMENT_ID set in `.env`
2. Environment variable exposed in root loader
3. Browser console for script errors
4. Cookie consent accepted

**Fix:**
```bash
# Verify env var
echo $GA4_MEASUREMENT_ID

# Check in browser console
console.log(window.ENV.GA4_MEASUREMENT_ID);
```

### Events Not Firing

**Check:**
1. User accepted cookies
2. `hasAnalyticsConsent()` returns true
3. gtag function available: `typeof window.gtag`
4. No ad blockers interfering

**Debug:**
```typescript
// Add to analytics.ts temporarily
function safeGtag(...args) {
  console.log('gtag call:', args);  // Debug log
  if (!isGtagAvailable()) return;
  if (!hasAnalyticsConsent()) return;
  window.gtag(...args);
}
```

### GA4 Real-time Not Showing Events

**Possible Causes:**
1. Events delayed (can take 5-10 seconds)
2. Wrong Measurement ID
3. Ad blocker active
4. Browser blocking third-party cookies

**Verify:**
- Check Network tab for gtag/collect requests
- Disable ad blocker
- Use Incognito/Private browsing
- Test on mobile device

### TypeScript Errors

**Common Issues:**

Missing types:
```typescript
// app/lib/analytics.ts includes proper type definitions
// Make sure to import from there:
import type {GA4Product, GA4ViewItemParams} from '~/lib/analytics';
```

Window.gtag not defined:
```typescript
// Global type declaration included in analytics.ts
declare global {
  interface Window {
    gtag: (...) => void;
    dataLayer: unknown[];
  }
}
```

---

## Advanced Configuration

### Custom Dimensions

To add custom dimensions in GA4:

1. Define in GA4 Admin → Data Display → Custom Definitions
2. Add to tracking calls:

```typescript
trackPageView(pathname, pageTitle, {
  custom_dimension_1: 'value',
  user_type: 'returning',
});
```

### Enhanced E-commerce

Already implemented:
- Product impressions (view_item_list)
- Product clicks (select_item)
- Product details (view_item)
- Add/remove from cart
- Checkout process (begin_checkout)
- Purchases (purchase)

### User Properties

Set custom user properties:

```typescript
window.gtag('set', 'user_properties', {
  customer_type: 'premium',
  loyalty_tier: 'gold',
});
```

---

## Performance Considerations

### Script Loading

- gtag.js loaded asynchronously
- No render-blocking
- Consent check before every event (minimal overhead)

### Event Batching

GA4 automatically batches events for efficiency. No manual batching required.

### Memory Management

- Event listeners properly cleaned up
- No memory leaks in useEffect hooks
- Consent state cached in memory (not repeatedly read from localStorage)

---

## Maintenance

### Adding New Routes

For new routes with product lists:

1. Import hook:
```typescript
import {useCollectionTracking} from '~/lib/hooks/useCollectionTracking';
```

2. Add tracking:
```typescript
useCollectionTracking({
  products,
  listId: 'collection_new_route',
  listName: 'New Route Collection',
});
```

### Updating Events

When adding new event types:

1. Add function to `app/lib/analytics.ts`
2. Use safeGtag wrapper (respects consent)
3. Follow GA4 event naming conventions
4. Document in this guide

### Monitoring

Regular checks:
- **Weekly**: Review GA4 real-time for issues
- **Monthly**: Check data quality in reports
- **Quarterly**: Audit event taxonomy
- **Annually**: Review custom dimensions/metrics

---

## Support

### Resources

- [GA4 Documentation](https://support.google.com/analytics/answer/9306384)
- [GA4 E-commerce Events](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)
- [gtag.js Reference](https://developers.google.com/tag-platform/gtagjs/reference)

### Common Questions

**Q: Do I need Google Tag Manager?**  
A: No, gtag.js is used directly for simplicity.

**Q: Can I track custom events?**  
A: Yes, use `window.gtag('event', 'event_name', {...params})` after consent.

**Q: How do I track conversions?**  
A: Purchase events are automatically tracked. Set up goals in GA4 admin.

**Q: Is this GDPR compliant?**  
A: Yes, consent is required and properly managed.

**Q: Can I use this with Server-Side GTM?**  
A: Yes, but requires additional setup beyond this guide.

---

## Changelog

**December 15, 2024**
- ✅ Implemented global page view tracking
- ✅ Added collection tracking hook
- ✅ Updated 11 collection routes with analytics
- ✅ Enhanced homepage tracking
- ✅ Documented GA4_MEASUREMENT_ID in .env.example
- ✅ Created comprehensive documentation

**Previous Implementations**
- ✅ Product page tracking (view_item, add_to_cart)
- ✅ Search tracking
- ✅ Cookie consent management
- ✅ GDPR compliance

---

## Summary

**What's Tracked:**
- 50+ routes with page view tracking
- 11 collection pages with item list tracking
- Product detail pages with view_item
- Add to cart events
- Search queries
- Homepage featured products

**What's Not Tracked (Without Consent):**
- Nothing fires until user accepts cookies
- IP addresses are anonymized
- No cross-site tracking

**Next Steps:**
1. Set GA4_MEASUREMENT_ID environment variable
2. Deploy to production
3. Test in GA4 Real-time view
4. Set up conversion goals in GA4
5. Monitor data quality weekly

---

**Status**: ✅ Production Ready  
**Last Updated**: December 15, 2024  
**Maintainer**: Development Team
