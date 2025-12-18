/**
 * Dynamic Keyword Service - The SEO Cheatcode
 * 
 * This service provides intelligent, context-aware keyword optimization
 * that automatically adapts based on page type, user intent, and content context.
 * 
 * Usage:
 * - Import the DynamicKeywordService class
 * - Call methods based on your page context
 * - Get optimized keywords, titles, and descriptions automatically
 */

import { VAPING_KEYWORDS, KeywordOptimizer } from './keyword-optimizer';

// ============================================================================
// Types & Interfaces
// ============================================================================

export type PageType = 'product' | 'category' | 'search' | 'blog' | 'landing' | 'brand' | 'guide';
export type SearchIntent = 'informational' | 'commercial' | 'transactional' | 'navigational';
export type ContentTone = 'promotional' | 'educational' | 'informative' | 'urgent';

export interface PageContext {
  pageType: PageType;
  primaryEntity?: string; // Product name, category name, brand name
  secondaryEntity?: string; // Vendor, product type
  tags?: string[];
  price?: { amount: string; currencyCode: string };
  productCount?: number;
  searchQuery?: string;
  searchIntent?: SearchIntent;
}

export interface DynamicKeywordResult {
  primaryKeywords: string[];
  secondaryKeywords: string[];
  longTailKeywords: string[];
  lsiKeywords: string[]; // Latent Semantic Indexing keywords
  intentKeywords: string[];
  geoKeywords: string[];
  title: string;
  metaDescription: string;
  h1: string;
  suggestedAnchors: string[];
  keywordDensityMap: Map<string, number>;
}

export interface TitleTemplate {
  template: string;
  variables: string[];
  maxLength: number;
}

export interface DescriptionTemplate {
  template: string;
  variables: string[];
  maxLength: number;
  tone: ContentTone;
}

// ============================================================================
// Dynamic Keyword Database - High-Value UK Vaping Keywords
// ============================================================================

/**
 * Intent-based keyword clusters
 * Organized by search intent for precise targeting
 */
export const INTENT_KEYWORD_CLUSTERS = {
  transactional: {
    modifiers: ['buy', 'shop', 'order', 'purchase', 'get', 'cheap', 'discount', 'sale', 'deal', 'offer'],
    urgency: ['today', 'now', 'fast delivery', 'next day', 'same day', 'instant'],
    trust: ['authentic', 'genuine', 'official', 'verified', 'uk retailer', 'trusted'],
    price: ['best price', 'lowest price', 'price match', 'cheap', 'affordable', 'budget'],
  },
  commercial: {
    comparison: ['best', 'top', 'vs', 'versus', 'compare', 'review', 'rated'],
    evaluation: ['quality', 'premium', 'professional', 'recommended', 'popular'],
    alternatives: ['alternative', 'similar to', 'like', 'replacement'],
  },
  informational: {
    questions: ['how to', 'what is', 'why', 'when', 'guide', 'tutorial', 'tips'],
    learning: ['beginners', 'starter', 'introduction', 'explained', 'understanding'],
    safety: ['safe', 'legal', 'regulations', 'uk law', 'age verification'],
  },
  navigational: {
    brand: ['official', 'store', 'website', 'uk'],
    local: ['near me', 'local', 'uk', 'london', 'manchester'],
  },
};

/**
 * Page-type specific keyword priorities
 * Higher weight = more important for that page type
 */
