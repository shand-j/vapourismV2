/**
 * Blog Articles Index
 * 
 * Central registry for all blog articles.
 * Import and export all articles here for easy management.
 */

/**
 * Blog Article interface
 */
export interface BlogArticle {
  slug: string;
  title: string;
  metaDescription: string;
  metaKeywords?: string;
  publishedDate: string;
  lastModified: string;
  author: string;
  category: string;
  tags: string[];
  content: string;
  featuredImage?: string;
  /**
   * Optional inline images to display within the article body.
   * 
   * To display an image in the article content, add a marker with the format
   * `{{image:id}}` on its own line in the content string, where `id` matches
   * an image's `id` property in this array.
   * 
   * If the marker references an ID that doesn't exist in this array, the marker
   * is silently ignored (a warning is logged in development mode).
   * 
   * @example
   * ```typescript
   * // In the article definition:
   * inlineImages: [
   *   {
   *     id: 'product-comparison',
   *     src: '/images/blog/product-comparison.jpg',
   *     alt: 'Comparison of vape devices',
   *     caption: 'Side-by-side comparison of popular devices',
   *   },
   * ],
   * content: `
   * ## Product Comparison
   * 
   * Here's how the devices compare:
   * 
   * {{image:product-comparison}}
   * 
   * As you can see from the image above...
   * `,
   * ```
   */
  inlineImages?: {
    /** Unique identifier to reference in content via {{image:id}} marker */
    id: string;
    /** Image URL (use local paths like /images/blog/... for production) */
    src: string;
    /** Alt text for accessibility */
    alt: string;
    /** Optional caption displayed below the image */
    caption?: string;
  }[];
}

import {nicotinePouchesArticle} from './nicotine-pouches-risks-and-benefits';
import {bestVapes2025Article} from './best-vapes-2025';
import {howMuchNicotineArticle} from './how-much-nicotine-in-vape';
import {crystalBarGuideArticle} from './crystal-bar-vape-guide';
import {bestRefillableVapeArticle} from './best-refillable-vape-uk';

/**
 * All blog articles available on the site
 */
export const allArticles: BlogArticle[] = [
  bestRefillableVapeArticle, // Newest first
  crystalBarGuideArticle,
  howMuchNicotineArticle,
  bestVapes2025Article,
  nicotinePouchesArticle,
];

/**
 * Get article by slug
 */
export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return allArticles.find(article => article.slug === slug);
}

/**
 * Get all articles sorted by published date (newest first)
 */
export function getAllArticles(): BlogArticle[] {
  return [...allArticles].sort((a, b) => {
    return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
  });
}

/**
 * Get articles by category
 */
export function getArticlesByCategory(category: string): BlogArticle[] {
  return allArticles.filter(article => article.category === category);
}

/**
 * Get articles by tag
 */
export function getArticlesByTag(tag: string): BlogArticle[] {
  return allArticles.filter(article => article.tags.includes(tag));
}
