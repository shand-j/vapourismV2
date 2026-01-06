/**
 * Mega Menu Configuration
 *
 * Static menu structure using vendor and productType filtering.
 * All navigation links route to /search with vendor/type query parameters.
 *
 * URL patterns:
 * - Brand pages: /search?vendor=Crystal+Bar
 * - Product type pages: /search?type=Disposable
 * - Combined: /search?type=E-Liquid&vendor=Hayati
 */

export interface MenuLink {
  label: string;
  url: string;
  vendor?: string;
  productType?: string;
}

export interface MenuColumn {
  heading: string;
  links: MenuLink[];
  seeAllLabel?: string;
  seeAllProductType?: string;
  seeAllVendor?: string;
}

export interface MenuCategory {
  id: string;
  label: string;
  productType?: string;
  vendor?: string;
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
 * Build search URL from vendor and/or productType
 */
export function buildSearchUrl(options: {
  vendor?: string;
  productType?: string;
  q?: string;
} = {}): string {
  const { vendor, productType, q } = options;
  if (!vendor && !productType && !q) return '/search';
  
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (productType) params.set('type', productType);
  if (vendor) params.set('vendor', vendor);
  
  return `/search?${params.toString()}`;
}

/**
 * Category hero configurations for search page banners
 * Keys are normalized productType values (lowercase, spaces to underscores)
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
  cbd: {
    title: 'CBD Products',
    subtitle: 'Oils, gummies, capsules, and more. Quality CBD for wellness.',
    accentColor: '#22c55e',
  },
  nicotine_pouch: {
    title: 'Nicotine Pouches',
    subtitle: 'Tobacco-free nicotine pouches. Discreet and smoke-free.',
    accentColor: '#ec4899',
  },
};

/**
 * Normalize a product type string for hero lookup
 * Converts to lowercase, replaces spaces/hyphens with underscores
 */
function normalizeProductType(productType: string | null | undefined): string {
  if (!productType || typeof productType !== 'string') {
    return '';
  }
  return productType.toLowerCase().replace(/[\s-]+/g, '_');
}

/**
 * Get hero config for a productType
 */
export function getHeroForProductType(productType: string | null | undefined): CategoryHero | null {
  if (!productType || typeof productType !== 'string') {
    return null;
  }
  
  const normalized = normalizeProductType(productType);
  if (!normalized) {
    return null;
  }
  return CATEGORY_HEROES[normalized] || null;
}

// =============================================================================
// MEGA MENU STRUCTURE
// =============================================================================

export const MEGA_MENU: MenuCategory[] = [
  // -------------------------------------------------------------------------
  // REUSABLES (Disposables)
  // -------------------------------------------------------------------------
  {
    id: 'reusables',
    label: 'Reusables',
    productType: 'Disposable',
    hero: CATEGORY_HEROES.disposable,
    columns: [
      {
        heading: 'By Brand',
        links: [
          {label: 'Crystal Bar', vendor: 'Crystal Bar', url: buildSearchUrl({vendor: 'Crystal Bar', productType: 'Disposable'})},
          {label: 'Lost Mary', vendor: 'Lost Mary', url: buildSearchUrl({vendor: 'Lost Mary', productType: 'Disposable'})},
          {label: 'Elux Legend', vendor: 'Elux', url: buildSearchUrl({vendor: 'Elux', productType: 'Disposable'})},
          {label: 'Hayati', vendor: 'Hayati', url: buildSearchUrl({vendor: 'Hayati', productType: 'Disposable'})},
        ],
        seeAllLabel: 'See all brands',
        seeAllProductType: 'Disposable',
      },
      {
        heading: 'By Puff Count',
        links: [
          {label: '600 Puffs', url: buildSearchUrl({productType: 'Disposable', q: '600 puffs'})},
          {label: '3500 Puffs', url: buildSearchUrl({productType: 'Disposable', q: '3500 puffs'})},
          {label: '6000+ Puffs', url: buildSearchUrl({productType: 'Disposable', q: '6000 puffs'})},
        ],
        seeAllLabel: 'See all disposables',
        seeAllProductType: 'Disposable',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // E-LIQUIDS
  // -------------------------------------------------------------------------
  {
    id: 'e-liquids',
    label: 'E-Liquids',
    productType: 'E-Liquid',
    hero: CATEGORY_HEROES['e-liquid'],
    quizLink: {
      label: 'Flavour Lab Quiz',
      url: '/flavour-lab',
    },
    columns: [
      {
        heading: 'By Brand',
        links: [
          {label: 'Riot Squad', vendor: 'Riot Squad', url: buildSearchUrl({vendor: 'Riot Squad', productType: 'E-Liquid'})},
          {label: 'Hayati Pro Max', vendor: 'Hayati', url: buildSearchUrl({vendor: 'Hayati', productType: 'E-Liquid'})},
        ],
        seeAllLabel: 'See all brands',
        seeAllProductType: 'E-Liquid',
      },
      {
        heading: 'By Type',
        links: [
          {label: 'Nic Salts', url: buildSearchUrl({productType: 'E-Liquid', q: 'nic salt'})},
          {label: 'Shortfills', url: buildSearchUrl({productType: 'E-Liquid', q: 'shortfill'})},
          {label: '10ml', url: buildSearchUrl({productType: 'E-Liquid', q: '10ml'})},
          {label: '50ml', url: buildSearchUrl({productType: 'E-Liquid', q: '50ml'})},
          {label: '100ml', url: buildSearchUrl({productType: 'E-Liquid', q: '100ml'})},
        ],
        seeAllLabel: 'See all e-liquids',
        seeAllProductType: 'E-Liquid',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // DEVICES
  // -------------------------------------------------------------------------
  {
    id: 'devices',
    label: 'Devices',
    productType: 'Device',
    hero: CATEGORY_HEROES.device,
    quizLink: {
      label: 'Device Studio Quiz',
      url: '/device-studio',
    },
    columns: [
      {
        heading: 'By Category',
        links: [
          {label: 'Pod Systems', url: buildSearchUrl({productType: 'Pod System'})},
          {label: 'Starter Kits', url: buildSearchUrl({productType: 'Device', q: 'starter kit'})},
        ],
        seeAllLabel: 'See all devices',
        seeAllProductType: 'Device',
      },
      {
        heading: 'By Brand',
        links: [
          {label: 'Hayati X4', vendor: 'Hayati', url: buildSearchUrl({vendor: 'Hayati', productType: 'Device'})},
          {label: 'Hayati Remix', vendor: 'Hayati', url: buildSearchUrl({vendor: 'Hayati', productType: 'Device'})},
        ],
        seeAllLabel: 'See all brands',
        seeAllProductType: 'Device',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // PODS & COILS
  // -------------------------------------------------------------------------
  {
    id: 'pods-coils',
    label: 'Pods & Coils',
    productType: 'Pod',
    hero: CATEGORY_HEROES.pod,
    columns: [
      {
        heading: 'Pods',
        links: [
          {label: 'Pre-filled Pods', url: buildSearchUrl({productType: 'Pod', q: 'prefilled'})},
          {label: 'Replacement Pods', url: buildSearchUrl({productType: 'Pod', q: 'replacement'})},
        ],
        seeAllLabel: 'See all pods',
        seeAllProductType: 'Pod',
      },
      {
        heading: 'Coils',
        links: [
          {label: 'Sub-Ohm Coils', url: buildSearchUrl({productType: 'Coil', q: 'sub ohm'})},
          {label: 'MTL Coils', url: buildSearchUrl({productType: 'Coil', q: 'MTL'})},
        ],
        seeAllLabel: 'See all coils',
        seeAllProductType: 'Coil',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // ACCESSORIES
  // -------------------------------------------------------------------------
  {
    id: 'accessories',
    label: 'Accessories',
    productType: 'Accessory',
    hero: CATEGORY_HEROES.accessory,
    columns: [
      {
        heading: 'Batteries & Power',
        links: [
          {label: 'Batteries', url: buildSearchUrl({productType: 'Accessory', q: 'battery'})},
          {label: 'Chargers', url: buildSearchUrl({productType: 'Accessory', q: 'charger'})},
          {label: 'Charging Cables', url: buildSearchUrl({productType: 'Accessory', q: 'cable'})},
        ],
        seeAllLabel: 'See all power accessories',
        seeAllProductType: 'Accessory',
      },
      {
        heading: 'Cases & Tools',
        links: [
          {label: 'Cases', url: buildSearchUrl({productType: 'Accessory', q: 'case'})},
          {label: 'Tool Kits', url: buildSearchUrl({productType: 'Accessory', q: 'tool'})},
        ],
        seeAllLabel: 'See all accessories',
        seeAllProductType: 'Accessory',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // CBD
  // -------------------------------------------------------------------------
  {
    id: 'cbd',
    label: 'CBD',
    productType: 'CBD',
    hero: CATEGORY_HEROES.cbd,
    columns: [
      {
        heading: 'By Form',
        links: [
          {label: 'Oils & Tinctures', url: buildSearchUrl({productType: 'CBD', q: 'oil'})},
          {label: 'Gummies & Edibles', url: buildSearchUrl({productType: 'CBD', q: 'gummy'})},
          {label: 'Capsules', url: buildSearchUrl({productType: 'CBD', q: 'capsule'})},
        ],
        seeAllLabel: 'See all CBD',
        seeAllProductType: 'CBD',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // NICOTINE POUCHES
  // -------------------------------------------------------------------------
  {
    id: 'nicotine-pouches',
    label: 'Nic Pouches',
    productType: 'Nicotine Pouch',
    hero: CATEGORY_HEROES.nicotine_pouch,
    columns: [
      {
        heading: 'By Brand',
        links: [
          {label: 'Velo', vendor: 'Velo', url: buildSearchUrl({vendor: 'Velo', productType: 'Nicotine Pouch'})},
          {label: 'Zyn', vendor: 'Zyn', url: buildSearchUrl({vendor: 'Zyn', productType: 'Nicotine Pouch'})},
          {label: 'Nordic Spirit', vendor: 'Nordic Spirit', url: buildSearchUrl({vendor: 'Nordic Spirit', productType: 'Nicotine Pouch'})},
        ],
        seeAllLabel: 'See all brands',
        seeAllProductType: 'Nicotine Pouch',
      },
      {
        heading: 'By Strength',
        links: [
          {label: 'Light (3-6mg)', url: buildSearchUrl({productType: 'Nicotine Pouch', q: '3mg 6mg'})},
          {label: 'Regular (8-11mg)', url: buildSearchUrl({productType: 'Nicotine Pouch', q: '10mg'})},
          {label: 'Strong (12-20mg)', url: buildSearchUrl({productType: 'Nicotine Pouch', q: '20mg'})},
        ],
        seeAllLabel: 'See all strengths',
        seeAllProductType: 'Nicotine Pouch',
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
 * Get menu category by productType
 */
export function getMenuCategoryByProductType(productType: string | null | undefined): MenuCategory | undefined {
  const normalized = normalizeProductType(productType);
  if (!normalized) return undefined;
  
  return MEGA_MENU.find((category) => {
    if (!category.productType) return false;
    const categoryNormalized = normalizeProductType(category.productType);
    return categoryNormalized === normalized;
  });
}