export const PAGE_TYPE_KEYWORD_WEIGHTS: Record<PageType, Record<string, number>> = {
  product: {
    product_name: 10,
    brand: 9,
    product_type: 8,
    features: 7,
    price_modifiers: 6,
    uk_geo: 5,
  },
  category: {
    category_name: 10,
    product_type: 9,
    brand_cluster: 8,
    uk_geo: 7,
    transactional: 6,
  },
  search: {
    query: 10,
    commercial: 8,
    product_type: 7,
    brand: 6,
    features: 5,
  },
  blog: {
    topic: 10,
    informational: 9,
    long_tail: 8,
    educational: 7,
    related_products: 5,
  },
  landing: {
    primary_cta: 10,
    brand: 9,
    uk_geo: 8,
    trust_signals: 7,
    transactional: 8,
  },
  brand: {
    brand_name: 10,
    product_types: 9,
    uk_stockist: 8,
    official: 7,
    popular_products: 6,
  },
  guide: {
    topic: 10,
    how_to: 9,
    educational: 8,
    beginner: 7,
    safety: 6,
  },
};

/**
 * LSI (Latent Semantic Indexing) keyword clusters
 * Related terms that search engines use to understand context
 */
export const LSI_KEYWORD_CLUSTERS = {
  vaping: ['e-cigarette', 'electronic cigarette', 'vaporizer', 'vaporiser', 'vapor', 'vapour'],
  e_liquid: ['vape juice', 'e-juice', 'liquid', 'shortfill', 'nic shot', 'flavour'],
  device: ['mod', 'pod', 'tank', 'coil', 'battery', 'kit', 'starter kit'],
  nicotine: ['nic salt', 'freebase', 'nicotine strength', 'mg', 'nicotine free', '0mg'],
  disposable: ['single use', 'rechargeable', 'puff count', 'pre-filled', 'ready to use'],
  flavour: ['fruit', 'menthol', 'tobacco', 'dessert', 'drink', 'ice', 'mint'],
  uk_specific: ['uk', 'united kingdom', 'british', 'tpd compliant', 'uk legal'],
  delivery: ['next day', 'fast shipping', 'free delivery', 'tracked', 'royal mail'],
};

/**
 * Seasonal and trending keyword modifiers
 */
export const SEASONAL_KEYWORDS = {
  current_year: new Date().getFullYear().toString(),
  seasons: {
    winter: ['winter', 'christmas', 'new year', 'cosy', 'warm'],
    spring: ['spring', 'fresh', 'new', 'easter'],
    summer: ['summer', 'holiday', 'outdoor', 'portable', 'travel'],
    autumn: ['autumn', 'fall', 'back to school'],
  },
  trending: ['new', 'latest', 'trending', 'popular', 'bestseller', 'top rated'],
};

// ============================================================================
// Dynamic Keyword Service
// ============================================================================

export class DynamicKeywordService {
  
  /**
   * Main entry point: Generate comprehensive keyword data for any page
   */
  static generateKeywords(context: PageContext): DynamicKeywordResult {
    const primaryKeywords = this.getPrimaryKeywords(context);
    const secondaryKeywords = this.getSecondaryKeywords(context);
    const longTailKeywords = this.getLongTailKeywords(context);
    const lsiKeywords = this.getLSIKeywords(context);
    const intentKeywords = this.getIntentKeywords(context);
    const geoKeywords = this.getGeoKeywords(context);
    
    const title = this.generateDynamicTitle(context, primaryKeywords);
    const metaDescription = this.generateDynamicDescription(context, primaryKeywords, secondaryKeywords);
    const h1 = this.generateDynamicH1(context, primaryKeywords);
    const suggestedAnchors = this.generateAnchorTexts(context, primaryKeywords);
    const keywordDensityMap = this.calculateKeywordDensity([
      ...primaryKeywords,
      ...secondaryKeywords,
      ...longTailKeywords,
    ]);
    
    return {
      primaryKeywords,
      secondaryKeywords,
      longTailKeywords,
      lsiKeywords,
      intentKeywords,
      geoKeywords,
      title,
      metaDescription,
      h1,
      suggestedAnchors,
      keywordDensityMap,
    };
  }

