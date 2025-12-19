import { defineConfig } from 'unlighthouse'

/**
 * Unlighthouse Configuration for Vapourism SEO Audits
 *
 * Run locally:     npm run seo:crawl
 * Run in CI:       npm run seo:crawl:ci
 *
 * Key settings for comprehensive e-commerce coverage:
 * - dynamicSampling: false - Scan ALL pages, not just samples
 * - maxRoutes: 500 - High limit for product catalog coverage
 * - samples: 3 - Multiple Lighthouse runs for accuracy
 */
export default defineConfig({
  site: 'https://vapourism.co.uk',

  scanner: {
    // CRITICAL: Disable dynamic sampling to scan ALL product/collection pages
    // Default (5) would only sample 5 products per category - not enough for SEO audit
    dynamicSampling: false,

    // Maximum routes to scan (default: 200)
    // Set high for full product catalog coverage
    maxRoutes: 500,

    // Run Lighthouse multiple times per page for accuracy (default: 1)
    samples: 3,

    // Use sitemap for URL discovery
    sitemap: true,

    // Also crawl pages for internal links
    crawler: true,

    // Respect robots.txt
    robotsTxt: true,

    // Enable throttling for realistic performance metrics
    throttle: true,

    // Mobile-first (default)
    device: 'mobile',

    // Exclude non-essential paths from audit
    exclude: [
      '/account/*',
      '/cart',
      '/checkout/*',
      '/api/*',
      '/*.json',
      '/age-verification',
    ],

    // Include key commerce paths
    include: [
      '/',
      '/collections/*',
      '/products/*',
      '/pages/*',
      '/blogs/*',
      '/search*',
    ],
  },

  // CI-specific settings (used with unlighthouse-ci)
  ci: {
    // Fail CI if scores drop below these thresholds
    budget: {
      seo: 80,
      accessibility: 80,
      'best-practices': 80,
      performance: 50, // More lenient for performance in CI
    },
    // Generate static reports for artifact upload
    buildStatic: true,
  },

  // Lighthouse-specific options
  lighthouse: {
    onlyCategories: ['seo', 'accessibility', 'best-practices', 'performance'],
  },

  // Output configuration
  outputPath: '.unlighthouse',
  cache: true,
  debug: false,
})
