/**
 * WordPress REST API Client for Vapourism Blog
 * 
 * This module provides a client for fetching blog content from a WordPress
 * installation via the REST API. Content is served seamlessly on the Vapourism
 * domain - users never see or interact with WordPress directly.
 * 
 * Benefits over static TypeScript files:
 * - Easy content publishing (WYSIWYG editor)
 * - No code deployments for new content
 * - Content automation support (scheduling, drafts)
 * - Non-technical users can manage content
 * 
 * Architecture:
 * - WordPress runs on a subdomain (e.g., blog-admin.vapourism.co.uk)
 * - Content is fetched server-side via REST API
 * - Routes display content on main domain (/blog)
 * - Images are proxied or served from WordPress media library
 */

import type {BlogArticle} from '~/data/blog';

/**
 * WordPress configuration
 * In production, set WORDPRESS_API_URL environment variable
 */
export interface WordPressConfig {
  /** WordPress REST API base URL (e.g., https://blog-admin.vapourism.co.uk/wp-json/wp/v2) */
  apiUrl: string;
  /** Optional authentication for private/draft posts */
  authToken?: string;
  /** Cache TTL in seconds (default: 300 = 5 minutes) */
  cacheTtl?: number;
  /** Enable draft preview mode */
  previewMode?: boolean;
}

/**
 * WordPress Post response from REST API
 */
export interface WordPressPost {
  id: number;
  slug: string;
  title: {rendered: string};
  content: {rendered: string};
  excerpt: {rendered: string};
  date: string;
  modified: string;
  status: 'publish' | 'draft' | 'pending' | 'private';
  featured_media: number;
  categories: number[];
  tags: number[];
  author: number;
  _embedded?: {
    author?: Array<{name: string; slug: string}>;
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
      media_details?: {
        sizes?: {
          medium?: {source_url: string};
          large?: {source_url: string};
          full?: {source_url: string};
        };
      };
    }>;
    'wp:term'?: Array<Array<{id: number; name: string; slug: string}>>;
  };
  // Custom fields from ACF or meta
  meta?: {
    meta_description?: string;
    meta_keywords?: string;
    [key: string]: unknown;
  };
  yoast_head_json?: {
    title?: string;
    description?: string;
    og_title?: string;
    og_description?: string;
  };
}

/**
 * WordPress Category
 */
export interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
  description: string;
}

/**
 * WordPress Tag
 */
export interface WordPressTag {
  id: number;
  name: string;
  slug: string;
  count: number;
}

/**
 * Simple in-memory cache for WordPress API responses
 * In production, consider using Cloudflare KV or similar
 */
const cache = new Map<string, {data: unknown; expires: number}>();

/**
 * WordPress REST API Client
 */
export class WordPressClient {
  private config: Required<WordPressConfig>;

  constructor(config: WordPressConfig) {
    this.config = {
      apiUrl: config.apiUrl.replace(/\/$/, ''), // Remove trailing slash
      authToken: config.authToken ?? '',
      cacheTtl: config.cacheTtl ?? 300,
      previewMode: config.previewMode ?? false,
    };
  }

  /**
   * Make authenticated request to WordPress API
   */
  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const cacheKey = `${this.config.apiUrl}${endpoint}`;
    
