# WordPress Blog Integration - POC Guide

## Overview

This POC implements WordPress as a headless CMS for the Vapourism blog, replacing the static TypeScript-based content system. The integration provides:

- **Easy content publishing**: Non-technical users can create/edit posts via WordPress WYSIWYG editor
- **No code deployments**: New content goes live without deploying code
- **Seamless UX**: Users see `/blog` on Vapourism domain - they never interact with WordPress
- **SEO optimized**: Full meta tag support, structured data, social sharing
- **Backward compatible**: Falls back to static content if WordPress is unavailable

## Architecture

```
┌─────────────────────────┐     ┌─────────────────────────┐
│     Vapourism User      │     │   Content Editor        │
│   (Browser - Public)    │     │   (WordPress Admin)     │
└───────────┬─────────────┘     └───────────┬─────────────┘
            │                               │
            │ GET /blog                     │ Write/Edit Posts
            ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│   Hydrogen Storefront   │◄────│      WordPress          │
│   (vapourism.co.uk)     │     │ (blog-admin.vapourism)  │
│                         │     │                         │
│   • Routes: /blog/*     │ API │   • REST API enabled    │
│   • SSR rendering       │────►│   • Yoast SEO plugin    │
│   • Caching layer       │     │   • Featured images     │
└─────────────────────────┘     └─────────────────────────┘
```

## Setup Instructions

### 1. WordPress Installation

You can use any WordPress hosting:
- **WordPress.com** (easiest, managed hosting)
- **Self-hosted** on subdomain (e.g., `blog-admin.vapourism.co.uk`)
- **Headless WordPress platforms** (WPEngine Headless, etc.)

**Recommended subdomain**: `blog-admin.yourdomain.com`

### 2. WordPress Configuration

#### Required Settings

1. **Enable REST API** (enabled by default in WordPress 4.7+)
   - Verify: Visit `https://your-wordpress-site.com/wp-json/wp/v2/posts`
   - Should return JSON array of posts

2. **Permalinks** 
   - Settings → Permalinks → Choose "Post name" (`/%postname%/`)
   - This ensures clean slugs for articles

3. **Media Settings**
   - Settings → Media → Enable "Organize uploads into month and year folders"

#### Recommended Plugins

1. **Yoast SEO** (free) - Meta descriptions and SEO optimization
2. **Application Passwords** (built into WordPress 5.6+) - For secure API authentication
3. **WP REST API Cache** - Performance optimization

### 3. Environment Variables

Add these to your `.env` file (and Oxygen environment):

```bash
# Enable WordPress integration
WORDPRESS_ENABLED=true

# WordPress REST API URL
WORDPRESS_API_URL=https://blog-admin.vapourism.co.uk/wp-json/wp/v2

# Optional: Auth token for draft preview
WORDPRESS_AUTH_TOKEN=

# Cache TTL in seconds (default: 300 = 5 minutes)
WORDPRESS_CACHE_TTL=300

# Enable preview mode (shows drafts)
WORDPRESS_PREVIEW_MODE=false
```

### 4. Testing the Integration

1. **Create a test post** in WordPress:
   - Title: "Test Article"
   - Slug: "test-article"
   - Add some content
   - Publish

2. **Verify API access**:
   ```bash
   curl https://your-wordpress-site.com/wp-json/wp/v2/posts?slug=test-article
   ```

3. **Check Vapourism blog**:
   - Visit `https://vapourism.co.uk/blog`
   - Should show WordPress posts (or static fallback if WP unavailable)

## How It Works

### Content Fetching Flow

1. User visits `/blog` on Vapourism
2. Loader checks if `WORDPRESS_ENABLED=true`
3. If enabled, fetches posts from WordPress REST API
4. Transforms WordPress data to `BlogArticle` format
5. Renders using existing blog components
6. If WordPress fails, falls back to static TypeScript articles

### Data Transformation

WordPress posts are transformed to match the existing `BlogArticle` interface:

| WordPress Field | BlogArticle Field |
|----------------|-------------------|
| `slug` | `slug` |
| `title.rendered` | `title` |
| `excerpt.rendered` | `metaDescription` |
| `date` | `publishedDate` |
| `modified` | `lastModified` |
| `_embedded.author[0].name` | `author` |
| `_embedded.wp:term[0][0].name` | `category` |
| `_embedded.wp:term[1].*.name` | `tags` |
| `content.rendered` | `content` |
| `_embedded.wp:featuredmedia[0].source_url` | `featuredImage` |

### Caching Strategy

- API responses cached for 5 minutes by default (configurable)
- Cache cleared on server restart
- Preview mode bypasses cache (for editors)

For production, consider using:
- Cloudflare KV for distributed caching
- WordPress cache invalidation webhooks

## Content Guidelines for Editors

### SEO Best Practices

1. **Titles**: 50-60 characters
2. **Meta Description**: Use Yoast SEO, 150-160 characters
3. **Featured Image**: Always add, minimum 1200x630px for social sharing
4. **Categories**: Use one primary category per post
5. **Tags**: Use 3-8 relevant tags

### Formatting

WordPress HTML is rendered directly. Use:
- Headings (H2, H3) for structure
- Paragraphs for readability
- Lists (bulleted/numbered)
- Bold/Italic for emphasis
- Links to products (internal linking)

### Product Links

Link to Vapourism products using relative URLs:
```html
<a href="/products/product-handle">Product Name</a>
```

## Deployment Checklist

- [ ] WordPress installed and configured
- [ ] REST API accessible from Oxygen servers
- [ ] Environment variables set in Oxygen dashboard
- [ ] Test post created and visible on `/blog`
- [ ] SEO metadata appearing correctly
- [ ] Featured images loading
- [ ] Mobile responsive verified
- [ ] Static fallback tested (disable WORDPRESS_ENABLED)

## Troubleshooting

### Posts Not Appearing

1. Check WORDPRESS_ENABLED is `true`
2. Verify API URL is correct
3. Check server logs for fetch errors
4. Ensure posts are Published (not Draft)

### Images Not Loading

1. Check WordPress media URLs are accessible
2. Verify CORS settings on WordPress
3. Consider proxying images through Vapourism domain

### Slow Page Loads

1. Increase WORDPRESS_CACHE_TTL
2. Check WordPress server performance
3. Consider adding CDN for WordPress

### Authentication Errors

1. Verify auth token is valid
2. Check Application Password is enabled
3. Ensure token has read permissions

## Limitations (POC)

This POC has some limitations to address in production:

1. **In-memory cache**: Not shared across Oxygen workers
2. **No preview integration**: Separate preview mechanism needed
3. **No pagination**: Currently loads all posts
4. **No search**: Blog search not implemented
5. **No comments**: Comment system not integrated

## Future Enhancements

For production readiness, consider:

1. **Cloudflare KV caching** for distributed cache
2. **Preview routes** with secret tokens
3. **Pagination** for large blog archives
4. **Image proxy** to serve media from main domain
5. **Webhook** to invalidate cache on post update
6. **Search API** integration for blog search

## Files Changed

- `app/lib/wordpress-client.ts` - WordPress REST API client
- `app/routes/blog._index.tsx` - Blog index with WordPress support
- `app/routes/blog.$slug.tsx` - Article page with WordPress support
- `env.d.ts` - Environment variable types
- `.env.example` - Environment variable documentation
- `tailwind.config.js` - Added typography plugin
- `tests/unit/wordpress-client.test.ts` - Unit tests

## References

- [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/)
- [Yoast SEO REST API](https://developer.yoast.com/features/rest-api/)
- [Hydrogen Documentation](https://shopify.dev/docs/custom-storefronts/hydrogen)
