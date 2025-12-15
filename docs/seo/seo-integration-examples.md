# SEO Integration Examples

This document provides practical examples of integrating the SEO optimization services into your Remix routes.

## Product Page Example

### Complete Product Route with SEO

```typescript
// app/routes/products.$handle.tsx
import { json, type LoaderFunctionArgs, type MetaFunction } from '@shopify/remix-oxygen';
import { useLoaderData } from '@remix-run/react';
import { SEOAutomationService, type ProductSEOData } from '~/preserved/seo-automation';
import { PRODUCT_QUERY } from '~/lib/fragments';

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { handle } = params;
  const { storefront } = context;

  if (!handle) {
    throw new Response('Not found', { status: 404 });
  }

  const { product } = await storefront.query(PRODUCT_QUERY, {
    variables: { handle },
  });

  if (!product?.id) {
    throw new Response('Not found', { status: 404 });
  }

  // Prepare SEO data
  const seoData: ProductSEOData = {
    title: product.title,
    vendor: product.vendor,
    productType: product.productType,
    description: product.description,
    tags: product.tags,
    price: product.priceRange.minVariantPrice,
    handle: product.handle,
    availableForSale: product.availableForSale,
    image: product.featuredImage?.url,
    url: `https://vapourism.co.uk/products/${product.handle}`,
    sku: product.variants.nodes[0]?.sku,
  };

  // Generate SEO metadata
  const seoTitle = SEOAutomationService.generateProductTitle(seoData);
  const seoDescription = SEOAutomationService.generateProductMetaDescription(seoData);
  const keywords = SEOAutomationService.generateProductKeywords(seoData);
  const productSchema = SEOAutomationService.generateProductSchema(seoData);
  const faqSchema = SEOAutomationService.generateProductFAQSchema(seoData);
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: seoData.productType, url: `/search?tag=${seoData.productType.toLowerCase().replace(/\s+/g, '_')}` },
    { name: product.title, url: `/products/${product.handle}` },
  ];
  const breadcrumbSchema = SEOAutomationService.generateBreadcrumbSchema(breadcrumbs);
  const imageAltText = SEOAutomationService.generateImageAltText(seoData, 'main');

  return json({
    product,
    seo: {
      title: seoTitle,
      description: seoDescription,
      keywords,
      productSchema,
      faqSchema,
      breadcrumbSchema,
      imageAltText,
    },
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [{ title: 'Product Not Found' }];
  }

  return [
    // Primary Meta Tags
    { title: data.seo.title },
    { name: 'description', content: data.seo.description },
    { name: 'keywords', content: data.seo.keywords.join(', ') },

    // Open Graph / Facebook
    { property: 'og:type', content: 'product' },
    { property: 'og:title', content: data.seo.title },
    { property: 'og:description', content: data.seo.description },
    { property: 'og:url', content: data.product.url || '' },
    { property: 'og:image', content: data.product.image || '' },
    { property: 'og:site_name', content: 'Vapourism' },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: data.seo.title },
    { name: 'twitter:description', content: data.seo.description },
    { name: 'twitter:image', content: data.product.image || '' },

    // Product Specific
    { property: 'product:price:amount', content: data.product.priceRange.minVariantPrice.amount },
    { property: 'product:price:currency', content: data.product.priceRange.minVariantPrice.currencyCode },
    { property: 'product:availability', content: data.product.availableForSale ? 'in stock' : 'out of stock' },
    { property: 'product:brand', content: data.product.vendor },

    // Robots
    { name: 'robots', content: 'index, follow' },
    { name: 'googlebot', content: 'index, follow' },
  ];
};