  /**
   * Get primary keywords based on page context
   * These are the most important keywords for the page
   */
  static getPrimaryKeywords(context: PageContext): string[] {
    const keywords: string[] = [];
    
    switch (context.pageType) {
      case 'product':
        if (context.primaryEntity) keywords.push(context.primaryEntity);
        if (context.secondaryEntity) keywords.push(context.secondaryEntity);
        keywords.push('vape', 'uk');
        break;
        
      case 'category':
        if (context.primaryEntity) {
          keywords.push(context.primaryEntity);
          keywords.push(`${context.primaryEntity} uk`);
          keywords.push(`buy ${context.primaryEntity}`);
        }
        break;
        
      case 'brand':
        if (context.primaryEntity) {
          keywords.push(context.primaryEntity);
          keywords.push(`${context.primaryEntity} vape`);
          keywords.push(`${context.primaryEntity} uk`);
          keywords.push(`${context.primaryEntity} products`);
        }
        break;
        
      case 'search':
        if (context.searchQuery) {
          keywords.push(context.searchQuery);
          keywords.push(`${context.searchQuery} uk`);
        }
        keywords.push('vape shop', 'vape uk');
        break;
        
      case 'blog':
      case 'guide':
        if (context.primaryEntity) {
          keywords.push(context.primaryEntity);
          keywords.push(`${context.primaryEntity} guide`);
        }
        keywords.push('vaping guide', 'vaping tips');
        break;
        
      case 'landing':
        keywords.push(...VAPING_KEYWORDS.primary.slice(0, 5));
        break;
    }
    
    // Add from tags if available
    if (context.tags && context.tags.length > 0) {
      const relevantTags = context.tags
        .filter(tag => !tag.includes('gid:') && !tag.includes('shopify'))
        .slice(0, 3);
      keywords.push(...relevantTags);
    }
    
    return Array.from(new Set(keywords.map(k => k.toLowerCase())));
  }

  /**
   * Get secondary keywords - supporting keywords that add context
   */
  static getSecondaryKeywords(context: PageContext): string[] {
    const keywords: string[] = [];
    
    // Add product type keywords
    if (context.secondaryEntity) {
      const typeKeywords = KeywordOptimizer.extractKeywordsFromContent(
        '',
        context.tags || [],
        context.secondaryEntity
      );
      keywords.push(...typeKeywords);
    }
    
    // Add transactional modifiers for commercial pages
    if (['product', 'category', 'brand', 'search'].includes(context.pageType)) {
      keywords.push(...INTENT_KEYWORD_CLUSTERS.transactional.modifiers.slice(0, 3));
      keywords.push(...INTENT_KEYWORD_CLUSTERS.transactional.trust.slice(0, 2));
    }
    
    // Add informational modifiers for content pages
    if (['blog', 'guide'].includes(context.pageType)) {
      keywords.push(...INTENT_KEYWORD_CLUSTERS.informational.questions.slice(0, 3));
    }
    
    // Add price-related keywords if price available
    if (context.price) {
      const priceNum = parseFloat(context.price.amount);
      if (priceNum < 10) keywords.push('cheap', 'affordable', 'budget');
      else if (priceNum > 50) keywords.push('premium', 'high-end', 'quality');
    }
    
    return Array.from(new Set(keywords.map(k => k.toLowerCase())));
  }

  /**
   * Generate long-tail keywords - specific, lower competition phrases
   */
  static getLongTailKeywords(context: PageContext): string[] {
    const longTail: string[] = [];
    const year = SEASONAL_KEYWORDS.current_year;
    
    if (context.primaryEntity) {
      const entity = context.primaryEntity.toLowerCase();
      
      // Pattern: [modifier] [entity] [location] [year]
      longTail.push(`best ${entity} uk ${year}`);
      longTail.push(`buy ${entity} uk`);
      longTail.push(`${entity} next day delivery`);
      longTail.push(`cheap ${entity} uk`);
      longTail.push(`${entity} free delivery`);
      
      // Add intent-specific long-tail
      if (context.searchIntent === 'informational') {
        longTail.push(`how to use ${entity}`);
        longTail.push(`${entity} beginners guide`);
        longTail.push(`${entity} vs cigarettes`);
      }
      
      if (context.searchIntent === 'commercial') {
        longTail.push(`${entity} reviews ${year}`);
        longTail.push(`best ${entity} for beginners`);
        longTail.push(`top rated ${entity}`);
      }
    }
    
    // Add product count if available
    if (context.productCount && context.productCount > 0) {
      if (context.primaryEntity) {
        longTail.push(`${context.productCount}+ ${context.primaryEntity.toLowerCase()} available`);
      }
    }
    
    return longTail;
  }

