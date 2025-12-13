/**
 * Keyword Optimizer for SEO
 * 
 * This service analyzes and optimizes keyword usage across the site
 * to improve organic search rankings based on competitor analysis.
 */

// Constants
const PRICE_VALIDITY_DAYS = 30; // How long product prices are valid for schema.org

export interface KeywordData {
  keyword: string;
  searchVolume?: number;
  difficulty?: number;
  position?: number;
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  category?: string;
}

export interface KeywordMapping {
  primary: string[];
  secondary: string[];
  longTail: string[];
}

export interface CompetitorKeywordAnalysis {
  totalKeywords: number;
  topPerformers: KeywordData[];
  categoryBreakdown: Record<string, number>;
  intentDistribution: Record<string, number>;
}

/**
 * UK Vaping Industry - High-Value Keywords
 * Based on competitor analysis and industry trends
 */
export const VAPING_KEYWORDS = {
  // Primary commercial keywords (high volume, high intent)
  primary: [
    'vape',
    'vaping',
    'e-cigarette',
    'e-liquid',
    'vape juice',
    'disposable vape',
    'vape kit',
    'vape pen',
    'pod system',
    'nicotine salt',
  ],
  
  // UK-specific modifiers (geo-targeting)
  geoModifiers: [
    'uk',
    'united kingdom',
    'british',
    'london',
    'manchester',
    'birmingham',
  ],
  
  // Product type keywords
  productTypes: [
    'disposable vape',
    'vape mod',
    'pod kit',
    'vape tank',
    'vape coils',
    'e-liquid',
    'shortfill',
    'nic shot',
    '10ml e-liquid',
    '50ml shortfill',
  ],
  
  // Brand-related keywords (high commercial intent)
  brands: [
    'elf bar',
    'lost mary',
    'geek bar',
    'smok',
    'voopoo',
    'vaporesso',
    'aspire',
    'innokin',
    'freemax',
    'uwell',
  ],
  
  // Feature keywords (long-tail)
  features: [
    'nicotine strength',
    'vg pg ratio',
    'mtl vaping',
    'sub ohm',
    'mouth to lung',
    'direct lung',
    'rechargeable',
    'refillable',
    'leak proof',
    'beginner friendly',
  ],
  
  // Flavour categories (high search volume)
  flavours: [
    'strawberry vape',
    'menthol vape',
    'tobacco flavour',
    'fruit vape',
    'dessert vape',
    'mint vape',
    'ice vape',
    'berry vape',
    'tropical vape',
    'vanilla vape',
  ],
  
  // Informational keywords (content opportunities)
  informational: [
    'how to vape',
    'vaping guide',
    'best vape for beginners',
    'how to choose vape',
    'vape vs cigarette',
    'vaping laws uk',
    'nicotine strength guide',
    'vape maintenance',
    'coil replacement',
    'vape battery safety',
  ],
  
  // Transactional modifiers (high conversion)
  transactional: [
    'buy',
    'shop',
    'cheap',
    'best price',
    'sale',
    'deal',
    'offer',
    'discount',
    'free delivery',
    'next day delivery',
  ],
};

export class KeywordOptimizer {
  
  /**
   * Generate keyword-optimized title for a product
   */
  static optimizeProductTitle(
    originalTitle: string,
    vendor: string,
    productType: string,
    tags: string[]
  ): string {
    const keywords: string[] = [];
    
    // Include brand if not already in title
    if (!originalTitle.toLowerCase().includes(vendor.toLowerCase())) {
      keywords.push(vendor);
    }
    
    // Include product type if not in title
    const normalizedType = this.normalizeProductType(productType);
    if (!originalTitle.toLowerCase().includes(normalizedType.toLowerCase())) {
      keywords.push(normalizedType);
    }
    
    // Add UK modifier for geo-targeting
    if (!originalTitle.toLowerCase().includes('uk')) {
      keywords.push('UK');
    }
    
    // Combine: "Original Title | Keywords | Vapourism"
    const keywordSuffix = keywords.length > 0 ? ` | ${keywords.join(' ')}` : '';
    return `${originalTitle}${keywordSuffix} | Vapourism`;
  }
  
  /**
   * Generate keyword-rich meta description
   */
  static optimizeMetaDescription(
    product: {
      title: string;
      vendor: string;
      productType: string;
      price?: { amount: string };
      tags: string[];
    }
  ): string {
    const keywords: string[] = [];
    const productType = this.normalizeProductType(product.productType);
    
    // Add transactional modifiers
    keywords.push('Shop');
    keywords.push(product.title);
    
    // Add brand
    keywords.push(`by ${product.vendor}`);
    
    // Add price if available
    if (product.price) {
      keywords.push(`from £${product.price.amount}`);
    }
    
    // Add product type
    keywords.push(productType);
    
    // Add UK geo-targeting
    keywords.push('in the UK');
    
    // Add trust signals and transactional modifiers
    const benefits = [
      '✓ Fast UK Delivery',
      '✓ Authentic Products',
      '✓ Best Prices',
      '✓ Expert Support',
    ];
    
    // Construct description (max 155-160 chars for optimal display)
    let description = keywords.join(' ') + '. ' + benefits.join(' ');
    
    // Truncate if too long
    if (description.length > 155) {
      description = description.substring(0, 152) + '...';
    }
    
    return description;
  }
  
