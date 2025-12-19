# Dynamic Keyword Utilization - The SEO Cheatcode

> **The complete guide to intelligent, automated keyword optimization for Vapourism**

This document explains how to use the Dynamic Keyword Service - your "cheatcode" for SEO keyword usage across the website.

## Quick Start

```typescript
import { 
  SEOAutomationService,
  DynamicKeywordService,
  getProductKeywords,
  getCategoryKeywords,
  getBrandKeywords,
  getSearchKeywords,
  getContentKeywords,
} from '~/preserved/seo-automation';

// For a product page - get ALL keywords, title, description, H1 automatically
const productSEO = SEOAutomationService.getDynamicProductSEO({
  title: 'Elf Bar 600',
  vendor: 'Elf Bar',
  productType: 'Disposable Vape',
  description: 'Premium disposable vape with 600 puffs',
  tags: ['strawberry', 'ice', 'disposable'],
  price: { amount: '5.99', currencyCode: 'GBP' },
  handle: 'elf-bar-600-strawberry',
});

// Use the results
console.log(productSEO.title);           // Optimized title (≤70 chars)
console.log(productSEO.metaDescription); // Optimized description (≤155 chars)
console.log(productSEO.primaryKeywords); // ['elf bar 600', 'elf bar', 'vape', 'uk']
console.log(productSEO.longTailKeywords); // ['best elf bar 600 uk 2025', 'buy elf bar 600 uk']
```

## Page Type Cheatcodes

### 🛒 Product Pages

```typescript
const productSEO = SEOAutomationService.getDynamicProductSEO(product);

// Or use the helper function directly
const keywords = getProductKeywords(
  'Elf Bar 600',
  'Elf Bar',
  'Disposable Vape',
  ['strawberry', 'ice'],
  { amount: '5.99', currencyCode: 'GBP' }
);
```

**Output includes:**
- `primaryKeywords`: Product name, brand, type, UK variants
- `secondaryKeywords`: Transactional modifiers, price-based terms
- `longTailKeywords`: "best [product] uk 2025", "buy [product] next day delivery"
- `lsiKeywords`: Related terms for semantic understanding
- `intentKeywords`: Transactional keywords ("buy", "shop", "order")
- `geoKeywords`: UK-specific terms

### 📁 Category Pages

```typescript
const categorySEO = SEOAutomationService.getDynamicCategorySEO(
  'Disposable Vapes',
  150,  // product count
  ['Elf Bar', 'Lost Mary', 'Geek Bar']  // top brands
);
```

### 🏷️ Brand Pages

```typescript
const brandSEO = SEOAutomationService.getDynamicBrandSEO(
  'SMOK',
  75,  // product count
  ['Pod Kit', 'Mod', 'Tank']  // product types
);
```

### 🔍 Search Pages

```typescript
const searchSEO = SEOAutomationService.getDynamicSearchSEO(
  'strawberry vape juice',  // query
  45  // result count
);
```

### 📝 Blog/Guide Pages

```typescript
const blogSEO = SEOAutomationService.getDynamicContentSEO(
  'Best Vapes for Beginners 2025',
  'guide',  // or 'blog'
  ['beginners', 'starter', 'vape kit']
);
```

## Keyword Clusters

### Intent-Based Keywords

```typescript
import { INTENT_KEYWORD_CLUSTERS } from '~/preserved/seo-automation';

// Access keyword clusters by search intent
INTENT_KEYWORD_CLUSTERS.transactional.modifiers  // ['buy', 'shop', 'order', ...]
INTENT_KEYWORD_CLUSTERS.transactional.urgency    // ['today', 'now', 'fast delivery', ...]
INTENT_KEYWORD_CLUSTERS.transactional.trust      // ['authentic', 'genuine', 'official', ...]
INTENT_KEYWORD_CLUSTERS.commercial.comparison    // ['best', 'top', 'vs', 'review', ...]
INTENT_KEYWORD_CLUSTERS.informational.questions  // ['how to', 'what is', 'guide', ...]
```

### LSI (Semantic) Keywords

```typescript
import { LSI_KEYWORD_CLUSTERS } from '~/preserved/seo-automation';

// Related terms that help search engines understand content
LSI_KEYWORD_CLUSTERS.vaping       // ['e-cigarette', 'vaporizer', 'vapor', ...]
LSI_KEYWORD_CLUSTERS.e_liquid     // ['vape juice', 'e-juice', 'shortfill', ...]
LSI_KEYWORD_CLUSTERS.device       // ['mod', 'pod', 'tank', 'coil', ...]
LSI_KEYWORD_CLUSTERS.nicotine     // ['nic salt', 'freebase', 'mg', ...]
LSI_KEYWORD_CLUSTERS.uk_specific  // ['uk', 'tpd compliant', 'uk legal', ...]
```

### Seasonal Keywords

```typescript
import { SEASONAL_KEYWORDS } from '~/preserved/seo-automation';

SEASONAL_KEYWORDS.current_year  // '2025'
SEASONAL_KEYWORDS.trending      // ['new', 'latest', 'trending', 'popular', ...]
SEASONAL_KEYWORDS.seasons.winter // ['winter', 'christmas', 'cosy', 'warm']
```

## Meta Function Integration

### Product Page Example