  /**
   * Get LSI (Latent Semantic Indexing) keywords
   * These help search engines understand the topic better
   */
  static getLSIKeywords(context: PageContext): string[] {
    const lsi: string[] = [];
    
    // Determine which LSI clusters are relevant
    const entity = (context.primaryEntity || '').toLowerCase();
    const entityType = (context.secondaryEntity || '').toLowerCase();
    
    // Add vaping-related LSI
    lsi.push(...LSI_KEYWORD_CLUSTERS.vaping.slice(0, 2));
    lsi.push(...LSI_KEYWORD_CLUSTERS.uk_specific.slice(0, 2));
    
    // Add entity-specific LSI
    if (entity.includes('liquid') || entityType.includes('liquid')) {
      lsi.push(...LSI_KEYWORD_CLUSTERS.e_liquid);
    }
    
    if (entity.includes('disposable') || entityType.includes('disposable')) {
      lsi.push(...LSI_KEYWORD_CLUSTERS.disposable);
    }
    
    if (entity.includes('device') || entity.includes('kit') || entity.includes('mod')) {
      lsi.push(...LSI_KEYWORD_CLUSTERS.device);
    }
    
    // Always add delivery LSI for commercial pages
    if (['product', 'category', 'brand'].includes(context.pageType)) {
      lsi.push(...LSI_KEYWORD_CLUSTERS.delivery.slice(0, 2));
    }
    
    return Array.from(new Set(lsi));
  }

  /**
   * Get intent-specific keywords based on inferred or provided search intent
   */
  static getIntentKeywords(context: PageContext): string[] {
    const intent = context.searchIntent || this.inferSearchIntent(context);
    const keywords: string[] = [];
    
    const cluster = INTENT_KEYWORD_CLUSTERS[intent];
    if (cluster) {
      Object.values(cluster).forEach(kws => {
        keywords.push(...(kws as string[]).slice(0, 2));
      });
    }
    
    return keywords;
  }

  /**
   * Get geo-targeting keywords for UK market
   */
  static getGeoKeywords(context: PageContext): string[] {
    return [
      'uk',
      'united kingdom',
      'uk delivery',
      'british',
      'uk vape shop',
      ...VAPING_KEYWORDS.geoModifiers.slice(0, 3),
    ];
  }

  /**
   * Infer search intent from page context
   */
  static inferSearchIntent(context: PageContext): SearchIntent {
    switch (context.pageType) {
      case 'product':
        return 'transactional';
      case 'category':
      case 'search':
      case 'brand':
        return 'commercial';
      case 'blog':
      case 'guide':
        return 'informational';
      case 'landing':
        return 'transactional';
      default:
        return 'commercial';
    }
  }

