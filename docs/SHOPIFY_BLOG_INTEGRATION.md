# Shopify Blog Integration

## Overview
The blog feature has been integrated with Shopify's native blog functionality. Articles are now fetched dynamically from Shopify's Storefront API instead of being stored as static TypeScript files.

## Architecture

### Data Flow
1. **Blog Index (`/blog`)**: Fetches paginated list of articles from Shopify blog
2. **Individual Article (`/blog/:slug`)**: Fetches specific article by handle from Shopify
3. All content remains on the Vapourism domain (no redirects to Shopify admin)

### Key Components

#### GraphQL Fragments (`app/preserved/fragments.ts`)
- `ARTICLE_FRAGMENT`: Defines the article data structure
- `BLOG_QUERY`: Fetches blog metadata
- `BLOG_ARTICLES_QUERY`: Fetches paginated list of articles
- `ARTICLE_QUERY`: Fetches individual article by handle

#### Data Layer (`app/lib/shopify-blog.ts`)
- `getBlog()`: Fetch blog metadata
- `getBlogArticles()`: Fetch paginated articles with cursor-based pagination
- `getArticle()`: Fetch individual article
- Helper functions for SEO and category extraction

#### Routes
- `app/routes/blog._index.tsx`: Blog listing page with pagination
- `app/routes/blog.$slug.tsx`: Individual article page

## Configuration

### Environment Variables
Add to your `.env` file:

```bash
# Shopify blog handle (defaults to 'news' if not specified)
BLOG_HANDLE=news
```

The blog handle must match the handle configured in your Shopify admin under **Online Store > Blog Posts**.

## SEO Optimization

### Meta Tags
All pages include comprehensive SEO meta tags:
- Title tags (truncated to 60 characters)
- Meta descriptions (155 characters optimal)
- Open Graph tags for social sharing
- Twitter Card tags
- Article-specific meta tags (published date, author, section)

### Structured Data
Individual article pages include JSON-LD structured data:
- `@type`: Article
- Publisher information
- Author information
- Publication dates
- Featured images (if available)
- Keywords from tags

### Content Rendering
- HTML content from Shopify is rendered with Tailwind's prose classes
- Semantic HTML structure maintained
- Proper heading hierarchy (H1, H2, H3)
- Responsive images with proper alt text

## Pagination

