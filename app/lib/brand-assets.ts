/**
 * Brand Media Pack Integration for V2
 * 
 * Manages brand assets from public/media_packs/ directory.
 * 
 * Key features:
 * - Load brand manifests
 * - Graceful fallbacks for missing assets
 * - Responsive image utilities
 * - Rights-safe asset management
 * 
 * References:
 * - v2/docs/research/media-pack-integration-plan.md
 * - public/media_packs/README.md
 */

export interface BrandAssets {
  displayName: string;
  vendor: string;
  shopifyVendor: string;
  slug: string;
  hasMediaPack: boolean;
  logos: {
    primary?: string;
    square?: string;
    vertical?: string;
  };
  lifestyle: Array<{
    url: string;
    alt: string;
    credit?: string;
  }>;
  products: Record<string, string>;
  brandStory?: string;
  brandColors?: {
    primary: string;
    secondary: string;
  };
  guidelines?: string;
  website?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

export interface BrandManifest {
  version: string;
  lastUpdated: string;
  brands: Record<string, BrandAssets>;
}

/**
 * Normalize vendor name to slug format
 * 
 * @param vendor - Vendor name from Shopify
 * @returns Normalized slug
 */
export function normalizeVendorSlug(vendor: string): string {
  return vendor
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Load brand manifest from public directory
 * Note: In production, this should be loaded once and cached
 * 
 * @returns Brand manifest data
 */
export async function loadBrandManifest(): Promise<BrandManifest | null> {
  try {
    // In V2, we'll need to load this from the public directory
    // For now, return a skeleton structure
    // TODO: Implement actual manifest loading when manifest.json is created
    return {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      brands: {},
    };
  } catch (error) {
    console.error('Error loading brand manifest:', error);
    return null;
  }
}

/**
 * Get brand assets for a specific vendor
 * 
 * @param vendor - Vendor name from Shopify product
 * @param manifest - Brand manifest (optional, will load if not provided)
 * @returns Brand assets or null if not found
 */
export async function getBrandAssets(
  vendor: string,
  manifest?: BrandManifest | null
): Promise<BrandAssets | null> {
  const slug = normalizeVendorSlug(vendor);

  // Load manifest if not provided
  const brandManifest = manifest || (await loadBrandManifest());
  if (!brandManifest) return null;

  const brandData = brandManifest.brands[slug];
  if (!brandData || !brandData.hasMediaPack) {
    return null;
  }

  return brandData;
}

/**
 * Get all brands with media packs
 * 
 * @param manifest - Brand manifest (optional, will load if not provided)
 * @returns Array of brand slugs with media packs
 */
export async function getAllBrandsWithMedia(
  manifest?: BrandManifest | null
): Promise<string[]> {
  const brandManifest = manifest || (await loadBrandManifest());
  if (!brandManifest) return [];

  return Object.keys(brandManifest.brands).filter(
    (slug) => brandManifest.brands[slug].hasMediaPack
  );
}

/**
 * Generate responsive image srcset
 * 
 * @param baseUrl - Base image URL
 * @param widths - Array of widths to generate (default: [300, 600, 1200])
 * @returns srcset string
 */
export function generateImageSrcSet(
  baseUrl: string,
  widths: number[] = [300, 600, 1200]
): string {
  // Check if image is already optimized (has width suffix)
  const hasWidthSuffix = /-\d+w\.(webp|jpg|jpeg|png)$/i.test(baseUrl);

  if (hasWidthSuffix) {
    // Image is already optimized, use as-is
    return baseUrl;
  }

  // Generate srcset for responsive loading
  const extension = baseUrl.split('.').pop();
  const basePath = baseUrl.replace(new RegExp(`\\.${extension}$`), '');

  return widths
    .map((width) => `${basePath}-${width}w.webp ${width}w`)
    .join(', ');
}

/**
 * Get fallback assets for brands without media packs
 * 
 * @returns Default brand assets structure
 */
export function getFallbackBrandAssets(): BrandAssets {
  return {
    displayName: 'Brand',
    vendor: '',
    shopifyVendor: '',
    slug: '',
    hasMediaPack: false,
    logos: {},
    lifestyle: [],
    products: {},
  };
}

/**
 * Validate brand assets structure
 * Useful for testing and development
 * 
 * @param assets - Brand assets to validate
 * @returns Validation result with errors
 */
export function validateBrandAssets(assets: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Required fields
  if (!assets.displayName) errors.push('Missing displayName');
  if (!assets.vendor) errors.push('Missing vendor');
  if (!assets.slug) errors.push('Missing slug');
  if (typeof assets.hasMediaPack !== 'boolean') errors.push('Missing hasMediaPack');

  // Logos validation
  if (assets.logos) {
    if (assets.logos.primary && typeof assets.logos.primary !== 'string') {
      errors.push('Invalid logo.primary format');
    }
  } else {
    errors.push('Missing logos object');
  }

  // Lifestyle images validation
  if (!Array.isArray(assets.lifestyle)) {
    errors.push('Lifestyle must be an array');
  } else {
    assets.lifestyle.forEach((img: any, index: number) => {
      if (!img.url) errors.push(`Lifestyle image ${index}: missing url`);
      if (!img.alt) errors.push(`Lifestyle image ${index}: missing alt text`);
    });
  }

  // Products validation
  if (assets.products && typeof assets.products !== 'object') {
    errors.push('Products must be an object');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate image optimization script metadata
 * Used by scripts/optimize_media_packs.py
 * 
 * @param brandSlug - Brand slug
 * @returns Optimization config
 */
export function getImageOptimizationConfig(brandSlug: string) {
  return {
    brandSlug,
    inputDir: `/public/media_packs/${brandSlug}`,
    outputFormats: ['webp'],
    widths: [300, 600, 1200],
    quality: 85,
    preserveOriginal: true,
  };
}

/**
 * Check if brand has specific asset type
 * 
 * @param assets - Brand assets
 * @param type - Asset type to check
 * @returns Whether asset type exists
 */
export function hasBrandAssetType(
  assets: BrandAssets | null,
  type: 'logo' | 'lifestyle' | 'products' | 'guidelines'
): boolean {
  if (!assets) return false;

  switch (type) {
    case 'logo':
      return !!(
        assets.logos.primary ||
        assets.logos.square ||
        assets.logos.vertical
      );
    case 'lifestyle':
      return assets.lifestyle.length > 0;
    case 'products':
      return Object.keys(assets.products).length > 0;
    case 'guidelines':
      return !!assets.guidelines;
    default:
      return false;
  }
}

/**
 * Get brand primary color for theming
 * 
 * @param assets - Brand assets
 * @param fallback - Fallback color (default: #000000)
 * @returns Primary brand color
 */
export function getBrandPrimaryColor(
  assets: BrandAssets | null,
  fallback: string = '#000000'
): string {
  return assets?.brandColors?.primary || fallback;
}

/**
 * Format brand social media link
 * 
 * @param platform - Social media platform
 * @param handle - Social media handle
 * @returns Full URL
 */
export function formatSocialMediaUrl(
  platform: 'instagram' | 'facebook' | 'twitter',
  handle: string
): string {
  const cleanHandle = handle.replace(/^@/, '');

  const platforms: Record<string, string> = {
    instagram: `https://instagram.com/${cleanHandle}`,
    facebook: `https://facebook.com/${cleanHandle}`,
    twitter: `https://twitter.com/${cleanHandle}`,
  };

  return platforms[platform] || '#';
}
