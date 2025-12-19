/**
 * SEO Automation Service for Vapourism
 * Provides automated SEO optimization for products and content
 * Note: Collections are not used in this store - all navigation is tag-based
 * 
 * Enhanced with Dynamic Keyword Service for intelligent keyword optimization
 */

import { KeywordOptimizer, generateKeywordVariations } from '~/lib/keyword-optimizer';
import { 
  DynamicKeywordService,
  getProductKeywords,
  getCategoryKeywords,
  getBrandKeywords,
  getSearchKeywords,
  getContentKeywords,
  getIntentKeywords,
  getRelatedKeywords,
  generateKeywordSnippet,
  type PageContext,
  type DynamicKeywordResult,
  type PageType,
  type SearchIntent,
  INTENT_KEYWORD_CLUSTERS,
  LSI_KEYWORD_CLUSTERS,
  SEASONAL_KEYWORDS,
} from '~/lib/dynamic-keywords';

// Re-export dynamic keyword types and utilities for easy access
export type { PageContext, DynamicKeywordResult, PageType, SearchIntent };
export {
  DynamicKeywordService,
  getProductKeywords,
  getCategoryKeywords,
  getBrandKeywords,
  getSearchKeywords,
  getContentKeywords,
  getIntentKeywords,
  getRelatedKeywords,
  generateKeywordSnippet,
  INTENT_KEYWORD_CLUSTERS,
  LSI_KEYWORD_CLUSTERS,
  SEASONAL_KEYWORDS,
};

export interface ProductSEOData {
  title: string;
  vendor: string;
  productType: string;
  description: string;
  tags: string[];
  price?: {
    amount: string;
    currencyCode: string;
  };
  handle: string;
  availableForSale?: boolean;
  image?: string;
  url?: string;
  sku?: string;
}

/**
 * Custom SEO title overrides for specific products
 * Maps product handle to optimized meta title
 */
const PRODUCT_TITLE_OVERRIDES: Record<string, string> = {
  'realest-cbd-4000mg-cbg-isolate-buy-1-get-1-free': 'Realest CBD 4000mg CBG Isolate: BOGO at Vapourism',
  'celtic-wind-crops-500mg-cbd-multi-complex-hemp-oil-10ml': 'Celtic Wind Crops 500mg CBD Oil 10ml: Buy Now | Vapourism',
  'joule-150mg-cbd-herbal-anti-oxi-conditioner-250ml': 'Joul\'e CBD Conditioner: Restore & Revive Hair | Vapourism',
  'realest-cbd-6000mg-cbd-10ml-raw-paste-buy-1-get-1-free': 'Realest CBD 6000mg Raw Paste (Buy 1 Get 1 Free) | Vapourism',
  'realest-cbd-1000mg-80-broad-spectrum-cbd-crumble-buy-1-get-1-free': 'Realest CBD Crumble: Buy 1 Get 1 Free – Vapourism 2025',
  '20mg-just-nic-it-nic-salt-10ml-50vg-50pg': '20mg Just Nic It Nic Salt 10ml: Fast Delivery at Vapourism',
  '12mg-ohm-boy-longfill-booster-kit-freebase-50vg-50pg': '12mg Ohm Boy Longfill Booster Kit (50VG/50PG) | Vapourism UK',
  'cbd-by-british-cannabis-1000mg-cbd-raw-cannabis-oil-drops-10ml': 'Buy British Cannabis CBD Oil Drops 1000mg | 2025',
  'realest-cbd-5000mg-80-broad-spectrum-cbd-crumble-buy-1-get-1-free': 'Realest CBD Crumble: Buy 1 Get 1 Free at Vapourism',
  'cbd-asylum-infuse-10000mg-cbd-cola-oil-30ml-buy-1-get-2-free': 'CBD Asylum Cola Oil 10000mg: Buy 1 Get 2 Free at Vapourism',
};

export class SEOAutomationService {
  
  /**
   * Product type keywords for title optimization
   * Order matters - more specific types should come first
   */
  private static readonly PRODUCT_TYPE_KEYWORDS = [
    'Drops',      // More specific than "Oil"
    'Crumble',
    'Oil',
    'Tea',
    'Gummies',
    'Capsules',
    'Vape',
    'E-Liquid'
  ];
  
