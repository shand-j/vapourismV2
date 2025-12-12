/**
 * Analytics Utility Library for Vapourism V2
 * 
 * Provides GA4 ecommerce tracking events and consent management.
 * All tracking respects user cookie consent preferences.
 */

// Types for GA4 events
export interface GA4Product {
  item_id: string;
  item_name: string;
  item_brand?: string;
  item_category?: string;
  price?: number;
  quantity?: number;
  item_variant?: string;
  currency?: string;
  [key: string]: string | number | undefined;
}

export interface GA4ViewItemParams {
  currency: string;
  value: number;
  items: GA4Product[];
  [key: string]: unknown;
}

export interface GA4AddToCartParams {
  currency: string;
  value: number;
  items: GA4Product[];
  [key: string]: unknown;
}

export interface GA4ViewCartParams {
  currency: string;
  value: number;
  items: GA4Product[];
  [key: string]: unknown;
}

export interface GA4BeginCheckoutParams {
  currency: string;
  value: number;
  items: GA4Product[];
  coupon?: string;
  [key: string]: unknown;
}

export interface GA4PurchaseParams {
  transaction_id: string;
  currency: string;
  value: number;
  tax?: number;
  shipping?: number;
  items: GA4Product[];
  coupon?: string;
  [key: string]: unknown;
}

interface ConsentData {
  analytics?: boolean;
  marketing?: boolean;
  timestamp?: string;
}

// Check if analytics consent has been granted
export function hasAnalyticsConsent(): boolean {
  if (globalThis.window === undefined) return false;
  
  try {
    const consent = globalThis.localStorage.getItem('vapourism_cookie_consent');
    if (!consent) return false;
    
    const parsed = JSON.parse(consent) as ConsentData;
    return parsed.analytics === true;
  } catch {
    return false;
  }
}

// Check if gtag is available
function isGtagAvailable(): boolean {
  return globalThis.window !== undefined && typeof globalThis.window.gtag === 'function';
}

// Safe gtag wrapper that respects consent
function safeGtag(...args: Parameters<typeof globalThis.window.gtag>): void {
  if (!isGtagAvailable()) return;
  if (!hasAnalyticsConsent()) return;
  
  globalThis.window.gtag(...args);
}

/**
 * Track page view
 */
export function trackPageView(pagePath: string, pageTitle?: string): void {
  safeGtag('event', 'page_view', {
    page_path: pagePath,
    page_title: pageTitle,
  });
}

/**
 * Track product view (view_item event)
 */
export function trackViewItem(params: GA4ViewItemParams): void {
  safeGtag('event', 'view_item', params);
}

/**
 * Track add to cart (add_to_cart event)
 */
export function trackAddToCart(params: GA4AddToCartParams): void {
  safeGtag('event', 'add_to_cart', params);
}

/**
 * Track remove from cart (remove_from_cart event)
 */
export function trackRemoveFromCart(params: GA4AddToCartParams): void {
  safeGtag('event', 'remove_from_cart', params);
}

/**
 * Track view cart (view_cart event)
 */
export function trackViewCart(params: GA4ViewCartParams): void {
  safeGtag('event', 'view_cart', params);
}

/**
 * Track begin checkout (begin_checkout event)
 */
export function trackBeginCheckout(params: GA4BeginCheckoutParams): void {
  safeGtag('event', 'begin_checkout', params);
}

/**
 * Track purchase (purchase event)
 */
export function trackPurchase(params: GA4PurchaseParams): void {
  safeGtag('event', 'purchase', params);
}

/**
 * Track search (search event)
 */
export function trackSearch(searchTerm: string): void {
  safeGtag('event', 'search', {
    search_term: searchTerm,
  });
}

/**
 * Track select item from list (select_item event)
 */
export function trackSelectItem(item: GA4Product, listId?: string, listName?: string): void {
  safeGtag('event', 'select_item', {
    item_list_id: listId,
    item_list_name: listName,
    items: [item],
  });
}

/**
 * Track view item list (view_item_list event)
 */
export function trackViewItemList(items: GA4Product[], listId?: string, listName?: string): void {
  safeGtag('event', 'view_item_list', {
    item_list_id: listId,
    item_list_name: listName,
    items,
  });
}

/**
 * Update consent state after user accepts/declines
 */
export function updateGtagConsent(analyticsConsent: boolean, marketingConsent: boolean): void {
  if (!isGtagAvailable()) return;
  
  globalThis.window.gtag('consent', 'update', {
    analytics_storage: analyticsConsent ? 'granted' : 'denied',
    ad_storage: marketingConsent ? 'granted' : 'denied',
    ad_user_data: marketingConsent ? 'granted' : 'denied',
    ad_personalization: marketingConsent ? 'granted' : 'denied',
  });
}

/**
 * Helper to convert Shopify product to GA4 item format
 */
export function shopifyProductToGA4Item(product: {
  id: string;
  title: string;
  vendor?: string;
  productType?: string;
  price?: { amount: string; currencyCode: string };
  variantTitle?: string;
  quantity?: number;
}): GA4Product {
  return {
    item_id: product.id.replace('gid://shopify/Product/', '').replace('gid://shopify/ProductVariant/', ''),
    item_name: product.title,
    item_brand: product.vendor,
    item_category: product.productType,
    price: product.price ? Number.parseFloat(product.price.amount) : undefined,
    item_variant: product.variantTitle,
    quantity: product.quantity ?? 1,
    currency: product.price?.currencyCode ?? 'GBP',
  };
}

// Extend window interface for TypeScript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'consent' | 'js' | 'set',
      targetOrAction: string | Date,
      params?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}
