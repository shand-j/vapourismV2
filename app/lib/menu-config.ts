/**
 * Mega Menu Configuration
 *
 * Static menu structure using tag-based filtering.
 * All navigation links route to /search with tag query parameters.
 *
 * Tag format follows the approved controlled vocabulary from the data analyst spec.
 */

export interface MenuLink {
  label: string;
  tags: string[];
  url: string;
}

export interface MenuColumn {
  heading: string;
  links: MenuLink[];
  seeAllLabel?: string;
  seeAllTags?: string[];
}

export interface MenuCategory {
  id: string;
  label: string;
  tags: string[];
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
 * Build search URL from tags
 */
export function buildSearchUrl(tags: string[]): string {
  if (tags.length === 0) return '/search';
  const params = new URLSearchParams();
  for (const tag of tags) {
    params.append('tag', tag);
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
 * Get hero config for a set of tags
 */
export function getHeroForTags(tags: string[]): CategoryHero | null {
  // Check for primary category tags first
  const primaryCategories = [
    'disposable',
    'e-liquid',
    'device',
    'pod_system',
    'box_mod',
    'tank',
    'pod',
    'coil',
    'accessory',
    'CBD',
    'nicotine_pouches',
  ];

  for (const category of primaryCategories) {
    if (tags.includes(category)) {
      return CATEGORY_HEROES[category] || null;
    }
  }

  return null;
}

// =============================================================================
// MEGA MENU STRUCTURE
// =============================================================================

export const MEGA_MENU: MenuCategory[] = [
  // -------------------------------------------------------------------------
  // REUSABLES
  // -------------------------------------------------------------------------
  {
    id: 'reusables',
    label: 'Reusables',
    tags: ['disposable'],
    hero: CATEGORY_HEROES.disposable,
    columns: [
      {
        heading: 'By Flavour',
        links: [
          {label: 'Fruity', tags: ['disposable', 'fruity'], url: buildSearchUrl(['disposable', 'fruity'])},
          {label: 'Ice & Menthol', tags: ['disposable', 'ice'], url: buildSearchUrl(['disposable', 'ice'])},
          {label: 'Tobacco', tags: ['disposable', 'tobacco'], url: buildSearchUrl(['disposable', 'tobacco'])},
          {label: 'Desserts & Bakery', tags: ['disposable', 'desserts/bakery'], url: buildSearchUrl(['disposable', 'desserts/bakery'])},
          {label: 'Beverages', tags: ['disposable', 'beverages'], url: buildSearchUrl(['disposable', 'beverages'])},
        ],
        seeAllLabel: 'See all flavours',
        seeAllTags: ['disposable'],
      },
      {
        heading: 'By Nicotine',
        links: [
          {label: '20mg', tags: ['disposable', '20mg'], url: buildSearchUrl(['disposable', '20mg'])},
          {label: '10mg', tags: ['disposable', '10mg'], url: buildSearchUrl(['disposable', '10mg'])},
          {label: '0mg (Nicotine Free)', tags: ['disposable', '0mg'], url: buildSearchUrl(['disposable', '0mg'])},
        ],
        seeAllLabel: 'See all strengths',
        seeAllTags: ['disposable'],
      },
      {
        heading: 'By Nicotine Type',
        links: [
          {label: 'Nic Salt', tags: ['disposable', 'nic_salt'], url: buildSearchUrl(['disposable', 'nic_salt'])},
          {label: 'Freebase', tags: ['disposable', 'freebase_nicotine'], url: buildSearchUrl(['disposable', 'freebase_nicotine'])},
        ],
        seeAllLabel: 'See all types',
        seeAllTags: ['disposable'],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // E-LIQUIDS
  // -------------------------------------------------------------------------
  {
    id: 'e-liquids',
    label: 'E-Liquids',
    tags: ['e-liquid'],
    hero: CATEGORY_HEROES['e-liquid'],
    quizLink: {
      label: 'Flavour Lab Quiz',
      url: '/flavour-lab',
    },
    columns: [
      {
        heading: 'By Type',
        links: [
          {label: 'Nic Salts', tags: ['e-liquid', 'nic_salt'], url: buildSearchUrl(['e-liquid', 'nic_salt'])},
          {label: 'Freebase', tags: ['e-liquid', 'freebase_nicotine'], url: buildSearchUrl(['e-liquid', 'freebase_nicotine'])},
          {label: 'Traditional', tags: ['e-liquid', 'traditional_nicotine'], url: buildSearchUrl(['e-liquid', 'traditional_nicotine'])},
        ],
        seeAllLabel: 'See all types',
        seeAllTags: ['e-liquid'],
      },
      {
        heading: 'By Size',
        links: [
          {label: '10ml', tags: ['e-liquid', '10ml'], url: buildSearchUrl(['e-liquid', '10ml'])},
          {label: '50ml Shortfill', tags: ['e-liquid', '50ml', 'shortfill'], url: buildSearchUrl(['e-liquid', '50ml', 'shortfill'])},
          {label: '100ml Shortfill', tags: ['e-liquid', '100ml', 'shortfill'], url: buildSearchUrl(['e-liquid', '100ml', 'shortfill'])},
        ],
        seeAllLabel: 'See all sizes',
        seeAllTags: ['e-liquid'],
      },
      {
        heading: 'By Flavour',
        links: [
          {label: 'Fruity', tags: ['e-liquid', 'fruity'], url: buildSearchUrl(['e-liquid', 'fruity'])},
          {label: 'Ice & Menthol', tags: ['e-liquid', 'ice'], url: buildSearchUrl(['e-liquid', 'ice'])},
          {label: 'Tobacco', tags: ['e-liquid', 'tobacco'], url: buildSearchUrl(['e-liquid', 'tobacco'])},
          {label: 'Desserts & Bakery', tags: ['e-liquid', 'desserts/bakery'], url: buildSearchUrl(['e-liquid', 'desserts/bakery'])},
          {label: 'Beverages', tags: ['e-liquid', 'beverages'], url: buildSearchUrl(['e-liquid', 'beverages'])},
          {label: 'Cereal', tags: ['e-liquid', 'cereal'], url: buildSearchUrl(['e-liquid', 'cereal'])},
        ],
        seeAllLabel: 'See all flavours',
        seeAllTags: ['e-liquid'],
      },
      {
        heading: 'By VG/PG Ratio',
        links: [
          {label: '50/50', tags: ['e-liquid', '50/50'], url: buildSearchUrl(['e-liquid', '50/50'])},
          {label: '70/30', tags: ['e-liquid', '70/30'], url: buildSearchUrl(['e-liquid', '70/30'])},
          {label: '80/20', tags: ['e-liquid', '80/20'], url: buildSearchUrl(['e-liquid', '80/20'])},
        ],
        seeAllLabel: 'See all ratios',
        seeAllTags: ['e-liquid'],
      },
      {
        heading: 'By Strength',
        links: [
          {label: '0mg', tags: ['e-liquid', '0mg'], url: buildSearchUrl(['e-liquid', '0mg'])},
          {label: '3mg', tags: ['e-liquid', '3mg'], url: buildSearchUrl(['e-liquid', '3mg'])},
          {label: '6mg', tags: ['e-liquid', '6mg'], url: buildSearchUrl(['e-liquid', '6mg'])},
          {label: '10mg', tags: ['e-liquid', '10mg'], url: buildSearchUrl(['e-liquid', '10mg'])},
          {label: '12mg', tags: ['e-liquid', '12mg'], url: buildSearchUrl(['e-liquid', '12mg'])},
          {label: '18mg', tags: ['e-liquid', '18mg'], url: buildSearchUrl(['e-liquid', '18mg'])},
          {label: '20mg', tags: ['e-liquid', '20mg'], url: buildSearchUrl(['e-liquid', '20mg'])},
        ],
        seeAllLabel: 'See all strengths',
        seeAllTags: ['e-liquid'],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // DEVICES
  // -------------------------------------------------------------------------
  {
    id: 'devices',
    label: 'Devices',
    tags: ['device'],
    hero: CATEGORY_HEROES.device,
    quizLink: {
      label: 'Device Studio Quiz',
      url: '/device-studio',
    },
    columns: [
      {
        heading: 'By Category',
        links: [
          {label: 'Pod Systems', tags: ['pod_system'], url: buildSearchUrl(['pod_system'])},
          {label: 'Box Mods', tags: ['box_mod'], url: buildSearchUrl(['box_mod'])},
          {label: 'Starter Kits', tags: ['device'], url: buildSearchUrl(['device'])},
          {label: 'Tanks', tags: ['tank'], url: buildSearchUrl(['tank'])},
        ],
        seeAllLabel: 'See all devices',
        seeAllTags: ['device'],
      },
      {
        heading: 'By Style',
        links: [
          {label: 'Pen Style', tags: ['device', 'pen_style'], url: buildSearchUrl(['device', 'pen_style'])},
          {label: 'Pod Style', tags: ['device', 'pod_style'], url: buildSearchUrl(['device', 'pod_style'])},
          {label: 'Box Style', tags: ['device', 'box_style'], url: buildSearchUrl(['device', 'box_style'])},
          {label: 'Compact', tags: ['device', 'compact'], url: buildSearchUrl(['device', 'compact'])},
          {label: 'Mini', tags: ['device', 'mini'], url: buildSearchUrl(['device', 'mini'])},
        ],
        seeAllLabel: 'See all styles',
        seeAllTags: ['device'],
      },
      {
        heading: 'By Vaping Style',
        links: [
          {label: 'Mouth-to-Lung', tags: ['device', 'mouth-to-lung'], url: buildSearchUrl(['device', 'mouth-to-lung'])},
          {label: 'Direct-to-Lung', tags: ['device', 'direct-to-lung'], url: buildSearchUrl(['device', 'direct-to-lung'])},
          {label: 'Restricted DTL', tags: ['device', 'restricted-direct-to-lung'], url: buildSearchUrl(['device', 'restricted-direct-to-lung'])},
        ],
        seeAllLabel: 'See all vaping styles',
        seeAllTags: ['device'],
      },
      {
        heading: 'By Power',
        links: [
          {label: 'Rechargeable', tags: ['device', 'rechargeable'], url: buildSearchUrl(['device', 'rechargeable'])},
          {label: 'Removable Battery', tags: ['device', 'removable_battery'], url: buildSearchUrl(['device', 'removable_battery'])},
        ],
        seeAllLabel: 'See all power options',
        seeAllTags: ['device'],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // PODS & COILS
  // -------------------------------------------------------------------------
  {
    id: 'pods-coils',
    label: 'Pods & Coils',
    tags: ['pod', 'coil'],
    hero: CATEGORY_HEROES.pod,
    columns: [
      {
        heading: 'Pods',
        links: [
          {label: 'Pre-filled Pods', tags: ['pod', 'prefilled_pod'], url: buildSearchUrl(['pod', 'prefilled_pod'])},
          {label: 'Replacement Pods', tags: ['pod', 'replacement_pod'], url: buildSearchUrl(['pod', 'replacement_pod'])},
        ],
        seeAllLabel: 'See all pods',
        seeAllTags: ['pod'],
      },
      {
        heading: 'Coils',
        links: [
          {label: 'Sub-Ohm Coils (0.3-0.5)', tags: ['coil', '0.3ohm'], url: buildSearchUrl(['coil', '0.3ohm'])},
          {label: 'RDTL Coils (0.6-0.8)', tags: ['coil', '0.6ohm'], url: buildSearchUrl(['coil', '0.6ohm'])},
          {label: 'MTL Coils (1.0+)', tags: ['coil', '1.0ohm'], url: buildSearchUrl(['coil', '1.0ohm'])},
        ],
        seeAllLabel: 'See all coils',
        seeAllTags: ['coil'],
      },
      {
        heading: 'By Capacity',
        links: [
          {label: '2ml', tags: ['pod', '2ml'], url: buildSearchUrl(['pod', '2ml'])},
          {label: '3ml', tags: ['pod', '3ml'], url: buildSearchUrl(['pod', '3ml'])},
          {label: '4ml', tags: ['pod', '4ml'], url: buildSearchUrl(['pod', '4ml'])},
          {label: '5ml+', tags: ['pod', '5ml'], url: buildSearchUrl(['pod', '5ml'])},
        ],
        seeAllLabel: 'See all capacities',
        seeAllTags: ['pod'],
      },
      {
        heading: 'By Resistance',
        links: [
          {label: '0.3ohm', tags: ['coil', '0.3ohm'], url: buildSearchUrl(['coil', '0.3ohm'])},
          {label: '0.6ohm', tags: ['coil', '0.6ohm'], url: buildSearchUrl(['coil', '0.6ohm'])},
          {label: '0.8ohm', tags: ['coil', '0.8ohm'], url: buildSearchUrl(['coil', '0.8ohm'])},
          {label: '1.0ohm', tags: ['coil', '1.0ohm'], url: buildSearchUrl(['coil', '1.0ohm'])},
          {label: '1.2ohm', tags: ['coil', '1.2ohm'], url: buildSearchUrl(['coil', '1.2ohm'])},
        ],
        seeAllLabel: 'See all resistances',
        seeAllTags: ['coil'],
      },
      {
        heading: 'Tank Parts',
        links: [
          {label: 'Replacement Glass', tags: ['tank', 'glass_tube'], url: buildSearchUrl(['tank', 'glass_tube'])},
          {label: 'O-Rings', tags: ['tank', 'o-rings'], url: buildSearchUrl(['tank', 'o-rings'])},
          {label: 'Drip Tips', tags: ['accessory', 'drip_tip'], url: buildSearchUrl(['accessory', 'drip_tip'])},
        ],
        seeAllLabel: 'See all tank parts',
        seeAllTags: ['tank'],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // ACCESSORIES
  // -------------------------------------------------------------------------
  {
    id: 'accessories',
    label: 'Accessories',
    tags: ['accessory'],
    hero: CATEGORY_HEROES.accessory,
    columns: [
      {
        heading: 'Batteries & Power',
        links: [
          {label: 'Batteries', tags: ['accessory', 'battery'], url: buildSearchUrl(['accessory', 'battery'])},
          {label: 'Chargers', tags: ['accessory', 'charger'], url: buildSearchUrl(['accessory', 'charger'])},
          {label: 'Charging Cables', tags: ['accessory', 'charging_cable'], url: buildSearchUrl(['accessory', 'charging_cable'])},
          {label: 'Battery Wraps', tags: ['accessory', 'battery_wraps'], url: buildSearchUrl(['accessory', 'battery_wraps'])},
        ],
        seeAllLabel: 'See all power accessories',
        seeAllTags: ['accessory', 'battery'],
      },
      {
        heading: 'Cases & Storage',
        links: [
          {label: 'Pouches', tags: ['accessory', 'pouch'], url: buildSearchUrl(['accessory', 'pouch'])},
          {label: 'Cases', tags: ['accessory', 'case'], url: buildSearchUrl(['accessory', 'case'])},
        ],
        seeAllLabel: 'See all storage',
        seeAllTags: ['accessory', 'case'],
      },
      {
        heading: 'Tools & Parts',
        links: [
          {label: 'Tool Kits', tags: ['accessory', 'tool_kit'], url: buildSearchUrl(['accessory', 'tool_kit'])},
          {label: 'Cotton', tags: ['accessory', 'cotton'], url: buildSearchUrl(['accessory', 'cotton'])},
          {label: 'Wire', tags: ['accessory', 'wire'], url: buildSearchUrl(['accessory', 'wire'])},
          {label: 'Screwdrivers', tags: ['accessory', 'screwdriver'], url: buildSearchUrl(['accessory', 'screwdriver'])},
          {label: 'Mouthpieces', tags: ['accessory', 'mouthpiece'], url: buildSearchUrl(['accessory', 'mouthpiece'])},
        ],
        seeAllLabel: 'See all tools',
        seeAllTags: ['accessory', 'tool_kit'],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // CBD
  // -------------------------------------------------------------------------
  {
    id: 'cbd',
    label: 'CBD',
    tags: ['CBD'],
    hero: CATEGORY_HEROES.CBD,
    columns: [
      {
        heading: 'By Form',
        links: [
          {label: 'Oils & Tinctures', tags: ['CBD', 'oil'], url: buildSearchUrl(['CBD', 'oil'])},
          {label: 'Gummies & Edibles', tags: ['CBD', 'gummy'], url: buildSearchUrl(['CBD', 'gummy'])},
          {label: 'Capsules', tags: ['CBD', 'capsule'], url: buildSearchUrl(['CBD', 'capsule'])},
          {label: 'Topicals & Patches', tags: ['CBD', 'topical'], url: buildSearchUrl(['CBD', 'topical'])},
          {label: 'Beverages', tags: ['CBD', 'beverage'], url: buildSearchUrl(['CBD', 'beverage'])},
          {label: 'Pastes & Shots', tags: ['CBD', 'paste'], url: buildSearchUrl(['CBD', 'paste'])},
        ],
        seeAllLabel: 'See all forms',
        seeAllTags: ['CBD'],
      },
      {
        heading: 'By Type',
        links: [
          {label: 'Full Spectrum', tags: ['CBD', 'full_spectrum'], url: buildSearchUrl(['CBD', 'full_spectrum'])},
          {label: 'Broad Spectrum', tags: ['CBD', 'broad_spectrum'], url: buildSearchUrl(['CBD', 'broad_spectrum'])},
          {label: 'Isolate', tags: ['CBD', 'isolate'], url: buildSearchUrl(['CBD', 'isolate'])},
          {label: 'CBG', tags: ['CBD', 'cbg'], url: buildSearchUrl(['CBD', 'cbg'])},
          {label: 'CBDA', tags: ['CBD', 'cbda'], url: buildSearchUrl(['CBD', 'cbda'])},
        ],
        seeAllLabel: 'See all types',
        seeAllTags: ['CBD'],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // NICOTINE POUCHES
  // -------------------------------------------------------------------------
  {
    id: 'nicotine-pouches',
    label: 'Nic Pouches',
    tags: ['nicotine_pouches'],
    hero: CATEGORY_HEROES.nicotine_pouches,
    columns: [
      {
        heading: 'By Strength',
        links: [
          {label: '3mg (Light)', tags: ['nicotine_pouches', '3mg'], url: buildSearchUrl(['nicotine_pouches', '3mg'])},
          {label: '6mg (Medium)', tags: ['nicotine_pouches', '6mg'], url: buildSearchUrl(['nicotine_pouches', '6mg'])},
          {label: '10mg (Strong)', tags: ['nicotine_pouches', '10mg'], url: buildSearchUrl(['nicotine_pouches', '10mg'])},
          {label: '15mg (Extra Strong)', tags: ['nicotine_pouches', '15mg'], url: buildSearchUrl(['nicotine_pouches', '15mg'])},
          {label: '20mg (Maximum)', tags: ['nicotine_pouches', '20mg'], url: buildSearchUrl(['nicotine_pouches', '20mg'])},
        ],
        seeAllLabel: 'See all strengths',
        seeAllTags: ['nicotine_pouches'],
      },
      {
        heading: 'By Flavour',
        links: [
          {label: 'Fruity', tags: ['nicotine_pouches', 'fruity'], url: buildSearchUrl(['nicotine_pouches', 'fruity'])},
          {label: 'Ice & Menthol', tags: ['nicotine_pouches', 'ice'], url: buildSearchUrl(['nicotine_pouches', 'ice'])},
          {label: 'Tobacco', tags: ['nicotine_pouches', 'tobacco'], url: buildSearchUrl(['nicotine_pouches', 'tobacco'])},
          {label: 'Beverages', tags: ['nicotine_pouches', 'beverages'], url: buildSearchUrl(['nicotine_pouches', 'beverages'])},
        ],
        seeAllLabel: 'See all flavours',
        seeAllTags: ['nicotine_pouches'],
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
 * Get menu category by primary tag
 */
export function getMenuCategoryByTag(tag: string): MenuCategory | undefined {
  return MEGA_MENU.find((category) => category.tags.includes(tag));
}

/**
 * Collection handle to tag mapping for redirects
 */
export const COLLECTION_TO_TAG_REDIRECTS: Record<string, string[]> = {
  // All products
  'all': [],
  
  // Disposables
  'disposable-vapes': ['disposable'],
  'disposables': ['disposable'],
  
  // E-Liquids
  'e-liquids': ['e-liquid'],
  'e-liquid': ['e-liquid'],
  'nic-salts': ['e-liquid', 'nic_salt'],
  'shortfills': ['e-liquid', 'shortfill'],
  'shortfill': ['e-liquid', 'shortfill'],
  '10ml-e-liquids': ['e-liquid', '10ml'],
  '50ml-e-liquids': ['e-liquid', '50ml'],
  '100ml-e-liquids': ['e-liquid', '100ml'],
  
  // Devices
  'vape-kits': ['device'],
  'pod-kits': ['pod_system'],
  'box-mods': ['box_mod'],
  'tanks': ['tank'],
  'starter-kits': ['device'],
  
  // Pods & Coils
  'pods': ['pod'],
  'coils': ['coil'],
  'coils-pods': ['coil', 'pod'],
  'replacement-pods': ['pod', 'replacement_pod'],
  'prefilled-pods': ['pod', 'prefilled_pod'],
  
  // Accessories
  'accessories': ['accessory'],
  'batteries': ['accessory', 'battery'],
  'chargers': ['accessory', 'charger'],
  
  // CBD
  'cbd': ['CBD'],
  'cbd-oils': ['CBD', 'oil'],
  'cbd-gummies': ['CBD', 'gummy'],
  
  // Nicotine Pouches
  'nicotine-pouches': ['nicotine_pouches'],
};

/**
 * Get redirect URL for a collection handle
 */
export function getCollectionRedirectUrl(handle: string): string | null {
  const tags = COLLECTION_TO_TAG_REDIRECTS[handle.toLowerCase()];
  if (!tags) return null;
  return buildSearchUrl(tags);
}