  /**
   * Product category mappings for og:title generation
   * Maps product types to their display names
   */
  private static readonly PRODUCT_CATEGORIES: Record<string, string> = {
    'Drops': 'CBD Oil Drops',
    'Oil': 'CBD Oil',
    'Crumble': 'CBD Crumble',
    'Tea': 'CBD Tea',
    'E-Liquid': 'E-Liquid',
    'Vape': 'Vape',
    'Gummies': 'CBD Gummies',
    'Capsules': 'CBD Capsules',
  };
  
  /**
   * Generate comprehensive keywords for products
   * Enhanced with competitor keyword analysis
   */
  static generateProductKeywords(product: ProductSEOData): string[] {
    const baseKeywords = [
      product.title.toLowerCase(),
      product.vendor.toLowerCase(),
      product.productType.toLowerCase(),
      'uk vaping',
      'vape shop uk',
      'premium vaping products'
    ];
    
    // Extract feature keywords from description and tags
    const featureKeywords = this.extractFeatures(product.description, product.tags);
    
    // Add price-based keywords
    const priceKeywords = product.price ? this.generatePriceKeywords(product.price) : [];
    
    // Add category-specific keywords
    const categoryKeywords = this.getCategoryKeywords(product.productType);
    
    // Extract optimized keywords using KeywordOptimizer
    const optimizedKeywords = KeywordOptimizer.extractKeywordsFromContent(
      product.description,
      product.tags,
      product.productType
    );
    
    // Generate keyword variations for better coverage
    const keywordVariations: string[] = [];
    [...baseKeywords, ...categoryKeywords].forEach(keyword => {
      if (keyword.length > 3) {
        const variations = generateKeywordVariations(keyword);
        keywordVariations.push(...variations.slice(0, 3)); // Limit variations per keyword
      }
    });
    
    return [...new Set([
      ...baseKeywords, 
      ...featureKeywords, 
      ...priceKeywords, 
      ...categoryKeywords,
      ...optimizedKeywords,
      ...keywordVariations
    ])];
  }

  /**
   * Generate SEO-optimized meta description for products
   * Enhanced with keyword optimization
   */
  static generateProductMetaDescription(product: ProductSEOData): string {
    // Use KeywordOptimizer for better keyword-rich descriptions
    return KeywordOptimizer.optimizeMetaDescription({
      title: product.title,
      vendor: product.vendor,
      productType: product.productType,
      price: product.price,
      tags: product.tags
    });
  }

  /**
   * Generate category meta description (for tag-based search pages)
   * Enhanced with keyword mapping
   */
  static generateCategoryMetaDescription(categoryTitle: string, productCount?: number, topBrands?: string[]): string {
    const productText = productCount ? `${productCount} products` : 'our range';
    const brandsText = topBrands?.slice(0, 3).join(', ') || 'top brands';
    
    // Generate category-specific keywords
    const categoryTag = categoryTitle.toLowerCase().replace(/\s+/g, '_');
    const keywordMapping = KeywordOptimizer.generateCategoryKeywords(
      categoryTag,
      productCount,
      topBrands
    );
    
    // Use primary keywords in description
    const primaryKeyword = keywordMapping.primary[0] || categoryTitle;
    
    return `Shop ${primaryKeyword} at Vapourism. ${productText} from ${brandsText}. ✓ Premium quality ✓ Fast UK delivery ✓ Competitive prices ✓ Expert support. Browse the best ${categoryTitle} ${new Date().getFullYear()}.`;
  }

  /**
   * Generate optimized page title for category pages
   */
  static generateCategoryTitle(categoryTitle: string, productCount?: number): string {
    const currentYear = new Date().getFullYear();
    const countText = productCount ? ` (${productCount}+ Products)` : '';
    return `${categoryTitle}${countText} | UK Vape Shop | Vapourism ${currentYear}`;
  }