  /**
   * Generate dynamic page title based on context and keywords
   */
  static generateDynamicTitle(context: PageContext, primaryKeywords: string[]): string {
    const year = SEASONAL_KEYWORDS.current_year;
    const templates = this.getTitleTemplates(context.pageType);
    
    let title = '';
    
    switch (context.pageType) {
      case 'product':
        title = `${context.primaryEntity || 'Product'} | ${context.secondaryEntity || 'Vape'} UK | Vapourism ${year}`;
        break;
        
      case 'category':
        const count = context.productCount ? `(${context.productCount}+)` : '';
        title = `${context.primaryEntity || 'Category'} ${count} | UK Vape Shop | Vapourism ${year}`;
        break;
        
      case 'brand':
        title = `${context.primaryEntity || 'Brand'} Vape Products | Official UK Stockist | Vapourism`;
        break;
        
      case 'search':
        if (context.searchQuery) {
          title = `${context.searchQuery} - Search Results | Vapourism UK`;
        } else {
          title = `Browse All Vape Products | Fast UK Delivery | Vapourism`;
        }
        break;
        
      case 'blog':
        title = `${context.primaryEntity || 'Blog'} | Vaping News & Tips | Vapourism ${year}`;
        break;
        
      case 'guide':
        title = `${context.primaryEntity || 'Guide'} | Complete UK Vaping Guide | Vapourism`;
        break;
        
      case 'landing':
        title = `Vape Shop UK | Premium Vaping Products | Vapourism ${year}`;
        break;
    }
    
    // Ensure title is within SEO limits (70 chars)
    if (title.length > 70) {
      title = title.substring(0, 67) + '...';
    }
    
    return title;
  }

  /**
   * Generate dynamic meta description based on context
   */
  static generateDynamicDescription(
    context: PageContext,
    primaryKeywords: string[],
    secondaryKeywords: string[]
  ): string {
    const year = SEASONAL_KEYWORDS.current_year;
    let description = '';
    
    // Trust signals to include
    const trustSignals = ['✓ Fast UK Delivery', '✓ Authentic Products', '✓ Best Prices'];
    
    switch (context.pageType) {
      case 'product':
        const priceText = context.price ? ` from £${context.price.amount}` : '';
        description = `Shop ${context.primaryEntity || 'this product'} by ${context.secondaryEntity || 'top brand'}${priceText}. ${trustSignals.join(' ')} ${year}.`;
        break;
        
      case 'category':
        const countText = context.productCount ? `${context.productCount}+ products` : 'Our range';
        description = `${countText} in ${context.primaryEntity || 'this category'}. ${trustSignals.join(' ')} Shop now at Vapourism UK.`;
        break;
        
      case 'brand':
        description = `Official UK stockist of ${context.primaryEntity || 'brand'} vaping products. ${trustSignals.join(' ')} Browse the full range at Vapourism.`;
        break;
        
      case 'search':
        if (context.searchQuery) {
          description = `Search results for "${context.searchQuery}". Find premium vaping products with ${trustSignals.slice(0, 2).join(' ')}`;
        } else {
          description = `Browse all vaping products at Vapourism UK. ${trustSignals.join(' ')} ${year}.`;
        }
        break;
        
      case 'blog':
      case 'guide':
        description = `${context.primaryEntity || 'Learn about vaping'} with our comprehensive guide. Expert advice, tips, and UK regulations explained.`;
        break;
        
      case 'landing':
        description = `UK's leading vape shop. Premium e-liquids, devices & accessories. ${trustSignals.join(' ')} Shop now!`;
        break;
    }
    
    // Ensure description is within SEO limits (155 chars)
    if (description.length > 155) {
      description = description.substring(0, 152) + '...';
    }
    
    return description;
  }

