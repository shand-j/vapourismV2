/**
 * Mega Menu Configuration
 *
 * Static menu structure using parsed_attributes metafield-based filtering.
 * All navigation links route to /search with attribute filter query parameters.
 *
 * Uses custom.parsed_attributes metafield for product filtering.
 */

import type { FilterableAttribute } from './parsed-attributes';

export interface MenuLink {
  label: string;
  /** Attribute-based filters using parsed_attributes metafield */
  filters: Record<string, string>;
  url: string;
}

export interface MenuColumn {
  heading: string;
  links: MenuLink[];
  seeAllLabel?: string;
  seeAllFilters?: Record<string, string>;
}

export interface MenuCategory {
  id: string;
  label: string;
  /** Attribute-based filters using parsed_attributes metafield */
  filters: Record<string, string>;
  columns: MenuColumn[];
  quizLink?: {
    label: string;
    url: string;
  };
  hero: CategoryHero;
}

export interface CategoryHero {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  accentColor: string;
}

/**
 * Build search URL from attribute filters
 * Uses parsed_attributes metafield values
 */
export function buildAttributeSearchUrl(filters: Record<string, string>): string {
  if (Object.keys(filters).length === 0) return '/search';
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value) {
      params.append(key, value);
    }
  }
  return `/search?${params.toString()}`;
}

/**
 * Category hero configurations for search page banners
 */
export const CATEGORY_HEROES: Record<string, CategoryHero> = {
  disposable: {
    title: 'Reusable Vapes',
    subtitle: 'Ready-to-use devices with pre-filled e-liquid. No charging, no refilling.',
    accentColor: '#f97316',
  },
  'e-liquid': {
    title: 'E-Liquids',
    subtitle: 'Premium vape juice in every flavour and strength. From nic salts to shortfills.',
    accentColor: '#8b5cf6',
  },
  device: {
    title: 'Vape Devices',
    subtitle: 'Pod systems, box mods, and starter kits for every vaping style.',
    accentColor: '#0ea5e9',
  },
  pod_system: {
    title: 'Pod Systems',
    subtitle: 'Compact, portable vaping with refillable or pre-filled pods.',
    accentColor: '#0ea5e9',
  },
  box_mod: {
    title: 'Box Mods',
    subtitle: 'Advanced devices with customisable power and temperature settings.',
    accentColor: '#0ea5e9',
  },
  tank: {
    title: 'Tanks',
    subtitle: 'Sub-ohm and MTL tanks for your favourite e-liquids.',
    accentColor: '#0ea5e9',
  },
  pod: {
    title: 'Pods',
    subtitle: 'Pre-filled and replacement pods for your pod system.',
    accentColor: '#06b6d4',
  },
  coil: {
    title: 'Coils',
    subtitle: 'Replacement coils for optimal flavour and vapour production.',
    accentColor: '#06b6d4',
  },
  accessory: {
    title: 'Accessories',
    subtitle: 'Batteries, chargers, cases, and everything else you need.',
    accentColor: '#64748b',
  },
  CBD: {
    title: 'CBD Products',
    subtitle: 'Oils, gummies, capsules, and more. Quality CBD for wellness.',
    accentColor: '#22c55e',
  },
  nicotine_pouches: {
    title: 'Nicotine Pouches',
    subtitle: 'Tobacco-free nicotine pouches. Discreet and smoke-free.',
    accentColor: '#ec4899',
  },
};

/**
 * Get hero config based on attribute filters
 * Maps product_type attribute values to hero configurations
 */
export function getHeroForFilters(filters: Record<string, string | string[]>): CategoryHero | null {
  const productType = filters.product_type;
  if (!productType) return null;

  const typeValue = Array.isArray(productType) ? productType[0] : productType;

  // Map product_type values to hero keys
  const typeToHeroKey: Record<string, string> = {
    'e-liquid': 'e-liquid',
    'disposable_vape': 'disposable',
    'pod_system': 'pod_system',
    'mod': 'box_mod',
    'tank_atomizer': 'tank',
    'coil': 'coil',
    'battery': 'accessory',
    'accessory': 'accessory',
    'nicotine_pouches': 'nicotine_pouches',
    'cbd': 'CBD',
  };

  const heroKey = typeToHeroKey[typeValue.toLowerCase()];
  if (heroKey && CATEGORY_HEROES[heroKey]) {
    return CATEGORY_HEROES[heroKey];
  }

  return null;
}

// =============================================================================
// MEGA MENU STRUCTURE
// =============================================================================

