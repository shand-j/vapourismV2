import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {
  WordPressClient,
  transformWordPressPost,
  stripHtml,
  decodeHtmlEntities,
  createWordPressClient,
  isWordPressEnabled,
  type WordPressPost,
  type WordPressConfig,
} from '~/lib/wordpress-client';

describe('WordPress Client', () => {
  describe('WordPressClient', () => {
    let client: WordPressClient;
    const mockConfig: WordPressConfig = {
      apiUrl: 'https://blog-admin.example.com/wp-json/wp/v2',
      cacheTtl: 60,
    };

    beforeEach(() => {
      client = new WordPressClient(mockConfig);
      vi.clearAllMocks();
    });

    afterEach(() => {
      client.clearCache();
    });

    it('should create client with config', () => {
      expect(client).toBeInstanceOf(WordPressClient);
    });

    it('should normalize API URL by removing trailing slash', () => {
      const clientWithSlash = new WordPressClient({
        ...mockConfig,
        apiUrl: 'https://blog-admin.example.com/wp-json/wp/v2/',
      });
      // The client should work the same regardless of trailing slash
      expect(clientWithSlash).toBeInstanceOf(WordPressClient);
    });
  });

  describe('transformWordPressPost', () => {
    const mockPost: WordPressPost = {
      id: 123,
      slug: 'test-article',
      title: {rendered: 'Test Article Title'},
      content: {rendered: '<p>This is the article content.</p>'},
      excerpt: {rendered: '<p>This is the excerpt.</p>'},
      date: '2024-12-15T10:30:00',
      modified: '2024-12-16T14:00:00',
      status: 'publish',
      featured_media: 456,
      categories: [1],
      tags: [2, 3],
      author: 1,
      _embedded: {
        author: [{name: 'John Doe', slug: 'john-doe'}],
        'wp:featuredmedia': [
          {
            source_url: 'https://example.com/image.jpg',
            alt_text: 'Test image',
          },
        ],
        'wp:term': [
          [{id: 1, name: 'Education', slug: 'education'}],
          [
            {id: 2, name: 'Vaping', slug: 'vaping'},
            {id: 3, name: 'Health', slug: 'health'},
          ],
        ],
      },
    };

    it('should transform post to BlogArticle format', () => {
      const article = transformWordPressPost(mockPost);

      expect(article.slug).toBe('test-article');
      expect(article.title).toBe('Test Article Title');
      expect(article.author).toBe('John Doe');
      expect(article.category).toBe('Education');
      expect(article.tags).toEqual(['Vaping', 'Health']);
      expect(article.featuredImage).toBe('https://example.com/image.jpg');
      expect(article.publishedDate).toBe('2024-12-15');
      expect(article.lastModified).toBe('2024-12-16');
    });

    it('should handle missing embedded data gracefully', () => {
      const postWithoutEmbedded: WordPressPost = {
        ...mockPost,
        _embedded: undefined,
      };

      const article = transformWordPressPost(postWithoutEmbedded);

      expect(article.author).toBe('Vapourism Team');
      expect(article.category).toBe('Blog');
      expect(article.tags).toEqual([]);
      expect(article.featuredImage).toBeUndefined();
    });

    it('should use Yoast meta description when available', () => {
      const postWithYoast: WordPressPost = {
        ...mockPost,
        yoast_head_json: {
          description: 'Yoast SEO description',
        },
      };

      const article = transformWordPressPost(postWithYoast);

      expect(article.metaDescription).toBe('Yoast SEO description');
    });

    it('should fallback to excerpt for meta description', () => {
      const article = transformWordPressPost(mockPost);

      // Should strip HTML and use excerpt
      expect(article.metaDescription).toBe('This is the excerpt.');
    });

    it('should decode HTML entities in title', () => {
      const postWithEntities: WordPressPost = {
        ...mockPost,
        title: {rendered: 'Test &amp; Article&#8217;s Title'},
      };

      const article = transformWordPressPost(postWithEntities);

      expect(article.title).toBe("Test & Article's Title");
    });
  });

  describe('stripHtml', () => {
    it('should strip HTML tags', () => {
      expect(stripHtml('<p>Hello <strong>World</strong></p>')).toBe('Hello World');
    });

    it('should handle empty string', () => {
      expect(stripHtml('')).toBe('');
    });

    it('should trim whitespace', () => {
      expect(stripHtml('  <p>Hello</p>  ')).toBe('Hello');
    });

    it('should handle nested tags', () => {
      expect(stripHtml('<div><p><span>Nested</span></p></div>')).toBe('Nested');
    });
    
    it('should handle HTML comments', () => {
      expect(stripHtml('<!-- comment --><p>Hello</p>')).toBe('Hello');
    });
    
    it('should normalize whitespace', () => {
      expect(stripHtml('<p>Hello</p>   <p>World</p>')).toBe('Hello World');
    });
    
    it('should remove script tags and content', () => {
      expect(stripHtml('<p>Hello</p><script>alert("xss")</script><p>World</p>')).toBe('HelloWorld');
      expect(stripHtml('<p>Hello </p><script>alert("xss")</script><p> World</p>')).toBe('Hello World');
    });
    
    it('should remove style tags and content', () => {
      expect(stripHtml('<style>.foo { color: red; }</style><p>Hello</p>')).toBe('Hello');
    });
    
    it('should handle null/undefined safely', () => {
      expect(stripHtml(null as unknown as string)).toBe('');
      expect(stripHtml(undefined as unknown as string)).toBe('');
    });
  });

  describe('decodeHtmlEntities', () => {
    it('should decode &amp;', () => {
      expect(decodeHtmlEntities('Tom &amp; Jerry')).toBe('Tom & Jerry');
    });

    it('should decode &lt; and &gt;', () => {
      expect(decodeHtmlEntities('&lt;div&gt;')).toBe('<div>');
    });

    it('should decode &quot;', () => {
      expect(decodeHtmlEntities('&quot;Hello&quot;')).toBe('"Hello"');
    });

    it('should decode smart quotes', () => {
      expect(decodeHtmlEntities('&#8220;Hello&#8221;')).toBe('"Hello"');
    });

    it('should decode apostrophes', () => {
      expect(decodeHtmlEntities("it&#8217;s")).toBe("it's");
    });

    it('should decode dashes', () => {
      expect(decodeHtmlEntities('word&#8211;word&#8212;word')).toBe('word–word—word');
    });

    it('should handle multiple entities', () => {
      expect(decodeHtmlEntities('&amp; &lt; &gt; &quot;')).toBe('& < > "');
    });
  });

  describe('createWordPressClient', () => {
    it('should return null when API URL is not set', () => {
      const env = {} as Env;
      const client = createWordPressClient(env);

      expect(client).toBeNull();
    });

    it('should return client when API URL is set', () => {
      const env = {
        WORDPRESS_API_URL: 'https://blog-admin.example.com/wp-json/wp/v2',
      } as Env;
      const client = createWordPressClient(env);

      expect(client).toBeInstanceOf(WordPressClient);
    });

    it('should use auth token when provided', () => {
      const env = {
        WORDPRESS_API_URL: 'https://blog-admin.example.com/wp-json/wp/v2',
        WORDPRESS_AUTH_TOKEN: 'test-token',
      } as Env;
      const client = createWordPressClient(env);

      expect(client).toBeInstanceOf(WordPressClient);
    });

    it('should parse cache TTL from string', () => {
      const env = {
        WORDPRESS_API_URL: 'https://blog-admin.example.com/wp-json/wp/v2',
        WORDPRESS_CACHE_TTL: '600',
      } as Env;
      const client = createWordPressClient(env);

      expect(client).toBeInstanceOf(WordPressClient);
    });
  });

  describe('isWordPressEnabled', () => {
    it('should return false when not enabled', () => {
      const env = {} as Env;
      expect(isWordPressEnabled(env)).toBe(false);
    });

    it('should return false when enabled but no URL', () => {
      const env = {WORDPRESS_ENABLED: 'true'} as Env;
      expect(isWordPressEnabled(env)).toBe(false);
    });

    it('should return false when URL set but not enabled', () => {
      const env = {
        WORDPRESS_API_URL: 'https://blog-admin.example.com/wp-json/wp/v2',
      } as Env;
      expect(isWordPressEnabled(env)).toBe(false);
    });

    it('should return true when both enabled and URL set', () => {
      const env = {
        WORDPRESS_ENABLED: 'true',
        WORDPRESS_API_URL: 'https://blog-admin.example.com/wp-json/wp/v2',
      } as Env;
      expect(isWordPressEnabled(env)).toBe(true);
    });
  });
});
