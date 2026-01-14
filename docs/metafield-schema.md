# Product Metafield Schema for Shopify Search & Discovery

This document defines the metafield schema for product taxonomy at Vapourism. This schema is used by Shopify's Search & Discovery app to power faceted filtering across the storefront.

> **Note**: This schema is implemented via a separate product tagging tool/process, not in the storefront code. The storefront simply uses Shopify's native search with whatever filters are configured in Search & Discovery.

## Overview

Instead of complex custom filtering logic in the storefront, we use:
1. **Shopify product metafields** to store structured product attributes
2. **Shopify Search & Discovery app** to configure which attributes are filterable
3. **Shopify's native search** to handle filtering automatically

## Namespace Convention

All product metafields use the `vapourism` namespace:
- Format: `vapourism.{attribute_name}`
- Example: `vapourism.nicotine_strength`

## Metafield Definitions

### Core Product Attributes

| Key | Type | Description | Example Values |
|-----|------|-------------|----------------|
| `vapourism.product_category` | `single_line_text_field` | Primary product category | `e-liquid`, `disposable`, `device`, `pod`, `coil`, `accessory`, `CBD`, `nicotine_pouches` |
| `vapourism.nicotine_strength` | `single_line_text_field` | Nicotine content in mg | `0mg`, `3mg`, `6mg`, `10mg`, `12mg`, `18mg`, `20mg` |
| `vapourism.nicotine_type` | `single_line_text_field` | Type of nicotine | `nic_salt`, `freebase`, `traditional`, `nicotine_free` |
| `vapourism.flavour_profile` | `list.single_line_text_field` | Flavour categories | `fruity`, `menthol`, `tobacco`, `dessert`, `beverage`, `candy` |

### E-Liquid Specific

| Key | Type | Description | Example Values |
|-----|------|-------------|----------------|
| `vapourism.bottle_size` | `single_line_text_field` | Bottle capacity | `10ml`, `30ml`, `50ml`, `100ml` |
| `vapourism.vg_pg_ratio` | `single_line_text_field` | VG/PG ratio | `50/50`, `70/30`, `80/20`, `Max VG` |
| `vapourism.is_shortfill` | `boolean` | Whether it's a shortfill | `true`, `false` |

### Device Specific

| Key | Type | Description | Example Values |
|-----|------|-------------|----------------|
| `vapourism.device_style` | `single_line_text_field` | Form factor | `pen_style`, `pod_style`, `box_style`, `compact`, `mini` |
| `vapourism.vaping_style` | `single_line_text_field` | Intended use | `mouth-to-lung`, `direct-to-lung`, `restricted-dtl` |
| `vapourism.power_supply` | `single_line_text_field` | Battery type | `rechargeable`, `removable_battery`, `built-in` |
| `vapourism.wattage_range` | `single_line_text_field` | Power output range | `5-15W`, `15-40W`, `40-80W`, `80W+` |

### Pod & Coil Specific

| Key | Type | Description | Example Values |
|-----|------|-------------|----------------|
| `vapourism.pod_type` | `single_line_text_field` | Type of pod | `prefilled`, `refillable`, `replacement` |
| `vapourism.pod_capacity` | `single_line_text_field` | E-liquid capacity | `2ml`, `3ml`, `4ml`, `5ml` |
| `vapourism.coil_resistance` | `single_line_text_field` | Ohm rating | `0.3ohm`, `0.6ohm`, `0.8ohm`, `1.0ohm`, `1.2ohm` |
| `vapourism.coil_material` | `single_line_text_field` | Heating element | `kanthal`, `mesh`, `ceramic`, `ni200` |

### CBD Specific

| Key | Type | Description | Example Values |
|-----|------|-------------|----------------|
| `vapourism.cbd_strength` | `single_line_text_field` | CBD content | `100mg`, `250mg`, `500mg`, `1000mg`, `1500mg` |
| `vapourism.cbd_type` | `single_line_text_field` | Spectrum type | `full_spectrum`, `broad_spectrum`, `isolate` |
| `vapourism.cbd_form` | `single_line_text_field` | Product form | `oil`, `gummy`, `capsule`, `topical`, `vape` |

