/**
 * Shopify Blog Integration
 * 
 * Provides functions to fetch blog articles from Shopify Storefront API
 * with proper caching, pagination, and error handling.
 */

import type {Storefront} from '@shopify/hydrogen';
import {
  BLOG_QUERY,
  BLOG_ARTICLES_QUERY,
  ARTICLE_QUERY,
} from '~/preserved/fragments';

/**
 * Default blog handle to use when none is specified
 * This should match your Shopify blog handle
 */
export const DEFAULT_BLOG_HANDLE = 'news';

/**
 * Number of articles to fetch per page
 */
export const ARTICLES_PER_PAGE = 12;

/**
 * Article interface matching the GraphQL fragment
 */
export interface ShopifyArticle {
  id: string;
  title: string;
  handle: string;
  content: string;
  contentHtml: string;
  excerpt: string | null;
  excerptHtml: string | null;
  publishedAt: string;
  authorV2?: {
    name: string;
  } | null;
  image?: {
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
  seo?: {
    title?: string | null;
    description?: string | null;
  } | null;
  tags: string[];
  blog: {
    id: string;
    handle: string;
    title: string;
  };
}

/**
 * Pagination info for cursor-based pagination
 */
export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

/**
 * Response from articles query
 */
export interface ArticlesResponse {
  articles: ShopifyArticle[];
  pageInfo: PageInfo;
}

/**
 * Fetch blog metadata
 */
export async function getBlog(
  storefront: Storefront,
  blogHandle: string = DEFAULT_BLOG_HANDLE,
): Promise<{id: string; handle: string; title: string; seo?: {title?: string | null; description?: string | null} | null} | null> {
  try {
    const {blog} = await storefront.query(BLOG_QUERY, {
      variables: {blogHandle},
      cache: storefront.CacheLong(), // Cache blog metadata for longer
    });

    return blog;
  } catch (error) {
    console.error(`Error fetching blog ${blogHandle}:`, error);
    return null;
  }
}

/**
 * Fetch paginated articles from a blog
 */
export async function getBlogArticles(
  storefront: Storefront,
  options: {
    blogHandle?: string;
    first?: number;
    after?: string;
  } = {},
): Promise<ArticlesResponse> {
  const {
    blogHandle = DEFAULT_BLOG_HANDLE,
    first = ARTICLES_PER_PAGE,
    after,
  } = options;

  try {
    const {blog} = await storefront.query(BLOG_ARTICLES_QUERY, {
      variables: {
        blogHandle,
        first,
        after: after || null,
      },
      cache: storefront.CacheShort(), // Cache for shorter time (1 minute)
    });

    if (!blog || !blog.articles) {
      return {
        articles: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null,
        },
      };
    }

    const articles = blog.articles.edges.map(
      (edge: {node: ShopifyArticle}) => edge.node,
    );

    return {
      articles,
      pageInfo: blog.articles.pageInfo,
    };
  } catch (error) {
    console.error(`Error fetching articles from blog ${blogHandle}:`, error);
    return {
      articles: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
    };
  }
}

/**
 * Fetch a single article by handle
 */
export async function getArticle(
  storefront: Storefront,
  articleHandle: string,
  blogHandle: string = DEFAULT_BLOG_HANDLE,
): Promise<ShopifyArticle | null> {
  try {
    const {blog} = await storefront.query(ARTICLE_QUERY, {
      variables: {
        blogHandle,
        articleHandle,
      },
      cache: storefront.CacheShort(), // Cache for 1 minute
    });

    if (!blog || !blog.articleByHandle) {
      return null;
    }

    return blog.articleByHandle;
  } catch (error) {
    console.error(
      `Error fetching article ${articleHandle} from blog ${blogHandle}:`,
      error,
    );
    return null;
  }
}

/**
 * Convert a Shopify article to match the legacy BlogArticle interface
 * This helps with backward compatibility during migration
 */
export function convertShopifyArticleToLegacy(
  article: ShopifyArticle,
): {
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
} {
  return {
    slug: article.handle,
    title: article.title,
    metaDescription:
      article.seo?.description ||
      article.excerpt ||
      article.content.substring(0, 155),
    metaKeywords: article.tags.join(', '),
    publishedDate: article.publishedAt,
    lastModified: article.publishedAt, // Shopify doesn't expose lastModified in Storefront API
    author: article.authorV2?.name || 'Vapourism',
    category: article.blog.title || 'Blog',
    tags: article.tags,
    content: article.content,
    featuredImage: article.image?.url,
  };
}

/**
 * Generate a meta description from article content if not provided
 * 
 * SECURITY NOTE: This function generates meta descriptions from Shopify article content.
 * The content source is TRUSTED (Shopify CMS, admin-controlled) and the output is used
 * ONLY in HTML meta tags, which are automatically escaped by React/Remix.
 * 
 * We use plain text fields when available to avoid any HTML processing:
 * 1. article.seo.description - Shopify's pre-processed SEO field (plain text)
 * 2. article.excerpt - May contain HTML, but we use it only for meta tags
 * 3. article.content - Last fallback, plain text version
 * 
 * Shopify's Storefront API provides both 'content' (plain text) and 'contentHtml' (HTML).
 * We use the plain text 'content' field here, which contains no HTML tags.
 * Therefore, no HTML sanitization is needed - the field is inherently safe.
 */
export function generateMetaDescription(article: ShopifyArticle): string {
  // Priority 1: Use Shopify's SEO description (pre-processed by Shopify)
  if (article.seo?.description) {
    return article.seo.description;
  }

  // Priority 2: Use excerpt - this may contain HTML in some cases
  // but is used only in meta tags which are auto-escaped by React
  if (article.excerpt) {
    // Truncate if needed
    if (article.excerpt.length > 155) {
      return article.excerpt.substring(0, 152) + '...';
    }
    return article.excerpt;
  }

  // Priority 3: Use content field (plain text from Shopify, no HTML)
  // Shopify provides 'content' as plain text and 'contentHtml' as HTML
  const maxLength = 155;
  if (article.content.length > maxLength) {
    return article.content.substring(0, maxLength - 3) + '...';
  }
  return article.content;
}

/**
 * Generate a category from blog title or tags
 */
export function getCategoryFromArticle(article: ShopifyArticle): string {
  // First try to extract from tags
  const categoryTags = ['Education', 'Reviews', 'Guides', 'News'];
  for (const tag of article.tags) {
    const matchedCategory = categoryTags.find(
      (cat) => tag.toLowerCase().includes(cat.toLowerCase()),
    );
    if (matchedCategory) {
      return matchedCategory;
    }
  }

  // Fallback to blog title
  return article.blog.title || 'Blog';
}
