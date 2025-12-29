/**
 * Content Syndication Service
 * 
 * Syndicates Shopify blog content to cloud provider static hosting platforms
 * for SEO backlink building while maintaining canonical URLs and best practices.
 * 
 * Key Features:
 * - Fetches blog posts from Shopify Storefront API
 * - Transforms content with proper SEO elements
 * - Injects strategic backlinks
 * - Generates static HTML pages
 * - Prepares content for cloud deployment
 * 
 * Usage:
 * ```typescript
 * const syndicator = new ContentSyndicator(storefront);
 * const pages = await syndicator.syncAllPosts();
 * await deployer.deploy(pages);
 * ```
 */

import type {Storefront} from '@shopify/hydrogen';
import type {ShopifyArticle} from '~/lib/shopify-blog';
import {getBlogArticles} from '~/lib/shopify-blog';
import {SEOAutomationService} from '~/preserved/seo-automation';

/**
 * Syndicated page output format
 */
export interface SyndicatedPage {
  /** URL-safe slug for the page */
  slug: string;
  /** Full HTML content */
  html: string;
  /** Original Shopify article */
  article: ShopifyArticle;
  /** SEO metadata */
  seo: {
    title: string;
    description: string;
    keywords: string[];
    canonical: string;
  };
  /** Generated date */
  generatedAt: string;
}

/**
 * Backlink configuration
 */
export interface BacklinkConfig {
  /** Main site URL */
  mainSiteUrl: string;
  /** Maximum backlinks per article */
  maxLinksPerArticle: number;
  /** Link placement strategy */
  strategy: 'natural' | 'aggressive' | 'conservative';
}

/**
 * Default backlink configuration
 */
const DEFAULT_BACKLINK_CONFIG: BacklinkConfig = {
  mainSiteUrl: 'https://www.vapourism.co.uk',
  maxLinksPerArticle: 3,
  strategy: 'natural',
};

/**
 * Strategic backlink targets with natural anchor text variations
 */
const BACKLINK_TARGETS = [
  {
    url: '/products',
    anchors: [
      'our vape shop',
      'browse our products',
      'shop our collection',
      'our online store',
      'Vapourism',
    ],
  },
  {
    url: '/collections/devices',
    anchors: [
      'vape devices',
      'our device collection',
      'browse devices',
      'pod systems and mods',
    ],
  },
  {
    url: '/collections/e-liquids',
    anchors: [
      'e-liquid range',
      'our e-liquids',
      'vape juice selection',
      'premium e-liquids',
    ],
  },
  {
    url: '/collections/disposables',
    anchors: [
      'disposable vapes',
      'our disposables',
      'ready-to-use vapes',
      'disposable range',
    ],
  },
  {
    url: '/guides',
    anchors: [
      'vaping guides',
      'our helpful guides',
      'beginner guides',
      'how-to guides',
    ],
  },
];

/**
 * Content Syndication Service
 */
export class ContentSyndicator {
  private config: BacklinkConfig;

  constructor(
    private storefront: Storefront,
    config?: Partial<BacklinkConfig>
  ) {
    this.config = {...DEFAULT_BACKLINK_CONFIG, ...config};
  }

  /**
   * Sync all blog posts and generate syndicated pages
   */
  async syncAllPosts(options?: {
    limit?: number;
    after?: string;
  }): Promise<SyndicatedPage[]> {
    const {articles} = await getBlogArticles(this.storefront, {
      first: options?.limit || 50,
      after: options?.after,
    });

    return Promise.all(
      articles.map((article) => this.generateSyndicatedPage(article))
    );
  }

