# Shopify Collections Audit & V2 Navigation Strategy

## Research Date
15 November 2025

## Objective
Map current category-mapping.ts logic (100+ fuzzy-matched categories) to Shopify collections structure and identify gaps in collection setup.

---

## Current State Analysis

### Existing Category Mapping Complexity
From `app/lib/category-mapping.ts`:

**Top-level categories (9):**
1. Disposable Vapes (35 subcategories)
2. E-Liquids (25 subcategories)
3. Vape Kits (18 subcategories)
4. Coils & Pods (12 subcategories)
5. Tanks (8 subcategories)
6. Batteries & Chargers (6 subcategories)
7. Accessories (15 subcategories)
8. CBD Products (10 subcategories)
9. Nicotine Pouches (4 subcategories)

**Example fuzzy matching logic:**
```typescript
{
  navigationName: 'Nic Salts',
  exactMatches: ['Nic Salts', 'Nicotine Salts', 'Salt Nic', 'Salt Nicotine', 'Nic Salt'],
  searchTerms: ['nic salt', 'nicotine salt', 'salt nic', 'salt nicotine'],
  keywords: ['salt', 'nic', 'nicotine', '10mg', '20mg']
}
```

**Problems with current approach:**
- ❌ Requires manual updates to category-mapping.ts for new products
- ❌ Fuzzy matching can produce false positives
- ❌ No visibility into category structure in Shopify admin
- ❌ Difficult for non-technical staff to manage
- ❌ Tag-based filtering is fragile (typos, inconsistent tagging)

---

## Shopify Collections Capabilities

### Collection Types

**1. Manual Collections**
- Hand-picked products
- Best for: Featured products, seasonal promotions, curated bundles
- Limitation: Requires manual maintenance

**2. Automated Collections**
- Rule-based product inclusion
- Conditions: product title, type, price, tag, vendor, variant option, inventory
- Best for: Category navigation (our primary use case)
- **Multiple conditions**: Use AND/OR logic for complex rules

### Example Automated Collections

**"Nic Salts" Collection Rules:**
```
Product tag contains "Nic Salts"
OR Product tag contains "Nicotine Salts"
OR Product tag contains "Salt Nic"
OR Product type equals "E-Liquid - Nic Salt"
```

**"Disposable Vapes - 3000 Puffs" Collection Rules:**
```
Product type equals "Disposable Vape"
AND Product tag contains "3000 Puffs"
AND Inventory quantity > 0
```

**"Budget Vape Kits Under £30" Collection Rules:**
```
Product type equals "Vape Kit"
AND Price < 30.00
AND Inventory quantity > 0
```

---

## Proposed Collection Structure

### Tier 1: Main Navigation (9 collections)
```
1. Disposable Vapes
2. E-Liquids
3. Vape Kits
4. Coils & Pods
5. Tanks
6. Batteries & Mods
7. Accessories
8. CBD Products
9. Nicotine Pouches
```

### Tier 2: Subcollections (60 collections)

**Disposable Vapes (12 subcollections):**
- By Puff Count: 600 Puffs, 1000 Puffs, 2000 Puffs, 3000 Puffs, 5000 Puffs, 10000+ Puffs
- By Brand: Elf Bar, Lost Mary, SKE Crystal, IVG, Elux, Other Brands
- By Nicotine: 0mg, 10mg, 20mg

**E-Liquids (15 subcollections):**
- By Type: Nic Salts, Shortfills, 50/50 E-Liquids, High VG
- By Nicotine: 0mg, 3mg, 6mg, 10mg, 20mg
- By Size: 10ml, 50ml, 100ml, 200ml
- By VG/PG: 50/50 VG/PG, 70/30 VG/PG, 80/20 VG/PG, Max VG
- By Flavor: Fruit Flavours, Dessert Flavours, Menthol & Ice, Tobacco

**Vape Kits (10 subcollections):**
- By Experience: Beginner Kits, Intermediate Kits, Advanced Kits
- By Type: Pod Kits, Pen Style Vapes, Box Mods, Disposable Rechargeable
- By Power: Under 40W, 40-80W, 80W+
- By Brand: SMOK Kits, Vaporesso Kits, Voopoo Kits, Aspire Kits, Other Brands

**Coils & Pods (8 subcollections):**
- By Resistance: Sub-Ohm (<1.0Ω), MTL (>1.0Ω)
- By Compatibility: SMOK Coils, Vaporesso Coils, Voopoo Coils, Aspire Coils, Universal Coils
- Replacement Pods (by brand)

**Accessories (10 subcategories):**
- By Type: Batteries, Chargers, Cases, Drip Tips, Replacement Glass, Tools
- Best Sellers, New Arrivals

