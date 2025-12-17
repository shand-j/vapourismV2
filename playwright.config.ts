import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || process.env.BASE_URL || 'http://localhost:3000';

const authBypassToken = process.env.OXYGEN_AUTH_BYPASS_TOKEN;

// Check if we're targeting a remote preview environment (not localhost)
const isRemotePreview = baseURL && !baseURL.includes('localhost') && !baseURL.includes('127.0.0.1');
const isCI = !!process.env.CI;

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
    // Add auth bypass token header for Oxygen preview environments
    ...(authBypassToken && {
      extraHTTPHeaders: {
        'oxygen-auth-bypass-token': authBypassToken,
      },
    }),
  },
  // Only start local webServer when not targeting a remote preview
  ...(isRemotePreview
    ? {}
    : {
        webServer: {
          command: 'npm run preview',
          url: baseURL,
          reuseExistingServer: true,
          timeout: 120_000,
        },
      }),
  // Only start local webServer when not testing against remote deployment
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Add mobile testing in CI
    ...(isCI ? [{
      name: 'mobile-chrome',
      use: { ...devices['iPhone 12'] },
    }] : []),
  ],
} );
