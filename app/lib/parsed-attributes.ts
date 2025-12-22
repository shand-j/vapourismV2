/**
 * Parsed Attributes Metafield Types and Utilities
 *
 * This module defines the structure for the custom.parsed_attributes metafield
 * used for product filtering and navigation. Tags are deprecated - all filtering
 * now uses this metafield.
 *
 * Metafield namespace: custom
 * Metafield key: parsed_attributes
 * Metafield type: json
 */

// =============================================================================
// PRODUCT TYPE CONSTANTS
// =============================================================================

export const PRODUCT_TYPES = {
  E_LIQUID: 'e-liquid',
  DISPOSABLE_VAPE: 'disposable_vape',
  POD_SYSTEM: 'pod_system',
  MOD: 'mod',
  TANK_ATOMIZER: 'tank_atomizer',
  COIL: 'coil',
  BATTERY: 'battery',
  ACCESSORY: 'accessory',
  NICOTINE_POUCHES: 'nicotine_pouches',
  CBD: 'cbd',
} as const;

export type ProductType = (typeof PRODUCT_TYPES)[keyof typeof PRODUCT_TYPES];

// =============================================================================
// FLAVOUR KEYWORDS (for reference, matching done in Shopify)
// =============================================================================

export const FLAVOUR_KEYWORDS = {
  fruity: [
    'strawberry', 'mango', 'grape', 'watermelon', 'blueberry', 'apple', 'peach', 'lemon', 'cherry', 'banana', 'pineapple', 'berry', 'citrus', 'fruit',
    'raspberry', 'blackberry', 'cranberry', 'blackcurrant', 'redcurrant', 'gooseberry', 'elderberry', 'boysenberry', 'loganberry', 'mulberry',
    'orange', 'lime', 'grapefruit', 'tangerine', 'mandarin', 'clementine', 'pomelo', 'yuzu', 'bergamot',
    'kiwi', 'papaya', 'passion fruit', 'passionfruit', 'guava', 'lychee', 'litchi', 'dragon fruit', 'dragonfruit', 'star fruit', 'starfruit',
    'apricot', 'plum', 'nectarine', 'fig', 'date', 'persimmon',
    'melon', 'cantaloupe', 'honeydew', 'rockmelon',
    'pomegranate', 'acai', 'açai', 'goji', 'mangosteen',
    'coconut', 'tropical', 'exotic fruit', 'mixed fruit', 'fruit punch', 'fruit salad', 'summer fruits', 'forest fruits', 'wild berries',
    'pear', 'quince',
  ],
  ice: [
    'ice', 'menthol', 'mint', 'cool', 'freeze', 'frozen', 'arctic', 'polar', 'glacier', 'frost', 'frosty', 'icy', 'chilled', 'cooling',
    'peppermint', 'spearmint', 'wintergreen', 'eucalyptus', 'koolada', 'ws-23',
    'ice blast', 'super cool', 'ultra cool', 'extreme ice', 'double ice', 'triple ice', 'mega ice',
    'menthol ice', 'mint ice', 'fresh mint', 'cool mint', 'iced mint',
  ],
  tobacco: [
    'tobacco', 'cigar', 'cigarette', 'cuban', 'virginia', 'burley', 'turkish', 'oriental',
    'ry4', 'ry-4', 'ry 4',
    'rolling tobacco', 'pipe tobacco', 'leaf', 'golden tobacco', 'dark tobacco', 'light tobacco',
    'american tobacco', 'english tobacco', 'french tobacco',
    'sweet tobacco', 'smooth tobacco', 'rich tobacco', 'bold tobacco', 'classic tobacco',
    'tobacco blend', 'tobacco mix',
  ],
  'desserts/bakery': [
    'vanilla', 'cream', 'caramel', 'custard', 'cake', 'cookie', 'pastry', 'dessert',
    'chocolate', 'cocoa', 'white chocolate', 'milk chocolate', 'dark chocolate',
    'cheesecake', 'tiramisu', 'panna cotta', 'crème brûlée', 'creme brulee',
    'donut', 'doughnut', 'muffin', 'cupcake', 'brownie', 'fudge',
    'pie', 'tart', 'strudel', 'danish', 'croissant', 'eclair',
    'pudding', 'mousse', 'soufflé', 'souffle',
    'biscuit', 'shortbread', 'wafer', 'macaroon', 'macaron',
    'ice cream', 'gelato', 'sorbet', 'frozen yogurt',
    'butterscotch', 'toffee', 'honeycomb', 'nougat', 'marshmallow',
    'meringue', 'whipped cream', 'clotted cream', 'bavarian cream', 'boston cream',
    'cinnamon roll', 'cinnamon bun', 'sticky bun', 'sweet roll',
    'pancake', 'waffle', 'french toast', 'crepe',
    'bread pudding', 'rice pudding', 'tapioca',
    'sweet', 'sugary', 'creamy', 'milky', 'buttery', 'rich',
  ],
  beverages: [
    'coffee', 'cola', 'soda', 'tea', 'latte', 'cappuccino',
    'espresso', 'mocha', 'macchiato', 'americano', 'flat white', 'cortado',
    'black coffee', 'iced coffee', 'cold brew', 'frappuccino',
    'green tea', 'black tea', 'white tea', 'oolong', 'chai', 'earl grey', 'english breakfast', 'jasmine tea', 'matcha',
    'iced tea', 'sweet tea', 'lemon tea', 'peach tea',
    'energy drink', 'red bull', 'monster', 'rockstar',
    'lemonade', 'orangeade', 'cherryade',
    'milkshake', 'smoothie', 'frappe',
    'hot chocolate', 'cocoa', 'drinking chocolate',
    'champagne', 'wine', 'whiskey', 'whisky', 'bourbon', 'rum', 'vodka', 'gin', 'brandy', 'cognac',
    'mojito', 'margarita', 'piña colada', 'pina colada', 'daiquiri', 'cosmopolitan',
    'beer', 'ale', 'lager', 'stout',
    'root beer', 'ginger beer', 'ginger ale', 'cream soda',
  ],
  nuts: [
    'almond', 'peanut', 'walnut', 'pecan', 'hazelnut', 'cashew', 'pistachio', 'macadamia',
    'chestnut', 'brazil nut', 'pine nut',
    'nutty', 'roasted nuts', 'salted nuts', 'honey roasted',
    'peanut butter', 'almond butter', 'hazelnut spread', 'nutella',
    'marzipan', 'praline', 'gianduja',
  ],
  'spices_&_herbs': [
    'cinnamon', 'vanilla', 'anise', 'star anise', 'fennel', 'liquorice', 'licorice',
    'ginger', 'cardamom', 'clove', 'nutmeg', 'allspice',
    'pepper', 'black pepper', 'white pepper', 'pink pepper',
    'basil', 'oregano', 'thyme', 'rosemary', 'sage', 'mint', 'parsley', 'cilantro', 'coriander',
    'lavender', 'chamomile', 'hibiscus', 'rose', 'jasmine',
    'saffron', 'turmeric', 'cumin', 'paprika', 'chili', 'chilli',
    'bay leaf', 'tarragon', 'dill', 'marjoram',
    'spice', 'spiced', 'herbal', 'botanical', 'floral',
    'chai spice', 'pumpkin spice', 'apple pie spice', 'mulling spice',
  ],
  cereal: [
    'cereal', 'corn flakes', 'cornflakes', 'frosted flakes', 'frosties',
    'rice krispies', 'coco pops', 'cocoa puffs', 'cheerios', 'fruit loops', 'froot loops',
    'lucky charms', 'trix', 'captain crunch',
    'granola', 'muesli', 'oat', 'oatmeal', 'porridge',
    'wheat', 'bran', 'grain', 'multigrain',
    'breakfast cereal', 'morning cereal', 'crunchy cereal',
    'honey nut', 'frosted', 'sugared cereal',
  ],
  unflavoured: [
    'unflavoured', 'unflavored', 'flavorless', 'flavourless',
    'plain', 'natural', 'neutral', 'base',
    'no flavour', 'no flavor', 'without flavour', 'without flavor',
  ],
  'candy/sweets': [
    'candy', 'sweet', 'gummy', 'bubblegum', 'bubble gum', 'chewing gum',
    'jelly bean', 'jellybean', 'jelly baby', 'wine gum',
    'gummy bear', 'gummy worm', 'sour gummy', 'fizzy gummy',
    'lollipop', 'lolly', 'sucker', 'hard candy',
    'rock candy', 'candy cane', 'peppermint stick',
    'liquorice', 'licorice', 'red liquorice', 'black liquorice',
    'sherbet', 'fizzy', 'sour', 'tangy', 'tart',
    'skittles', 'starburst', 'jolly rancher', 'nerds', 'smarties', 'm&m', 'haribo',
    'cotton candy', 'candy floss', 'fairy floss',
    'taffy', 'salt water taffy', 'laffy taffy',
    'jawbreaker', 'gobstopper',
    'sour patch', 'sour belt', 'sour straw',
    'rainbow candy', 'fruit candy', 'tropical candy',
    'sugar rush', 'sugar high', 'sweet shop', 'candy store',
  ],
} as const;