export default function Product() {
  const { product, seo } = useLoaderData<typeof loader>();

  return (
    <div className="product-page">
      {/* Structured Data - Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(seo.productSchema),
        }}
      />

      {/* Structured Data - FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(seo.faqSchema),
        }}
      />

      {/* Structured Data - Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(seo.breadcrumbSchema),
        }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href={`/search?tag=${product.productType.toLowerCase().replace(/\s+/g, '_')}`}>
            {product.productType}
          </a></li>
          <li aria-current="page">{product.title}</li>
        </ol>
      </nav>

      {/* Product Content */}
      <article itemScope itemType="https://schema.org/Product">
        <h1 itemProp="name">{product.title}</h1>
        
        <div className="product-images">
          <img
            src={product.featuredImage?.url}
            alt={seo.imageAltText}
            itemProp="image"
            loading="eager"
          />
        </div>

        <div className="product-info">
          <div itemProp="brand" itemScope itemType="https://schema.org/Brand">
            <span itemProp="name">{product.vendor}</span>
          </div>

          <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
            <meta itemProp="priceCurrency" content={product.priceRange.minVariantPrice.currencyCode} />
            <meta itemProp="price" content={product.priceRange.minVariantPrice.amount} />
            <link itemProp="availability" href={`https://schema.org/${product.availableForSale ? 'InStock' : 'OutOfStock'}`} />
            <span className="price">£{product.priceRange.minVariantPrice.amount}</span>
          </div>

          <div itemProp="description">
            {product.description}
          </div>

          {/* Add to Cart Form */}
          {/* ... */}
        </div>
      </article>
    </div>
  );
}
```

## Category/Search Page Example

### Search Route with Category SEO

```typescript
// app/routes/search.tsx
import { json, type LoaderFunctionArgs, type MetaFunction } from '@shopify/remix-oxygen';
import { useLoaderData } from '@remix-run/react';
import { SEOAutomationService } from '~/preserved/seo-automation';
import { searchProducts } from '~/lib/shopify-search';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '';
  const tags = url.searchParams.getAll('tag');

  // Search products
  const searchResults = await searchProducts(context.storefront, query, tags);

  // Determine category title
  const categoryTitle = tags.length > 0
    ? tags[0].replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    : query || 'All Products';

  // Extract top brands from results
  const topBrands = [...new Set(searchResults.products.map((p) => p.vendor))]
    .slice(0, 5);

  // Generate SEO metadata
  const seoTitle = SEOAutomationService.generateCategoryTitle(
    categoryTitle,
    searchResults.totalCount
  );

  const seoDescription = SEOAutomationService.generateCategoryMetaDescription(
    categoryTitle,
    searchResults.totalCount,
    topBrands
  );

  // Generate breadcrumb
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: categoryTitle, url: url.pathname + url.search },
  ];
  const breadcrumbSchema = SEOAutomationService.generateBreadcrumbSchema(breadcrumbs);

  return json({
    results: searchResults,
    categoryTitle,
    seo: {
      title: seoTitle,
      description: seoDescription,
      breadcrumbSchema,
    },
  });
}

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
  if (!data) {
    return [{ title: 'Search - Vapourism' }];
  }

  const canonicalUrl = `https://vapourism.co.uk${location.pathname}${location.search}`;

  return [
    { title: data.seo.title },
    { name: 'description', content: data.seo.description },
    { name: 'robots', content: 'index, follow' },
    { link: 'canonical', href: canonicalUrl },
    
    // Open Graph
    { property: 'og:title', content: data.seo.title },
    { property: 'og:description', content: data.seo.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: canonicalUrl },
  ];
};

export default function SearchPage() {
  const { results, categoryTitle, seo } = useLoaderData<typeof loader>();

  return (
    <div className="search-page">
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(seo.breadcrumbSchema),
        }}
      />

      {/* Page Content */}
      <h1>{categoryTitle}</h1>
      <p className="category-description">
        {seo.description}
      </p>

      {/* Product Grid */}
      <div className="product-grid">
        {results.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

## Homepage Example

### Homepage with Organization Schema

```typescript
// app/routes/_index.tsx
import { json, type LoaderFunctionArgs, type MetaFunction } from '@shopify/remix-oxygen';

export async function loader({ context }: LoaderFunctionArgs) {
  // ... fetch homepage data

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Vapourism",
    "url": "https://vapourism.co.uk",
    "logo": "https://vapourism.co.uk/logo.png",
    "description": "Premium UK vape shop offering disposable vapes, e-liquids, vape kits, and accessories. Fast delivery, authentic products, competitive prices.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "GB",
    },
    "sameAs": [
      "https://www.facebook.com/vapourism",
      "https://twitter.com/vapourism",
      "https://www.instagram.com/vapourism"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+44-xxx-xxx-xxxx",
      "contactType": "customer service",
      "areaServed": "GB",
      "availableLanguage": "English"
    }
  };

  return json({ organizationSchema });
}

export const meta: MetaFunction = () => {
  return [
    { title: 'Vapourism | Premium UK Vape Shop | Disposables, E-Liquids & Kits' },
    { name: 'description', content: 'Shop premium vaping products at Vapourism. ✓ Disposable Vapes ✓ E-Liquids ✓ Pod Kits ✓ Fast UK Delivery ✓ Authentic Products ✓ Best Prices 2025.' },
    { name: 'keywords', content: 'vape shop uk, disposable vape, e-liquid, vape juice, pod kit, elf bar, lost mary, geek bar, vaping uk' },
    
    // Home-specific
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: 'Vapourism - Premium UK Vape Shop' },
    { property: 'og:description', content: 'Shop premium vaping products with fast UK delivery' },
    { property: 'og:url', content: 'https://vapourism.co.uk' },
  ];
};

export default function Homepage() {
  const { organizationSchema } = useLoaderData<typeof loader>();

  return (
    <div>
      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />

      {/* Homepage content */}
    </div>
  );
}
```

## Blog/Guide Page Example

### Blog Post with Article Schema

```typescript
// app/routes/guides.$slug.tsx
import { json, type LoaderFunctionArgs, type MetaFunction } from '@shopify/remix-oxygen';
import { useLoaderData } from '@remix-run/react';

export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;

  // Fetch blog post data
  const post = {
    title: 'Complete Beginner\'s Guide to Vaping 2025',
    description: 'Learn everything you need to know about vaping...',
    content: '...',
    author: 'Vapourism Team',
    publishedDate: '2025-01-15',
    modifiedDate: '2025-01-20',
    image: 'https://vapourism.co.uk/guides/beginner-guide.jpg',
    slug,
  };

  // Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "image": post.image,
    "author": {
      "@type": "Organization",
      "name": post.author,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Vapourism",
      "logo": {
        "@type": "ImageObject",
        "url": "https://vapourism.co.uk/logo.png"
      }
    },
    "datePublished": post.publishedDate,
    "dateModified": post.modifiedDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://vapourism.co.uk/guides/${post.slug}`
    }
  };

  return json({ post, articleSchema });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [];

  return [
    { title: `${data.post.title} | Vapourism Guides` },
    { name: 'description', content: data.post.description },
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: data.post.title },
    { property: 'og:description', content: data.post.description },
    { property: 'article:published_time', content: data.post.publishedDate },
    { property: 'article:modified_time', content: data.post.modifiedDate },
  ];
};

