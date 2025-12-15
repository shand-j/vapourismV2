# SEO Optimization Guide

## Overview

This guide documents the SEO optimization infrastructure implemented for Vapourism, designed to improve organic search rankings based on competitor keyword analysis and industry best practices.

## Architecture

### Core Components

1. **Keyword Optimizer** (`app/lib/keyword-optimizer.ts`)
   - Analyzes and optimizes keyword usage
   - Generates keyword-rich titles and descriptions
   - Provides keyword mapping for products and categories
   - Includes UK vaping industry keyword database

2. **Competitor Analysis** (`app/lib/competitor-analysis.ts`)
   - Parses competitor keyword data
   - Classifies keywords by intent and category
   - Generates actionable SEO improvement plans
   - Exports comprehensive analysis reports

3. **Enhanced SEO Automation** (`app/preserved/seo-automation.ts`)
   - Integrated with KeywordOptimizer
   - Generates optimized meta tags
   - Creates structured data (schema.org)
   - Produces keyword-rich content

## Keyword Strategy

### UK Vaping Keywords Database

The system includes a comprehensive database of high-value keywords organized by:

- **Primary Keywords**: Core commercial terms (vape, vaping, e-liquid, etc.)
- **Product Types**: Specific product categories
- **Brands**: Major vaping brands
- **Features**: Technical specifications and features
- **Flavours**: Popular e-liquid flavours
- **Informational**: How-to and guide keywords
- **Transactional**: Purchase-intent modifiers

### Geo-Targeting

All SEO functions include UK-specific targeting:
- "uk" modifier in titles and descriptions
- British English spellings
- UK-centric trust signals (UK delivery, UK laws, etc.)

## Usage

### For Product Pages

```typescript
import { SEOAutomationService } from '~/preserved/seo-automation';

const product = {
  title: "Elf Bar 600",
  vendor: "Elf Bar",
  productType: "Disposable Vape",
  description: "...",
  tags: ["disposable", "600_puff"],
  price: { amount: "5.99", currencyCode: "GBP" },
  handle: "elf-bar-600",
  availableForSale: true,
  image: "https://...",
  url: "/products/elf-bar-600",
  sku: "EB600"
};

// Generate optimized title
const title = SEOAutomationService.generateProductTitle(product);
// Result: "Elf Bar 600 | Disposable Vape UK | Vapourism"

// Generate optimized meta description
const description = SEOAutomationService.generateProductMetaDescription(product);
// Result: "Shop Elf Bar 600 by Elf Bar from £5.99 Disposable Vape in the UK. ✓ Fast UK Delivery ✓ Authentic Products ✓ Best Prices ✓ Expert Support."

// Generate keywords
const keywords = SEOAutomationService.generateProductKeywords(product);

// Generate structured data
const schema = SEOAutomationService.generateProductSchema(product);
```

### For Category/Search Pages

```typescript
// Generate category title
const categoryTitle = SEOAutomationService.generateCategoryTitle(
  "Disposable Vapes",
  150 // product count
);
// Result: "Disposable Vapes (150+ Products) | UK Vape Shop | Vapourism 2025"

// Generate category description
const categoryDescription = SEOAutomationService.generateCategoryMetaDescription(
  "Disposable Vapes",
  150,
  ["Elf Bar", "Lost Mary", "Geek Bar"]
);
```

### Analyzing Competitor Keywords

Use the provided script to analyze competitor keyword data:

```bash
# Run analysis on CSV file
node scripts/analyze-competitor-keywords.cjs path/to/keywords.csv

# Output will be saved to docs/seo-competitor-analysis.md
```

#### CSV Format

The script expects a CSV file with these columns:
- `keyword`: The search keyword
- `search_volume`: Monthly search volume
- `difficulty`: Keyword difficulty (0-100)
- `position`: Current ranking position

Example:
```csv
keyword,search_volume,difficulty,position
"disposable vape",33100,65,1
"elf bar",27100,70,2
"vape",22200,80,5
```