export type FlavourCategory = keyof typeof FLAVOUR_KEYWORDS;

// =============================================================================
// CBD CONSTANTS
// =============================================================================

export const CBD_TYPES = ['full-spectrum', 'broad-spectrum', 'isolate'] as const;
export type CbdType = (typeof CBD_TYPES)[number];

export const CBD_FORMS = ['e-liquid', 'oil', 'edible', 'topical'] as const;
export type CbdForm = (typeof CBD_FORMS)[number];

// =============================================================================
// PARSED ATTRIBUTES INTERFACES
// =============================================================================

/**
 * The structure of the custom.parsed_attributes metafield JSON
 * Applied to products (isVariant: false)
 * 
 * Note: Arrays are used for attributes that can have multiple values across variants
 */
export interface ParsedAttributes {
  /** Whether this is a variant (always false for parsed_attributes) */
  isVariant?: boolean;
  product_type: ProductType | null;
  brand: string | null;
  /** Array of flavour categories available across variants */
  flavour_categories: FlavourCategory[];
  /** Array of nicotine strengths available across variants */
  nicotine_strengths: string[];
  /** Array of CBD strengths available across variants */
  cbd_strengths: string[];
  cbd_type: CbdType | null;
  cbd_form: CbdForm | null;
  device_type: string | null;
  capacity: string | null;
  pack_size: string | null;
  puff_count: string | null;
  battery_capacity: string | null;
  coil_resistance: string | null;
  /** Array of materials available */
  materials: string[];
  /** Array of colors available across variants */
  colors: string[];
  size: string | null;
  
