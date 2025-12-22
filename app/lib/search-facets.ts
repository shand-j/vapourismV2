import type {SearchProduct} from './shopify-search';
import {
  parseParsedAttributes,
  parseVariantAttributes,
  getAttributeValue,
  formatAttributeValue,
  FILTERABLE_ATTRIBUTES,
  VARIANT_FILTERABLE_ATTRIBUTES,
  ATTRIBUTE_LABELS,
  type ParsedAttributes,
  type ParsedVariantAttributes,
  type FilterableAttribute,
  type VariantFilterableAttribute,
} from './parsed-attributes';

export const FILTER_TAG_PREFIX = 'filter:';

/**
 * Filter group key - now aligned with parsed_attributes fields
 * Still supports legacy tag-based keys for backwards compatibility
 */
export type FilterGroupKey =
  | 'product_type'
  | 'brand'
  | 'flavour_category'
  | 'nicotine_strength'
  | 'cbd_strength'
  | 'cbd_type'
  | 'cbd_form'
  | 'device_type'
  | 'volume'
  | 'capacity'
  | 'pack_size'
  | 'puff_count'
  | 'battery_capacity'
  | 'coil_resistance'
  | 'material'
  | 'color'
  | 'size'
  // Legacy keys for backwards compatibility
  | 'category'
  | 'bottle_size'
  | 'device_style'
  | 'flavour_type'
  | 'nicotine_type'
  | 'power_supply'
  | 'vg_ratio'
  | 'vaping_style'
  | 'pod_type'
  | 'accessory_type'
  | 'tank_parts'
  | 'coil_ohm'
  | 'promo'
  | 'curation';

interface FilterGroupConfig {
  key: FilterGroupKey;
  label: string;
  /** Mapped attribute key from parsed_attributes */
  attributeKey?: FilterableAttribute;
  /** Categories this filter applies to */
  appliesTo?: string[];
}

/**
 * Filter groups configuration
 * Maps to both new parsed_attributes and legacy tag system
 */
export const TAG_FILTER_GROUPS: FilterGroupConfig[] = [
  // Primary Categories - mapped to parsed_attributes
  {key: 'product_type', label: 'Product Type', attributeKey: 'product_type'},
  {key: 'brand', label: 'Brand', attributeKey: 'brand'},
  {key: 'flavour_category', label: 'Flavour', attributeKey: 'flavour_category'},
  {key: 'nicotine_strength', label: 'Nicotine Strength', attributeKey: 'nicotine_strength'},
  {key: 'volume', label: 'Volume', attributeKey: 'volume'},
  {key: 'capacity', label: 'Capacity', attributeKey: 'capacity'},
  {key: 'puff_count', label: 'Puff Count', attributeKey: 'puff_count'},
  {key: 'battery_capacity', label: 'Battery', attributeKey: 'battery_capacity'},
  {key: 'coil_resistance', label: 'Coil Resistance', attributeKey: 'coil_resistance'},
  {key: 'device_type', label: 'Device Type', attributeKey: 'device_type'},
  {key: 'pack_size', label: 'Pack Size', attributeKey: 'pack_size'},
  // CBD-specific
  {key: 'cbd_strength', label: 'CBD Strength', attributeKey: 'cbd_strength'},
  {key: 'cbd_type', label: 'CBD Type', attributeKey: 'cbd_type'},
  {key: 'cbd_form', label: 'CBD Form', attributeKey: 'cbd_form'},
  // Material & appearance
  {key: 'material', label: 'Material', attributeKey: 'material'},
  {key: 'color', label: 'Color', attributeKey: 'color'},
  {key: 'size', label: 'Size', attributeKey: 'size'},
  // Legacy keys - kept for backwards compatibility with existing URLs
  {key: 'category', label: 'Product Type', attributeKey: 'product_type'},
  {key: 'bottle_size', label: 'Volume', attributeKey: 'volume'},
  {key: 'flavour_type', label: 'Flavour', attributeKey: 'flavour_category'},
  {key: 'coil_ohm', label: 'Coil Resistance', attributeKey: 'coil_resistance'},
];

const TAG_CONFIG_MAP = new Map(TAG_FILTER_GROUPS.map((config) => [config.key, config]));