### Nicotine Pouches Specific

| Key | Type | Description | Example Values |
|-----|------|-------------|----------------|
| `vapourism.pouch_strength` | `single_line_text_field` | Strength category | `light`, `regular`, `strong`, `extra_strong` |
| `vapourism.pouch_format` | `single_line_text_field` | Pouch size | `mini`, `slim`, `regular`, `large` |

## Shopify Search & Discovery Configuration

### Recommended Filter Configuration

Configure these filters in Shopify Admin → Search & Discovery → Filters:

1. **Product Category** (`vapourism.product_category`)
   - Display: Product Type
   - Show as: List

2. **Nicotine Strength** (`vapourism.nicotine_strength`)
   - Display: Nicotine Strength
   - Show as: List
   - Sort: By value (ascending)

3. **Flavour Profile** (`vapourism.flavour_profile`)
   - Display: Flavour
   - Show as: List

4. **Price Range**
   - Use Shopify's built-in price filter
   - Enable range slider

5. **Availability**
   - Use Shopify's built-in availability filter

6. **Brand** (Vendor)
   - Use Shopify's built-in vendor filter
   - Display: Brand

### Search Synonyms

Configure synonyms in Search & Discovery to improve search relevance:

| Term | Synonyms |
|------|----------|
| e-liquid | eliquid, e liquid, vape juice, juice |
| disposable | disposables, reusable, prefilled |
| nicotine | nic |
| 50/50 | fifty fifty, 5050 |
| MTL | mouth to lung, mouth-to-lung |
| DTL | direct to lung, direct-to-lung |
| mg | milligram, strength |

## Implementation Notes

### For Product Tagging Tool

When populating metafields:

1. **Normalize values** to lowercase with underscores
2. **Use consistent terminology** from the approved vocabulary above
3. **Multi-value fields** (like `flavour_profile`) should be arrays
4. **Always include `product_category`** as it's the primary facet

### For Storefront

The storefront code does NOT need to:
- Build facets from product data
- Parse complex tag formats
- Expand tags to filters

The storefront ONLY needs to:
- Pass search queries to Shopify
- Let Shopify handle filtering via native `productFilters` parameter
- Display search results

### API Example

Using Shopify Storefront API with filters:

```graphql
query Search($query: String!, $productFilters: [ProductFilter!]) {
  search(query: $query, productFilters: $productFilters, types: PRODUCT) {
    edges {
      node {
        ... on Product {
          id
          title
          handle
        }
      }
    }
    productFilters {
      id
      label
      type
      values {
        id
        label
        count
      }
    }
  }
}
```

## Migration from Tag-Based Filtering

### Before (Complex Tag System)
- Products tagged with `filter:category:disposable`, `filter:nicotine_strength:20mg`
- Storefront code parsed tags, built facets, expanded filters
- Required `getCachedFacets()` to fetch ALL products

### After (Metafield System)
- Products have metafields like `vapourism.nicotine_strength: "20mg"`
- Search & Discovery app handles filtering
- Storefront just passes queries to Shopify's native search

### Benefits
1. **Performance**: No need to fetch all products for facet calculation
2. **Maintainability**: Filter config managed in Shopify Admin, not code
3. **Reliability**: Shopify handles edge cases, caching, optimization
4. **Flexibility**: Easy to add/remove filters without code changes

## Future Enhancements

1. **Smart Collections**: Use metafields to auto-generate collections
2. **Merchandising Boosts**: Configure product boosting in Search & Discovery
3. **Personalization**: Use metafields for recommendation engines
4. **Analytics**: Track filter usage for product insights

## References

- [Shopify Search & Discovery App](https://help.shopify.com/en/manual/online-store/search-and-discovery)
- [Metafield Definitions](https://help.shopify.com/en/manual/custom-data/metafields/metafield-definitions)
- [Storefront API Search](https://shopify.dev/docs/api/storefront/2025-01/queries/search)
- [Product Filters in GraphQL](https://shopify.dev/docs/api/storefront/2025-01/input-objects/ProductFilter)
