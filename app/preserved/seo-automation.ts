/**
 * SEO Automation Service for Vapourism
 * Provides automated SEO optimization for products and content
 * Note: Collections are not used in this store - all navigation is tag-based
 */

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
}

export class SEOAutomationService {
  
  /**
   * Generate comprehensive keywords for products
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
    
    return [...new Set([...baseKeywords, ...featureKeywords, ...priceKeywords, ...categoryKeywords])];
  }

  /**
   * Generate SEO-optimized meta description for products
   */
  static generateProductMetaDescription(product: ProductSEOData): string {
    const price = product.price ? ` from £${product.price.amount}` : '';
    const availability = product.availableForSale ? '✓ In Stock' : '✓ Pre-order';
    
    return `${product.title} by ${product.vendor}. Premium ${product.productType}${price}. ${availability} ✓ Fast UK delivery ✓ Quality guaranteed ✓ Age verification required. ${product.description.substring(0, 60)}...`;
  }

  /**
   * Generate category meta description (for tag-based search pages)
   */
  static generateCategoryMetaDescription(categoryTitle: string, productCount?: number, topBrands?: string[]): string {
    const productText = productCount ? `${productCount} products` : 'our range';
    const brandsText = topBrands?.slice(0, 3).join(', ') || 'top brands';
    
    return `Shop ${categoryTitle} at Vapourism. ${productText} from ${brandsText}. ✓ Premium quality ✓ Fast UK delivery ✓ Competitive prices ✓ Expert support.`;
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
        "item": `https://vapourism.co.uk${crumb.url}`
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
   * Generate optimized alt text for images
   */
  static generateImageAltText(product: ProductSEOData, context: 'main' | 'thumbnail' | 'gallery' = 'main'): string {
    const contextMap = {
      main: `${product.title} by ${product.vendor} | Premium ${product.productType} | Vapourism UK`,
      thumbnail: `${product.title} - ${product.vendor} thumbnail`,
      gallery: `${product.title} product image ${Math.floor(Math.random() * 5) + 1}`
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
   * Generate optimized product title for meta tags
   * Ensures title fits within 70 character SEO limit
   * Priority: Product title > Vendor > "Vapourism"
   * @param productTitle The product title
   * @param vendor The vendor/brand name
   * @param seoTitle Optional SEO title override from Shopify
   * @returns Optimized title string ≤70 characters
   */
  static generateProductTitle(productTitle: string, vendor: string, seoTitle?: string | null): string {
    // Use SEO title from Shopify if available
    if (seoTitle) {
      return this.truncateTitle(seoTitle);
    }

    const suffix = ' | Vapourism';
    const maxProductLength = 70 - suffix.length;

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

    // Truncate product title to fit (reserve 1 char for ellipsis)
    const maxContentLength = maxProductLength - 1;
    const truncatedProduct = productTitle.substring(0, maxContentLength);
    const lastSpace = truncatedProduct.lastIndexOf(' ');
    
    if (lastSpace > maxContentLength - 10) {
      return truncatedProduct.substring(0, lastSpace) + '…' + suffix;
    }
    
    return truncatedProduct + '…' + suffix;
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