export interface ParsedFilterTag {
  groupKey: FilterGroupKey;
  value: string;
}

export function parseFilterTag(tag: string): ParsedFilterTag | null {
  if (!tag || typeof tag !== 'string') return null;
  if (!tag.toLowerCase().startsWith(FILTER_TAG_PREFIX)) return null;
  const remainder = tag.slice(FILTER_TAG_PREFIX.length);
  if (!remainder.includes(':')) return null;
  const [groupRaw, ...valueParts] = remainder.split(':');
  const valueRaw = valueParts.join(':');
  if (!groupRaw || !valueRaw) return null;
  const normalizedGroup = groupRaw.trim().toLowerCase() as FilterGroupKey;
  if (!TAG_CONFIG_MAP.has(normalizedGroup)) return null;
  return {
    groupKey: normalizedGroup,
    value: valueRaw.trim(),
  };
}

/**
 * Parse attribute filter from URL parameter format
 * Format: attributeKey:value (e.g., "product_type:e-liquid")
 */
export function parseAttributeFilter(param: string): { key: FilterableAttribute; value: string } | null {
  if (!param || typeof param !== 'string') return null;
  const colonIndex = param.indexOf(':');
  if (colonIndex === -1) return null;
  
  const key = param.slice(0, colonIndex) as FilterableAttribute;
  const value = param.slice(colonIndex + 1);
  
  if (!FILTERABLE_ATTRIBUTES.includes(key)) return null;
  if (!value) return null;
  
  return { key, value };
}

export function formatFacetLabel(value: string): string {
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase()) || value;
}

export interface FacetOption {
  value: string; // Filter value (attributeKey:value format for new system)
  label: string;
  count: number;
  originalTags?: string[]; // Legacy - for tag mapping
  originalValue?: string; // Original value for filters
}

export interface TagFacetGroup {
  key: FilterGroupKey;
  label: string;
  options: FacetOption[];
  /** The corresponding parsed_attributes key */
  attributeKey?: FilterableAttribute;
}

export interface PriceSummary {
  min: number;
  max: number;
  currencyCode: string;
}

/**
 * Extract facets from parsed_attributes metafield (product-level)
 * and parsed_variant_attributes metafield (variant-level)
 * This is the primary facet extraction method for the new system
 */
function extractParsedAttributesFacets(
  products: SearchProduct[],
  groupOptionMap: Map<FilterGroupKey, Map<string, FacetOption & {productIds: Set<string>}>>,
) {
  products.forEach((product) => {
    const attributes = parseParsedAttributes(product.parsedAttributesJson);
    
    // Process product-level attributes
    if (attributes) {
      for (const attrKey of FILTERABLE_ATTRIBUTES) {
        // Use the getAttributeValue helper that handles both old and new schema
        const value = getAttributeValue(attributes, attrKey);
        if (value === null || value === undefined) continue;
        
        // Find the group key for this attribute
        const groupConfig = TAG_FILTER_GROUPS.find(g => g.attributeKey === attrKey);
        if (!groupConfig) continue;
        
        const groupKey = groupConfig.key;
        const group = groupOptionMap.get(groupKey) ?? new Map();
        groupOptionMap.set(groupKey, group);

        // Handle array values (like flavour_categories, nicotine_strengths)
        const values = Array.isArray(value) ? value : [value];
        
        for (const v of values) {
          if (!v) continue;
          const filterValue = `${attrKey}:${v}`;
          const option = group.get(filterValue) ?? {
            value: filterValue,
            label: formatAttributeValue(v),
            count: 0,
            productIds: new Set<string>(),
            originalValue: v,
          };
          
          if (!option.productIds.has(product.id)) {
            option.productIds.add(product.id);
            option.count += 1;
          }
          group.set(filterValue, option);
        }
      }
    }
    
    // Process variant-level attributes from parsed_variant_attributes
    if (product.variants && product.variants.length > 0) {
      for (const variant of product.variants) {
        const variantAttrs = parseVariantAttributes(variant.parsedVariantAttributesJson);
        if (!variantAttrs) continue;
        
        // Extract variant-specific attributes
        for (const attrKey of VARIANT_FILTERABLE_ATTRIBUTES) {
          const value = variantAttrs[attrKey];
          if (!value) continue;
          
          // Map variant attribute to group key
          // Most variant attributes map directly to product-level filter groups
          let groupKey: FilterGroupKey = attrKey as FilterGroupKey;
          if (attrKey === 'flavour') {
            // 'flavour' from variant adds to 'flavour' filter but we need to check
            // if we want a separate filter or combine with flavour_category
            groupKey = 'flavour_category'; // Combine into flavour category for now
          }
          
          const groupConfig = TAG_FILTER_GROUPS.find(g => g.key === groupKey || g.attributeKey === attrKey);
          if (!groupConfig) continue;
          
          const finalGroupKey = groupConfig.key;
          const group = groupOptionMap.get(finalGroupKey) ?? new Map();
          groupOptionMap.set(finalGroupKey, group);
          
          const filterValue = `${groupConfig.attributeKey || attrKey}:${value}`;
          const option = group.get(filterValue) ?? {
            value: filterValue,
            label: formatAttributeValue(value),
            count: 0,
            productIds: new Set<string>(),
            originalValue: value,
          };
          
          // Count at product level (not variant level) to avoid duplicates
          if (!option.productIds.has(product.id)) {
            option.productIds.add(product.id);
            option.count += 1;
          }
          group.set(filterValue, option);
        }
      }
    }
  });
}