  /**
   * Extract features from product description and tags
   */
  private static extractFeatures(description: string, tags: string[]): string[] {
    const features: string[] = [];
    
    // Common vaping features to look for
    const featurePatterns = {
      nicotine: /(\d+)mg|nicotine|nic salt/gi,
      volume: /(\d+)ml|(\d+) ?ml/gi,
      vgpg: /(\d+)\/(\d+)|(\d+) ?vg|(\d+) ?pg/gi,
      flavour: /strawberry|vanilla|mint|menthol|tobacco|fruit|dessert|drink|beverage/gi,
      device: /pod|mod|tank|coil|battery|disposable|refillable/gi,
      brand: /smok|voopoo|aspire|innokin|vaporesso|eleaf|lost mary|elf bar/gi
    };

    // Extract from description
    Object.entries(featurePatterns).forEach(([category, pattern]) => {
      const matches = description.match(pattern);
      if (matches) {
        features.push(...matches.map(m => m.toLowerCase()));
      }
    });

    // Add relevant tags
    const relevantTags = tags.filter(tag => 
      tag.length > 2 && 
      !tag.includes('shopify') && 
      !tag.includes('gid:')
    );
    
    features.push(...relevantTags.map(tag => tag.toLowerCase()));
    
    return [...new Set(features)];
  }

  /**
   * Generate price-based keywords
   */
  private static generatePriceKeywords(price: {amount: string; currencyCode: string}): string[] {
    const amount = parseFloat(price.amount);
    const keywords: string[] = [];
    
    // Price range keywords
    if (amount < 10) keywords.push('cheap vape', 'budget vaping');
    else if (amount < 25) keywords.push('affordable vape', 'mid-range vaping');
    else if (amount < 50) keywords.push('premium vape', 'quality vaping');
    else keywords.push('luxury vape', 'high-end vaping');
    
    // Price point keywords
    const roundedPrice = Math.ceil(amount / 5) * 5;
    keywords.push(`vape under £${roundedPrice}`);
    
    return keywords;
  }

  /**
   * Get category-specific keywords
   */
  private static getCategoryKeywords(productType: string): string[] {
    const categoryMap: Record<string, string[]> = {
      'E-Liquid': ['e-liquid', 'vape juice', 'eliquid', 'shortfill', 'nic shot'],
      'Pod System': ['pod system', 'pod kit', 'pod vape', 'portable vape'],
      'Mod': ['vape mod', 'box mod', 'mechanical mod', 'regulated mod'],
      'Tank': ['vape tank', 'sub ohm tank', 'clearomizer', 'atomizer'],
      'Coils': ['vape coils', 'replacement coils', 'coil heads', 'atomizer coils'],
      'Disposable': ['disposable vape', 'disposable e-cig', 'single use vape'],
      'Accessories': ['vape accessories', 'vaping supplies', 'vape parts']
    };

    return categoryMap[productType] || [productType.toLowerCase()];
  }

  /**
   * Generate internal link suggestions
   */
  static generateInternalLinks(product: ProductSEOData): Array<{url: string; anchor: string; title: string}> {
    return [
      {
        url: `/products?vendor=${encodeURIComponent(product.vendor)}`,
        anchor: `More ${product.vendor} Products`,
        title: `Browse all ${product.vendor} vaping products`
      },
      {
        url: `/search?tag=${encodeURIComponent(product.productType.toLowerCase().replace(/\s+/g, '_'))}`,
        anchor: `Shop All ${product.productType}s`,
        title: `Explore our ${product.productType} range`
      },
      {
        url: '/guides/complete-beginners-guide-to-vaping',
        anchor: 'Beginner Vaping Guide',
        title: 'Learn how to start vaping safely'
      },
      {
        url: '/guides/how-to-choose-your-first-vape-device',
        anchor: 'Device Selection Guide',
        title: 'How to choose the right vape device'
      }
    ];
  }