## Implementation Guide

### 1. Product Page Optimization

**Route**: `app/routes/products.$handle.tsx`

```typescript
export async function loader({ params, context }: LoaderFunctionArgs) {
  const { handle } = params;
  const { storefront } = context;
  
  // Fetch product data
  const product = await storefront.query(PRODUCT_QUERY, {
    variables: { handle }
  });
  
  // Generate SEO metadata
  const seoData = {
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
    sku: product.variants.nodes[0]?.sku
  };
  
  return json({
    product,
    seo: {
      title: SEOAutomationService.generateProductTitle(seoData),
      description: SEOAutomationService.generateProductMetaDescription(seoData),
      schema: SEOAutomationService.generateProductSchema(seoData),
      keywords: SEOAutomationService.generateProductKeywords(seoData)
    }
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data.seo.title },
    { name: 'description', content: data.seo.description },
    { name: 'keywords', content: data.seo.keywords.join(', ') },
    { property: 'og:title', content: data.seo.title },
    { property: 'og:description', content: data.seo.description },
    { property: 'og:type', content: 'product' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: data.seo.title },
    { name: 'twitter:description', content: data.seo.description },
  ];
};
```

### 2. Category/Search Page Optimization

**Route**: `app/routes/search.tsx`

```typescript
export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const tags = url.searchParams.getAll('tag');
  const query = url.searchParams.get('q');
  
  // Search products
  const results = await searchProducts(context.storefront, query, tags);
  
  // Determine category title
  const categoryTitle = tags.length > 0 
    ? tags[0].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'All Products';
  
  // Extract top brands from results
  const topBrands = [...new Set(results.map(p => p.vendor))].slice(0, 5);
  
  return json({
    results,
    seo: {
      title: SEOAutomationService.generateCategoryTitle(
        categoryTitle,
        results.length
      ),
      description: SEOAutomationService.generateCategoryMetaDescription(
        categoryTitle,
        results.length,
        topBrands
      )
    }
  });
}
```

### 3. Structured Data Implementation

Add JSON-LD structured data to page components:

```typescript
export default function ProductPage({ product, seo }) {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(seo.schema)
        }}
      />
      
      {/* Page content */}
      <article>
        <h1>{product.title}</h1>
        {/* ... */}
      </article>
    </>
  );
}
```

## Keyword Research Workflow

### 1. Collect Competitor Data

Use SEO tools (Ahrefs, SEMrush, etc.) to export competitor keyword data:
- Rankings for top 3-5 competitors
- Search volumes
- Keyword difficulty
- Current positions

### 2. Analyze Data

Run the analysis script:

```bash
node scripts/analyze-competitor-keywords.cjs path/to/competitor-keywords.csv
```

### 3. Review Report

Open `docs/seo-competitor-analysis.md` to review:
- Quick win opportunities (low-hanging fruit)
- Content gaps (keywords to target)
- Category distribution
- Intent analysis

### 4. Implement Changes

Based on the report:

1. **Quick Wins (Week 1-4)**:
   - Optimize existing product pages with target keywords
   - Update meta titles and descriptions
   - Add keywords to product descriptions
   - Implement structured data

2. **Content Gaps (Month 2-3)**:
   - Create new category pages for missing keywords
   - Write blog posts for informational keywords
   - Add FAQ sections for question keywords
   - Build landing pages for commercial keywords

3. **Long-term (Month 4-6)**:
   - Create comprehensive guides
   - Build authority content
   - Develop internal linking strategy
   - Monitor and refine based on results

## Best Practices

### Title Tags

- **Length**: 50-60 characters
- **Format**: `Product/Category | Modifier | Brand | Year`
- **Include**: Primary keyword, geo-modifier (UK), brand
- **Example**: `Elf Bar 600 | Disposable Vape UK | Vapourism 2025`

### Meta Descriptions

