# Product Tagging & Collection Implementation Guide

## Current System Validation ✅

The tag parsing system is working correctly and supports the format:
```
filter:group_key:value
```

## Step-by-Step Implementation

### Step 1: Create Core Collections

Start with these essential collections in Shopify Admin:

#### 1.1 Main Categories
```
Handle: disposable-vapes
Title: Disposable Vapes
Conditions: Product tag contains "filter:category:disposable-vape"

Handle: e-liquids  
Title: E-Liquids
Conditions: Product tag contains "filter:category:e-liquid"

Handle: vape-kits
Title: Vape Kits  
Conditions: Product tag contains "filter:category:vape-kit"

Handle: accessories
Title: Accessories
Conditions: Product tag contains "filter:category:accessory"
```

#### 1.2 Sub-Collections (Disposables)
```
Handle: disposable-vapes-600-puff
Title: 600 Puff Disposables
Conditions: ALL of:
- Product tag contains "filter:category:disposable-vape"  
- Product tag contains "filter:puff_count:600"

Handle: disposable-vapes-2500-puff
Title: 2500+ Puff Disposables
Conditions: ALL of:
- Product tag contains "filter:category:disposable-vape"
- Product tag contains "filter:puff_count:2500" OR "filter:puff_count:5000" OR "filter:puff_count:10000"
```

### Step 2: Tag Your Products

Use this tagging pattern for each product type:

#### 2.1 Disposable Vapes
```javascript
// Example: Elf Bar 600 Blue Razz Lemonade
const tags = [
  "filter:category:disposable-vape",
  "filter:puff_count:600", 
  "filter:nicotine_strength:20mg",
  "filter:nicotine_type:nic_salt",
  "filter:flavour_type:fruit",
  "filter:flavour_type:menthol", 
  "filter:brand:elf_bar"
];
```

#### 2.2 E-Liquids  
```javascript
// Example: Vampire Vape Heisenberg 10ml
const tags = [
  "filter:category:e-liquid",
  "filter:nicotine_type:nic_salt", // or freebase
  "filter:bottle_size:10ml",
  "filter:nicotine_strength:20mg", 
  "filter:vg_ratio:50_50",
  "filter:flavour_type:menthol",
  "filter:brand:vampire_vape"
];
```

#### 2.3 Vape Kits
```javascript
// Example: Vaporesso XROS 3
const tags = [
  "filter:category:vape-kit", 
  "filter:device_style:pod_system",
  "filter:vaping_style:mtl",
  "filter:battery_capacity:1000mah",
  "filter:e_liquid_capacity:2ml",
  "filter:brand:vaporesso"
];
```

### Step 3: Test Collection Logic

Use the GraphQL playground at `http://localhost:3003/graphiql` to test:

```graphql
query TestCollection($handle: String!) {
  collection(handle: $handle) {
    id
    title
    handle
    products(first: 10) {
      edges {
        node {
          id
          title
          tags
        }
      }
    }
  }
}
```

Variables:
```json
{
  "handle": "disposable-vapes"
}
```

### Step 4: Validate Filtering

The system will automatically generate filter facets from your tags. Test this by:

1. Visit a collection page: `/collections/disposable-vapes`
2. Check that filter groups appear in the sidebar
3. Test filtering by selecting different facets
4. Verify URL updates: `/collections/disposable-vapes?tag=filter:puff_count:600`

### Step 5: Brand Collections (Optional)

Create brand-specific collections for popular brands:

```  
Handle: elf-bar
Title: Elf Bar
Conditions: Product tag contains "filter:brand:elf_bar"

Handle: lost-mary  
Title: Lost Mary
Conditions: Product tag contains "filter:brand:lost_mary"
```

## Tag Categories Reference

### Essential Tags (Always Required)
- `filter:category:*` - Primary product category
- `filter:brand:*` - Product brand

### Disposable-Specific Tags
- `filter:puff_count:*` - 600, 2500, 5000, 10000
- `filter:nicotine_strength:*` - 0mg, 10mg, 20mg  
- `filter:nicotine_type:*` - nic_salt, freebase
- `filter:flavour_type:*` - fruit, menthol, dessert, tobacco

### E-Liquid Specific Tags
- `filter:bottle_size:*` - 10ml, 30ml, 50ml, 100ml
- `filter:vg_ratio:*` - 50_50, 70_30, 80_20
- `filter:nicotine_strength:*` - 0mg, 3mg, 6mg, 12mg, 18mg, 20mg
- `filter:nicotine_type:*` - freebase, nic_salt

### Kit-Specific Tags  
- `filter:device_style:*` - pod_system, sub_ohm, squonk
- `filter:vaping_style:*` - mtl, dtl, rdtl
- `filter:battery_capacity:*` - 1000mah, 2000mah, 3000mah
- `filter:e_liquid_capacity:*` - 2ml, 4ml, 6ml, 8ml

## Testing Commands

Use the validation script to test your tags:

```bash
cd /Users/home/Projects/vapourism/v2
node scripts/validate-tags.js
```

## Expected Results

After implementation:
1. **Navigation** - Clean category-based navigation  
2. **Filtering** - Faceted search within collections
3. **SEO** - Collection-specific URLs and content
4. **UX** - Intuitive product discovery
5. **Management** - Tag-driven inventory organization

## Next Steps

1. Tag ~10 sample products using the patterns above
2. Create 2-3 test collections in Shopify
3. Test the collection pages and filtering
4. Expand tagging to your full catalog
5. Add sub-collections and brand collections

The system is ready to support this structure - you just need to create the collections and tag the products!