  // Legacy fields for backwards compatibility
  /** @deprecated Use flavour_categories instead */
  flavours?: string[];
  /** @deprecated Use flavour_categories instead */
  flavour_category?: FlavourCategory | null;
  /** @deprecated Use nicotine_strengths instead */
  nicotine_strength?: string | null;
  /** @deprecated Use cbd_strengths instead */
  cbd_strength?: string | null;
  /** @deprecated Use materials instead */
  material?: string | null;
  /** @deprecated Use colors instead */
  color?: string | null;
  /** @deprecated Not used in new schema */
  volume?: string | null;
}

/**
 * The structure of the custom.parsed_variant_attributes metafield JSON
 * Applied to variants (isVariant: true)
 */
export interface ParsedVariantAttributes {
  /** Whether this is a variant (always true for parsed_variant_attributes) */
  isVariant?: boolean;
  /** Specific flavour for this variant */
  flavour: string | null;
  /** Flavour category for this variant */
  flavour_category: FlavourCategory | null;
  /** Nicotine strength for this variant */
  nicotine_strength: string | null;
  /** CBD strength for this variant */
  cbd_strength: string | null;
  /** Color for this variant */
  color: string | null;
}

/**
 * Combined type for either product or variant attributes
 */
export type ProductOrVariantAttributes = ParsedAttributes | ParsedVariantAttributes;

// =============================================================================
// FILTER ATTRIBUTE KEYS
// =============================================================================