- **Length**: 150-155 characters
- **Include**: Primary keyword, price (if applicable), trust signals, call-to-action
- **Format**: `Shop [keyword] from £X. ✓ Trust Signal 1 ✓ Trust Signal 2 ✓ Trust Signal 3`
- **Example**: `Shop Elf Bar 600 by Elf Bar from £5.99 Disposable Vape in the UK. ✓ Fast UK Delivery ✓ Authentic Products ✓ Best Prices`

### Heading Structure

```html
<h1>Primary Keyword (Product/Category Name)</h1>
<h2>Secondary Keywords (Features, Benefits)</h2>
<h3>Long-tail Keywords (Specific Details)</h3>
```

### Internal Linking

- Use keyword-rich anchor text
- Link from high-authority pages to target pages
- Create content hubs (pillar pages + cluster content)
- Link related products and categories

### Image Optimization

```typescript
import { SEOAutomationService } from '~/preserved/seo-automation';

const altText = SEOAutomationService.generateImageAltText(
  product,
  'main' // or 'thumbnail' or 'gallery'
);

<img 
  src={product.image} 
  alt={altText}
  loading="lazy"
/>
```

## Monitoring & Measurement

### Key Metrics

Track these monthly:

1. **Organic Traffic**
   - Total sessions from organic search
   - Landing pages by traffic
   - Traffic by keyword

2. **Rankings**
   - Position changes for target keywords
   - New ranking keywords
   - Lost rankings

3. **Engagement**
   - Bounce rate by landing page
   - Time on page
   - Pages per session
   - Conversion rate by keyword

4. **Technical SEO**
   - Crawl errors
   - Page speed (LCP, FID, CLS)
   - Mobile usability
   - Index coverage

### Tools

- **Google Search Console**: Rankings, impressions, clicks
- **Google Analytics**: Traffic, engagement, conversions
- **PageSpeed Insights**: Performance metrics
- **Shopify Analytics**: E-commerce metrics

## Maintenance

### Weekly

- Monitor Google Search Console for new opportunities
- Check for crawl errors
- Review top landing pages performance

### Monthly

- Update target keyword list based on performance
- Refresh competitor analysis
- Optimize underperforming pages
- Create new content for content gaps

### Quarterly

- Comprehensive SEO audit
- Review and update keyword strategy
- Analyze seasonal trends
- Plan content calendar

## Common Issues & Solutions

### Issue: Pages not ranking

**Solutions:**
1. Ensure proper indexing (check robots.txt, sitemap)
2. Verify meta tags are present and optimized
3. Check for duplicate content (canonical tags)
4. Improve page speed
5. Build internal links to the page
6. Add more content (aim for 500+ words)

### Issue: High bounce rate

**Solutions:**
1. Improve page load speed
2. Ensure content matches search intent
3. Add trust signals (reviews, badges)
4. Improve mobile experience
5. Add clear calls-to-action
6. Internal linking to related content

### Issue: Ranking but no conversions

**Solutions:**
1. Review search intent alignment
2. Improve product descriptions
3. Add social proof (reviews, ratings)
4. Optimize pricing display
5. Add trust badges
6. Improve call-to-action visibility

## Future Enhancements

### Planned Features

1. **Dynamic Keyword Insertion**: Auto-inject location-based keywords
2. **A/B Testing**: Test different title/description variations
3. **AI Content Generation**: Auto-generate SEO-optimized descriptions
4. **Real-time Rank Tracking**: Monitor keyword positions automatically
5. **Competitor Monitoring**: Automated competitor analysis
6. **Content Recommendations**: AI-powered content gap analysis

## Resources

- [Google Search Central](https://developers.google.com/search)
- [Shopify SEO Guide](https://www.shopify.com/blog/seo-guide)
- [Schema.org Documentation](https://schema.org/)
- [UK GDPR Guidelines](https://ico.org.uk/)

---

**Last Updated**: December 2025
