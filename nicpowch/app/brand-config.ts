/**
 * NicPowch Brand Configuration
 *
 * Central configuration for the NicPowch nicotine pouch specialist storefront.
 * This variant filters products by nicotine_pouches/snus tags and uses
 * a teal/green brand identity.
 */

export const BRAND_CONFIG = {
  /** Brand name displayed throughout the site */
  name: 'NicPowch',

  /** Tagline for hero sections and meta */
  tagline: 'Premium Nicotine Pouches UK',

  /** Short description for meta tags */
  description:
    'UK\'s specialist nicotine pouch retailer. Shop Velo, Zyn, Nordic Spirit and more with fast delivery. Tobacco-free nicotine pouches for a smoke-free lifestyle.',

  /** Production domain (placeholder) */
  domain: 'https://www.nicpowch.co.uk',

  /** Contact email */
  email: 'hello@nicpowch.co.uk',

  /** Twitter handle */
  twitter: '@nicpowchuk',

  /** Product filter tags - only show products with these tags */
  productFilterTags: ['nicotine_pouches', 'snus'] as const,

  /** Brand colors - teal/green theme */
  colors: {
    /** Primary gradient start (teal) */
    gradientStart: '#0d9488',
    /** Primary gradient end (emerald) */
    gradientEnd: '#10b981',
    /** Accent color for CTAs */
    accent: '#14b8a6',
    /** Dark accent for hover states */
    accentDark: '#0f766e',
    /** Theme color for browser chrome */
    themeColor: '#0d9488',
  },

  /** SEO keywords */
  keywords: [
    'nicotine pouches',
    'nicotine pouches UK',
    'nic pouches',
    'tobacco free nicotine',
    'snus UK',
    'velo pouches',
    'zyn pouches',
    'nordic spirit',
    'on! pouches',
    'nicotine pouch delivery',
    'smoke free nicotine',
  ],

  /** Featured brands for the store */
  featuredBrands: [
    {name: 'Velo', slug: 'velo'},
    {name: 'Zyn', slug: 'zyn'},
    {name: 'Nordic Spirit', slug: 'nordic-spirit'},
    {name: 'On!', slug: 'on'},
    {name: 'Killa', slug: 'killa'},
    {name: 'Pablo', slug: 'pablo'},
  ],

  /** Free shipping threshold in GBP */
  freeShippingThreshold: 30,

  /** Same-day dispatch cutoff */
  dispatchCutoff: '1pm',
} as const;

export type BrandConfig = typeof BRAND_CONFIG;

/**
 * Build a product filter for Shopify search queries
 * Returns filters to only show nicotine pouch products
 */
export function getProductFilters() {
  return BRAND_CONFIG.productFilterTags.map((tag) => ({tag}));
}

/**
 * Check if a product belongs to the NicPowch catalogue
 */
export function isNicPowchProduct(tags: string[]): boolean {
  return tags.some((tag) =>
    BRAND_CONFIG.productFilterTags.includes(
      tag.toLowerCase() as (typeof BRAND_CONFIG.productFilterTags)[number],
    ),
  );
}

/**
 * Get the search query filter string for Shopify search
 */
export function getSearchTagFilter(): string {
  return BRAND_CONFIG.productFilterTags.map((tag) => `tag:${tag}`).join(' OR ');
}
