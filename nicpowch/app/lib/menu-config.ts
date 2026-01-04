/**
 * NicPowch Menu Configuration
 *
 * Simplified menu structure focused exclusively on nicotine pouches.
 * All navigation links route to /search with tag query parameters.
 */

import {BRAND_CONFIG} from '../brand-config';

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
  hero: CategoryHero;
}

export interface CategoryHero {
  title: string;
  subtitle: string;
  accentColor: string;
}

/**
 * Build search URL from tags
 * Always includes the base nicotine_pouches filter
 */
export function buildSearchUrl(tags: string[]): string {
  const defaultTag = BRAND_CONFIG.productFilterTags[0];
  if (tags.length === 0) return `/search?tag=${defaultTag}`;
  const params = new URLSearchParams();
  for (const tag of tags) {
    params.append('tag', tag);
  }
  return `/search?${params.toString()}`;
}

/**
 * Category hero configuration for nicotine pouches
 */
export const CATEGORY_HERO: CategoryHero = {
  title: 'Nicotine Pouches',
  subtitle: 'Tobacco-free nicotine pouches. Discreet, smoke-free satisfaction.',
  accentColor: BRAND_CONFIG.colors.accent,
};

// =============================================================================
// NICPOWCH MEGA MENU STRUCTURE
// =============================================================================