/**
 * Extract facets from product fields (vendor, productType) as fallback
 * Also extracts from legacy tags for backwards compatibility
 */
function extractFallbackFacets(
  products: SearchProduct[],
  groupOptionMap: Map<FilterGroupKey, Map<string, FacetOption & {productIds: Set<string>}>>,
) {
  products.forEach((product) => {
    // Extract Brand facets from vendor field (fallback if not in parsed_attributes)
    if (product.vendor) {
      const brandGroup = groupOptionMap.get('brand') ?? new Map();
      groupOptionMap.set('brand', brandGroup);
      const brandValue = `brand:${product.vendor}`;
      const brandOption = brandGroup.get(brandValue) ?? {
        value: brandValue,
        label: product.vendor,
        count: 0,
        productIds: new Set<string>(),
        originalValue: product.vendor,
      };
      if (!brandOption.productIds.has(product.id)) {
        brandOption.productIds.add(product.id);
        brandOption.count += 1;
      }
      brandGroup.set(brandValue, brandOption);
    }

    // Extract Category facets from productType field (fallback if not in parsed_attributes)
    if (product.productType) {
      const categoryGroup = groupOptionMap.get('product_type') ?? new Map();
      groupOptionMap.set('product_type', categoryGroup);
      const categoryValue = `product_type:${product.productType.toLowerCase().replace(/\s+/g, '_')}`;
      const categoryOption = categoryGroup.get(categoryValue) ?? {
        value: categoryValue,
        label: product.productType,
        count: 0,
        productIds: new Set<string>(),
        originalValue: product.productType,
      };
      if (!categoryOption.productIds.has(product.id)) {
        categoryOption.productIds.add(product.id);
        categoryOption.count += 1;
      }
      categoryGroup.set(categoryValue, categoryOption);
    }

    // Extract facets from legacy tags (backwards compatibility)
    const productTags = product.tags || [];
    productTags.forEach((tag) => {
      const lowerTag = tag.toLowerCase();
      
      // Look for nicotine strength patterns (e.g., "20mg", "0mg")
      if (/^\d+mg$/i.test(tag)) {
        const nicotineGroup = groupOptionMap.get('nicotine_strength') ?? new Map();
        groupOptionMap.set('nicotine_strength', nicotineGroup);
        const nicotineValue = `nicotine_strength:${tag.toLowerCase()}`;
        const nicotineOption = nicotineGroup.get(nicotineValue) ?? {
          value: nicotineValue,
          label: tag,
          count: 0,
          productIds: new Set<string>(),
          originalValue: tag,
        };
        if (!nicotineOption.productIds.has(product.id)) {
          nicotineOption.productIds.add(product.id);
          nicotineOption.count += 1;
        }
        nicotineGroup.set(nicotineValue, nicotineOption);
      }

      // Look for volume patterns (e.g., "10ml", "50ml")
      if (/^\d+ml$/i.test(tag)) {
        const sizeGroup = groupOptionMap.get('volume') ?? new Map();
        groupOptionMap.set('volume', sizeGroup);
        const sizeValue = `volume:${tag.toLowerCase()}`;
        const sizeOption = sizeGroup.get(sizeValue) ?? {
          value: sizeValue,
          label: tag,
          count: 0,
          productIds: new Set<string>(),
          originalValue: tag,
        };
        if (!sizeOption.productIds.has(product.id)) {
          sizeOption.productIds.add(product.id);
          sizeOption.count += 1;
        }
        sizeGroup.set(sizeValue, sizeOption);
      }

      // Look for common flavor patterns and map to flavour_category
      const flavorKeywords = [
        {keyword: 'fruit', category: 'fruity'},
        {keyword: 'ice', category: 'ice'},
        {keyword: 'menthol', category: 'ice'},
        {keyword: 'tobacco', category: 'tobacco'},
        {keyword: 'dessert', category: 'desserts/bakery'},
        {keyword: 'sweet', category: 'candy/sweets'},
        {keyword: 'cool', category: 'ice'},
        {keyword: 'beverage', category: 'beverages'},
        {keyword: 'candy', category: 'candy/sweets'},
      ];
      
      for (const {keyword, category} of flavorKeywords) {
        if (lowerTag.includes(keyword)) {
          const flavorGroup = groupOptionMap.get('flavour_category') ?? new Map();
          groupOptionMap.set('flavour_category', flavorGroup);
          const flavorValue = `flavour_category:${category}`;
          const flavorOption = flavorGroup.get(flavorValue) ?? {
            value: flavorValue,
            label: formatFacetLabel(category),
            count: 0,
            productIds: new Set<string>(),
            originalValue: category,
            originalTags: [],
          };
          if (!flavorOption.productIds.has(product.id)) {
            flavorOption.productIds.add(product.id);
            flavorOption.count += 1;
          }
          if (flavorOption.originalTags && !flavorOption.originalTags.includes(tag)) {
            flavorOption.originalTags.push(tag);
          }
          flavorGroup.set(flavorValue, flavorOption);
          break; // Only match first flavor category
        }
      }
    });
  });
}

