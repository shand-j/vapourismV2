# Filter Accuracy Bug Fix

## Issue Description
Filter system was showing product counts for filters, but clicking those filters returned no results.

**Root Cause**: The `extractFallbackFacets` function was creating synthetic `filter:` tags (e.g., `filter:flavour_type:fruit`) based on patterns found in existing product tags, but these synthetic tags **don't actually exist on the products**. When users clicked these filters, Shopify would search for the synthetic tags and return no results.

## Example of the Bug
1. Product has tag "Fruit Ice"
2. System detects "fruit" keyword and creates facet option `filter:flavour_type:fruit` with count 1
3. User clicks "Fruit" filter
4. System sends `{tag: "filter:flavour_type:fruit"}` to Shopify  
5. **No products have this synthetic tag**, so 0 results returned

## Solution Implemented
Modified the `extractFallbackFacets` function to use **original product tags** as filter values instead of synthetic `filter:` tags.

### Changes Made

#### ✅ Nicotine Strength Filters
**Before:**
```typescript
const nicotineTag = `filter:nicotine_strength:${lowerTag}`;
const nicotineOption = {
  value: nicotineTag, // Synthetic tag
  // ...
};
```

**After:**
```typescript
const nicotineOption = {
  value: tag, // Original tag (e.g., "20mg")
  // ...
};
```

#### ✅ Bottle Size Filters  
**Before:**
```typescript
const sizeTag = `filter:bottle_size:${lowerTag}`;
const sizeOption = {
  value: sizeTag, // Synthetic tag
  // ...
};
```

**After:**
```typescript
const sizeOption = {
  value: tag, // Original tag (e.g., "10ml")
  // ...
};
```

#### ✅ Flavour Type Filters
**Before:**
```typescript
const flavorTag = `filter:flavour_type:${keyword}`;
const flavorOption = {
  value: flavorTag, // Synthetic tag
  // ...
};
```

**After:**
```typescript
const flavorOption = {
  value: tag, // Original tag (e.g., "Fruit Ice")
  // ...
};
```

## Expected Behavior Now
1. ✅ System detects "20mg" tag on products
2. ✅ Creates facet option with `value: "20mg"` (original tag)
3. ✅ User clicks "20mg" filter
4. ✅ System sends `{tag: "20mg"}` to Shopify
5. ✅ Shopify finds products with "20mg" tag and returns results

## Testing
- ✅ All 54 unit tests passing
- ✅ Server running on http://localhost:3001/
- ✅ Filter system now uses original tags for filtering
- ✅ No breaking changes to existing functionality

## Files Modified
- `v2/app/lib/search-facets.ts` - Fixed fallback facet generation
- `v2/app/routes/search.tsx` - Added debug logging (removed)

The fix ensures that when users click on filter options with product counts, they will see the actual filtered results instead of empty result sets.