  /**
   * Generate dynamic H1 heading
   */
  static generateDynamicH1(context: PageContext, primaryKeywords: string[]): string {
    let h1 = '';
    
    switch (context.pageType) {
      case 'product':
        h1 = context.primaryEntity || 'Product';
        // Remove vendor from H1 if it's already there to avoid duplication
        if (context.secondaryEntity && h1.toLowerCase().includes(context.secondaryEntity.toLowerCase())) {
          // Keep as is
        } else if (context.secondaryEntity) {
          h1 = `${h1} by ${context.secondaryEntity}`;
        }
        break;
        
      case 'category':
        h1 = context.productCount 
          ? `${context.primaryEntity || 'Category'} (${context.productCount}+ Products)`
          : (context.primaryEntity || 'Category');
        break;
        
      case 'brand':
        h1 = `${context.primaryEntity || 'Brand'} Products`;
        break;
        
      case 'search':
        if (context.searchQuery) {
          h1 = `Search: ${context.searchQuery}`;
        } else {
          h1 = 'Browse All Products';
        }
        if (context.productCount) {
          h1 += ` (${context.productCount} Results)`;
        }
        break;
        
      case 'blog':
      case 'guide':
        h1 = context.primaryEntity || 'Guide';
        break;
        
      case 'landing':
        h1 = 'Premium Vaping Products';
        break;
    }
    
    // Ensure H1 is within SEO limits (60 chars)
    if (h1.length > 60) {
      h1 = h1.substring(0, 57) + '...';
    }
    
    return h1;
  }

  /**
   * Generate suggested anchor texts for internal linking
   */
  static generateAnchorTexts(context: PageContext, primaryKeywords: string[]): string[] {
    const anchors: string[] = [];
    
    if (context.primaryEntity) {
      anchors.push(context.primaryEntity);
      anchors.push(`Shop ${context.primaryEntity}`);
      anchors.push(`${context.primaryEntity} UK`);
      anchors.push(`Buy ${context.primaryEntity}`);
    }
    
    if (context.secondaryEntity) {
      anchors.push(`More ${context.secondaryEntity} products`);
      anchors.push(`Browse ${context.secondaryEntity}`);
    }
    
    // Add generic but keyword-rich anchors
    anchors.push('Shop now');
    anchors.push('View all products');
    anchors.push('Learn more');
    
    return anchors;
  }

  /**
   * Calculate recommended keyword density
   */
  static calculateKeywordDensity(keywords: string[]): Map<string, number> {
    const densityMap = new Map<string, number>();
    
    // Primary keywords: 2-3% density
    keywords.slice(0, 3).forEach(kw => {
      densityMap.set(kw, 0.025); // 2.5%
    });
    
    // Secondary keywords: 1-2% density
    keywords.slice(3, 8).forEach(kw => {
      densityMap.set(kw, 0.015); // 1.5%
    });
    
    // Long-tail keywords: 0.5-1% density
    keywords.slice(8).forEach(kw => {
      densityMap.set(kw, 0.008); // 0.8%
    });
    
    return densityMap;
  }

  /**
   * Get title templates for a page type
   */
  private static getTitleTemplates(pageType: PageType): TitleTemplate[] {
    const templates: Record<PageType, TitleTemplate[]> = {
      product: [
        { template: '{name} | {type} UK | Vapourism {year}', variables: ['name', 'type', 'year'], maxLength: 70 },
        { template: 'Buy {name} | {brand} | Fast UK Delivery', variables: ['name', 'brand'], maxLength: 70 },
      ],
      category: [
        { template: '{category} ({count}+) | UK Vape Shop | Vapourism', variables: ['category', 'count'], maxLength: 70 },
        { template: 'Shop {category} UK | Best {category} {year}', variables: ['category', 'year'], maxLength: 70 },
      ],
      search: [
        { template: '{query} - Search | Vapourism UK', variables: ['query'], maxLength: 70 },
        { template: 'Browse {count}+ Products | Vapourism', variables: ['count'], maxLength: 70 },
      ],
      blog: [
        { template: '{title} | Vaping Blog | Vapourism', variables: ['title'], maxLength: 70 },
      ],
      landing: [
        { template: 'Vape Shop UK | Premium Products | Vapourism {year}', variables: ['year'], maxLength: 70 },
      ],
      brand: [
        { template: '{brand} UK | Official Stockist | Vapourism', variables: ['brand'], maxLength: 70 },
      ],
      guide: [
        { template: '{title} | UK Vaping Guide | Vapourism', variables: ['title'], maxLength: 70 },
      ],
    };
    
    return templates[pageType] || templates.landing;
  }
}