export function buildTagFacetGroups(
  products: SearchProduct[],
  selectedTags: string[] = [],
): TagFacetGroup[] {
  const groupOptionMap = new Map<FilterGroupKey, Map<string, FacetOption & {productIds: Set<string>}>>();
  const selectedSet = new Set(selectedTags);

  // First, process parsed_attributes metafield (primary source)
  extractParsedAttributesFacets(products, groupOptionMap);

  // Then, extract fallback facets from product fields and legacy tags
  extractFallbackFacets(products, groupOptionMap);

  // Process legacy filter: tags for backwards compatibility
  products.forEach((product) => {
    const productTags = new Set(product.tags || []);
    productTags.forEach((tag) => {
      const parsed = parseFilterTag(tag);
      if (!parsed) return;
      const config = TAG_CONFIG_MAP.get(parsed.groupKey);
      if (!config) return;
      const group = groupOptionMap.get(parsed.groupKey) ?? new Map();
      groupOptionMap.set(parsed.groupKey, group);
      
      // Convert legacy tag to new format if possible
      const attrKey = config.attributeKey;
      const filterValue = attrKey ? `${attrKey}:${parsed.value}` : tag;
      
      const option = group.get(filterValue) ?? {
        value: filterValue,
        label: formatFacetLabel(parsed.value),
        count: 0,
        productIds: new Set<string>(),
        originalValue: parsed.value,
      };
      if (!option.productIds.has(product.id)) {
        option.productIds.add(product.id);
        option.count += 1;
      }
      group.set(filterValue, option);
    });
  });

  // Ensure selected filters remain visible even if zero results currently match
  selectedSet.forEach((filter) => {
    // Try parsing as new attribute format first
    const attrFilter = parseAttributeFilter(filter);
    if (attrFilter) {
      const groupConfig = TAG_FILTER_GROUPS.find(g => g.attributeKey === attrFilter.key);
      if (groupConfig) {
        const group = groupOptionMap.get(groupConfig.key) ?? new Map();
        groupOptionMap.set(groupConfig.key, group);
        if (!group.has(filter)) {
          group.set(filter, {
            value: filter,
            label: formatAttributeValue(attrFilter.value),
            count: 0,
            productIds: new Set<string>(),
            originalValue: attrFilter.value,
          });
        }
      }
      return;
    }
    
    // Fall back to legacy tag parsing
    const parsed = parseFilterTag(filter);
    if (!parsed) return;
    const config = TAG_CONFIG_MAP.get(parsed.groupKey);
    if (!config) return;
    const group = groupOptionMap.get(parsed.groupKey) ?? new Map();
    groupOptionMap.set(parsed.groupKey, group);
    if (!group.has(filter)) {
      group.set(filter, {
        value: filter,
        label: formatFacetLabel(parsed.value),
        count: 0,
        productIds: new Set<string>(),
        originalValue: parsed.value,
      });
    }
  });

  // Build final facet groups, removing duplicates
  // Use explicit list of primary keys to filter out legacy duplicates
  const primaryAttributeKeys = new Set<string>([
    'product_type', 'brand', 'flavour_category', 'nicotine_strength',
    'volume', 'capacity', 'puff_count', 'battery_capacity', 'coil_resistance',
    'device_type', 'pack_size', 'cbd_strength', 'cbd_type', 'cbd_form',
    'material', 'color', 'size'
  ]);
  const seenAttributeKeys = new Set<string>();
  
  return TAG_FILTER_GROUPS
    .filter(config => {
      // For configs with an attributeKey, check if it's a primary key or a legacy alias
      if (config.attributeKey) {
        // If we've already processed this attributeKey, skip
        if (seenAttributeKeys.has(config.attributeKey)) {
          return false;
        }
        // Only include if the key itself is a primary key OR the config.key matches the attributeKey
        // This ensures primary keys are used instead of legacy aliases
        if (primaryAttributeKeys.has(config.key) || config.key === config.attributeKey) {
          seenAttributeKeys.add(config.attributeKey);
          return true;
        }
        // Skip legacy keys (like 'category' -> 'product_type')
        return false;
      }
      // Include configs without attributeKey (legacy-only filters)
      return true;
    })
    .map((config) => {
      const options = groupOptionMap.get(config.key);
      if (!options || options.size === 0) return null;
      
      // Deduplicate options by label
      const labelMap = new Map<string, FacetOption & {productIds: Set<string>}>();
      for (const option of options.values()) {
        const existing = labelMap.get(option.label);
        if (existing) {
          // Merge counts
          for (const id of option.productIds) {
            if (!existing.productIds.has(id)) {
              existing.productIds.add(id);
              existing.count += 1;
            }
          }
        } else {
          labelMap.set(option.label, option);
        }
      }
      
      const normalizedOptions = Array.from(labelMap.values()).map((option) => ({
        value: option.value,
        label: option.label,
        count: option.count,
        originalValue: option.originalValue,
        originalTags: option.originalTags,
      }));
      
      normalizedOptions.sort((a, b) => {
        if (config.key === 'brand') {
          return a.label.toLowerCase().localeCompare(b.label.toLowerCase());
        }
        if (b.count === a.count) {
          return a.label.localeCompare(b.label);
        }
        return b.count - a.count;
      });
      
      return {
        key: config.key,
        label: config.label,
        options: normalizedOptions,
        attributeKey: config.attributeKey,
      } satisfies TagFacetGroup;
    })
    .filter(Boolean) as TagFacetGroup[];
}