  /**
   * Generate keyword mapping for a category/tag page
   */
  static generateCategoryKeywords(
    categoryTag: string,
    productCount?: number,
    topBrands?: string[]
  ): KeywordMapping {
    const primary: string[] = [];
    const secondary: string[] = [];
    const longTail: string[] = [];
    
    // Normalize category tag
    const category = categoryTag.replace(/_/g, ' ').toLowerCase();
    
    // Primary keywords
    primary.push(category);
    primary.push(`${category} uk`);
    primary.push(`buy ${category}`);
    primary.push(`shop ${category}`);
    
    // Add brand combinations for secondary keywords
    if (topBrands && topBrands.length > 0) {
      topBrands.slice(0, 5).forEach(brand => {
        secondary.push(`${brand.toLowerCase()} ${category}`);
      });
    }
    
    // Long-tail keywords with modifiers
    VAPING_KEYWORDS.transactional.slice(0, 5).forEach(modifier => {
      longTail.push(`${modifier} ${category} uk`);
    });
    
    // Add product count to long-tail
    if (productCount && productCount > 0) {
      longTail.push(`best ${category} ${new Date().getFullYear()}`);
      longTail.push(`${category} for beginners`);
      longTail.push(`cheap ${category} uk`);
    }
    
    return { primary, secondary, longTail };
  }
  
  /**
   * Extract relevant keywords from product tags and description
   */
  static extractKeywordsFromContent(
    description: string,
    tags: string[],
    productType: string
  ): string[] {
    const keywords = new Set<string>();
    
    // Add normalized product type
    keywords.add(this.normalizeProductType(productType).toLowerCase());
    
    // Extract from tags
    tags.forEach(tag => {
      const normalized = tag.toLowerCase().replace(/_/g, ' ');
      
      // Match against known keyword categories
      if (this.isRelevantKeyword(normalized)) {
        keywords.add(normalized);
      }
    });
    
    // Extract from description (match patterns)
    const patterns = [
      /(\d+)mg/gi,           // Nicotine strength
      /(\d+)ml/gi,           // Volume
      /(\d+)\/(\d+)/gi,      // VG/PG ratio
      /\b(mtl|dtl)\b/gi,     // Vaping style
      /\b(pod|mod|tank|coil|disposable)\b/gi, // Device types
    ];
    
    patterns.forEach(pattern => {
      const matches = description.match(pattern);
      if (matches) {
        matches.forEach(match => keywords.add(match.toLowerCase()));
      }
    });
    
    return Array.from(keywords);
  }
  