```typescript
export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.product) return [{ title: 'Product Not Found | Vapourism' }];
  
  const { product } = data;
  const seo = SEOAutomationService.getDynamicProductSEO({
    title: product.title,
    vendor: product.vendor,
    productType: product.productType,
    description: product.description,
    tags: product.tags,
    price: product.priceRange.minVariantPrice,
    handle: product.handle,
  });

  return [
    { title: seo.title },
    { name: 'description', content: seo.metaDescription },
    { name: 'keywords', content: seo.primaryKeywords.join(', ') },
    { property: 'og:title', content: seo.title },
    { property: 'og:description', content: seo.metaDescription },
    // ... other meta tags
  ];
};
```

### Category Page Example

```typescript
export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const seo = SEOAutomationService.getDynamicCategorySEO(
    data.categoryName,
    data.productCount,
    data.topBrands
  );

  return [
    { title: seo.title },
    { name: 'description', content: seo.metaDescription },
    { name: 'keywords', content: [...seo.primaryKeywords, ...seo.secondaryKeywords].join(', ') },
  ];
};
```

## Advanced Usage

### Get Intent-Specific Keywords

```typescript
// Get keywords for specific search intent
const transactionalKeywords = SEOAutomationService.getIntentBasedKeywords('transactional');
// ['buy', 'shop', 'order', 'today', 'now', 'authentic', 'genuine', ...]

const informationalKeywords = SEOAutomationService.getIntentBasedKeywords('informational');
// ['how to', 'what is', 'guide', 'tutorial', 'beginners', ...]
```

### Get Related/LSI Keywords

```typescript
// Get semantically related keywords for better context
const relatedKeywords = SEOAutomationService.getRelatedKeywordsFor('e-liquid');
// ['vape juice', 'e-juice', 'shortfill', 'nic shot', 'flavour', ...]
```

### Generate Keyword-Rich Snippets

```typescript
// Generate a keyword-optimized snippet for any content
const snippet = SEOAutomationService.generateKeywordRichSnippet(
  'Disposable Vapes',
  'commercial',  // or 'transactional', 'informational'
  160  // max length
);
// "Disposable Vapes - disposable vapes, disposable vapes uk. best, top at Vapourism UK."
```

### Access Full Service

```typescript
// For advanced customization, access the full service
const DKS = SEOAutomationService.getDynamicKeywordService();

const customResult = DKS.generateKeywords({
  pageType: 'landing',
  primaryEntity: 'UK Vape Shop',
  searchIntent: 'transactional',
});
```

## Keyword Density Guidelines

The service automatically calculates recommended keyword density:

| Keyword Type | Recommended Density |
|--------------|---------------------|
| Primary Keywords | 2.5% |
| Secondary Keywords | 1.5% |
| Long-tail Keywords | 0.8% |

Access via:
```typescript
const result = getProductKeywords(...);
result.keywordDensityMap.get('primary keyword'); // 0.025
```

## SEO Checklist

When using the Dynamic Keyword Service, ensure:

- ✅ Title is ≤70 characters (automatic)
- ✅ Meta description is ≤155 characters (automatic)
- ✅ H1 is ≤60 characters (automatic)
- ✅ Primary keyword in title, H1, first 100 words
- ✅ UK geo-targeting keywords included (automatic)
- ✅ Intent-appropriate keywords used (automatic)
- ✅ LSI keywords for semantic richness (automatic)

## Complete Example: Product Page

```typescript
// app/routes/products.$handle.tsx
import { SEOAutomationService, type ProductSEOData } from '~/preserved/seo-automation';

export async function loader({ params, context }: LoaderFunctionArgs) {
  const product = await fetchProduct(params.handle);
  
  // Generate dynamic SEO data
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
  };

  const dynamicSEO = SEOAutomationService.getDynamicProductSEO(seoData);

  return json({
    product,
    seo: dynamicSEO,
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.seo) return [{ title: 'Vapourism' }];
  
  const { seo } = data;
  
  return [
    { title: seo.title },
    { name: 'description', content: seo.metaDescription },
    { name: 'keywords', content: seo.primaryKeywords.join(', ') },
    { property: 'og:title', content: seo.title },
    { property: 'og:description', content: seo.metaDescription },
    { property: 'og:type', content: 'product' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: seo.title },
    { name: 'twitter:description', content: seo.metaDescription },
  ];
};

export default function ProductPage() {
  const { product, seo } = useLoaderData<typeof loader>();
  
  return (
    <div>
      {/* Use SEO-optimized H1 */}
      <h1>{seo.h1}</h1>
      
      {/* Use suggested anchor texts for internal linking */}
      <nav>
        {seo.suggestedAnchors.slice(0, 3).map(anchor => (
          <a key={anchor} href={`/search?q=${encodeURIComponent(anchor)}`}>
            {anchor}
          </a>
        ))}
      </nav>
      
      {/* Product content... */}
    </div>
  );
}
```

## Files Reference

- **Dynamic Keyword Service**: `app/lib/dynamic-keywords.ts`
- **SEO Automation Service**: `app/preserved/seo-automation.ts`
- **Keyword Optimizer**: `app/lib/keyword-optimizer.ts`
- **Tests**: `tests/unit/dynamic-keywords.test.ts`

---

**Last Updated**: December 2025

For more SEO guidance, see:
- [SEO Quick Reference](./seo-quick-reference.md)
- [SEO Integration Examples](./seo-integration-examples.md)
- [SEO Optimization Guide](./seo-optimization-guide.md)
