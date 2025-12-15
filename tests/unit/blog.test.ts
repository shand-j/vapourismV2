import {describe, it, expect} from 'vitest';
import {
  getAllArticles,
  getArticleBySlug,
  getArticlesByCategory,
  getArticlesByTag,
  allArticles,
} from '~/data/blog';

describe('Blog Data Layer', () => {
  describe('allArticles', () => {
    it('should contain at least one article', () => {
      expect(allArticles.length).toBeGreaterThan(0);
    });

    it('should have articles with required fields', () => {
      allArticles.forEach((article) => {
        expect(article).toHaveProperty('slug');
        expect(article).toHaveProperty('title');
        expect(article).toHaveProperty('metaDescription');
        expect(article).toHaveProperty('publishedDate');
        expect(article).toHaveProperty('lastModified');
        expect(article).toHaveProperty('author');
        expect(article).toHaveProperty('category');
        expect(article).toHaveProperty('tags');
        expect(article).toHaveProperty('content');
      });
    });

    it('should have articles with valid data types', () => {
      allArticles.forEach((article) => {
        expect(typeof article.slug).toBe('string');
        expect(typeof article.title).toBe('string');
        expect(typeof article.metaDescription).toBe('string');
        expect(typeof article.publishedDate).toBe('string');
        expect(typeof article.lastModified).toBe('string');
        expect(typeof article.author).toBe('string');
        expect(typeof article.category).toBe('string');
        expect(Array.isArray(article.tags)).toBe(true);
        expect(typeof article.content).toBe('string');
      });
    });
  });

  describe('getAllArticles', () => {
    it('should return all articles', () => {
      const articles = getAllArticles();
      expect(articles).toEqual(allArticles);
    });

    it('should return articles sorted by published date (newest first)', () => {
      const articles = getAllArticles();
      for (let i = 0; i < articles.length - 1; i++) {
        const currentDate = new Date(articles[i].publishedDate);
        const nextDate = new Date(articles[i + 1].publishedDate);
        expect(currentDate >= nextDate).toBe(true);
      }
    });

    it('should not mutate original articles array', () => {
      const originalLength = allArticles.length;
      const articles = getAllArticles();
      articles.push({
        slug: 'test',
        title: 'Test',
        metaDescription: 'Test',
        publishedDate: '2024-01-01',
        lastModified: '2024-01-01',
        author: 'Test',
        category: 'Test',
        tags: [],
        content: 'Test',
      });
      expect(allArticles.length).toBe(originalLength);
    });
  });

  describe('getArticleBySlug', () => {
    it('should return article with matching slug', () => {
      const article = getArticleBySlug('nicotine-pouches-risks-and-benefits');
      expect(article).toBeDefined();
      expect(article?.slug).toBe('nicotine-pouches-risks-and-benefits');
    });

    it('should return undefined for non-existent slug', () => {
      const article = getArticleBySlug('non-existent-article');
      expect(article).toBeUndefined();
    });

    it('should be case-sensitive', () => {
      const article = getArticleBySlug('Nicotine-Pouches-Risks-And-Benefits');
      expect(article).toBeUndefined();
    });
  });

  describe('getArticlesByCategory', () => {
    it('should return articles matching the category', () => {
      const articles = getArticlesByCategory('Education');
      expect(articles.length).toBeGreaterThan(0);
      articles.forEach((article) => {
        expect(article.category).toBe('Education');
      });
    });

    it('should return empty array for non-existent category', () => {
      const articles = getArticlesByCategory('NonExistentCategory');
      expect(articles).toEqual([]);
    });

    it('should be case-sensitive', () => {
      const articles = getArticlesByCategory('education');
      expect(articles).toEqual([]);
    });
  });

  describe('getArticlesByTag', () => {
    it('should return articles matching the tag', () => {
      const articles = getArticlesByTag('nicotine pouches');
      expect(articles.length).toBeGreaterThan(0);
      articles.forEach((article) => {
        expect(article.tags).toContain('nicotine pouches');
      });
    });

    it('should return empty array for non-existent tag', () => {
      const articles = getArticlesByTag('non-existent-tag');
      expect(articles).toEqual([]);
    });

    it('should handle tags with special characters', () => {
      const articles = getArticlesByTag('harm reduction');
      expect(articles.length).toBeGreaterThan(0);
    });
  });

  describe('nicotine pouches article', () => {
    it('should have proper slug', () => {
      const article = getArticleBySlug('nicotine-pouches-risks-and-benefits');
      expect(article?.slug).toBe('nicotine-pouches-risks-and-benefits');
    });

    it('should have SEO-optimized title', () => {
      const article = getArticleBySlug('nicotine-pouches-risks-and-benefits');
      expect(article?.title).toBe('Nicotine Pouches Explained: Risks vs. Benefits');
      expect(article?.title.length).toBeLessThanOrEqual(60); // SEO best practice
    });

    it('should have meta description within SEO limits', () => {
      const article = getArticleBySlug('nicotine-pouches-risks-and-benefits');
      expect(article?.metaDescription).toBeDefined();
      expect(article!.metaDescription.length).toBeGreaterThanOrEqual(120);
      expect(article!.metaDescription.length).toBeLessThanOrEqual(160); // SEO best practice
    });

    it('should have valid date format', () => {
      const article = getArticleBySlug('nicotine-pouches-risks-and-benefits');
      expect(article?.publishedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(article?.lastModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should have relevant tags', () => {
      const article = getArticleBySlug('nicotine-pouches-risks-and-benefits');
      expect(article?.tags).toContain('nicotine pouches');
      expect(article?.tags.length).toBeGreaterThan(0);
    });

    it('should have substantial content', () => {
      const article = getArticleBySlug('nicotine-pouches-risks-and-benefits');
      expect(article?.content).toBeDefined();
      expect(article!.content.length).toBeGreaterThan(1000); // Substantial article
    });

    it('should have proper markdown structure', () => {
      const article = getArticleBySlug('nicotine-pouches-risks-and-benefits');
      expect(article?.content).toContain('# Nicotine Pouches: Risks and Benefits Explained');
      expect(article?.content).toContain('## '); // Section headers
    });
  });
});
