import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || process.env.BASE_URL || 'http://localhost:3000';
const authBypassToken = process.env.OXYGEN_AUTH_BYPASS_TOKEN;

// Check if we're targeting a remote preview environment (not localhost)
const isRemotePreview = baseURL && !baseURL.includes('localhost') && !baseURL.includes('127.0.0.1');

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 120 * 1000,
  expect: { timeout: 5000 },
  fullyParallel: false,
  workers: 1,
  retries: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL,
    headless: true,
    trace: 'on-first-retry',
    video: 'on',
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
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
