import type {SearchProduct} from './shopify-search';

export const FILTER_TAG_PREFIX = 'filter:';

export type FilterGroupKey =
  | 'category'
  | 'capacity'
  | 'bottle_size'
  | 'device_style'
  | 'nicotine_strength'
  | 'cbd_strength'
  | 'cbd_form'
  | 'cbd_type'
  | 'flavour_type'
  | 'nicotine_type'
  | 'power_supply'
  | 'vg_ratio'
  | 'vaping_style'
  | 'pod_type'
  | 'accessory_type'
  | 'tank_parts'
  | 'coil_ohm'
  | 'brand'
  | 'promo'
  | 'curation';

interface FilterGroupConfig {
  key: FilterGroupKey;
  label: string;
  /** Categories this filter applies to (from approved vocabulary) */
  appliesTo?: string[];
}

export const TAG_FILTER_GROUPS: FilterGroupConfig[] = [
  // Primary Categories (Data Analyst Priority Order)
  {key: 'category', label: 'Product Type'},
  {key: 'capacity', label: 'Capacity', appliesTo: ['tank', 'pod']},
  {key: 'bottle_size', label: 'Bottle Size', appliesTo: ['e-liquid']},
  {key: 'device_style', label: 'Device Style', appliesTo: ['device', 'pod_system']},
  {key: 'nicotine_strength', label: 'Nicotine Strength', appliesTo: ['e-liquid', 'disposable', 'device', 'pod_system', 'nicotine_pouches']},
  {key: 'cbd_strength', label: 'CBD Strength', appliesTo: ['CBD']},
  {key: 'cbd_form', label: 'CBD Form', appliesTo: ['CBD']},
  {key: 'cbd_type', label: 'CBD Type', appliesTo: ['CBD']},
  {key: 'flavour_type', label: 'Flavour Type', appliesTo: ['e-liquid', 'disposable', 'nicotine_pouches', 'pod']},
  {key: 'nicotine_type', label: 'Nicotine Type', appliesTo: ['e-liquid', 'disposable', 'device', 'pod_system', 'nicotine_pouches']},
  {key: 'power_supply', label: 'Power Supply', appliesTo: ['device', 'pod_system']},
  {key: 'vg_ratio', label: 'VG/PG Ratio', appliesTo: ['e-liquid']},
  {key: 'vaping_style', label: 'Vaping Style', appliesTo: ['device', 'pod_system', 'e-liquid']},
  {key: 'pod_type', label: 'Pod Type', appliesTo: ['pod']},
  {key: 'accessory_type', label: 'Accessory Type', appliesTo: ['accessory']},
  {key: 'tank_parts', label: 'Tank Parts', appliesTo: ['tank']},
  {key: 'coil_ohm', label: 'Coil Resistance', appliesTo: ['coil', 'device', 'pod_system']},
  {key: 'brand', label: 'Brand'},
  // Secondary Categories
  {key: 'promo', label: 'Promotions'},
  {key: 'curation', label: 'Curated Sets'},
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

export function formatFacetLabel(value: string): string {
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase()) || value;
}

export interface FacetOption {
  value: string; // raw tag value
  label: string;
  count: number;
  originalTags?: string[]; // Only for deduped flavour_type options
  originalValue?: string; // Original value for synthetic filters (brand, category)
}

export interface TagFacetGroup {
  key: FilterGroupKey;
  label: string;
  options: FacetOption[];
}

export interface PriceSummary {
  min: number;
  max: number;
  currencyCode: string;
}

/**
 * Extract facets from existing product data (fallback while filter tags are being implemented)
 */