/**
 * All filterable attribute keys from parsed_attributes (product level)
 */
export const FILTERABLE_ATTRIBUTES = [
  'product_type',
  'brand',
  'flavour_category',
  'nicotine_strength',
  'cbd_strength',
  'cbd_type',
  'cbd_form',
  'device_type',
  'capacity',
  'pack_size',
  'puff_count',
  'battery_capacity',
  'coil_resistance',
  'material',
  'color',
  'size',
  // Keep volume for backwards compatibility
  'volume',
] as const;

export type FilterableAttribute = (typeof FILTERABLE_ATTRIBUTES)[number];

/**
 * Variant-specific filterable attributes from parsed_variant_attributes
 */
export const VARIANT_FILTERABLE_ATTRIBUTES = [
  'flavour',
  'flavour_category',
  'nicotine_strength',
  'cbd_strength',
  'color',
] as const;

export type VariantFilterableAttribute = (typeof VARIANT_FILTERABLE_ATTRIBUTES)[number];

/**
 * Display labels for filterable attributes
 */
export const ATTRIBUTE_LABELS: Record<FilterableAttribute, string> = {
  product_type: 'Product Type',
  brand: 'Brand',
  flavour_category: 'Flavour',
  nicotine_strength: 'Nicotine Strength',
  cbd_strength: 'CBD Strength',
  cbd_type: 'CBD Type',
  cbd_form: 'CBD Form',
  device_type: 'Device Type',
  volume: 'Volume',
  capacity: 'Capacity',
  pack_size: 'Pack Size',
  puff_count: 'Puff Count',
  battery_capacity: 'Battery',
  coil_resistance: 'Coil Resistance',
  material: 'Material',
  color: 'Color',
  size: 'Size',
};

/**
 * Display labels for variant-specific attributes
 */
export const VARIANT_ATTRIBUTE_LABELS: Record<VariantFilterableAttribute, string> = {
  flavour: 'Flavour',
  flavour_category: 'Flavour Category',
  nicotine_strength: 'Nicotine Strength',
  cbd_strength: 'CBD Strength',
  color: 'Color',
};

/**
 * Which attributes apply to which product types
 */