/**
 * Get display label for a filter value
 * Supports both new attribute format and legacy tag format
 */
export function getTagDisplayLabel(filter: string): string {
  // Try new attribute format first (attributeKey:value)
  const attrFilter = parseAttributeFilter(filter);
  if (attrFilter) {
    const label = ATTRIBUTE_LABELS[attrFilter.key] || formatFacetLabel(attrFilter.key);
    const valueLabel = formatAttributeValue(attrFilter.value);
    return `${label}: ${valueLabel}`;
  }
  
  // Fall back to legacy tag format
  const parsed = parseFilterTag(filter);
  if (!parsed) return filter;
  const group = TAG_CONFIG_MAP.get(parsed.groupKey);
  const valueLabel = formatFacetLabel(parsed.value);
  if (group) {
    return `${group.label}: ${valueLabel}`;
  }
  return valueLabel;
}

/**
 * UK VAT rate (20%)
 * Shopify prices are stored ex-VAT, we add VAT for display.
 */
const UK_VAT_RATE = 0.2;

export function calculatePriceSummary(products: SearchProduct[]): PriceSummary | null {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  let currencyCode: string | null = null;

  products.forEach((product) => {
    const amountRaw = product.priceRange?.minVariantPrice?.amount;
    if (!amountRaw) return;
    const numericAmount = parseFloat(amountRaw);
    if (Number.isNaN(numericAmount)) return;
    currencyCode = currencyCode ?? product.priceRange.minVariantPrice.currencyCode ?? 'GBP';
    min = Math.min(min, numericAmount);
    max = Math.max(max, numericAmount);
  });

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return null;
  }

  // Return VAT-inclusive prices for display
  return {
    min: min * (1 + UK_VAT_RATE),
    max: max * (1 + UK_VAT_RATE),
    currencyCode: currencyCode ?? 'GBP',
  };
}

