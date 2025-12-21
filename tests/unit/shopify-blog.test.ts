import {describe, it, expect} from 'vitest';
import {
  generateMetaDescription,
  getCategoryFromArticle,
  convertShopifyArticleToLegacy,
  DEFAULT_BLOG_HANDLE,
  ARTICLES_PER_PAGE,
  type ShopifyArticle,
} from '~/lib/shopify-blog';

describe('Shopify Blog Integration', () => {
  describe('Constants', () => {
    it('should have a default blog handle', () => {
      expect(DEFAULT_BLOG_HANDLE).toBe('news');
    });

    it('should have a default articles per page value', () => {
      expect(ARTICLES_PER_PAGE).toBe(12);
    });
  });

  describe('generateMetaDescription', () => {
    it('should return SEO description if available', () => {
      const article: ShopifyArticle = {
        id: '1',
        title: 'Test Article',
        handle: 'test-article',
        content: 'This is the content of the article',
        contentHtml: '<p>This is the content of the article</p>',
        excerpt: 'This is the excerpt',
        excerptHtml: '<p>This is the excerpt</p>',
        publishedAt: '2024-01-01',
        seo: {
          title: 'Test SEO Title',
          description: 'This is the SEO description',
        },
        tags: [],
        blog: {
          id: '1',
          handle: 'news',
          title: 'News',
        },
      };

      const description = generateMetaDescription(article);
      expect(description).toBe('This is the SEO description');
    });

    it('should fallback to excerpt if SEO description not available', () => {
      const article: ShopifyArticle = {
        id: '1',
        title: 'Test Article',
        handle: 'test-article',
        content: 'This is the content of the article',
        contentHtml: '<p>This is the content of the article</p>',
        excerpt: 'This is a plain text excerpt without HTML',
        excerptHtml: '<p>This is a plain text excerpt without HTML</p>',
        publishedAt: '2024-01-01',
        seo: null,
        tags: [],
        blog: {
          id: '1',
          handle: 'news',
          title: 'News',
        },
      };

      const description = generateMetaDescription(article);
      expect(description).toBe('This is a plain text excerpt without HTML');
    });

    it('should truncate long excerpts to 155 characters', () => {
      const longExcerpt = 'A'.repeat(200);
      const article: ShopifyArticle = {
        id: '1',
        title: 'Test Article',
        handle: 'test-article',
        content: longExcerpt,
        contentHtml: `<p>${longExcerpt}</p>`,
        excerpt: longExcerpt,
        excerptHtml: `<p>${longExcerpt}</p>`,
        publishedAt: '2024-01-01',
        seo: null,
        tags: [],
        blog: {
          id: '1',
          handle: 'news',
          title: 'News',
        },
      };

      const description = generateMetaDescription(article);
      expect(description.length).toBeLessThanOrEqual(155);
      expect(description.endsWith('...')).toBe(true);
    });

    it('should use plain text excerpt from Shopify', () => {
      const article: ShopifyArticle = {
        id: '1',
        title: 'Test Article',
        handle: 'test-article',
        content: 'Content',
        contentHtml: '<p>Content</p>',
        excerpt: 'Bold and italic text', // Shopify provides plain text in excerpt field
        excerptHtml: '<p><strong>Bold</strong> and <em>italic</em> text</p>',
        publishedAt: '2024-01-01',
        seo: null,
        tags: [],
        blog: {
          id: '1',
          handle: 'news',
          title: 'News',
        },
      };

      const description = generateMetaDescription(article);
      expect(description).toBe('Bold and italic text');
    });

    it('should fallback to content if no excerpt', () => {
      const article: ShopifyArticle = {
        id: '1',
        title: 'Test Article',
        handle: 'test-article',
        content: 'This is the plain content of the article',
        contentHtml: '<p>This is the plain content of the article</p>',
        excerpt: null,
        excerptHtml: null,
        publishedAt: '2024-01-01',
        seo: null,
        tags: [],
        blog: {
          id: '1',
          handle: 'news',
          title: 'News',
        },
      };

      const description = generateMetaDescription(article);
      expect(description).toBe('This is the plain content of the article');
    });
  });

  describe('getCategoryFromArticle', () => {
    it('should extract category from Education tag', () => {
      const article: ShopifyArticle = {
        id: '1',
        title: 'Test Article',
        handle: 'test-article',
        content: 'Content',
        contentHtml: '<p>Content</p>',
        excerpt: 'Excerpt',
        excerptHtml: '<p>Excerpt</p>',
        publishedAt: '2024-01-01',
        tags: ['education', 'vaping'],
        blog: {
          id: '1',
          handle: 'news',
          title: 'News',
        },
      };

      const category = getCategoryFromArticle(article);
      expect(category).toBe('Education');
    });

    it('should extract category from Reviews tag', () => {
      const article: ShopifyArticle = {
        id: '1',
        title: 'Test Article',
        handle: 'test-article',
        content: 'Content',
        contentHtml: '<p>Content</p>',
        excerpt: 'Excerpt',
        excerptHtml: '<p>Excerpt</p>',
        publishedAt: '2024-01-01',
        tags: ['product-reviews', 'vaping'],
        blog: {
          id: '1',
          handle: 'news',
          title: 'News',
        },
      };

      const category = getCategoryFromArticle(article);
      expect(category).toBe('Reviews');
    });

    it('should extract category from Guides tag', () => {
      const article: ShopifyArticle = {
        id: '1',
        title: 'Test Article',
        handle: 'test-article',
        content: 'Content',
        contentHtml: '<p>Content</p>',
        excerpt: 'Excerpt',
        excerptHtml: '<p>Excerpt</p>',
        publishedAt: '2024-01-01',
        tags: ['buying-guides', 'vaping'],
        blog: {
          id: '1',
          handle: 'news',
          title: 'News',
        },
      };

      const category = getCategoryFromArticle(article);
      expect(category).toBe('Guides');
    });

    it('should extract category from News tag', () => {
      const article: ShopifyArticle = {
        id: '1',
        title: 'Test Article',
        handle: 'test-article',
        content: 'Content',
        contentHtml: '<p>Content</p>',
        excerpt: 'Excerpt',
        excerptHtml: '<p>Excerpt</p>',
        publishedAt: '2024-01-01',
        tags: ['industry-news', 'vaping'],
        blog: {
          id: '1',
          handle: 'news',
          title: 'News',
        },
      };

      const category = getCategoryFromArticle(article);
      expect(category).toBe('News');
    });

    it('should fallback to blog title if no category tag found', () => {
      const article: ShopifyArticle = {
        id: '1',
        title: 'Test Article',
        handle: 'test-article',
        content: 'Content',
        contentHtml: '<p>Content</p>',
        excerpt: 'Excerpt',
        excerptHtml: '<p>Excerpt</p>',
        publishedAt: '2024-01-01',
        tags: ['vaping', 'nicotine'],
        blog: {
          id: '1',
          handle: 'news',
          title: 'News Blog',
        },
      };

      const category = getCategoryFromArticle(article);
      expect(category).toBe('News Blog');
    });

    it('should return Blog if no category tag and no blog title', () => {
      const article: ShopifyArticle = {
        id: '1',
        title: 'Test Article',
        handle: 'test-article',
        content: 'Content',
        contentHtml: '<p>Content</p>',
        excerpt: 'Excerpt',
        excerptHtml: '<p>Excerpt</p>',
        publishedAt: '2024-01-01',
        tags: ['vaping'],
        blog: {
          id: '1',
          handle: 'news',
          title: '',
        },
      };

      const category = getCategoryFromArticle(article);
      expect(category).toBe('Blog');
    });

    it('should be case insensitive when matching tags', () => {
      const article: ShopifyArticle = {
        id: '1',
        title: 'Test Article',
        handle: 'test-article',
        content: 'Content',
        contentHtml: '<p>Content</p>',
        excerpt: 'Excerpt',
        excerptHtml: '<p>Excerpt</p>',
        publishedAt: '2024-01-01',
        tags: ['EDUCATION', 'VAPING'],
        blog: {
          id: '1',
          handle: 'news',
          title: 'News',
        },
      };

      const category = getCategoryFromArticle(article);
      expect(category).toBe('Education');
    });
  });

  describe('convertShopifyArticleToLegacy', () => {
    it('should convert Shopify article to legacy format', () => {
      const shopifyArticle: ShopifyArticle = {
        id: '1',
        title: 'Test Article Title',
        handle: 'test-article',
        content: 'This is the plain content',
        contentHtml: '<p>This is the plain content</p>',
        excerpt: 'This is the excerpt',
        excerptHtml: '<p>This is the excerpt</p>',
        publishedAt: '2024-01-15',
        authorV2: {
          name: 'John Doe',
        },
        image: {
          url: 'https://example.com/image.jpg',
          altText: 'Test image',
        },
        seo: {
          title: 'SEO Title',
          description: 'SEO description',
        },
        tags: ['vaping', 'education'],
        blog: {
          id: '1',
          handle: 'news',
          title: 'News Blog',
        },
      };

      const legacyArticle = convertShopifyArticleToLegacy(shopifyArticle);

      expect(legacyArticle.slug).toBe('test-article');
      expect(legacyArticle.title).toBe('Test Article Title');
      expect(legacyArticle.metaDescription).toBe('SEO description');
      expect(legacyArticle.metaKeywords).toBe('vaping, education');
      expect(legacyArticle.publishedDate).toBe('2024-01-15');
      expect(legacyArticle.lastModified).toBe('2024-01-15');
      expect(legacyArticle.author).toBe('John Doe');
      expect(legacyArticle.category).toBe('News Blog');
      expect(legacyArticle.tags).toEqual(['vaping', 'education']);
      expect(legacyArticle.content).toBe('This is the plain content');
      expect(legacyArticle.featuredImage).toBe('https://example.com/image.jpg');
    });

    it('should handle missing optional fields', () => {
      const shopifyArticle: ShopifyArticle = {
        id: '1',
        title: 'Test Article',
        handle: 'test-article',
        content: 'Content',
        contentHtml: '<p>Content</p>',
        excerpt: null,
        excerptHtml: null,
        publishedAt: '2024-01-15',
        authorV2: null,
        image: null,
        seo: null,
        tags: [],
        blog: {
          id: '1',
          handle: 'news',
          title: '',
        },
      };

      const legacyArticle = convertShopifyArticleToLegacy(shopifyArticle);

      expect(legacyArticle.author).toBe('Vapourism');
      expect(legacyArticle.category).toBe('Blog');
      expect(legacyArticle.featuredImage).toBeUndefined();
    });

    it('should use content substring if no excerpt or SEO description', () => {
      const longContent = 'A'.repeat(200);
      const shopifyArticle: ShopifyArticle = {
        id: '1',
        title: 'Test Article',
        handle: 'test-article',
        content: longContent,
        contentHtml: `<p>${longContent}</p>`,
        excerpt: null,
        excerptHtml: null,
        publishedAt: '2024-01-15',
        seo: null,
        tags: [],
        blog: {
          id: '1',
          handle: 'news',
          title: 'News',
        },
      };

      const legacyArticle = convertShopifyArticleToLegacy(shopifyArticle);

      expect(legacyArticle.metaDescription.length).toBeLessThanOrEqual(155);
    });
  });
});