  /**
   * Generate a syndicated page from a Shopify article
   */
  async generateSyndicatedPage(
    article: ShopifyArticle
  ): Promise<SyndicatedPage> {
    const canonical = this.getCanonicalUrl(article);
    const seo = this.generateSEO(article, canonical);
    const html = this.generateHTML(article, seo, canonical);

    return {
      slug: article.handle,
      html,
      article,
      seo,
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Get canonical URL for an article
   */
  private getCanonicalUrl(article: ShopifyArticle): string {
    return `${this.config.mainSiteUrl}/blog/${article.handle}`;
  }

  /**
   * Generate SEO metadata for syndicated page
   */
  private generateSEO(
    article: ShopifyArticle,
    canonical: string
  ): SyndicatedPage['seo'] {
    // Use existing SEO automation service
    const title =
      article.seo?.title ||
      `${article.title} | Vapourism Vaping Blog`;
    
    const description =
      article.seo?.description ||
      article.excerpt ||
      article.content.substring(0, 155);

    // Generate keywords from article content and tags
    const keywords = [
      ...article.tags,
      'vaping',
      'vape shop uk',
      'vapourism',
      ...this.extractKeywordsFromContent(article.content),
    ];

    return {
      title: SEOAutomationService.truncateTitle(title, 70),
      description: description.substring(0, 160),
      keywords: [...new Set(keywords)].slice(0, 15),
      canonical,
    };
  }

  /**
   * Extract keywords from article content
   */
  private extractKeywordsFromContent(content: string): string[] {
    const keywords: string[] = [];
    const commonTerms = [
      'e-liquid',
      'vape juice',
      'pod system',
      'disposable vape',
      'nicotine',
      'vaping device',
      'coil',
      'tank',
      'mod',
    ];

    commonTerms.forEach((term) => {
      if (content.toLowerCase().includes(term.toLowerCase())) {
        keywords.push(term);
      }
    });

    return keywords;
  }

  /**
   * Generate complete HTML page with SEO elements and backlinks
   */
  private generateHTML(
    article: ShopifyArticle,
    seo: SyndicatedPage['seo'],
    canonical: string
  ): string {
    const content = this.injectBacklinks(article.contentHtml, article.content);
    const structuredData = this.generateStructuredData(article, canonical);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.escapeHtml(seo.title)}</title>
    <meta name="description" content="${this.escapeHtml(seo.description)}">
    <meta name="keywords" content="${this.escapeHtml(seo.keywords.join(', '))}">
    
    <!-- CRITICAL: Canonical URL to prevent duplicate content -->
    <link rel="canonical" href="${canonical}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${this.escapeHtml(seo.title)}">
    <meta property="og:description" content="${this.escapeHtml(seo.description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:type" content="article">
    ${article.image ? `<meta property="og:image" content="${article.image.url}">` : ''}
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${this.escapeHtml(seo.title)}">
    <meta name="twitter:description" content="${this.escapeHtml(seo.description)}">
    ${article.image ? `<meta name="twitter:image" content="${article.image.url}">` : ''}
    
    <!-- Structured Data -->
    <script type="application/ld+json">
${JSON.stringify(structuredData, null, 2)}
    </script>
    
    <!-- Robots -->
    <meta name="robots" content="index, follow">
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        header {
            border-bottom: 3px solid #6366f1;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .brand {
            font-size: 24px;
            font-weight: bold;
            color: #6366f1;
            text-decoration: none;
        }
        .attribution {
            background: #f3f4f6;
            padding: 15px;
            border-left: 4px solid #6366f1;
            margin: 20px 0;
            font-size: 14px;
        }
        .attribution a {
            color: #6366f1;
            font-weight: 600;
        }
        article h1 {
            font-size: 32px;
            margin-bottom: 10px;
            color: #111;
        }
        .meta {
            color: #666;
            font-size: 14px;
            margin-bottom: 30px;
        }
        article p {
            margin-bottom: 15px;
        }
        article a {
            color: #6366f1;
            text-decoration: underline;
        }
        article a:hover {
            color: #4f46e5;
        }
        article img {
            max-width: 100%;
            height: auto;
            margin: 20px 0;
        }
        footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        .age-warning {
            background: #fef3c7;
            border: 2px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <header>
        <a href="${this.config.mainSiteUrl}" class="brand">Vapourism</a>
    </header>
    
    <div class="attribution">
        📰 Originally published at <a href="${canonical}" rel="nofollow">Vapourism.co.uk</a>
    </div>
    
    <article>
        ${article.image ? `<img src="${article.image.url}" alt="${this.escapeHtml(article.image.altText || article.title)}" loading="lazy">` : ''}
        
        <h1>${this.escapeHtml(article.title)}</h1>
        
        <div class="meta">
            ${article.authorV2?.name ? `By ${this.escapeHtml(article.authorV2.name)} • ` : ''}
            ${new Date(article.publishedAt).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
        </div>
        
        ${content}
        
        <div class="age-warning">
            ⚠️ Age Verification Required: This content relates to products suitable only for adults aged 18 and over.
        </div>
    </article>
    
    <footer>
        <p>© ${new Date().getFullYear()} Vapourism. All rights reserved.</p>
        <p><a href="${this.config.mainSiteUrl}">Visit Vapourism.co.uk</a> for premium vaping products in the UK.</p>
    </footer>
</body>
</html>`;
  }

  /**
   * Inject strategic backlinks into content
   */
  private injectBacklinks(contentHtml: string, plainText: string): string {
    let modified = contentHtml;
    const linksToInject = this.selectBacklinks(plainText);

    // Inject each backlink at strategic positions
    linksToInject.forEach((link, index) => {
      // Find paragraphs to inject links into
      // Strategy: inject into 25%, 50%, 75% positions of content
      const position = (index + 1) / (linksToInject.length + 1);
      modified = this.injectLinkAtPosition(modified, link, position);
    });

    return modified;
  }

  /**
   * Select appropriate backlinks based on content
   */
  private selectBacklinks(
    content: string
  ): Array<{url: string; anchor: string}> {
    const links: Array<{url: string; anchor: string}> = [];
    const maxLinks = this.config.maxLinksPerArticle;

    // Analyze content and select relevant targets
    const selectedTargets = BACKLINK_TARGETS.filter((target) => {
      // Simple relevance check - can be enhanced with NLP
      const isRelevant = target.anchors.some((anchor) =>
        content.toLowerCase().includes(anchor.split(' ')[0].toLowerCase())
      );
      return isRelevant || Math.random() > 0.5; // Fallback to random selection
    }).slice(0, maxLinks);

    selectedTargets.forEach((target) => {
      // Pick random anchor text for natural variation
      const anchor =
        target.anchors[Math.floor(Math.random() * target.anchors.length)];
      links.push({
        url: `${this.config.mainSiteUrl}${target.url}`,
        anchor,
      });
    });

    return links;
  }

  /**
   * Inject a link at a specific position in the HTML content
   */
  private injectLinkAtPosition(
    html: string,
    link: {url: string; anchor: string},
    position: number
  ): string {
    // Find all <p> tags
    const paragraphs = html.match(/<p[^>]*>.*?<\/p>/gs) || [];
    if (paragraphs.length === 0) return html;

    // Calculate target paragraph index
    const targetIndex = Math.floor(paragraphs.length * position);
    if (targetIndex >= paragraphs.length) return html;

    const targetParagraph = paragraphs[targetIndex];

    // Create contextual sentence with the link
    const contextSentences = [
      `For more information, visit <a href="${link.url}" rel="nofollow">${link.anchor}</a>.`,
      `You can explore <a href="${link.url}" rel="nofollow">${link.anchor}</a> for additional options.`,
      `Check out <a href="${link.url}" rel="nofollow">${link.anchor}</a> to learn more.`,
      `Browse <a href="${link.url}" rel="nofollow">${link.anchor}</a> for related products.`,
    ];

    const sentence =
      contextSentences[Math.floor(Math.random() * contextSentences.length)];

    // Inject the sentence at the end of the paragraph
    const injected = targetParagraph.replace(/<\/p>$/, ` ${sentence}</p>`);

    return html.replace(targetParagraph, injected);
  }

  /**
   * Generate structured data for article
   */
  private generateStructuredData(
    article: ShopifyArticle,
    canonical: string
  ): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: article.title,
      description:
        article.seo?.description || article.excerpt || article.content.substring(0, 200),
      url: canonical,
      datePublished: article.publishedAt,
      dateModified: article.publishedAt,
      author: {
        '@type': 'Person',
        name: article.authorV2?.name || 'Vapourism',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Vapourism',
        url: this.config.mainSiteUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${this.config.mainSiteUrl}/logo.png`,
        },
      },
      ...(article.image && {
        image: {
          '@type': 'ImageObject',
          url: article.image.url,
          width: article.image.width,
          height: article.image.height,
        },
      }),
      keywords: article.tags.join(', '),
      articleSection: article.blog.title,
    };
  }

  /**
   * Escape HTML special characters
   */
  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (char) => map[char] || char);
  }

  /**
   * Generate a sitemap for syndicated content
   */
  generateSitemap(pages: SyndicatedPage[], baseUrl: string): string {
    const urls = pages
      .map(
        (page) => `  <url>
    <loc>${baseUrl}/${page.slug}.html</loc>
    <lastmod>${page.article.publishedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
      )
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  }

  /**
   * Generate robots.txt for syndicated site
   */
  generateRobotsTxt(sitemapUrl: string): string {
    return `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}

# Canonical source: https://www.vapourism.co.uk
`;
  }
}

/**
 * Helper function to create a syndicator instance
 */
export function createContentSyndicator(
  storefront: Storefront,
  config?: Partial<BacklinkConfig>
): ContentSyndicator {
  return new ContentSyndicator(storefront, config);
}