  /**
   * Generate structured data with optimized keywords
   */
  static generateProductSchema(product: {
    title: string;
    vendor: string;
    productType: string;
    description: string;
    price: { amount: string; currencyCode: string };
    image?: string;
    url: string;
    sku?: string;
    availability: boolean;
  }) {
    const keywords = this.extractKeywordsFromContent(
      product.description,
      [],
      product.productType
    );
    
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.title,
      "description": product.description,
      "brand": {
        "@type": "Brand",
        "name": product.vendor
      },
      "category": this.normalizeProductType(product.productType),
      "keywords": keywords.join(', '),
      "offers": {
        "@type": "Offer",
        "price": product.price.amount,
        "priceCurrency": product.price.currencyCode,
        "availability": product.availability 
          ? "https://schema.org/InStock" 
          : "https://schema.org/OutOfStock",
        "url": product.url,
        "seller": {
          "@type": "Organization",
          "name": "Vapourism"
        },
        "priceValidUntil": new Date(Date.now() + PRICE_VALIDITY_DAYS * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      ...(product.image && {
        "image": product.image
      }),
      ...(product.sku && {
        "sku": product.sku
      }),
    };
  }
  
  /**
   * Analyze competitor keyword data
   */
  static analyzeCompetitorKeywords(keywords: KeywordData[]): CompetitorKeywordAnalysis {
    const categoryBreakdown: Record<string, number> = {};
    const intentDistribution: Record<string, number> = {};
    
    keywords.forEach(kw => {
      // Category breakdown
      if (kw.category) {
        categoryBreakdown[kw.category] = (categoryBreakdown[kw.category] || 0) + 1;
      }
      
      // Intent distribution
      intentDistribution[kw.intent] = (intentDistribution[kw.intent] || 0) + 1;
    });
    
    // Sort by position to get top performers
    const topPerformers = keywords
      .filter(kw => kw.position && kw.position <= 10)
      .sort((a, b) => (a.position || 999) - (b.position || 999))
      .slice(0, 20);
    
    return {
      totalKeywords: keywords.length,
      topPerformers,
      categoryBreakdown,
      intentDistribution,
    };
  }
  
  /**
   * Generate content suggestions based on keyword gaps
   */
  static generateContentSuggestions(
    competitorKeywords: KeywordData[],
    currentKeywords: string[]
  ): Array<{
    keyword: string;
    opportunity: 'high' | 'medium' | 'low';
    contentType: 'product' | 'category' | 'blog' | 'guide';
    suggestion: string;
  }> {
    const suggestions: Array<{
      keyword: string;
      opportunity: 'high' | 'medium' | 'low';
      contentType: 'product' | 'category' | 'blog' | 'guide';
      suggestion: string;
    }> = [];
    
    // Find keywords competitors rank for that we don't have
    const currentSet = new Set(currentKeywords.map(k => k.toLowerCase()));
    
    competitorKeywords.forEach(kw => {
      if (!currentSet.has(kw.keyword.toLowerCase())) {
        // Determine opportunity level
        const opportunity = this.assessOpportunity(kw);
        
        // Determine content type
        const contentType = this.determineContentType(kw);
        
        suggestions.push({
          keyword: kw.keyword,
          opportunity,
          contentType,
          suggestion: this.generateContentSuggestion(kw, contentType),
        });
      }
    });
    
    // Sort by opportunity (high to low)
    return suggestions.sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.opportunity] - order[b.opportunity];
    });
  }
  
  /**
   * Helper: Normalize product type to standard keyword
   */
  private static normalizeProductType(productType: string): string {
    const typeMap: Record<string, string> = {
      'E-Liquid': 'E-Liquid',
      'E Liquid': 'E-Liquid',
      'Vape Juice': 'E-Liquid',
      'Pod System': 'Pod Kit',
      'Pod Kit': 'Pod Kit',
      'Mod': 'Vape Mod',
      'Box Mod': 'Vape Mod',
      'Disposable': 'Disposable Vape',
      'Disposable Vape': 'Disposable Vape',
      'Tank': 'Vape Tank',
      'Coils': 'Vape Coils',
      'Coil': 'Vape Coils',
    };
    
    return typeMap[productType] || productType;
  }
  
  /**
   * Helper: Check if a keyword is relevant for SEO
   */
  private static isRelevantKeyword(keyword: string): boolean {
    const allKeywords = [
      ...VAPING_KEYWORDS.primary,
      ...VAPING_KEYWORDS.productTypes,
      ...VAPING_KEYWORDS.features,
      ...VAPING_KEYWORDS.flavours,
    ].map(k => k.toLowerCase());
    
    return allKeywords.some(k => keyword.includes(k) || k.includes(keyword));
  }
  
  /**
   * Helper: Assess opportunity level for a keyword
   */
  private static assessOpportunity(kw: KeywordData): 'high' | 'medium' | 'low' {
    // High opportunity: low competition, high volume, or competitor ranks well
    if (kw.position && kw.position <= 3 && kw.intent === 'transactional') {
      return 'high';
    }
    
    if (kw.difficulty && kw.difficulty < 30 && kw.searchVolume && kw.searchVolume > 500) {
      return 'high';
    }
    
    // Medium opportunity
    if (kw.position && kw.position <= 10) {
      return 'medium';
    }
    
    // Low opportunity
    return 'low';
  }
  
  /**
   * Helper: Determine best content type for a keyword
   */
  private static determineContentType(
    kw: KeywordData
  ): 'product' | 'category' | 'blog' | 'guide' {
    if (kw.intent === 'transactional') {
      return 'product';
    }
    
    if (kw.intent === 'commercial') {
      return 'category';
    }
    
    if (kw.keyword.toLowerCase().includes('how to') || 
        kw.keyword.toLowerCase().includes('guide')) {
      return 'guide';
    }
    
    return 'blog';
  }
  
  /**
   * Helper: Generate content suggestion text
   */
  private static generateContentSuggestion(
    kw: KeywordData,
    contentType: 'product' | 'category' | 'blog' | 'guide'
  ): string {
    const suggestions = {
      product: `Create or optimize product pages targeting "${kw.keyword}"`,
      category: `Build category page or collection for "${kw.keyword}"`,
      blog: `Write blog post about "${kw.keyword}"`,
      guide: `Create comprehensive guide for "${kw.keyword}"`,
    };
    
    return suggestions[contentType];
  }
}

/**
 * Helper function to build keyword-optimized URLs
 */
export function buildSEOFriendlyUrl(baseUrl: string, keywords: string[]): string {
  // Take first 2-3 keywords and create slug
  const slug = keywords
    .slice(0, 3)
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  return `${baseUrl}/${slug}`;
}

/**
 * Helper to generate keyword variations
 */
export function generateKeywordVariations(baseKeyword: string): string[] {
  const variations = new Set<string>();
  
  // Add base keyword
  variations.add(baseKeyword);
  
  // Add UK variations
  variations.add(`${baseKeyword} uk`);
  variations.add(`uk ${baseKeyword}`);
  
  // Add transactional modifiers
  ['buy', 'shop', 'best', 'cheap'].forEach(modifier => {
    variations.add(`${modifier} ${baseKeyword}`);
    variations.add(`${modifier} ${baseKeyword} uk`);
  });
  
  // Add year for freshness
  const currentYear = new Date().getFullYear();
  variations.add(`${baseKeyword} ${currentYear}`);
  
  return Array.from(variations);
}
