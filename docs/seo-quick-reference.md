# SEO Quick Reference Card

A cheat sheet for implementing SEO optimization in Vapourism routes.

## Import Statements

```typescript
import { SEOAutomationService, type ProductSEOData } from '~/preserved/seo-automation';
import { KeywordOptimizer } from '~/lib/keyword-optimizer';
```

## Product Pages

### Generate SEO Metadata

```typescript
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
  url: `/products/${product.handle}`,
  sku: product.variants.nodes[0]?.sku,
};

const seoTitle = SEOAutomationService.generateProductTitle(seoData);
const seoDescription = SEOAutomationService.generateProductMetaDescription(seoData);
const keywords = SEOAutomationService.generateProductKeywords(seoData);
const productSchema = SEOAutomationService.generateProductSchema(seoData);
```

### Meta Tags Array

```typescript
export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data.seo.title },
  { name: 'description', content: data.seo.description },
  { name: 'keywords', content: data.seo.keywords.join(', ') },
  { property: 'og:title', content: data.seo.title },
  { property: 'og:description', content: data.seo.description },
  { property: 'og:type', content: 'product' },
  { property: 'og:image', content: data.product.image },
  { name: 'twitter:card', content: 'summary_large_image' },
];
```

### Structured Data

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(seo.productSchema),
  }}
/>
```

## Category/Search Pages

### Generate Category SEO

```typescript
const categoryTitle = tags[0].replace(/_/g, ' ').toUpperCase();
const topBrands = [...new Set(products.map(p => p.vendor))].slice(0, 5);

const seoTitle = SEOAutomationService.generateCategoryTitle(
  categoryTitle,
  totalProducts
);

const seoDescription = SEOAutomationService.generateCategoryMetaDescription(
  categoryTitle,
  totalProducts,
  topBrands
);
```

### Category Keywords

```typescript
import { KeywordOptimizer } from '~/lib/keyword-optimizer';

const categoryKeywords = KeywordOptimizer.generateCategoryKeywords(
  'disposable_vape',
  150,
  ['Elf Bar', 'Lost Mary']
);

// Use primary keywords in title/description
const primaryKeyword = categoryKeywords.primary[0];
```

## Breadcrumbs

### Generate Breadcrumb Schema

```typescript
const breadcrumbs = [
  { name: 'Home', url: '/' },
  { name: 'E-Liquids', url: '/search?tag=e-liquid' },
  { name: product.title, url: `/products/${product.handle}` },
];

const breadcrumbSchema = SEOAutomationService.generateBreadcrumbSchema(breadcrumbs);
```

## Image Optimization

### Generate Alt Text

```typescript
const mainImageAlt = SEOAutomationService.generateImageAltText(seoData, 'main');
const thumbnailAlt = SEOAutomationService.generateImageAltText(seoData, 'thumbnail');

<img 
  src={product.image} 
  alt={mainImageAlt}
  loading="lazy"
/>
```

## Internal Links

### Generate Related Links

```typescript
const internalLinks = SEOAutomationService.generateInternalLinks(product);

<nav>
  {internalLinks.map(link => (
    <a key={link.url} href={link.url} title={link.title}>
      {link.anchor}
    </a>
  ))}
</nav>
```

## FAQ Schema

### Add FAQ to Product Page

```typescript
const faqSchema = SEOAutomationService.generateProductFAQSchema(product);

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(faqSchema),
  }}
/>
```

## Keyword Analysis

### Run Competitor Analysis

```bash
# Analyze competitor keywords
node scripts/analyze-competitor-keywords.cjs path/to/keywords.csv

# Output saved to docs/seo-competitor-analysis.md
```

### Extract Keywords from Content

```typescript
const keywords = KeywordOptimizer.extractKeywordsFromContent(
  product.description,
  product.tags,
  product.productType
);
```

### Generate Keyword Variations

```typescript
import { generateKeywordVariations } from '~/lib/keyword-optimizer';

const variations = generateKeywordVariations('disposable vape');
// Returns: ['disposable vape', 'disposable vape uk', 'buy disposable vape', ...]
```

## Meta Tag Checklist

### Required on Every Page

- ✅ `<title>` (50-60 chars)
- ✅ `<meta name="description">` (150-155 chars)
- ✅ `<meta name="robots">`
- ✅ `<link rel="canonical">`
- ✅ Open Graph tags (og:title, og:description, og:type, og:image)
- ✅ Twitter Card tags

### Product Pages Only

- ✅ Product schema (JSON-LD)
- ✅ `<meta property="product:price:amount">`
- ✅ `<meta property="product:availability">`
- ✅ FAQ schema (optional)

### Category Pages Only

- ✅ Breadcrumb schema
- ✅ Category-specific keywords

## Common Patterns

### Canonical URL

```typescript
const canonicalUrl = `https://vapourism.co.uk${pathname}${search}`;