The blog uses cursor-based pagination (Shopify's standard):
- **First page**: `/blog`
- **Next pages**: `/blog?after=<cursor>`
- 12 articles per page (configurable via `ARTICLES_PER_PAGE` constant)

Pagination controls appear at the bottom of the blog index when multiple pages exist.

## Analytics

### Google Analytics 4 Events
Article pages track:
- `view_blog_article`: When article is viewed
- `blog_engagement`: Time spent on article (if > 5 seconds)
- `scroll_depth`: Scroll milestones (25%, 50%, 75%, 100%)

## Shopify Admin Setup

### Creating Blog Posts

1. **Navigate to Blog Posts**
   - Go to **Online Store > Blog Posts** in Shopify admin

2. **Create or Edit Blog**
   - Ensure you have a blog with handle matching `BLOG_HANDLE` env var
   - Default is "news" but you can change this

3. **Create Article**
   - Click "Add blog post"
   - Fill in required fields:
     - **Title**: Article title (used as H1)
     - **Content**: Article body (supports Shopify's rich text editor)
     - **Excerpt**: Short description (used as meta description)
     - **Featured Image**: Optional hero image
     - **Author**: Author name
     - **Tags**: Comma-separated tags for categorization
     - **Handle**: URL-friendly slug (auto-generated from title)

4. **SEO Settings**
   - Click "Search engine listing preview"
   - Customize:
     - **Page title**: SEO title (if different from article title)
     - **Description**: Meta description (optimal: 120-155 characters)

5. **Publish**
   - Set visibility (Published/Hidden/Scheduled)
   - Save article

### Best Practices

#### Title
- Keep under 60 characters for SEO
- Include primary keyword
- Make it compelling and descriptive

#### Excerpt
- Write 120-155 characters
- Include target keywords naturally
- Clearly describe article content

#### Content
- Use headings (H2, H3) for structure
- Include bullet points for readability
- Add relevant internal links
- Keep paragraphs short (2-3 sentences)

#### Tags
- Use 5-10 relevant tags
- Include:
  - Category tag (e.g., "Education", "Reviews", "Guides")
  - Topic tags (e.g., "vaping", "nicotine pouches")
  - Product tags if relevant

#### Images
- Add featured image (recommended: 1200x630px for social sharing)
- Use descriptive alt text
- Optimize file size for performance

## Caching Strategy

- **Blog metadata**: `CacheLong()` - Cached for longer periods
- **Article listings**: `CacheShort()` - Cached for 1 minute
- **Individual articles**: `CacheShort()` - Cached for 1 minute

This ensures content updates appear quickly while still benefiting from edge caching.

## Migration from Static Blog

### Previous Implementation
- Articles stored in `app/data/blog/*.ts` files
- Manual content updates required
- No admin interface

### Current Implementation
- Articles managed via Shopify admin
- Content updates instant
- No code deployments needed for new articles

### Deprecation Notice
The static blog files in `app/data/blog/` are no longer used and can be safely removed in a future cleanup.

## Testing

### Manual Testing
See [BLOG_MANUAL_TEST_PLAN.md](./BLOG_MANUAL_TEST_PLAN.md) for comprehensive testing checklist.

### Automated Tests
Tests in `tests/unit/blog.test.ts` need to be updated to work with Shopify integration.

## Troubleshooting

### No Articles Displaying
1. Check that `BLOG_HANDLE` env var matches your Shopify blog handle
2. Verify blog posts are published (not hidden/draft) in Shopify admin
3. Check browser console for GraphQL errors

### Articles Not Updating
1. Clear Shopify's edge cache (can take up to 1 minute)
2. Verify article is published in Shopify admin
3. Check that article handle matches URL slug

### SEO Issues
1. Verify SEO fields are filled in Shopify admin
2. Check page source for meta tags
3. Use Google's Rich Results Test for structured data validation

### Pagination Not Working
1. Verify `pageInfo.endCursor` is being passed correctly
2. Check browser console for errors
3. Ensure GraphQL query includes pageInfo fields

## Future Enhancements

### Potential Features
- Blog search functionality
- Category/tag filtering on frontend
- Related articles recommendations
- Comments system integration
- Social sharing buttons
- RSS feed generation
- Reading time estimates

### Performance Optimizations
- Pre-fetch article data on blog index hover
- Implement service worker for offline reading
- Add image optimization/lazy loading
- Consider static generation for popular articles

## API Reference

### `getBlogArticles(storefront, options)`
Fetches paginated list of articles.

**Parameters:**
- `storefront`: Hydrogen Storefront instance
- `options`:
  - `blogHandle`: Blog handle (default: from env)
  - `first`: Number of articles (default: 12)
  - `after`: Pagination cursor

**Returns:**
```typescript
{
  articles: ShopifyArticle[];
  pageInfo: PageInfo;
}
```

### `getArticle(storefront, articleHandle, blogHandle)`
Fetches individual article.

**Parameters:**
- `storefront`: Hydrogen Storefront instance
- `articleHandle`: URL slug of article
- `blogHandle`: Blog handle (default: from env)

**Returns:** `ShopifyArticle | null`

### `generateMetaDescription(article)`
Generates SEO meta description from article content.

**Returns:** `string` (155 characters max)

### `getCategoryFromArticle(article)`
Extracts category from tags or blog title.

**Returns:** `string`

## Resources

- [Shopify Storefront API - Blog](https://shopify.dev/docs/api/storefront/latest/objects/Blog)
- [Shopify Storefront API - Article](https://shopify.dev/docs/api/storefront/latest/objects/Article)
- [Cursor-Based Pagination](https://shopify.dev/docs/api/usage/pagination-graphql)
- [Hydrogen Documentation](https://shopify.dev/docs/custom-storefronts/hydrogen)

## Support

For issues or questions:
1. Check Shopify admin blog configuration
2. Review GraphQL query responses in Network tab
3. Consult Shopify Storefront API documentation
4. Check this project's issue tracker on GitHub