**CBD Products (5 subcollections):**
- By Type: CBD Oils, CBD Edibles, CBD Vape Liquids, CBD Topicals
- By Strength: 250mg, 500mg, 1000mg, 2000mg+

### Tier 3: Smart Collections (15 curated collections)
```
- New Arrivals (created_at > 30 days ago)
- Best Sellers (requires app or manual curation)
- Sale Items (compare_at_price exists)
- Starter Bundles (manual, beginner-focused products)
- Premium Products (price > £50, curated for quality)
- UK Brands Only (vendor tag "UK Brand")
- Stock Clearance (inventory low, manual)
- Customer Favorites (manual, based on reviews)
- Gift Sets (manual, bundle products)
- Travel Essentials (manual, compact products)
- Eco-Friendly (manual, sustainable products)
- Limited Edition (manual, exclusive releases)
- Pre-Orders (manual, upcoming products)
- Subscription Eligible (manual, recurring order products)
- Wholesale Packs (manual, bulk quantities)
```

---

## Gap Analysis

### Current Categories WITHOUT Shopify Collections

**Need to Create (22 collections):**
1. Disposable Vapes by Puff Count (6 collections)
2. E-Liquids by Flavor Profile (5 collections)
3. Vape Kits by Experience Level (3 collections)
4. Coils by Resistance (2 collections)
5. Smart Collections (6 collections: New Arrivals, Best Sellers, Sale, etc.)

### Collections That Exist but Need Rules Update