/**
 * Filter products by parsed_attributes and parsed_variant_attributes
 * Used for client-side filtering when server-side filtering is not available
 * Checks both product-level and variant-level attributes
 */
export function filterProductsByAttributes(
  products: SearchProduct[],
  filters: Record<string, string | string[]>,
): SearchProduct[] {
  if (Object.keys(filters).length === 0) return products;

  return products.filter((product) => {
    const attributes = parseParsedAttributes(product.parsedAttributesJson);
    
    // Parse all variant attributes
    const variantAttributesList: ParsedVariantAttributes[] = [];
    if (product.variants) {
      for (const variant of product.variants) {
        const variantAttrs = parseVariantAttributes(variant.parsedVariantAttributesJson);
        if (variantAttrs) {
          variantAttributesList.push(variantAttrs);
        }
      }
    }
    
    for (const [key, filterValue] of Object.entries(filters)) {
      if (!filterValue) continue;
      
      // Parse the filter key to get attribute key
      const attrKey = key as FilterableAttribute;
      const filterValues = Array.isArray(filterValue) ? filterValue : [filterValue];
      let matched = false;
      
      // Check parsed_attributes (product level)
      if (attributes && FILTERABLE_ATTRIBUTES.includes(attrKey)) {
        const productValue = getAttributeValue(attributes, attrKey);
        
        if (productValue !== null && productValue !== undefined) {
          if (Array.isArray(productValue)) {
            matched = filterValues.some((fv) =>
              productValue.some((pv) => pv.toLowerCase() === fv.toLowerCase())
            );
          } else {
            matched = filterValues.some(
              (fv) => productValue.toLowerCase() === fv.toLowerCase()
            );
          }
        }
      }
      
      // Check parsed_variant_attributes if not matched at product level
      if (!matched && variantAttributesList.length > 0) {
        const variantKey = key as VariantFilterableAttribute;
        if (VARIANT_FILTERABLE_ATTRIBUTES.includes(variantKey as any)) {
          matched = variantAttributesList.some((va) => {
            const variantValue = va[variantKey];
            if (!variantValue) return false;
            return filterValues.some(
              (fv) => variantValue.toLowerCase() === fv.toLowerCase()
            );
          });
        }
      }
      
      // Fallback to product fields
      if (!matched && attrKey === 'brand' && product.vendor) {
        if (filterValues.some(fv => product.vendor.toLowerCase() === fv.toLowerCase())) {
          matched = true;
        }
      }
      
      if (!matched && attrKey === 'product_type' && product.productType) {
        if (filterValues.some(fv => 
          product.productType.toLowerCase() === fv.toLowerCase() ||
          product.productType.toLowerCase().replace(/\s+/g, '_') === fv.toLowerCase()
        )) {
          matched = true;
        }
      }
      
      // Check tags as last fallback
      if (!matched) {
        const productTags = (product.tags || []).map(t => t.toLowerCase());
        if (filterValues.some(fv => productTags.includes(fv.toLowerCase()))) {
          matched = true;
        }
      }
      
      // Filter did not match anywhere
      if (!matched) return false;
    }
    
    return true;
  });
}