export const ATTRIBUTE_APPLICABILITY: Record<FilterableAttribute, ProductType[] | null> = {
  product_type: null, // Applies to all
  brand: null, // Applies to all
  flavour_category: [PRODUCT_TYPES.E_LIQUID, PRODUCT_TYPES.DISPOSABLE_VAPE, PRODUCT_TYPES.NICOTINE_POUCHES],
  nicotine_strength: [PRODUCT_TYPES.E_LIQUID, PRODUCT_TYPES.DISPOSABLE_VAPE, PRODUCT_TYPES.NICOTINE_POUCHES, PRODUCT_TYPES.POD_SYSTEM],
  cbd_strength: [PRODUCT_TYPES.CBD],
  cbd_type: [PRODUCT_TYPES.CBD],
  cbd_form: [PRODUCT_TYPES.CBD],
  device_type: [PRODUCT_TYPES.POD_SYSTEM, PRODUCT_TYPES.MOD, PRODUCT_TYPES.TANK_ATOMIZER],
  volume: [PRODUCT_TYPES.E_LIQUID],
  capacity: [PRODUCT_TYPES.POD_SYSTEM, PRODUCT_TYPES.TANK_ATOMIZER, PRODUCT_TYPES.DISPOSABLE_VAPE],
  pack_size: [PRODUCT_TYPES.E_LIQUID, PRODUCT_TYPES.COIL, PRODUCT_TYPES.NICOTINE_POUCHES],
  puff_count: [PRODUCT_TYPES.DISPOSABLE_VAPE],
  battery_capacity: [PRODUCT_TYPES.POD_SYSTEM, PRODUCT_TYPES.MOD, PRODUCT_TYPES.DISPOSABLE_VAPE],
  coil_resistance: [PRODUCT_TYPES.COIL, PRODUCT_TYPES.POD_SYSTEM],
  material: [PRODUCT_TYPES.COIL, PRODUCT_TYPES.TANK_ATOMIZER, PRODUCT_TYPES.ACCESSORY],
  color: null, // Applies to all
  size: [PRODUCT_TYPES.ACCESSORY, PRODUCT_TYPES.POD_SYSTEM],
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Parse the custom.parsed_attributes metafield JSON string
 */
export function parseParsedAttributes(jsonString: string | null | undefined): ParsedAttributes | null {
  if (!jsonString) return null;

  try {
    const parsed = JSON.parse(jsonString);
    // Validate it has the expected structure
    if (typeof parsed !== 'object' || parsed === null) return null;
    return parsed as ParsedAttributes;
  } catch {
    // Log error without exposing potentially sensitive data
    console.error('Failed to parse parsed_attributes metafield');
    return null;
  }
}

/**
 * Parse the custom.parsed_variant_attributes metafield JSON string
 */
export function parseVariantAttributes(jsonString: string | null | undefined): ParsedVariantAttributes | null {
  if (!jsonString) return null;

  try {
    const parsed = JSON.parse(jsonString);
    // Validate it has the expected structure
    if (typeof parsed !== 'object' || parsed === null) return null;
    return parsed as ParsedVariantAttributes;
  } catch {
    console.error('Failed to parse parsed_variant_attributes metafield');
    return null;
  }
}

/**
 * Get a specific attribute value from parsed attributes
 * Handles both old (singular) and new (array) field names
 */
export function getAttributeValue(
  attributes: ParsedAttributes | null,
  key: FilterableAttribute
): string | string[] | null {
  if (!attributes) return null;
  
  // Map new array fields to their values
  switch (key) {
    case 'flavour_category':
      // Try new array field first, then fallback to old singular field
      if (attributes.flavour_categories && attributes.flavour_categories.length > 0) {
        return attributes.flavour_categories;
      }
      return attributes.flavour_category ?? null;
    case 'nicotine_strength':
      if (attributes.nicotine_strengths && attributes.nicotine_strengths.length > 0) {
        return attributes.nicotine_strengths;
      }
      return attributes.nicotine_strength ?? null;
    case 'cbd_strength':
      if (attributes.cbd_strengths && attributes.cbd_strengths.length > 0) {
        return attributes.cbd_strengths;
      }
      return attributes.cbd_strength ?? null;
    case 'material':
      if (attributes.materials && attributes.materials.length > 0) {
        return attributes.materials;
      }
      return attributes.material ?? null;
    case 'color':
      if (attributes.colors && attributes.colors.length > 0) {
        return attributes.colors;
      }
      return attributes.color ?? null;
    default:
      const value = (attributes as any)[key];
      if (value === undefined) return null;
      return value;
  }
}

/**
 * Get attribute value from variant attributes
 */
export function getVariantAttributeValue(
  attributes: ParsedVariantAttributes | null,
  key: VariantFilterableAttribute
): string | null {
  if (!attributes) return null;
  const value = attributes[key];
  if (value === undefined) return null;
  return value;
}

/**
 * Check if an attribute is applicable to a given product type
 */
export function isAttributeApplicable(
  attribute: FilterableAttribute,
  productType: ProductType | null
): boolean {
  const applicability = ATTRIBUTE_APPLICABILITY[attribute];
  if (applicability === null) return true; // Applies to all
  if (productType === null) return true; // Unknown product type, show all
  return applicability.includes(productType);
}

/**
 * Format an attribute value for display
 */
export function formatAttributeValue(value: string | null): string {
  if (!value) return '';
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Build a URL parameter for filtering by an attribute
 */
export function buildAttributeFilterParam(attribute: FilterableAttribute, value: string): string {
  return `${attribute}:${encodeURIComponent(value)}`;
}

/**
 * Parse a URL parameter back into attribute and value
 */
export function parseAttributeFilterParam(param: string): { attribute: FilterableAttribute; value: string } | null {
  const colonIndex = param.indexOf(':');
  if (colonIndex === -1) return null;

  const attribute = param.slice(0, colonIndex) as FilterableAttribute;
  const value = decodeURIComponent(param.slice(colonIndex + 1));

  if (!FILTERABLE_ATTRIBUTES.includes(attribute)) return null;

  return { attribute, value };
}

/**
 * Build a search URL with attribute filters
 */
export function buildAttributeSearchUrl(filters: Record<string, string | string[]>): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (Array.isArray(value)) {
      for (const v of value) {
        params.append(key, v);
      }
    } else if (value) {
      params.append(key, value);
    }
  }

  const queryString = params.toString();
  return queryString ? `/search?${queryString}` : '/search';
}