// ============================================================================
// Helper Functions for Quick Access
// ============================================================================

/**
 * Quick function to get optimized keywords for a product page
 */
export function getProductKeywords(
  title: string,
  vendor: string,
  productType: string,
  tags: string[] = [],
  price?: { amount: string; currencyCode: string }
): DynamicKeywordResult {
  return DynamicKeywordService.generateKeywords({
    pageType: 'product',
    primaryEntity: title,
    secondaryEntity: vendor,
    tags,
    price,
    searchIntent: 'transactional',
  });
}

/**
 * Quick function to get optimized keywords for a category page
 */
export function getCategoryKeywords(
  categoryName: string,
  productCount?: number,
  topBrands?: string[]
): DynamicKeywordResult {
  return DynamicKeywordService.generateKeywords({
    pageType: 'category',
    primaryEntity: categoryName,
    productCount,
    tags: topBrands,
    searchIntent: 'commercial',
  });
}

/**
 * Quick function to get optimized keywords for a brand page
 */
export function getBrandKeywords(
  brandName: string,
  productCount?: number,
  productTypes?: string[]
): DynamicKeywordResult {
  return DynamicKeywordService.generateKeywords({
    pageType: 'brand',
    primaryEntity: brandName,
    productCount,
    tags: productTypes,
    searchIntent: 'commercial',
  });
}

/**
 * Quick function to get optimized keywords for a search page
 */
export function getSearchKeywords(
  query: string,
  resultCount?: number
): DynamicKeywordResult {
  return DynamicKeywordService.generateKeywords({
    pageType: 'search',
    searchQuery: query,
    productCount: resultCount,
    searchIntent: 'commercial',
  });
}

/**
 * Quick function to get optimized keywords for a blog/guide page
 */
export function getContentKeywords(
  title: string,
  pageType: 'blog' | 'guide' = 'blog',
  tags?: string[]
): DynamicKeywordResult {
  return DynamicKeywordService.generateKeywords({
    pageType,
    primaryEntity: title,
    tags,
    searchIntent: 'informational',
  });
}

/**
 * Get all high-value keywords for a specific intent
 */
export function getIntentKeywords(intent: SearchIntent): string[] {
  const cluster = INTENT_KEYWORD_CLUSTERS[intent];
  if (!cluster) return [];
  
  const keywords: string[] = [];
  Object.values(cluster).forEach(kws => {
    keywords.push(...(kws as string[]));
  });
  
  return keywords;
}

/**
 * Get LSI keywords for a topic
 */
export function getRelatedKeywords(topic: string): string[] {
  const topicLower = topic.toLowerCase();
  const related: string[] = [];
  
  Object.entries(LSI_KEYWORD_CLUSTERS).forEach(([, keywords]) => {
    if (keywords.some(kw => topicLower.includes(kw) || kw.includes(topicLower))) {
      related.push(...keywords);
    }
  });
  
  // If no specific matches, return general vaping LSI
  if (related.length === 0) {
    related.push(...LSI_KEYWORD_CLUSTERS.vaping);
    related.push(...LSI_KEYWORD_CLUSTERS.uk_specific);
  }
  
  return Array.from(new Set(related));
}

/**
 * Generate a keyword-rich snippet for any content
 */
export function generateKeywordSnippet(
  topic: string,
  intent: SearchIntent = 'commercial',
  maxLength: number = 160
): string {
  const keywords = DynamicKeywordService.generateKeywords({
    pageType: intent === 'informational' ? 'guide' : 'category',
    primaryEntity: topic,
    searchIntent: intent,
  });
  
  const snippet = `${topic} - ${keywords.primaryKeywords.slice(0, 2).join(', ')}. ${keywords.intentKeywords.slice(0, 2).join(', ')} at Vapourism UK.`;
  
  return snippet.length > maxLength ? snippet.substring(0, maxLength - 3) + '...' : snippet;
}