**Audit Required (estimated 15 collections):**
- Check for orphaned products (in collection but shouldn't be)
- Verify rule logic matches tagging strategy
- Ensure inventory conditions prevent out-of-stock items
- Remove duplicates across collections

### Tags Requiring Cleanup

From `scripts/optimize_product_tags_v2.py` output analysis:
- **Inconsistent nicotine tags**: "10mg", "10 mg", "10MG", "10mg/ml" → standardize to "10mg"
- **Puff count variations**: "3000 puffs", "3000 Puffs", "3K Puffs" → standardize to "3000 Puffs"
- **VG/PG inconsistencies**: "70/30", "70VG/30PG", "70% VG" → standardize to "70/30 VG/PG"
- **Device type typos**: "Pod Kit", "Pod-Kit", "pod kit" → standardize to "Pod Kit"

**Action Required:**
1. Run tag normalization script (create if doesn't exist)
2. Standardize on: "10mg", "3000 Puffs", "70/30 VG/PG"
3. Update automated collection rules to match normalized tags

---

## Implementation Checklist

### Phase 1: Shopify Admin Setup (Week 4)

**Create Main Collections (9):**
- [ ] Disposable Vapes (automated: `product_type = "Disposable Vape"`)
- [ ] E-Liquids (automated: `product_type = "E-Liquid" OR tag = "E-Liquid"`)
- [ ] Vape Kits (automated: `product_type = "Vape Kit"`)
- [ ] Coils & Pods (automated: `product_type IN ["Coils", "Pods", "Replacement Coils"]`)
- [ ] Tanks (automated: `product_type = "Tank"`)
- [ ] Batteries & Mods (automated: `product_type IN ["Battery", "Mod", "Box Mod"]`)
- [ ] Accessories (automated: `product_type = "Accessory"`)
- [ ] CBD Products (automated: `tag = "CBD" OR product_type = "CBD"`)
- [ ] Nicotine Pouches (automated: `product_type = "Nicotine Pouch"`)

**Create Subcollections (60):**
- [ ] Disposable Vapes subcollections (12)
- [ ] E-Liquids subcollections (15)
- [ ] Vape Kits subcollections (10)
- [ ] Coils & Pods subcollections (8)
- [ ] Accessories subcollections (10)
- [ ] CBD subcollections (5)

**Create Smart Collections (15):**
- [ ] New Arrivals (automated: `created_at > 30 days`)
- [ ] Sale Items (automated: `compare_at_price exists`)
- [ ] Manual curated collections (Best Sellers, Starter Bundles, etc.)

### Phase 2: Tag Normalization (Week 4)

**Script to create:** `scripts/normalize_collection_tags.py`

Purpose:
- Standardize nicotine format: "10mg", "20mg"
- Standardize puff counts: "600 Puffs", "3000 Puffs"
- Standardize VG/PG ratios: "70/30 VG/PG"
- Remove duplicate/typo tags
- Ensure consistent capitalization

**Execution:**
```bash
python scripts/normalize_collection_tags.py --dry-run  # Preview changes
python scripts/normalize_collection_tags.py --apply    # Apply to Shopify
```

---

## SEO & URL Strategy

### Collection URL Structure
```
/collections/disposable-vapes
/collections/disposable-vapes-3000-puffs
/collections/e-liquids-nic-salts
/collections/vape-kits-beginner
/collections/new-arrivals
/collections/sale
```

### Redirect Map (for SEO preservation)

**Priority redirects (high-traffic legacy URLs):**
```typescript
// v2/app/lib/redirects.ts
export const LEGACY_CATEGORY_REDIRECTS: Record<string, string> = {
  // Old category-mapping URLs → New collection URLs
  '/search?category=nic-salts': '/collections/e-liquids-nic-salts',
  '/search?category=disposable-vapes': '/collections/disposable-vapes',
  '/search?category=pod-kits': '/collections/vape-kits-pod',
  '/search?category=shortfills': '/collections/e-liquids-shortfills',
  '/search?category=beginner-kits': '/collections/vape-kits-beginner',
  // Add ~100 more mappings from category-mapping.ts
};
```

**Implementation in entry.server.tsx:**
```typescript
export async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const url = new URL(request.url);
  const redirectTo = LEGACY_CATEGORY_REDIRECTS[url.pathname + url.search];

  if (redirectTo) {
    return new Response(null, {
      status: 301, // Permanent redirect for SEO
      headers: {Location: redirectTo},
    });
  }

  // ...existing Remix handling
}
```

---

## Benefits of Collections-Based Navigation

### 1. **Content Management Simplicity**
- ✅ Non-technical staff can manage collections in Shopify admin
- ✅ Automated rules keep collections up-to-date
- ✅ Preview collections before publishing
- ✅ Bulk product assignment

### 2. **Performance Improvements**
- ✅ No client-side filtering logic (server-rendered)
- ✅ Better SEO (proper URLs, no query params)
- ✅ Faster page loads (no fuzzy matching overhead)
- ✅ Collection queries cache aggressively

### 3. **Flexibility & Scalability**
- ✅ Easy to add new collections (no code changes)
- ✅ Support for multiple navigation styles (sidebar, dropdown, mega menu)
- ✅ Can create seasonal/promotional collections on-the-fly
- ✅ A/B test collection layouts without deploys

### 4. **SEO Advantages**
- ✅ Clean URLs (`/collections/nic-salts` vs `/search?category=nic-salts`)
- ✅ Collection-specific meta descriptions
- ✅ Breadcrumb schema support
- ✅ Easier for search engines to crawl

---

## Risks & Mitigations

### Risk 1: Loss of Fuzzy Matching
**Impact:** Users searching "salt nic" won't find "Nic Salts" collection  
**Mitigation:**
- Add comprehensive tags during product optimization
- Use Shopify's native search for query matching
- Create synonym collections ("Salt Nic" → redirects to "Nic Salts")

### Risk 2: Over-segmentation
**Impact:** Too many collections confuse users  
**Mitigation:**
- Start with 9 main + 60 sub = 69 collections (manageable)
- Use analytics to identify underused collections
- Consolidate/archive low-traffic collections quarterly

### Risk 3: Manual Collection Maintenance
**Impact:** Some curated collections (Best Sellers, Gift Sets) require manual updates  
**Mitigation:**
- Automate where possible (New Arrivals, Sale Items)
- Set calendar reminders for manual collection reviews (monthly)
- Use Shopify Flow (if on Plus) to auto-add products to collections

### Risk 4: Collection Rule Complexity
**Impact:** Complex AND/OR rules may not match expected products  
**Mitigation:**
- Test collection rules thoroughly before publishing
- Use collection preview to verify products
- Document rule logic in collection description for future reference

---

## Recommendation

**✅ PROCEED with collections-based navigation for V2**

**Rationale:**
1. **Shopify-native solution**: Leverages platform capabilities instead of custom code
2. **Maintainability**: Non-technical staff can manage without dev involvement
3. **Performance**: Server-side filtering is faster than client-side category matching
4. **SEO**: Clean URLs and better crawlability
5. **Scalability**: Easy to add/modify collections as catalog grows

**Risk level:** LOW
- Collections can be set up in parallel with current system
- Easy to revert if issues arise
- Gradual rollout possible (one category at a time)

---

## Next Steps

1. ✅ Document findings (this file)
2. ⏭️ Create collections in Shopify admin (Phase 4)
3. ⏭️ Build tag normalization script (Phase 4)
4. ⏭️ Implement V2 navigation component (Phase 4)
5. ⏭️ Test navigation UX on staging (Phase 7)
6. ⏭️ Create redirect map for SEO (Phase 6)

---

## References

- Current implementation: `app/lib/category-mapping.ts`
- Tag optimization: `scripts/optimize_product_tags_v2.py`
- [Shopify Collections Documentation](https://shopify.dev/docs/api/admin-rest/2025-01/resources/collection)
- [Shopify Automated Collections](https://help.shopify.com/en/manual/products/collections/automated-collections)
