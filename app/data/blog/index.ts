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
  /** Optional inline images to display within the article body */
  inlineImages?: {
    /** Unique identifier to reference in content, e.g., "section-1" */
    id: string;
    /** Image URL */
    src: string;
    /** Alt text for accessibility */
    alt: string;
    /** Optional caption */
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