export default function GuidePage() {
  const { post, articleSchema } = useLoaderData<typeof loader>();

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />

      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

## Best Practices Summary

### 1. Always Include Structured Data

Every page type should have appropriate schema.org markup:
- **Products**: Product + Offer schema
- **Categories**: BreadcrumbList schema
- **Homepage**: Organization schema
- **Guides**: Article schema
- **FAQs**: FAQPage schema

### 2. Optimize Meta Tags

- **Title**: 50-60 characters, include primary keyword
- **Description**: 150-155 characters, include keywords and CTAs
- **Keywords**: 5-10 relevant keywords
- **Canonical**: Always set canonical URL

### 3. Use Semantic HTML

```html
<article itemScope itemType="https://schema.org/Product">
  <h1 itemProp="name">Product Title</h1>
  <div itemProp="description">Description</div>
  <span itemProp="price">£9.99</span>
</article>
```

### 4. Optimize Images

- Add descriptive alt text with keywords
- Use lazy loading for images below fold
- Serve optimized image formats (WebP)
- Include images in structured data

### 5. Internal Linking

Use keyword-rich anchor text:
```typescript
const relatedLinks = SEOAutomationService.generateInternalLinks(product);

<ul>
  {relatedLinks.map(link => (
    <li key={link.url}>
      <a href={link.url} title={link.title}>
        {link.anchor}
      </a>
    </li>
  ))}
</ul>
```

### 6. Mobile Optimization

- Ensure responsive design
- Fast loading times (< 2s LCP)
- Touch-friendly navigation
- Readable font sizes

### 7. Performance

- Use Remix's `defer()` for non-critical data
- Implement proper caching headers
- Minimize JavaScript bundle size
- Optimize images

## Testing Your SEO Implementation

### 1. Google Rich Results Test
https://search.google.com/test/rich-results

Test your structured data markup.

### 2. PageSpeed Insights
https://pagespeed.web.dev/

Check page performance and Core Web Vitals.

### 3. Mobile-Friendly Test
https://search.google.com/test/mobile-friendly

Ensure mobile compatibility.

### 4. Lighthouse
Run in Chrome DevTools to audit:
- Performance
- Accessibility
- Best Practices
- SEO

### 5. Manual Checks

- View page source and verify meta tags
- Check structured data in browser console
- Test on multiple devices
- Verify canonical URLs

## Common Issues & Fixes

### Issue: Duplicate Meta Tags

**Fix**: Use Remix's meta function properly, don't add tags in component.

### Issue: Missing Structured Data

**Fix**: Always render JSON-LD scripts in component.

### Issue: Long Load Times

**Fix**: Use `defer()` for heavy queries, implement caching.

### Issue: Missing Canonical URL

**Fix**: Always include canonical in meta array.

### Issue: Poor Mobile Experience

**Fix**: Test on real devices, use responsive design.

---

**Last Updated**: December 2025
