# Tag-Based Navigation System

## Overview

Vapourism V2 uses a **pure tag-based navigation and filtering system** with no dependencies on Shopify collections. All navigation links route to `/search` with tag query parameters that filter products based on approved tags from `approved_tags.json`.

## Key Components

### 1. Approved Tags (`approved_tags.json`)

The controlled vocabulary for all product tags, organized by category:

- **Category tags**: `e-liquid`, `disposable`, `device`, `pod_system`, etc.
- **Attribute tags**: nicotine strength, bottle size, flavour type, VG/PG ratio, etc.
- **Rules**: Define how tags should be applied to products

### 2. Mega Menu (`app/lib/menu-config.ts`)

Static menu configuration that powers both desktop and mobile navigation:

```typescript
export const MEGA_MENU: MenuCategory[] = [
  {
    id: 'reusables',
    label: 'Reusables',
    tags: ['disposable'],
    columns: [
      {
        heading: 'By Flavour',
        links: [
          {
            label: 'Fruity',
            tags: ['disposable', 'fruity'],
            url: '/search?tag=disposable&tag=fruity'
          },
          // ... more links
        ]
      }
    ]
  }
  // ... more categories
]
```

**Key functions:**
- `buildSearchUrl(tags: string[])` - Converts tag arrays to search URLs
- `getHeroForTags(tags: string[])` - Returns category hero config for search pages
- `getMenuCategory(id: string)` - Retrieves menu category by ID
- `getMenuCategoryByTag(tag: string)` - Finds category by primary tag

### 3. Navigation Components

#### Desktop: `MegaMenu` (`app/components/navigation/MegaMenu.tsx`)
- Hover-based mega menu dropdown
- Shows category columns with tag-filtered links
- Includes category heroes and quiz links

#### Mobile: `MobileMenu` (`app/components/navigation/MegaMenu.tsx`)
- Slide-out drawer navigation
- Expandable category sections
- Same tag-based links as desktop

### 4. Search & Filters

#### Search Route (`app/routes/search.tsx`)
Handles all product browsing with tag-based filtering:

**Query Parameters:**
- `q` - Search query text
- `tag` - Product tags (multiple allowed)
- `sort` - Sort order (RELEVANCE, PRICE, etc.)
- `type` - Product type filter
- `vendor` - Brand filter
- `availability` - Stock status
- `price_min` / `price_max` - Price range

#### Filter Facets (`app/lib/search-facets.ts`)
Dynamically builds filter options from product tags:

```typescript
export function buildTagFacetGroups(
  products: SearchProduct[],
  selectedTags: string[] = []
): TagFacetGroup[]
```

**Filter Groups:**
- Category, capacity, bottle size
- Nicotine strength, nicotine type
- Flavour type, VG/PG ratio
- Device style, vaping style
- Brand (extracted from vendor)

### 5. Search Implementation (`app/lib/shopify-search.ts`)

Uses Shopify Storefront API for product search:

- **Predictive search**: Autocomplete suggestions (products + queries only, **no collections**)
- **Full search**: Paginated product results with filters
- **Edge caching**: Optimized for Oxygen deployment

**Key functions:**
- `predictiveSearch()` - Autocomplete results
- `searchProducts()` - Full search with filters
- `getCachedFacets()` - Cached filter options

## URL Structure

All product browsing uses the `/search` route:

```
/search                           # All products
/search?tag=disposable            # Disposables category
/search?tag=e-liquid&tag=nic_salt # Nic salt e-liquids
/search?tag=device&tag=pod_style  # Pod-style devices
/search?q=elf+bar                 # Text search
```

## Migration from Collections

Previous collection URLs automatically redirect to tag-based search (handled by removed redirect routes). Users bookmarking old URLs like `/collections/disposables` would need to be redirected manually or via server-side configuration if needed.

## Benefits

1. **Simplicity**: No need to manage Shopify collections
2. **Flexibility**: Easy to add new categories and filters
3. **Performance**: Direct product queries, no collection overhead
4. **Consistency**: Single source of truth for navigation (approved tags)
5. **Maintainability**: Static configuration in code, easier to version control

## Adding New Navigation Items

To add a new category or filter:

1. **Update `approved_tags.json`** - Add new tag to controlled vocabulary
2. **Update `menu-config.ts`** - Add to MEGA_MENU structure
3. **Update `CATEGORY_HEROES`** - Add hero configuration for search page
4. **Tag products** - Apply new tag to relevant products in Shopify

Example:
```typescript
{
  id: 'new-category',
  label: 'New Category',
  tags: ['new_category'],
  hero: {
    title: 'New Category',
    subtitle: 'Description of new category',
    accentColor: '#3b82f6',
  },
  columns: [
    {
      heading: 'By Type',
      links: [
        {
          label: 'Type A',
          tags: ['new_category', 'type_a'],
          url: buildSearchUrl(['new_category', 'type_a'])
        }
      ]
    }
  ]
}
```

## Testing

- Navigation links should route to `/search?tag=...`
- Search filters should use approved tags
- No references to Shopify collections should exist
- Predictive search should return products and queries only (no collections)