function extractFallbackFacets(
  products: SearchProduct[],
  groupOptionMap: Map<FilterGroupKey, Map<string, FacetOption & {productIds: Set<string>}>>,
) {
  products.forEach((product) => {
    // Extract Brand facets from vendor field
    if (product.vendor) {
      const brandGroup = groupOptionMap.get('brand') ?? new Map();
      groupOptionMap.set('brand', brandGroup);
      const brandTag = `filter:brand:${product.vendor.toLowerCase().replace(/\s+/g, '_')}`;
      const brandOption = brandGroup.get(brandTag) ?? {
        value: brandTag,
        label: product.vendor,
        count: 0,
        productIds: new Set<string>(),
        originalValue: product.vendor, // Store original vendor name
      };
      if (!brandOption.productIds.has(product.id)) {
        brandOption.productIds.add(product.id);
        brandOption.count += 1;
      }
      brandGroup.set(brandTag, brandOption);
    }

    // Extract Category facets from productType field
    if (product.productType) {
      const categoryGroup = groupOptionMap.get('category') ?? new Map();
      groupOptionMap.set('category', categoryGroup);
      const categoryTag = `filter:category:${product.productType.toLowerCase().replace(/\s+/g, '_')}`;
      const categoryOption = categoryGroup.get(categoryTag) ?? {
        value: categoryTag,
        label: product.productType,
        count: 0,
        productIds: new Set<string>(),
        originalValue: product.productType, // Store original productType
      };
      if (!categoryOption.productIds.has(product.id)) {
        categoryOption.productIds.add(product.id);
        categoryOption.count += 1;
      }
      categoryGroup.set(categoryTag, categoryOption);
    }

    // Extract facets from existing tags (look for common patterns)
    const productTags = product.tags || [];
    productTags.forEach((tag) => {
      const lowerTag = tag.toLowerCase();
      
      // Look for nicotine strength patterns (e.g., "20mg", "0mg")
      if (/^\d+mg$/i.test(tag)) {
        const nicotineGroup = groupOptionMap.get('nicotine_strength') ?? new Map();
        groupOptionMap.set('nicotine_strength', nicotineGroup);
        // Use the original tag as the value instead of synthetic filter tag
        const nicotineOption = nicotineGroup.get(tag) ?? {
          value: tag, // Use original tag for filtering
          label: tag,
          count: 0,
          productIds: new Set<string>(),
        };
        if (!nicotineOption.productIds.has(product.id)) {
          nicotineOption.productIds.add(product.id);
          nicotineOption.count += 1;
        }
        nicotineGroup.set(tag, nicotineOption);
      }

      // Look for bottle size patterns (e.g., "10ml", "50ml")
      if (/^\d+ml$/i.test(tag)) {
        const sizeGroup = groupOptionMap.get('bottle_size') ?? new Map();
        groupOptionMap.set('bottle_size', sizeGroup);
        // Use the original tag as the value instead of synthetic filter tag
        const sizeOption = sizeGroup.get(tag) ?? {
          value: tag, // Use original tag for filtering
          label: tag,
          count: 0,
          productIds: new Set<string>(),
        };
        if (!sizeOption.productIds.has(product.id)) {
          sizeOption.productIds.add(product.id);
          sizeOption.count += 1;
        }
        sizeGroup.set(tag, sizeOption);
      }

      // Look for common flavor patterns
      const flavorKeywords = ['fruit', 'ice', 'menthol', 'tobacco', 'dessert', 'sweet', 'cool'];
        flavorKeywords.forEach((keyword) => {
          if (lowerTag.includes(keyword)) {
            const flavorGroup = groupOptionMap.get('flavour_type') ?? new Map();
            groupOptionMap.set('flavour_type', flavorGroup);
            // Deduplicate by keyword, aggregate product IDs and count
            const flavorTag = `filter:flavour_type:${keyword}`;
            const flavorOption = flavorGroup.get(flavorTag) ?? {
              value: flavorTag,
              label: keyword.charAt(0).toUpperCase() + keyword.slice(1),
              count: 0,
              productIds: new Set<string>(),
              originalTags: [],
            };
            if (!flavorOption.productIds.has(product.id)) {
              flavorOption.productIds.add(product.id);
              flavorOption.count += 1;
            }
            // Track original tags for deduplication mapping
            if (!flavorOption.originalTags) {
              flavorOption.originalTags = [];
            }
            if (!flavorOption.originalTags.includes(tag)) {
              flavorOption.originalTags.push(tag);
            }
            flavorGroup.set(flavorTag, flavorOption);
          }
        });
    });
  });
}

export function buildTagFacetGroups(
  products: SearchProduct[],
  selectedTags: string[] = [],
): TagFacetGroup[] {
  const groupOptionMap = new Map<FilterGroupKey, Map<string, FacetOption & {productIds: Set<string>}>>();
  const selectedSet = new Set(selectedTags);

  // First, process proper filter: tags
  products.forEach((product) => {
    const productTags = new Set(product.tags || []);
    productTags.forEach((tag) => {
      const parsed = parseFilterTag(tag);
      if (!parsed) return;
      const config = TAG_CONFIG_MAP.get(parsed.groupKey);
      if (!config) return;
      const group = groupOptionMap.get(parsed.groupKey) ?? new Map();
      groupOptionMap.set(parsed.groupKey, group);
      const option = group.get(tag) ?? {
        value: tag,
        label: formatFacetLabel(parsed.value),
        count: 0,
        productIds: new Set<string>(),
      };
      if (!option.productIds.has(product.id)) {
        option.productIds.add(product.id);
        option.count += 1;
      }
      group.set(tag, option);
    });
  });

  // Then, extract fallback facets from existing product data
  extractFallbackFacets(products, groupOptionMap);

  // Ensure selected tags remain visible even if zero results currently match
  selectedSet.forEach((tag) => {
    const parsed = parseFilterTag(tag);
    if (!parsed) return;
    const config = TAG_CONFIG_MAP.get(parsed.groupKey);
    if (!config) return;
    const group = groupOptionMap.get(parsed.groupKey) ?? new Map();
    groupOptionMap.set(parsed.groupKey, group);
    if (!group.has(tag)) {
      group.set(tag, {
        value: tag,
        label: formatFacetLabel(parsed.value),
        count: 0,
        productIds: new Set<string>(),
      });
    }
  });

  return TAG_FILTER_GROUPS
    .map((config) => {
      const options = groupOptionMap.get(config.key);
      if (!options || options.size === 0) return null;
      const normalizedOptions = Array.from(options.values()).map((option) => {
        // For flavour_type, include originalTags for mapping
        if (config.key === 'flavour_type') {
          return {
            value: option.value,
            label: option.label,
            count: option.count,
            originalTags: Array.from(option.originalTags ?? []),
          };
        }
        // For brand and category, include originalValue for case-sensitive matching
        if (config.key === 'brand' || config.key === 'category') {
          return {
            value: option.value,
            label: option.label,
            count: option.count,
            originalValue: option.originalValue,
          };
        }
        return {
          value: option.value,
          label: option.label,
          count: option.count,
        };
      });
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
      } satisfies TagFacetGroup;
    })
    .filter(Boolean) as TagFacetGroup[];
}

export function getTagDisplayLabel(tag: string): string {
  const parsed = parseFilterTag(tag);
  if (!parsed) return tag;
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