return [
  { link: 'canonical', href: canonicalUrl },
  { property: 'og:url', content: canonicalUrl },
];
```

### Handle 404s

```typescript
export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      { title: 'Page Not Found | Vapourism' },
      { name: 'robots', content: 'noindex, nofollow' },
    ];
  }
  // ... normal meta tags
};
```

### Noindex for Search Results

```typescript
// For paginated search results
const robotsContent = pageNumber > 1 
  ? 'noindex, follow' 
  : 'index, follow';

return [{ name: 'robots', content: robotsContent }];
```

## Performance Tips

### Defer Non-Critical Data

```typescript
export async function loader({ context }: LoaderFunctionArgs) {
  // Critical data (loads immediately)
  const product = await fetchProduct();
  
  // Non-critical data (streams in)
  const relatedProducts = fetchRelatedProducts();
  
  return defer({
    product,
    relatedProducts,
  });
}
```

### Cache SEO Data

```typescript
import { CacheLong } from '@shopify/hydrogen';

const { storefront } = context;
const data = await storefront.query(QUERY, {
  cache: CacheLong(),
});
```

## Testing Checklist

- [ ] Verify title is 50-60 characters
- [ ] Verify description is 150-155 characters
- [ ] Check structured data with [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Validate mobile-friendliness
- [ ] Check page speed (target LCP < 2.5s)
- [ ] Verify canonical URL is correct
- [ ] Check Open Graph preview
- [ ] Test breadcrumb navigation

## Quick Wins

### Top 5 SEO Improvements

1. **Add Product Schema** to all product pages
2. **Optimize Title Tags** with primary keywords + UK
3. **Write Compelling Descriptions** with keywords and CTAs
4. **Implement Breadcrumbs** with schema markup
5. **Add FAQ Sections** with schema markup

### Title Template

```
[Product Name] | [Product Type] [Modifier] | Vapourism [Year]

Examples:
"Elf Bar 600 | Disposable Vape UK | Vapourism 2025"
"Strawberry Ice E-Liquid | 10ml Nic Salt | Vapourism 2025"
```

### Description Template

```
Shop [Product] by [Brand] from £[Price] [Type] in the UK. ✓ [Benefit 1] ✓ [Benefit 2] ✓ [Benefit 3]

Example:
"Shop Elf Bar 600 by Elf Bar from £5.99 Disposable Vape in the UK. ✓ Fast UK Delivery ✓ Authentic Products ✓ Best Prices"
```

## Keyword Density Guidelines

- **Primary Keyword**: 2-3% density
- **Secondary Keywords**: 1-2% density
- **Keyword in Title**: ✓
- **Keyword in H1**: ✓
- **Keyword in First 100 Words**: ✓
- **Keyword in Meta Description**: ✓
- **Keyword in URL**: ✓ (if possible)
- **Keyword in Alt Text**: ✓

## URL Structure Best Practices

```
✅ Good: /products/elf-bar-600-strawberry-ice
✅ Good: /search?tag=disposable_vape
✅ Good: /guides/beginners-guide-to-vaping

❌ Bad: /products/12345
❌ Bad: /p/eb600
❌ Bad: /search?id=xyz123
```

## Resources

- **Full Guide**: [SEO Optimization Guide](./seo-optimization-guide.md)
- **Examples**: [SEO Integration Examples](./seo-integration-examples.md)
- **Analysis**: [Competitor Analysis](./seo-competitor-analysis.md)
- **Scripts**: [Scripts README](../scripts/README.md)

## Emergency SEO Fixes

### Issue: Duplicate Content

**Quick Fix**: Add canonical tags
```typescript
{ link: 'canonical', href: canonicalUrl }
```

### Issue: Slow Page Load

**Quick Fix**: Use defer() for non-critical data
```typescript
return defer({ critical, nonCritical });
```

### Issue: Missing Meta Tags

**Quick Fix**: Add meta function to route
```typescript
export const meta: MetaFunction = () => [
  { title: 'Page Title' },
  { name: 'description', content: 'Description' },
];
```

### Issue: No Structured Data

**Quick Fix**: Add JSON-LD script
```tsx
<script type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
/>
```

---

**Last Updated**: December 2025

**Need Help?** Refer to the full [SEO Optimization Guide](./seo-optimization-guide.md)
