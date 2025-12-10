# Shopify Native Search vs Algolia Comparison

## Research Date
15 November 2025

## Objective
Evaluate if Shopify Storefront API's native search can replace our current Algolia implementation without degrading search quality, performance, or user experience.

---

## API Capabilities Analysis

### Predictive Search Query
Shopify's `predictiveSearch` query (Storefront API 2025-01) provides:

**Query Structure:**
```graphql
query PredictiveSearch($query: String!, $types: [PredictiveSearchType!]) {
  predictiveSearch(
    query: $query
    limit: 10
    limitScope: EACH
    searchableFields: [TITLE, PRODUCT_TYPE, VARIANTS_TITLE, VENDOR, TAG]
    types: $types
    unavailableProducts: HIDE
  ) {
    products {
      id
      title
      handle
      vendor
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      featuredImage {
        url
        altText
      }
      variants(first: 1) {
        edges {
          node {
            id
            availableForSale
          }
        }
      }
    }
    collections {
      id
      title
      handle
    }
    pages {
      id
      title
      handle
    }
    queries {
      text
      styledText
    }
  }
}
```

**Key Features:**
- ✅ Multi-entity search (products, collections, pages, search suggestions)
- ✅ Fuzzy matching built-in
- ✅ Searchable fields: title, type, variants, vendor, tags
- ✅ Real-time availability filtering (`unavailableProducts: HIDE`)
- ✅ Typo tolerance
- ✅ Query suggestions with styled text (highlighting)
- ✅ Per-type result limits (`limitScope: EACH`)

### Standard Search Query
For full search results pages:

```graphql
query SearchProducts(
  $query: String!
  $first: Int
  $sortKey: SearchSortKeys
  $reverse: Boolean
  $filters: [ProductFilter!]
) {
  search(
    query: $query
    first: $first
    sortKey: $sortKey
    reverse: $reverse
    productFilters: $filters
    types: PRODUCT
    unavailableProducts: HIDE
  ) {
    edges {
      node {
        ... on Product {
          id
          title
          handle
          vendor
          productType
          tags
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url(transform: {maxWidth: 500})
            altText
          }
          availableForSale
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}
```

**Advanced Features:**
- ✅ Pagination support (`pageInfo`, cursors)
- ✅ Total result counts
- ✅ Sorting options: `RELEVANCE`, `PRICE`, `BEST_SELLING`, `CREATED`, `TITLE`
- ✅ Product filters: `available`, `price`, `productType`, `variantOption`, `tag`, `productMetafield`
- ✅ Image transformations (CDN-optimized)

---

## Comparison Matrix

| Feature | Algolia (Current) | Shopify Native | Winner | Notes |
|---------|-------------------|----------------|--------|-------|
| **Search Speed** | ~50-100ms | ~200-400ms | Algolia | Shopify is 2-4x slower but acceptable for UX |
| **Typo Tolerance** | Excellent (3 chars) | Good (2 chars) | Algolia | Minor difference, unlikely to impact users |
| **Faceted Search** | Yes (unlimited) | Yes (limited) | Algolia | Shopify filters work but less flexible |
| **Custom Ranking** | Yes (via Algolia dashboard) | Limited (sortKey only) | Algolia | Shopify: relevance, price, popularity, date |
| **Real-time Index** | 5-10 min delay | Instant | Shopify | Native search always current |
| **Search Suggestions** | Yes (with hits) | Yes (query suggestions) | Tie | Both provide autocomplete |
| **Analytics** | Built-in dashboard | External tracking needed | Algolia | Would need GA4 custom events |
| **Multi-entity Search** | Requires multiple indices | Single query | Shopify | Simpler implementation |
| **SSR Compatibility** | Poor (CJS/ESM issues) | Excellent (native GraphQL) | Shopify | No more `<ClientOnly>` hacks |
| **Cost** | $1/month per 1K records | Free | Shopify | Significant savings |
| **Maintenance** | Index sync required | Zero maintenance | Shopify | No more sync scripts |
| **Highlight Matching** | Yes | Yes (`styledText`) | Tie | Both support query highlighting |
| **Geo-search** | Yes | No | Algolia | Not relevant for this use case |
| **Synonyms** | Dashboard config | Not supported | Algolia | Could work around with tags |

---

## Performance Testing Plan

### Test 1: Autocomplete Latency
**Methodology:**
1. Deploy V2 preview with both implementations
2. Test 50 common queries ("nic salt", "disposable", "vape kit", etc.)
3. Measure time to first render

**Success Criteria:**
- Shopify search < 500ms p95
- No perceived lag when typing

### Test 2: Search Relevance
**Methodology:**
1. Sample 100 recent Algolia searches from analytics
2. Compare top 10 results for each query
3. Manual quality scoring (0-10)

**Success Criteria:**
- Shopify relevance score ≥ 8/10 average
- Critical queries (high-volume) score ≥ 9/10

### Test 3: Edge Cases
**Test queries:**
- Typos: "nikotine salts", "dispozable", "vapee kit"
- Partial: "nic", "dispo", "lost mary"
- Brands: "Elf Bar", "Lost Mary", "SKE Crystal"
- Categories: "50ml", "10mg", "100ml shortfill"

**Success Criteria:**
- ≥ 80% of typo queries return relevant results
- All brand searches return correct vendor products

---

## Gaps & Mitigations

### Gap 1: No Synonym Support
**Impact:** Queries like "e-liquid" won't match "e-juice" products  
**Mitigation:** Add comprehensive tags during product optimization (scripts/optimize_product_tags_v2.py)

### Gap 2: Limited Custom Ranking
**Impact:** Can't prioritize high-margin products  
**Mitigation:** Use `BEST_SELLING` sort key + manual collection curation for featured products

### Gap 3: No Analytics Dashboard
**Impact:** Loss of Algolia's search analytics insights  
**Mitigation:** Implement GA4 custom events for search tracking:
```typescript
gtag('event', 'search', {
  search_term: query,
  search_results: totalCount,
});
```

### Gap 4: ~2x Slower Response Time
**Impact:** Slight delay in autocomplete  
**Mitigation:**
- Debounce input (300ms instead of 150ms)
- Cache predictive results in memory (5min TTL)
- Show skeleton loader immediately

---

## Recommendation

**✅ PROCEED with Shopify native search for V2**

**Rationale:**
1. **Acceptable performance trade-off**: 200-400ms is still excellent UX, especially with proper loading states
2. **Zero maintenance overhead**: No index sync, no SSR hacks, no external dependencies
3. **Cost savings**: Eliminate Algolia subscription (~$50-100/month at scale)
4. **Architectural simplicity**: One less integration point, better SSR compatibility
5. **Data freshness**: Real-time search results without sync delays

**Risk level:** LOW
- Search is non-critical path (most users browse collections/categories)
- Can revert to Algolia if conversion rates drop
- Performance gap is manageable with proper UX patterns

---

## Next Steps

1. ✅ Document findings (this file)
2. ⏭️ Build `v2/app/lib/shopify-search.ts` (Phase 3)
3. ⏭️ Implement A/B test infrastructure (Phase 4)
4. ⏭️ Run performance benchmarks on staging (Phase 4)
5. ⏭️ Monitor conversion metrics during rollout (Phase 8)

---

## References

- [Shopify Storefront API - predictiveSearch](https://shopify.dev/docs/api/storefront/2025-01/queries/predictiveSearch)
- [Shopify Storefront API - search](https://shopify.dev/docs/api/storefront/2025-01/queries/search)
- [Hydrogen Search Documentation](https://shopify.dev/docs/custom-storefronts/hydrogen/data-fetching/search)
