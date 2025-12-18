/**
 * Lighthouse CI Configuration
 *
 * This configuration file defines settings for automated Lighthouse audits
 * targeting SEO, performance, accessibility, and best practices.
 *
 * Run manually: npx lhci autorun --config=.lighthouserc.cjs
 * Run in CI: The SEO audit workflow will automatically use this config
 */

module.exports = {
  ci: {
    collect: {
      // URLs to audit - use environment variable for preview deployments
      // Fall back to production URLs for local testing
      url: process.env.LHCI_URLS?.split(',') || [
        'https://vapourism.co.uk/',
        'https://vapourism.co.uk/collections/disposable-vapes',
        'https://vapourism.co.uk/products/elux-legend-3500-puffs-disposable-vape',
      ],
      // Number of Lighthouse runs per URL for reliability
      numberOfRuns: 1,
      settings: {
        // Chrome flags for headless environments
        chromeFlags: '--no-sandbox --headless',
        // Focus on SEO and related categories
        onlyCategories: ['seo', 'accessibility', 'best-practices', 'performance'],
        // Mobile-first auditing (default viewport)
        emulatedFormFactor: 'mobile',
        // Skip throttling in CI for faster results (still representative)
        throttlingMethod: 'devtools',
      },
    },
    assert: {
      // Assertion presets - fail if scores drop below thresholds
      assertions: {
        // SEO - primary focus, start at 80% and increase over time
        'categories:seo': ['error', {minScore: 0.8}],
        // Accessibility - important for compliance
        'categories:accessibility': ['warn', {minScore: 0.8}],
        // Best practices - should follow web standards
        'categories:best-practices': ['warn', {minScore: 0.8}],
        // Performance - warn but don't fail (varies in CI environments)
        'categories:performance': ['warn', {minScore: 0.5}],

        // Critical SEO-specific audits
        'document-title': 'error',
        'meta-description': 'error',
        'http-status-code': 'error',
        'is-crawlable': 'error',
        'robots-txt': 'warn',
        'canonical': 'warn',
        'hreflang': 'off', // Not applicable for UK-only store
        'font-size': 'warn',
        'link-text': 'warn',
        'tap-targets': 'warn',

        // Critical accessibility audits
        'image-alt': 'error',
        'html-has-lang': 'error',
        'html-lang-valid': 'error',
        'color-contrast': 'warn',
        'heading-order': 'warn',

        // Best practices
        'viewport': 'error',
        'charset': 'error',
        'doctype': 'error',
      },
    },
    upload: {
      // Use temporary storage for PR comments and artifact links
      target: 'temporary-public-storage',
    },
  },
};