export const MEGA_MENU: MenuCategory[] = [
  // -------------------------------------------------------------------------
  // REUSABLES (Disposable Vapes)
  // -------------------------------------------------------------------------
  {
    id: 'reusables',
    label: 'Reusables',
    filters: {product_type: 'disposable_vape'},
    hero: CATEGORY_HEROES.disposable,
    columns: [
      {
        heading: 'By Flavour',
        links: [
          {label: 'Fruity', filters: {product_type: 'disposable_vape', flavour_category: 'fruity'}, url: buildAttributeSearchUrl({product_type: 'disposable_vape', flavour_category: 'fruity'})},
          {label: 'Ice & Menthol', filters: {product_type: 'disposable_vape', flavour_category: 'ice'}, url: buildAttributeSearchUrl({product_type: 'disposable_vape', flavour_category: 'ice'})},
          {label: 'Tobacco', filters: {product_type: 'disposable_vape', flavour_category: 'tobacco'}, url: buildAttributeSearchUrl({product_type: 'disposable_vape', flavour_category: 'tobacco'})},
          {label: 'Desserts & Bakery', filters: {product_type: 'disposable_vape', flavour_category: 'desserts/bakery'}, url: buildAttributeSearchUrl({product_type: 'disposable_vape', flavour_category: 'desserts/bakery'})},
          {label: 'Beverages', filters: {product_type: 'disposable_vape', flavour_category: 'beverages'}, url: buildAttributeSearchUrl({product_type: 'disposable_vape', flavour_category: 'beverages'})},
        ],
        seeAllLabel: 'See all flavours',
        seeAllFilters: {product_type: 'disposable_vape'},
      },
      {
        heading: 'By Nicotine',
        links: [
          {label: '20mg', filters: {product_type: 'disposable_vape', nicotine_strength: '20mg'}, url: buildAttributeSearchUrl({product_type: 'disposable_vape', nicotine_strength: '20mg'})},
          {label: '10mg', filters: {product_type: 'disposable_vape', nicotine_strength: '10mg'}, url: buildAttributeSearchUrl({product_type: 'disposable_vape', nicotine_strength: '10mg'})},
          {label: '0mg (Nicotine Free)', filters: {product_type: 'disposable_vape', nicotine_strength: '0mg'}, url: buildAttributeSearchUrl({product_type: 'disposable_vape', nicotine_strength: '0mg'})},
        ],
        seeAllLabel: 'See all strengths',
        seeAllFilters: {product_type: 'disposable_vape'},
      },
    ],
  },

  // -------------------------------------------------------------------------
  // E-LIQUIDS
  // -------------------------------------------------------------------------
  {
    id: 'e-liquids',
    label: 'E-Liquids',
    filters: {product_type: 'e-liquid'},
    hero: CATEGORY_HEROES['e-liquid'],
    quizLink: {
      label: 'Flavour Lab Quiz',
      url: '/flavour-lab',
    },
    columns: [
      {
        heading: 'By Flavour',
        links: [
          {label: 'Fruity', filters: {product_type: 'e-liquid', flavour_category: 'fruity'}, url: buildAttributeSearchUrl({product_type: 'e-liquid', flavour_category: 'fruity'})},
          {label: 'Ice & Menthol', filters: {product_type: 'e-liquid', flavour_category: 'ice'}, url: buildAttributeSearchUrl({product_type: 'e-liquid', flavour_category: 'ice'})},
          {label: 'Tobacco', filters: {product_type: 'e-liquid', flavour_category: 'tobacco'}, url: buildAttributeSearchUrl({product_type: 'e-liquid', flavour_category: 'tobacco'})},
          {label: 'Desserts & Bakery', filters: {product_type: 'e-liquid', flavour_category: 'desserts/bakery'}, url: buildAttributeSearchUrl({product_type: 'e-liquid', flavour_category: 'desserts/bakery'})},
          {label: 'Beverages', filters: {product_type: 'e-liquid', flavour_category: 'beverages'}, url: buildAttributeSearchUrl({product_type: 'e-liquid', flavour_category: 'beverages'})},
          {label: 'Cereal', filters: {product_type: 'e-liquid', flavour_category: 'cereal'}, url: buildAttributeSearchUrl({product_type: 'e-liquid', flavour_category: 'cereal'})},
        ],
        seeAllLabel: 'See all flavours',
        seeAllFilters: {product_type: 'e-liquid'},
      },
      {
        heading: 'By Strength',
        links: [
          {label: '0mg', filters: {product_type: 'e-liquid', nicotine_strength: '0mg'}, url: buildAttributeSearchUrl({product_type: 'e-liquid', nicotine_strength: '0mg'})},
          {label: '3mg', filters: {product_type: 'e-liquid', nicotine_strength: '3mg'}, url: buildAttributeSearchUrl({product_type: 'e-liquid', nicotine_strength: '3mg'})},
          {label: '6mg', filters: {product_type: 'e-liquid', nicotine_strength: '6mg'}, url: buildAttributeSearchUrl({product_type: 'e-liquid', nicotine_strength: '6mg'})},
          {label: '10mg', filters: {product_type: 'e-liquid', nicotine_strength: '10mg'}, url: buildAttributeSearchUrl({product_type: 'e-liquid', nicotine_strength: '10mg'})},
          {label: '20mg', filters: {product_type: 'e-liquid', nicotine_strength: '20mg'}, url: buildAttributeSearchUrl({product_type: 'e-liquid', nicotine_strength: '20mg'})},
        ],
        seeAllLabel: 'See all strengths',
        seeAllFilters: {product_type: 'e-liquid'},
      },
    ],
  },

  // -------------------------------------------------------------------------
  // DEVICES (Pod Systems, Mods)
  // -------------------------------------------------------------------------
  {
    id: 'devices',
    label: 'Devices',
    filters: {product_type: 'pod_system'},
    hero: CATEGORY_HEROES.device,
    quizLink: {
      label: 'Device Studio Quiz',
      url: '/device-studio',
    },
    columns: [
      {
        heading: 'By Category',
        links: [
          {label: 'Pod Systems', filters: {product_type: 'pod_system'}, url: buildAttributeSearchUrl({product_type: 'pod_system'})},
          {label: 'Box Mods', filters: {product_type: 'mod'}, url: buildAttributeSearchUrl({product_type: 'mod'})},
          {label: 'Tanks', filters: {product_type: 'tank_atomizer'}, url: buildAttributeSearchUrl({product_type: 'tank_atomizer'})},
        ],
        seeAllLabel: 'See all devices',
        seeAllFilters: {product_type: 'pod_system'},
      },
      {
        heading: 'By Device Type',
        links: [
          {label: 'Pen Style', filters: {product_type: 'pod_system', device_type: 'pen_style'}, url: buildAttributeSearchUrl({product_type: 'pod_system', device_type: 'pen_style'})},
          {label: 'Pod Style', filters: {product_type: 'pod_system', device_type: 'pod_style'}, url: buildAttributeSearchUrl({product_type: 'pod_system', device_type: 'pod_style'})},
          {label: 'Box Style', filters: {product_type: 'mod', device_type: 'box_style'}, url: buildAttributeSearchUrl({product_type: 'mod', device_type: 'box_style'})},
        ],
        seeAllLabel: 'See all styles',
        seeAllFilters: {product_type: 'pod_system'},
      },
    ],
  },

  // -------------------------------------------------------------------------
  // PODS & COILS
  // -------------------------------------------------------------------------
  {
    id: 'pods-coils',
    label: 'Pods & Coils',
    filters: {product_type: 'coil'},
    hero: CATEGORY_HEROES.pod,
    columns: [
      {
        heading: 'Coils',
        links: [
          {label: 'All Coils', filters: {product_type: 'coil'}, url: buildAttributeSearchUrl({product_type: 'coil'})},
        ],
        seeAllLabel: 'See all coils',
        seeAllFilters: {product_type: 'coil'},
      },
    ],
  },

  // -------------------------------------------------------------------------
  // ACCESSORIES
  // -------------------------------------------------------------------------
  {
    id: 'accessories',
    label: 'Accessories',
    filters: {product_type: 'accessory'},
    hero: CATEGORY_HEROES.accessory,
    columns: [
      {
        heading: 'Batteries & Power',
        links: [
          {label: 'Batteries', filters: {product_type: 'battery'}, url: buildAttributeSearchUrl({product_type: 'battery'})},
          {label: 'All Accessories', filters: {product_type: 'accessory'}, url: buildAttributeSearchUrl({product_type: 'accessory'})},
        ],
        seeAllLabel: 'See all accessories',
        seeAllFilters: {product_type: 'accessory'},
      },
    ],
  },

  // -------------------------------------------------------------------------
  // CBD
  // -------------------------------------------------------------------------
  {
    id: 'cbd',
    label: 'CBD',
    filters: {product_type: 'cbd'},
    hero: CATEGORY_HEROES.CBD,
    columns: [
      {
        heading: 'By Form',
        links: [
          {label: 'CBD E-Liquids', filters: {product_type: 'cbd', cbd_form: 'e-liquid'}, url: buildAttributeSearchUrl({product_type: 'cbd', cbd_form: 'e-liquid'})},
          {label: 'CBD Oils', filters: {product_type: 'cbd', cbd_form: 'oil'}, url: buildAttributeSearchUrl({product_type: 'cbd', cbd_form: 'oil'})},
          {label: 'CBD Edibles', filters: {product_type: 'cbd', cbd_form: 'edible'}, url: buildAttributeSearchUrl({product_type: 'cbd', cbd_form: 'edible'})},
          {label: 'CBD Topicals', filters: {product_type: 'cbd', cbd_form: 'topical'}, url: buildAttributeSearchUrl({product_type: 'cbd', cbd_form: 'topical'})},
        ],
        seeAllLabel: 'See all CBD',
        seeAllFilters: {product_type: 'cbd'},
      },
      {
        heading: 'By Type',
        links: [
          {label: 'Full Spectrum', filters: {product_type: 'cbd', cbd_type: 'full-spectrum'}, url: buildAttributeSearchUrl({product_type: 'cbd', cbd_type: 'full-spectrum'})},
          {label: 'Broad Spectrum', filters: {product_type: 'cbd', cbd_type: 'broad-spectrum'}, url: buildAttributeSearchUrl({product_type: 'cbd', cbd_type: 'broad-spectrum'})},
          {label: 'Isolate', filters: {product_type: 'cbd', cbd_type: 'isolate'}, url: buildAttributeSearchUrl({product_type: 'cbd', cbd_type: 'isolate'})},
        ],
        seeAllLabel: 'See all types',
        seeAllFilters: {product_type: 'cbd'},
      },
    ],
  },

  // -------------------------------------------------------------------------
  // NICOTINE POUCHES
  // -------------------------------------------------------------------------
  {
    id: 'nicotine-pouches',
    label: 'Nic Pouches',
    filters: {product_type: 'nicotine_pouches'},
    hero: CATEGORY_HEROES.nicotine_pouches,
    columns: [
      {
        heading: 'By Strength',
        links: [
          {label: '3mg (Light)', filters: {product_type: 'nicotine_pouches', nicotine_strength: '3mg'}, url: buildAttributeSearchUrl({product_type: 'nicotine_pouches', nicotine_strength: '3mg'})},
          {label: '6mg (Medium)', filters: {product_type: 'nicotine_pouches', nicotine_strength: '6mg'}, url: buildAttributeSearchUrl({product_type: 'nicotine_pouches', nicotine_strength: '6mg'})},
          {label: '10mg (Strong)', filters: {product_type: 'nicotine_pouches', nicotine_strength: '10mg'}, url: buildAttributeSearchUrl({product_type: 'nicotine_pouches', nicotine_strength: '10mg'})},
          {label: '20mg (Maximum)', filters: {product_type: 'nicotine_pouches', nicotine_strength: '20mg'}, url: buildAttributeSearchUrl({product_type: 'nicotine_pouches', nicotine_strength: '20mg'})},
        ],
        seeAllLabel: 'See all strengths',
        seeAllFilters: {product_type: 'nicotine_pouches'},
      },
      {
        heading: 'By Flavour',
        links: [
          {label: 'Fruity', filters: {product_type: 'nicotine_pouches', flavour_category: 'fruity'}, url: buildAttributeSearchUrl({product_type: 'nicotine_pouches', flavour_category: 'fruity'})},
          {label: 'Ice & Menthol', filters: {product_type: 'nicotine_pouches', flavour_category: 'ice'}, url: buildAttributeSearchUrl({product_type: 'nicotine_pouches', flavour_category: 'ice'})},
          {label: 'Tobacco', filters: {product_type: 'nicotine_pouches', flavour_category: 'tobacco'}, url: buildAttributeSearchUrl({product_type: 'nicotine_pouches', flavour_category: 'tobacco'})},
        ],
        seeAllLabel: 'See all flavours',
        seeAllFilters: {product_type: 'nicotine_pouches'},
      },
    ],
  },
];

/**
 * Get menu category by ID
 */
export function getMenuCategory(id: string): MenuCategory | undefined {
  return MEGA_MENU.find((category) => category.id === id);
}

/**
 * Get menu category by product_type filter
 */
export function getMenuCategoryByProductType(productType: string): MenuCategory | undefined {
  return MEGA_MENU.find((category) => category.filters.product_type === productType);
}