export const NICPOWCH_MENU: MenuCategory[] = [
  // -------------------------------------------------------------------------
  // BY STRENGTH
  // -------------------------------------------------------------------------
  {
    id: 'by-strength',
    label: 'By Strength',
    tags: ['nicotine_pouches'],
    hero: {
      title: 'Shop by Strength',
      subtitle: 'Find your perfect nicotine level, from light to extra strong.',
      accentColor: BRAND_CONFIG.colors.accent,
    },
    columns: [
      {
        heading: 'Nicotine Strength',
        links: [
          {
            label: '3mg - Light',
            tags: ['nicotine_pouches', '3mg'],
            url: buildSearchUrl(['nicotine_pouches', '3mg']),
          },
          {
            label: '6mg - Medium',
            tags: ['nicotine_pouches', '6mg'],
            url: buildSearchUrl(['nicotine_pouches', '6mg']),
          },
          {
            label: '10mg - Strong',
            tags: ['nicotine_pouches', '10mg'],
            url: buildSearchUrl(['nicotine_pouches', '10mg']),
          },
          {
            label: '15mg - Extra Strong',
            tags: ['nicotine_pouches', '15mg'],
            url: buildSearchUrl(['nicotine_pouches', '15mg']),
          },
          {
            label: '20mg - Maximum',
            tags: ['nicotine_pouches', '20mg'],
            url: buildSearchUrl(['nicotine_pouches', '20mg']),
          },
        ],
        seeAllLabel: 'See all strengths',
        seeAllTags: ['nicotine_pouches'],
      },
      {
        heading: 'Strength Guide',
        links: [
          {
            label: 'Beginner (1-6mg)',
            tags: ['nicotine_pouches', '3mg'],
            url: buildSearchUrl(['nicotine_pouches', '3mg']),
          },
          {
            label: 'Intermediate (6-12mg)',
            tags: ['nicotine_pouches', '10mg'],
            url: buildSearchUrl(['nicotine_pouches', '10mg']),
          },
          {
            label: 'Advanced (12-20mg)',
            tags: ['nicotine_pouches', '20mg'],
            url: buildSearchUrl(['nicotine_pouches', '20mg']),
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // BY FLAVOUR
  // -------------------------------------------------------------------------
  {
    id: 'by-flavour',
    label: 'By Flavour',
    tags: ['nicotine_pouches'],
    hero: {
      title: 'Shop by Flavour',
      subtitle: 'From fresh mint to fruity blends, find your favourite taste.',
      accentColor: BRAND_CONFIG.colors.accent,
    },
    columns: [
      {
        heading: 'Popular Flavours',
        links: [
          {
            label: 'Mint & Ice',
            tags: ['nicotine_pouches', 'ice'],
            url: buildSearchUrl(['nicotine_pouches', 'ice']),
          },
          {
            label: 'Spearmint',
            tags: ['nicotine_pouches', 'spearmint'],
            url: buildSearchUrl(['nicotine_pouches', 'spearmint']),
          },
          {
            label: 'Peppermint',
            tags: ['nicotine_pouches', 'peppermint'],
            url: buildSearchUrl(['nicotine_pouches', 'peppermint']),
          },
          {
            label: 'Wintergreen',
            tags: ['nicotine_pouches', 'wintergreen'],
            url: buildSearchUrl(['nicotine_pouches', 'wintergreen']),
          },
        ],
        seeAllLabel: 'See all mint',
        seeAllTags: ['nicotine_pouches', 'ice'],
      },
      {
        heading: 'Fruity',
        links: [
          {
            label: 'Berry',
            tags: ['nicotine_pouches', 'berry'],
            url: buildSearchUrl(['nicotine_pouches', 'berry']),
          },
          {
            label: 'Citrus',
            tags: ['nicotine_pouches', 'citrus'],
            url: buildSearchUrl(['nicotine_pouches', 'citrus']),
          },
          {
            label: 'Tropical',
            tags: ['nicotine_pouches', 'tropical'],
            url: buildSearchUrl(['nicotine_pouches', 'tropical']),
          },
          {
            label: 'Watermelon',
            tags: ['nicotine_pouches', 'watermelon'],
            url: buildSearchUrl(['nicotine_pouches', 'watermelon']),
          },
        ],
        seeAllLabel: 'See all fruity',
        seeAllTags: ['nicotine_pouches', 'fruity'],
      },
      {
        heading: 'Classic',
        links: [
          {
            label: 'Tobacco',
            tags: ['nicotine_pouches', 'tobacco'],
            url: buildSearchUrl(['nicotine_pouches', 'tobacco']),
          },
          {
            label: 'Coffee',
            tags: ['nicotine_pouches', 'coffee'],
            url: buildSearchUrl(['nicotine_pouches', 'coffee']),
          },
          {
            label: 'Unflavoured',
            tags: ['nicotine_pouches', 'unflavoured'],
            url: buildSearchUrl(['nicotine_pouches', 'unflavoured']),
          },
        ],
        seeAllLabel: 'See all classic',
        seeAllTags: ['nicotine_pouches', 'tobacco'],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // BY BRAND
  // -------------------------------------------------------------------------
  {
    id: 'by-brand',
    label: 'By Brand',
    tags: ['nicotine_pouches'],
    hero: {
      title: 'Shop by Brand',
      subtitle: 'Premium nicotine pouches from the world\'s leading brands.',
      accentColor: BRAND_CONFIG.colors.accent,
    },
    columns: [
      {
        heading: 'Popular Brands',
        links: [
          {
            label: 'Velo',
            tags: ['nicotine_pouches'],
            url: '/search?tag=nicotine_pouches&vendor=Velo',
          },
          {
            label: 'Zyn',
            tags: ['nicotine_pouches'],
            url: '/search?tag=nicotine_pouches&vendor=Zyn',
          },
          {
            label: 'Nordic Spirit',
            tags: ['nicotine_pouches'],
            url: '/search?tag=nicotine_pouches&vendor=Nordic+Spirit',
          },
          {
            label: 'On!',
            tags: ['nicotine_pouches'],
            url: '/search?tag=nicotine_pouches&vendor=On%21',
          },
        ],
        seeAllLabel: 'See all brands',
        seeAllTags: ['nicotine_pouches'],
      },
      {
        heading: 'Strong Brands',
        links: [
          {
            label: 'Killa',
            tags: ['nicotine_pouches'],
            url: '/search?tag=nicotine_pouches&vendor=Killa',
          },
          {
            label: 'Pablo',
            tags: ['nicotine_pouches'],
            url: '/search?tag=nicotine_pouches&vendor=Pablo',
          },
          {
            label: 'Kurwa',
            tags: ['nicotine_pouches'],
            url: '/search?tag=nicotine_pouches&vendor=Kurwa',
          },
          {
            label: 'Siberia',
            tags: ['nicotine_pouches'],
            url: '/search?tag=nicotine_pouches&vendor=Siberia',
          },
        ],
      },
      {
        heading: 'Premium Brands',
        links: [
          {
            label: 'Loop',
            tags: ['nicotine_pouches'],
            url: '/search?tag=nicotine_pouches&vendor=Loop',
          },
          {
            label: 'Volt',
            tags: ['nicotine_pouches'],
            url: '/search?tag=nicotine_pouches&vendor=Volt',
          },
          {
            label: 'Ace',
            tags: ['nicotine_pouches'],
            url: '/search?tag=nicotine_pouches&vendor=Ace',
          },
          {
            label: 'White Fox',
            tags: ['nicotine_pouches'],
            url: '/search?tag=nicotine_pouches&vendor=White+Fox',
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // BUNDLES & OFFERS
  // -------------------------------------------------------------------------
  {
    id: 'bundles',
    label: 'Bundles',
    tags: ['nicotine_pouches', 'bundle'],
    hero: {
      title: 'Bundles & Offers',
      subtitle: 'Save more when you buy in bulk. Multi-packs and variety bundles.',
      accentColor: BRAND_CONFIG.colors.accent,
    },
    columns: [
      {
        heading: 'Multi-Packs',
        links: [
          {
            label: '5-Pack Bundles',
            tags: ['nicotine_pouches', 'bundle', '5-pack'],
            url: buildSearchUrl(['nicotine_pouches', 'bundle', '5-pack']),
          },
          {
            label: '10-Pack Bundles',
            tags: ['nicotine_pouches', 'bundle', '10-pack'],
            url: buildSearchUrl(['nicotine_pouches', 'bundle', '10-pack']),
          },
          {
            label: 'Variety Packs',
            tags: ['nicotine_pouches', 'bundle', 'variety'],
            url: buildSearchUrl(['nicotine_pouches', 'bundle', 'variety']),
          },
        ],
        seeAllLabel: 'See all bundles',
        seeAllTags: ['nicotine_pouches', 'bundle'],
      },
      {
        heading: 'Special Offers',
        links: [
          {
            label: 'New Arrivals',
            tags: ['nicotine_pouches', 'new'],
            url: buildSearchUrl(['nicotine_pouches', 'new']),
          },
          {
            label: 'Best Sellers',
            tags: ['nicotine_pouches', 'best-seller'],
            url: buildSearchUrl(['nicotine_pouches', 'best-seller']),
          },
        ],
      },
    ],
  },
];

/**
 * Get menu category by ID
 */
export function getMenuCategory(id: string): MenuCategory | undefined {
  return NICPOWCH_MENU.find((category) => category.id === id);
}

/**
 * Get hero configuration for the main nicotine pouches category
 */
export function getDefaultHero(): CategoryHero {
  return CATEGORY_HERO;
}