  /**
   * Generate breadcrumb schema
   */
  static generateBreadcrumbSchema(breadcrumbs: Array<{name: string; url: string}>) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": `https://www.vapourism.co.uk${crumb.url}`
      }))
    };
  }

  /**
   * Generate FAQ schema for product pages
   */
  static generateProductFAQSchema(product: ProductSEOData) {
    const faqs = [
      {
        question: `Is the ${product.title} authentic?`,
        answer: `Yes, all our ${product.vendor} products including the ${product.title} are 100% authentic and sourced directly from authorized distributors.`
      },
      {
        question: `How quickly will my ${product.title} be delivered?`,
        answer: `We offer fast UK delivery with most orders arriving within 1-3 business days. Free delivery on orders over £20.`
      },
      {
        question: `What's included with the ${product.title}?`,
        answer: `The ${product.title} comes with all manufacturer-included accessories and a full warranty. Check the product description for complete contents.`
      }
    ];

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }

  /**
   * Generate enhanced Product schema with keywords
   */
  static generateProductSchema(product: ProductSEOData) {
    if (!product.price || !product.url) {
      return null;
    }

    return KeywordOptimizer.generateProductSchema({
      title: product.title,
      vendor: product.vendor,
      productType: product.productType,
      description: product.description,
      price: product.price,
      image: product.image,
      url: product.url,
      sku: product.sku,
      availability: product.availableForSale ?? true
    });
  }

  /**
   * Generate optimized alt text for images
   * @param product - Product SEO data
   * @param context - Image context: 'main' for primary image, 'thumbnail' for gallery thumbnails, 'gallery' for gallery images
   * @param imageIndex - Optional index for gallery images (1-based) to create unique, deterministic alt text
   */
  static generateImageAltText(product: ProductSEOData, context: 'main' | 'thumbnail' | 'gallery' = 'main', imageIndex?: number): string {
    // Build gallery alt text based on whether index is provided
    const galleryAlt = imageIndex 
      ? `${product.title} product image ${imageIndex}` 
      : `${product.title} by ${product.vendor} - product gallery`;
    
    const contextMap = {
      main: `${product.title} by ${product.vendor} | Premium ${product.productType} | Vapourism UK`,
      thumbnail: `${product.title} - ${product.vendor} thumbnail`,
      gallery: galleryAlt,
    };

    return contextMap[context];
  }

  /**
   * Generate social media sharing text
   */
  static generateSocialShareText(product: ProductSEOData): {
    twitter: string;
    facebook: string;
    whatsapp: string;
  } {
    const price = product.price ? ` - £${product.price.amount}` : '';
    
    return {
      twitter: `Just discovered the ${product.title} by ${product.vendor}${price}! Check it out at @vapourism 🔥 #vaping #${product.vendor.replace(/\s+/g, '')}`,
      facebook: `Check out this amazing ${product.productType}: ${product.title} by ${product.vendor}. Available now at Vapourism with fast UK delivery!`,
      whatsapp: `Found this great ${product.productType} - ${product.title} by ${product.vendor}${price}. Thought you might be interested! Available at vapourism.co.uk`
    };
  }

  /**
   * Truncate page title to 70 characters or less for SEO compliance
   * Most search engines truncate titles over 70 characters
   * @param title The full title string
   * @param maxLength Maximum length (default 70)
   * @returns Truncated title with ellipsis if needed
   */
  static truncateTitle(title: string, maxLength: number = 70): string {
    if (title.length <= maxLength) {
      return title;
    }

    // Reserve 1 character for the ellipsis
    const maxContentLength = maxLength - 1;
    const truncated = title.substring(0, maxContentLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    // If we can break at a word boundary within the last 10 characters, do so
    if (lastSpace > maxContentLength - 10) {
      return truncated.substring(0, lastSpace) + '…';
    }
    
    return truncated + '…';
  }

  /**
   * H1 heading length constraints for SEO
   * Google typically displays 50-60 characters in search results
   */
  private static readonly H1_MIN_LENGTH = 20;
  private static readonly H1_MAX_LENGTH = 60;

  /**
   * Format product title for H1 tag to be more SEO-friendly
   * Removes redundant vendor names and cleans up promotional text
   * Ensures heading length is within SEO-recommended range (20-60 chars)
   * @param title The raw product title
   * @param vendor The vendor/brand name
   * @returns SEO-optimized H1 heading string
   */
  static formatProductH1(title: string, vendor: string): string {
    let formatted = title;
    
    // Remove "by [vendor]" pattern (case insensitive)
    const escapedVendor = vendor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const byVendorPattern = new RegExp(`\\s+by\\s+${escapedVendor}`, 'gi');
    formatted = formatted.replace(byVendorPattern, '');
    
    // Clean up promotional text: (BUY 1 GET 1 FREE) -> Buy 1 Get 1 Free
    formatted = formatted.replace(/\(BUY\s+(\d+)\s+GET\s+(\d+)\s+FREE\)/gi, '– Buy $1 Get $2 Free');
    
    // Only remove hyphens that are surrounded by spaces (not part of compound words like "E-liquid")
    formatted = formatted.replace(/\s+-\s+/g, ' ');
    
    // Clean up multiple spaces
    formatted = formatted.replace(/\s+/g, ' ').trim();
    
    // Handle heading length for SEO compliance
    if (formatted.length > this.H1_MAX_LENGTH) {
      // Truncate at word boundary, append ellipsis
      const truncated = formatted.substring(0, this.H1_MAX_LENGTH - 1);
      const lastSpace = truncated.lastIndexOf(' ');
      if (lastSpace > this.H1_MAX_LENGTH - 15) {
        formatted = truncated.substring(0, lastSpace) + '…';
      } else {
        formatted = truncated + '…';
      }
    } else if (formatted.length < this.H1_MIN_LENGTH && vendor) {
      // If too short, add vendor name for context
      const withVendor = `${formatted} by ${vendor}`;
      if (withVendor.length <= this.H1_MAX_LENGTH) {
        formatted = withVendor;
      }
    }
    
    return formatted;
  }

  /**
   * Extract unique identifying specs from product title (strength, volume, etc.)
   * These specs help differentiate similar products and should be preserved in titles
   * @param title The product title to extract specs from
   * @returns Array of unique spec strings found in the title
   */
  private static extractProductSpecs(title: string): string[] {
    const specs: string[] = [];
    
    // Extract nicotine strength (e.g., "20mg", "12mg")
    const strengthMatch = title.match(/\b(\d+)\s*mg\b/i);
    if (strengthMatch) specs.push(strengthMatch[1] + 'mg');
    
    // Extract volume (e.g., "10ml", "30ml", "100ml")
    const volumeMatch = title.match(/\b(\d+)\s*ml\b/i);
    if (volumeMatch) specs.push(volumeMatch[1] + 'ml');
    
    // Extract weight (e.g., "1g", "5g")
    const weightMatch = title.match(/\b(\d+)\s*g\b/i);
    if (weightMatch) specs.push(weightMatch[1] + 'g');
    
    // Extract VG/PG ratio (e.g., "50/50", "70/30")
    const vgpgMatch = title.match(/\b(\d+)\s*\/\s*(\d+)\b/);
    if (vgpgMatch) specs.push(`${vgpgMatch[1]}/${vgpgMatch[2]}`);
    
    // Extract puff count for disposables (e.g., "600 puffs", "4000 puffs")
    const puffMatch = title.match(/\b(\d+)\s*(?:puff|puffs)\b/i);
    if (puffMatch) specs.push(`${puffMatch[1]} puffs`);
    
    // Extract percentage values (e.g., "80%", "100%")
    const percentMatch = title.match(/\b(\d+)\s*%/);
    if (percentMatch) specs.push(`${percentMatch[1]}%`);
    
    return specs;
  }

  /**
   * Build smart truncated title that preserves unique identifying information
   * @param productTitle The full product title
   * @param maxLength Maximum length for the truncated portion
   * @param specs Unique product specs to preserve
   * @returns Smartly truncated title string
   */
  private static smartTruncate(productTitle: string, maxLength: number, specs: string[]): string {
    // If it fits, return as-is
    if (productTitle.length <= maxLength) {
      return productTitle;
    }
    
    // If we have unique specs, try to preserve them at the end
    if (specs.length > 0) {
      // Reserve space for specs (e.g., " 20mg 10ml")
      const specsText = ' ' + specs.join(' ');
      const specsLength = specsText.length;
      
      // Check if the full title ends with these specs already
      const endsWithSpecs = specs.some(spec => 
        productTitle.toLowerCase().trim().endsWith(spec.toLowerCase())
      );
      
      if (endsWithSpecs) {
        // Specs are at the end, truncate from the beginning/middle
        const availableLength = maxLength - 1; // Reserve 1 for ellipsis
        const truncated = productTitle.substring(0, availableLength);
        const lastSpace = truncated.lastIndexOf(' ');
        
        if (lastSpace > availableLength - 15) {
          return truncated.substring(0, lastSpace) + '…';
        }
        return truncated + '…';
      } else if (specsLength < maxLength - 10) {
        // Specs exist but not at end, extract and append them
        // Remove specs from title and truncate the remainder
        let baseTitle = productTitle;
        specs.forEach(spec => {
          baseTitle = baseTitle.replace(new RegExp('\\s*' + spec.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*', 'gi'), ' ');
        });
        baseTitle = baseTitle.replace(/\s+/g, ' ').trim();
        
        const availableForBase = maxLength - specsLength - 1; // Reserve 1 for ellipsis
        if (baseTitle.length > availableForBase) {
          const truncated = baseTitle.substring(0, availableForBase);
          const lastSpace = truncated.lastIndexOf(' ');
          if (lastSpace > availableForBase - 15) {
            return truncated.substring(0, lastSpace) + '…' + specsText;
          }
          return truncated + '…' + specsText;
        }
        return baseTitle + specsText;
      }
    }
    
    // Standard truncation at word boundary
    const maxContentLength = maxLength - 1;
    const truncated = productTitle.substring(0, maxContentLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > maxContentLength - 15) {
      return truncated.substring(0, lastSpace) + '…';
    }
    
    return truncated + '…';
  }

  /**
   * Generate optimized product title for meta tags
   * Ensures title fits within 70 character SEO limit and preserves unique identifying information
   * Priority: Custom override > Shopify SEO title > Product title > Vendor > "Vapourism"
   * @param productTitle The product title
   * @param vendor The vendor/brand name
   * @param seoTitle Optional SEO title override from Shopify
   * @param handle Optional product handle for custom title overrides
   * @returns Optimized title string ≤70 characters, guaranteed unique per product
   */
  static generateProductTitle(productTitle: string, vendor: string, seoTitle?: string | null, handle?: string | null): string {
    // Check for custom title override by product handle
    if (handle && PRODUCT_TITLE_OVERRIDES[handle]) {
      return this.truncateTitle(PRODUCT_TITLE_OVERRIDES[handle]);
    }

    // Use SEO title from Shopify if available
    if (seoTitle) {
      return this.truncateTitle(seoTitle);
    }

    const suffix = ' | Vapourism';
    const maxProductLength = 70 - suffix.length;
    
    // Extract unique product specs that should be preserved
    const specs = this.extractProductSpecs(productTitle);

    // Try full title with vendor
    const fullTitle = `${productTitle} | ${vendor}${suffix}`;
    if (fullTitle.length <= 70) {
      return fullTitle;
    }

    // Try product title only with suffix
    const titleOnly = `${productTitle}${suffix}`;
    if (titleOnly.length <= 70) {
      return titleOnly;
    }

    // Smart truncation that preserves unique specs
    const truncatedProduct = this.smartTruncate(productTitle, maxProductLength, specs);
    return truncatedProduct + suffix;
  }

  /**
   * Generate marketing-friendly Open Graph title for products
   * Creates engaging, concise titles optimized for social sharing
   * Handles promotional text (BUY 1 GET 1 FREE, etc.) by reordering for impact
   * @param productTitle The raw product title from Shopify
   * @param vendor The vendor/brand name
   * @returns Marketing-optimized og:title (no suffix, ready for social sharing)
   */
  static generateOGTitle(productTitle: string, vendor: string): string {
    // Extract all parenthesized content and find promotional text
    const allParentheses = productTitle.match(/\([^)]+\)/g) || [];
    const promoText = allParentheses.find(p => /buy\s+\d+\s+get\s+\d+\s+free/i.test(p))?.replace(/[()]/g, '') || null;
    
    // Clean title by removing parentheses content and extra whitespace
    let cleanTitle = productTitle.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
    
    // Handle "BUY X GET Y FREE" promotions - move to front with colon
    if (promoText && /buy\s+\d+\s+get\s+\d+\s+free/i.test(promoText)) {
      const match = promoText.match(/buy\s+(\d+)\s+get\s+(\d+)\s+free/i);
      if (match) {
        const [, buy, get] = match;
        const buyNum = parseInt(buy);
        const getNum = parseInt(get);
        
        // Extract key product info (strength, size, type)
        const strengthMatch = cleanTitle.match(/(\d+mg)/i);
        const strength = strengthMatch ? strengthMatch[1] : '';
        
        // Get product type using class constant with word boundary matching
        const words = cleanTitle.split(/\s+/);
        const productType = words.find(w => 
          this.PRODUCT_TYPE_KEYWORDS.some(t => w.toLowerCase() === t.toLowerCase())
        ) || '';
        
        // Format promotional title based on offer type
        const promoPrefix = `Buy ${buy} Get ${get} Free`;
        const suffix = (buyNum === 1 && getNum === 1) ? ' Deal' : '';
        return `${promoPrefix}: ${vendor} ${strength} ${productType}${suffix}`.replace(/\s+/g, ' ').trim();
      }
    }
    
    // For standard products, create format: "Strength/Key Feature + Product Type + by Vendor + Unique Selling Point"
    
    // Extract numeric strength (mg, ml, g)
    const strengthMatch = cleanTitle.match(/(\d+(?:mg|ml|g))/i);
    const strength = strengthMatch ? strengthMatch[1] : '';
    
    // Identify product category using class constant
    // Categories are checked in order of specificity (Drops before Oil)
    const isCBDProduct = /\bcbd\b/i.test(cleanTitle);
    let productCategory = '';
    for (const [key, value] of Object.entries(this.PRODUCT_CATEGORIES)) {
      // Use case-insensitive matching to catch all variations
      if (cleanTitle.toLowerCase().includes(key.toLowerCase())) {
        // Only add CBD prefix for CBD products; use base type for others
        productCategory = isCBDProduct ? value : key;
        break;
      }
    }
    
    // Extract key descriptors (Broad Spectrum, Full Spectrum, Raw, Cold Pressed, etc.)
    const descriptors: string[] = [];
    if (/broad\s+spectrum/i.test(cleanTitle)) descriptors.push('Broad Spectrum');
    if (/full\s+spectrum/i.test(cleanTitle)) descriptors.push('Full Spectrum');
    if (/raw/i.test(cleanTitle)) descriptors.push('Raw Extract');
    if (/cold\s+pressed/i.test(cleanTitle)) descriptors.push('Cold Pressed');
    
    // Build optimized title based on available components
    if (strength && productCategory && vendor) {
      if (descriptors.length > 0) {
        return `${strength} ${productCategory} by ${vendor} - ${descriptors[0]}`;
      }
      return `${strength} ${productCategory} by ${vendor}`;
    }
    
    // If we have product category without strength, still try to build a good title
    if (productCategory && vendor) {
      if (descriptors.length > 0) {
        return `${productCategory} by ${vendor} - ${descriptors[0]}`;
      }
      return `${productCategory} by ${vendor}`;
    }
    
    // Fallback: try to create a concise version
    // Remove redundant "CBD" repetitions
    let optimized = cleanTitle.replace(/\bCBD\s+by\s+(\w+)\s+(\w+)\s+CBD\b/gi, 'CBD by $1 $2');
    
    // If title is too long, extract key parts
    if (optimized.length > 60) {
      const parts = [];
      if (strength) parts.push(strength);
      if (productCategory) parts.push(productCategory);
      if (vendor && !optimized.toLowerCase().includes('by')) parts.push(`by ${vendor}`);
      if (descriptors.length > 0) parts.push(`- ${descriptors[0]}`);
      
      if (parts.length > 0) {
        return parts.join(' ');
      }
    }
    
    // Final fallback: use cleaned title, truncated if needed
    if (optimized.length > 60) {
      return optimized.substring(0, 57) + '...';
    }
    
    return optimized;
  }

  // ============================================================================
  // Dynamic Keyword Integration - The SEO Cheatcode
  // ============================================================================

  /**
   * Generate complete dynamic SEO data for a product page
   * This is the "cheatcode" - provides all keywords, titles, and meta automatically
   */
  static getDynamicProductSEO(product: ProductSEOData): DynamicKeywordResult {
    return getProductKeywords(
      product.title,
      product.vendor,
      product.productType,
      product.tags,
      product.price
    );
  }

  /**
   * Generate complete dynamic SEO data for a category page
   */
  static getDynamicCategorySEO(
    categoryName: string,
    productCount?: number,
    topBrands?: string[]
  ): DynamicKeywordResult {
    return getCategoryKeywords(categoryName, productCount, topBrands);
  }

  /**
   * Generate complete dynamic SEO data for a brand page
   */
  static getDynamicBrandSEO(
    brandName: string,
    productCount?: number,
    productTypes?: string[]
  ): DynamicKeywordResult {
    return getBrandKeywords(brandName, productCount, productTypes);
  }

  /**
   * Generate complete dynamic SEO data for a search results page
   */
  static getDynamicSearchSEO(
    query: string,
    resultCount?: number
  ): DynamicKeywordResult {
    return getSearchKeywords(query, resultCount);
  }

  /**
   * Generate complete dynamic SEO data for blog/guide content
   */
  static getDynamicContentSEO(
    title: string,
    pageType: 'blog' | 'guide' = 'blog',
    tags?: string[]
  ): DynamicKeywordResult {
    return getContentKeywords(title, pageType, tags);
  }

  /**
   * Get intent-based keywords for any page
   */
  static getIntentBasedKeywords(intent: SearchIntent): string[] {
    return getIntentKeywords(intent);
  }

  /**
   * Get LSI (related) keywords for better context
   */
  static getRelatedKeywordsFor(topic: string): string[] {
    return getRelatedKeywords(topic);
  }

  /**
   * Generate a keyword-rich snippet for any content
   */
  static generateKeywordRichSnippet(
    topic: string,
    intent: SearchIntent = 'commercial',
    maxLength: number = 160
  ): string {
    return generateKeywordSnippet(topic, intent, maxLength);
  }

  /**
   * Get the full Dynamic Keyword Service for advanced usage
   */
  static getDynamicKeywordService(): typeof DynamicKeywordService {
    return DynamicKeywordService;
  }

  /**
   * Get keyword clusters by intent for content planning
   */
  static getIntentKeywordClusters() {
    return INTENT_KEYWORD_CLUSTERS;
  }

  /**
   * Get LSI keyword clusters for semantic optimization
   */
  static getLSIKeywordClusters() {
    return LSI_KEYWORD_CLUSTERS;
  }

  /**
   * Get seasonal keywords for time-sensitive content
   */
  static getSeasonalKeywords() {
    return SEASONAL_KEYWORDS;
  }
}

/**
 * Content automation helper functions
 */
export class ContentAutomationService {
  
  /**
   * Generate SEO-optimized product descriptions
   */
  static enhanceProductDescription(product: ProductSEOData): string {
    const features = SEOAutomationService.generateProductKeywords(product).slice(0, 5);
    const internalLinks = SEOAutomationService.generateInternalLinks(product);
    
    return `
## ${product.title} by ${product.vendor}

${product.description}

### Key Features:
${features.map(feature => `- ${feature}`).join('\n')}

### Why Choose This ${product.productType}?
- ✓ Authentic ${product.vendor} product
- ✓ Premium quality guaranteed
- ✓ Fast UK delivery (1-3 days)
- ✓ Expert customer support
- ✓ Competitive pricing

### Related Products:
${internalLinks.slice(0, 2).map(link => `- [${link.anchor}](${link.url})`).join('\n')}

*Age verification required. This product is only suitable for adults aged 18 and over.*
    `.trim();
  }

  /**
   * Generate seasonal content suggestions
   */
  static generateSeasonalContent(season: 'spring' | 'summer' | 'autumn' | 'winter'): Array<{title: string; keywords: string[]; description: string}> {
    const seasonalContent = {
      spring: [
        {
          title: 'Spring Cleaning Your Vape: Maintenance Guide 2024',
          keywords: ['vape maintenance', 'spring cleaning', 'vape care', 'device cleaning'],
          description: 'Complete guide to spring cleaning and maintaining your vape devices for optimal performance.'
        },
        {
          title: 'Fresh Spring Flavours: Best E-Liquids for the Season',
          keywords: ['spring flavours', 'fresh e-liquids', 'seasonal vaping', 'new flavours'],
          description: 'Discover the best fresh and fruity e-liquid flavours perfect for spring vaping.'
        }
      ],
      summer: [
        {
          title: 'Summer Vaping Guide: Best Practices for Hot Weather',
          keywords: ['summer vaping', 'hot weather vaping', 'vape care summer', 'outdoor vaping'],
          description: 'Essential tips for vaping safely and effectively during the summer months.'
        },
        {
          title: 'Refreshing Summer E-Liquid Flavours: Cool Down Your Vape',
          keywords: ['summer flavours', 'cooling e-liquids', 'menthol vape', 'refreshing vape'],
          description: 'Beat the heat with our selection of cooling and refreshing summer e-liquid flavours.'
        }
      ],
      autumn: [
        {
          title: 'Cozy Autumn Flavours: Warm Up Your Vaping Experience',
          keywords: ['autumn flavours', 'warm e-liquids', 'dessert vape', 'seasonal flavours'],
          description: 'Discover rich, warm, and comforting e-liquid flavours perfect for autumn.'
        }
      ],
      winter: [
        {
          title: 'Winter Vaping: Battery Care in Cold Weather',
          keywords: ['winter vaping', 'battery care', 'cold weather vaping', 'vape maintenance'],
          description: 'Keep your vape performing optimally during winter with proper battery and device care.'
        }
      ]
    };

    return seasonalContent[season] || [];
  }
} 