    // Check cache first (unless in preview mode)
    if (!this.config.previewMode) {
      const cached = cache.get(cacheKey);
      if (cached && cached.expires > Date.now()) {
        return cached.data as T;
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Merge in any custom headers
    if (options.headers) {
      const customHeaders = options.headers;
      if (customHeaders instanceof Headers) {
        customHeaders.forEach((value, key) => {
          headers[key] = value;
        });
      } else if (Array.isArray(customHeaders)) {
        customHeaders.forEach(([key, value]) => {
          headers[key] = value;
        });
      } else {
        Object.assign(headers, customHeaders);
      }
    }

    // Add authentication if provided
    if (this.config.authToken) {
      headers['Authorization'] = `Bearer ${this.config.authToken}`;
    }

    const response = await fetch(`${this.config.apiUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(
        `WordPress API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();

    // Cache the response
    cache.set(cacheKey, {
      data,
      expires: Date.now() + this.config.cacheTtl * 1000,
    });

    return data as T;
  }

  /**
   * Get all published blog posts
   */
  async getPosts(options?: {
    page?: number;
    perPage?: number;
    category?: number;
    tag?: number;
    search?: string;
  }): Promise<{posts: WordPressPost[]; total: number; totalPages: number}> {
    const params = new URLSearchParams();
    params.set('_embed', 'true'); // Include embedded data (author, media, terms)
    params.set('status', this.config.previewMode ? 'any' : 'publish');
    params.set('per_page', String(options?.perPage ?? 10));
    params.set('page', String(options?.page ?? 1));
    params.set('orderby', 'date');
    params.set('order', 'desc');

    if (options?.category) {
      params.set('categories', String(options.category));
    }
    if (options?.tag) {
      params.set('tags', String(options.tag));
    }
    if (options?.search) {
      params.set('search', options.search);
    }

    // For this POC, we'll make the request and parse headers
    const cacheKey = `${this.config.apiUrl}/posts?${params.toString()}`;
    
    if (!this.config.previewMode) {
      const cached = cache.get(cacheKey);
      if (cached && cached.expires > Date.now()) {
        return cached.data as {posts: WordPressPost[]; total: number; totalPages: number};
      }
    }

    const headers: HeadersInit = {'Content-Type': 'application/json'};
    if (this.config.authToken) {
      headers['Authorization'] = `Bearer ${this.config.authToken}`;
    }

    const response = await fetch(
      `${this.config.apiUrl}/posts?${params.toString()}`,
      {headers},
    );

    if (!response.ok) {
      throw new Error(
        `WordPress API error: ${response.status} ${response.statusText}`,
      );
    }

    const posts = (await response.json()) as WordPressPost[];
    const total = parseInt(response.headers.get('X-WP-Total') ?? '0', 10);
    const totalPages = parseInt(
      response.headers.get('X-WP-TotalPages') ?? '0',
      10,
    );

    const result = {posts, total, totalPages};
    
    cache.set(cacheKey, {
      data: result,
      expires: Date.now() + this.config.cacheTtl * 1000,
    });

    return result;
  }

  /**
   * Get single post by slug
   */
  async getPostBySlug(slug: string): Promise<WordPressPost | null> {
    const params = new URLSearchParams();
    params.set('_embed', 'true');
    params.set('slug', slug);
    params.set('status', this.config.previewMode ? 'any' : 'publish');

    const posts = await this.fetch<WordPressPost[]>(
      `/posts?${params.toString()}`,
    );
    
    return posts.length > 0 ? posts[0] : null;
  }

  /**
   * Get single post by ID (for preview)
   */
  async getPostById(id: number): Promise<WordPressPost | null> {
    try {
      const params = new URLSearchParams();
      params.set('_embed', 'true');

      return await this.fetch<WordPressPost>(`/posts/${id}?${params.toString()}`);
    } catch {
      return null;
    }
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<WordPressCategory[]> {
    const params = new URLSearchParams();
    params.set('per_page', '100');
    params.set('hide_empty', 'true');

    return this.fetch<WordPressCategory[]>(`/categories?${params.toString()}`);
  }

  /**
   * Get all tags
   */
  async getTags(): Promise<WordPressTag[]> {
    const params = new URLSearchParams();
    params.set('per_page', '100');
    params.set('hide_empty', 'true');

    return this.fetch<WordPressTag[]>(`/tags?${params.toString()}`);
  }

  /**
   * Clear the in-memory cache
   */
  clearCache(): void {
    cache.clear();
  }
}

/**
 * Transform WordPress post to BlogArticle format
 * This ensures compatibility with existing blog components
 */
export function transformWordPressPost(post: WordPressPost): BlogArticle {
  // Extract author name from embedded data
  const authorName =
    post._embedded?.author?.[0]?.name ?? 'Vapourism Team';

  // Extract featured image URL
  const featuredImage =
    post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? undefined;

  // Extract categories and tags from embedded data
  const categories = post._embedded?.['wp:term']?.[0] ?? [];
  const tags = post._embedded?.['wp:term']?.[1] ?? [];

  // Get category name (use first category or default)
  const category = categories.length > 0 ? categories[0].name : 'Blog';

  // Get tag names
  const tagNames = tags.map((t) => t.name);

  // Get meta description from Yoast SEO or excerpt
  const metaDescription =
    post.yoast_head_json?.description ??
    post.meta?.meta_description ??
    stripHtml(post.excerpt.rendered).slice(0, 160);

  // Get meta keywords
  const metaKeywords =
    post.meta?.meta_keywords ?? tagNames.join(', ');

  // Transform HTML content to a simpler format
  // Note: WordPress content is HTML, not markdown like static articles
  // We'll keep it as HTML since the component can handle both
  const content = post.content.rendered;

  return {
    slug: post.slug,
    title: decodeHtmlEntities(post.title.rendered),
    metaDescription,
    metaKeywords,
    publishedDate: post.date.split('T')[0],
    lastModified: post.modified.split('T')[0],
    author: authorName,
    category,
    tags: tagNames,
    content,
    featuredImage,
  };
}

/**
 * Strip HTML tags from string for text extraction (meta descriptions, etc.)
 * 
 * ⚠️ SECURITY NOTE - READ CAREFULLY:
 * This function is for TEXT EXTRACTION ONLY from trusted WordPress CMS content.
 * It extracts plain text for meta descriptions - the output is NEVER rendered as HTML.
 * 
 * DO NOT use this for:
 * - Sanitizing untrusted user input
 * - Preparing content for HTML rendering
 * - Any security-sensitive context
 * 
 * For HTML sanitization, use DOMPurify or a similar library on the client side.
 * 
 * CodeQL flags this function because regex-based HTML handling has edge cases.
 * These alerts are acceptable here because:
 * 1. Input is from trusted WordPress CMS (authenticated editors only)
 * 2. Output is used for meta descriptions (text context, not HTML)
 * 3. We're extracting text, not sanitizing for HTML rendering
 * 
 * @param html - HTML string from trusted WordPress content
 * @returns Plain text suitable for meta descriptions
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  
  let text = html;
  
  // Remove script tags and their content - regex is sufficient for text extraction
  // from trusted WordPress content where scripts shouldn't exist anyway
  // lgtm[js/incomplete-multi-character-sanitization]
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove style tags and their content
  // lgtm[js/incomplete-multi-character-sanitization]  
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Remove HTML comments (loop to handle nested comments)
  let prevText;
  do {
    prevText = text;
    text = text.replace(/<!--[\s\S]*?-->/g, '');
  } while (text !== prevText);
  
  // Remove all remaining HTML tags
  // lgtm[js/incomplete-multi-character-sanitization]
  text = text.replace(/<[^>]*>/g, '');
  
  // Normalize whitespace and trim
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Decode HTML entities (e.g., &amp; -> &)
 */
export function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&apos;': "'",
    '&#8217;': "'",
    '&#8216;': "'",
    '&#8220;': '"',
    '&#8221;': '"',
    '&#8211;': '–',
    '&#8212;': '—',
    '&nbsp;': ' ',
  };

  return Object.entries(entities).reduce(
    (str, [entity, char]) => str.replace(new RegExp(entity, 'g'), char),
    text,
  );
}

/**
 * Create WordPress client from environment variables
 */
export function createWordPressClient(env: Env): WordPressClient | null {
  const apiUrl = env.WORDPRESS_API_URL;
  
  if (!apiUrl) {
    return null;
  }

  // Parse and validate cache TTL
  let cacheTtl = 300; // Default 5 minutes
  if (env.WORDPRESS_CACHE_TTL) {
    const parsed = parseInt(env.WORDPRESS_CACHE_TTL, 10);
    if (!isNaN(parsed) && parsed > 0) {
      cacheTtl = parsed;
    }
  }

  return new WordPressClient({
    apiUrl,
    authToken: env.WORDPRESS_AUTH_TOKEN,
    cacheTtl,
    previewMode: env.WORDPRESS_PREVIEW_MODE === 'true',
  });
}

/**
 * Check if WordPress integration is enabled
 */
export function isWordPressEnabled(env: Env): boolean {
  return env.WORDPRESS_ENABLED === 'true' && Boolean(env.WORDPRESS_API_URL);
}