/**
 * Extract non-null attributes from a parsed attributes object
 * Returns only attributes that have values
 */
export function getNonNullAttributes(attributes: ParsedAttributes | null): Partial<ParsedAttributes> {
  if (!attributes) return {};

  const result: Partial<ParsedAttributes> = {};

  for (const key of FILTERABLE_ATTRIBUTES) {
    const value = getAttributeValue(attributes, key);
    if (value !== null && value !== undefined) {
      if (Array.isArray(value) && value.length === 0) continue;
      (result as any)[key] = value;
    }
  }

  return result;
}

/**
 * Check if a product matches given filter criteria
 * Checks both product-level attributes and variant-level attributes
 */
export function matchesFilters(
  attributes: ParsedAttributes | null,
  filters: Partial<Record<FilterableAttribute, string | string[]>>,
  variantAttributes?: ParsedVariantAttributes[] | null
): boolean {
  if (!attributes) return false;

  for (const [key, filterValue] of Object.entries(filters)) {
    if (!filterValue) continue;

    const attributeKey = key as FilterableAttribute;
    const filterValues = Array.isArray(filterValue) ? filterValue : [filterValue];
    
    // First try to match at product level
    const productValue = getAttributeValue(attributes, attributeKey);
    let productMatches = false;
    
    if (productValue !== null && productValue !== undefined) {
      if (Array.isArray(productValue)) {
        productMatches = filterValues.some((fv) =>
          productValue.some((pv) => pv.toLowerCase() === fv.toLowerCase())
        );
      } else {
        productMatches = filterValues.some(
          (fv) => productValue.toLowerCase() === fv.toLowerCase()
        );
      }
    }
    
    // If product doesn't match, check variant-level attributes
    if (!productMatches && variantAttributes && variantAttributes.length > 0) {
      // Check if any variant matches
      const variantKey = key as VariantFilterableAttribute;
      if (VARIANT_FILTERABLE_ATTRIBUTES.includes(variantKey as any)) {
        const variantMatches = variantAttributes.some((va) => {
          const variantValue = getVariantAttributeValue(va, variantKey);
          if (variantValue === null) return false;
          return filterValues.some(
            (fv) => variantValue.toLowerCase() === fv.toLowerCase()
          );
        });
        if (variantMatches) continue; // Filter matched via variant
      }
    }
    
    // If neither product nor variant matched, filter fails
    if (!productMatches) return false;
  }

  return true;
}

// =============================================================================
// METAFIELD GRAPHQL FRAGMENTS
// =============================================================================

/**
 * GraphQL fragment to fetch the parsed_attributes metafield on Product
 */
export const PARSED_ATTRIBUTES_METAFIELD_FRAGMENT = `#graphql
  fragment ParsedAttributesMetafield on Product {
    parsedAttributes: metafield(namespace: "custom", key: "parsed_attributes") {
      value
      type
    }
  }
` as const;

/**
 * GraphQL fragment to fetch the parsed_variant_attributes metafield on ProductVariant
 */
export const PARSED_VARIANT_ATTRIBUTES_METAFIELD_FRAGMENT = `#graphql
  fragment ParsedVariantAttributesMetafield on ProductVariant {
    parsedVariantAttributes: metafield(namespace: "custom", key: "parsed_variant_attributes") {
      value
      type
    }
  }
` as const;

/**
 * GraphQL fragment identifier for product queries
 */
export const PARSED_ATTRIBUTES_METAFIELD_ID = 'ParsedAttributesMetafield';

/**
 * GraphQL fragment identifier for variant queries
 */
export const PARSED_VARIANT_ATTRIBUTES_METAFIELD_ID = 'ParsedVariantAttributesMetafield';
