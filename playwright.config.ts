import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || process.env.BASE_URL || 'http://localhost:3000';
const isCI = !!process.env.CI;
const isRemote = baseURL.includes('oxygen.myshopify.com') || baseURL.includes('vapourism.co.uk');

// Oxygen preview password for accessing private preview deployments
const oxygenPreviewPassword = process.env.OXYGEN_PREVIEW_PASSWORD;

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 120 * 1000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  workers: 1,
  retries: isCI ? 2 : 1,
  reporter: isCI 
    ? [['html', { open: 'never' }], ['github'], ['list']]
    : [['html', { open: 'never' }], ['list']],
  use: {
    baseURL,
    headless: true,
    trace: 'on-first-retry',
    video: isCI ? 'on-first-retry' : 'on',
    screenshot: 'only-on-failure',
    // Add extra HTTP headers for Oxygen preview authentication
    extraHTTPHeaders: oxygenPreviewPassword ? {
      'X-Shopify-Oxygen-Preview-Password': oxygenPreviewPassword,
    } : {},
  },
  // Only start local webServer when not testing against remote deployment
  ...(isRemote ? {} : {
    webServer: {
      command: 'npm run preview',
      url: baseURL,
      reuseExistingServer: true,
      timeout: 120_000,
    },
  }),
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Add mobile testing in CI
    ...(isCI ? [{
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    }] : []),
  ],
});
