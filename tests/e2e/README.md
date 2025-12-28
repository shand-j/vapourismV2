# E2E Tests

This directory contains end-to-end (E2E) tests for the Vapourism V2 Hydrogen storefront using Playwright.

## Overview

The E2E tests validate critical user journeys across the storefront, including:
- Homepage discovery and navigation
- Predictive search functionality
- Collections browsing and mega-menu
- Mobile responsive navigation
- Product detail pages and add-to-cart flow
- Search results with filtering and pagination
- Age verification modals and post-payment verification
- Account authentication flows
- Error handling (404 pages)

## Test Execution Environments

### CI Environment (Recommended)
The E2E tests are **designed to run against a deployed Oxygen preview environment** in CI:

1. **Automatic Execution**: Tests run automatically in pull requests via `.github/workflows/pr-tests.yml`
2. **Environment**: Tests execute against an Oxygen preview deployment with:
   - Live Shopify Storefront API access
   - All environment variables configured
   - Proper authentication tokens
3. **Workflow Steps**:
   - Unit tests run first
   - Preview deployment is created
   - E2E tests run against the preview URL
   - Test reports are uploaded as artifacts

### Local Development
Running E2E tests locally requires **valid Shopify credentials** and a **running preview server**.

#### Prerequisites
```bash
# Install Playwright browsers
npx playwright install --with-deps chromium

# Ensure the application is built
npm run build
```

#### Option 1: Test Against Local Preview
```bash
# Terminal 1: Start preview server (requires valid Shopify credentials in .env)
npm run preview

# Terminal 2: Run E2E tests
npm run test:e2e
```

**Note**: Local testing requires a `.env` file with valid Shopify credentials:
- `SESSION_SECRET` - Session encryption key
- `PUBLIC_STOREFRONT_API_TOKEN` - Shopify Storefront API token
- `PUBLIC_STOREFRONT_ID` - Shopify storefront ID
- `PUBLIC_STORE_DOMAIN` - Your Shopify store domain
- Other required Hydrogen environment variables

#### Option 2: Test Against Deployed Preview
```bash
# Set the preview URL from your Oxygen deployment
export PLAYWRIGHT_BASE_URL="https://your-preview-url.oxygen.shopifypreview.com"
export OXYGEN_AUTH_BYPASS_TOKEN="your-auth-token"

# Run E2E tests
npm run test:e2e
```

## Test Commands

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Run E2E tests with UI mode (interactive)
npm run test:e2e:ui

# Run E2E tests in debug mode
npm run test:e2e:debug

# Run specific test file
npx playwright test tests/e2e/user-journeys.spec.ts

# View test report
npx playwright show-report
```

## Test Structure

### `user-journeys.spec.ts`
Main test suite covering 14 critical user journeys:

1. **Homepage Discovery** - Hero section and CTAs visibility
2. **Predictive Search** - Header search with suggestions, products, and collections (UI-based, not dependent on API response)
3. **Collections Mega-Menu** - Desktop navigation and hover interactions
4. **Mobile Menu** - Drawer navigation and responsive behavior
5. **Collections Directory** - Collections listing and detail pages
6. **Product Detail Page** - Gallery and purchase functionality
7. **Search Results** - Full search page with results display
8. **Filters and Pagination** - Search filtering and pagination controls
9. **Add to Cart** - Cart slideout and optimistic updates (UI-based, not dependent on cart API response)
10. **Age Verification Modal** - First-time visit modal
11. **Account Login** - Redirect to Shopify authentication
12. **404 Error Page** - Not found page rendering
13. **Post-Payment Age Verification** - Verification page load
14. **Age Verification Flow** - Complete verification process with mock token

### `user-journeys.feature`
Gherkin-style feature file documenting expected behavior in business language.

## Test Configuration

See `playwright.config.ts` in the project root for configuration:
- Base URL from environment variables
- Timeout settings (120s for tests, 10s for assertions)
- Retry logic (2 retries in CI, 1 locally)
- Video and screenshot capture on failure
- Authentication bypass token support for Oxygen previews

## Common Issues

### "Session Secret not set" Error
**Cause**: Missing `SESSION_SECRET` environment variable  
**Solution**: Create a `.env` file with `SESSION_SECRET=your-secret-here`

### "publicStorefrontToken not provided" Error
**Cause**: Missing Shopify Storefront API credentials  
**Solution**: Ensure `.env` has `PUBLIC_STOREFRONT_API_TOKEN` and related variables

### "Timeout waiting for webServer"
**Cause**: Preview server failed to start (usually due to missing credentials)  
**Solution**: Check that all required Shopify environment variables are set

### Tests Failing with "Element not visible"
**Cause**: Timing issues or elements not loaded  
**Solution**: Tests include explicit waits (5000ms timeouts). If issues persist, check actual page rendering.

## Maintenance

When updating tests:
1. **Use proper async/await**: Always await `.count()` calls before using in conditionals
2. **Avoid silent error swallowing**: Never use `.catch(() => {})` on assertions
3. **Test UI state, not network requests**: Avoid `waitForResponse()` calls that can timeout; instead, test the UI state that results from the network request
4. **Add explicit timeouts**: Critical assertions should have `{ timeout: 10000 }` or higher for CI environments
5. **Use specific selectors**: Prefer `getByRole`, `getByLabel`, and specific test IDs
6. **Check TypeScript**: Run `npx tsc --noEmit tests/e2e/*.spec.ts` to verify syntax

## CI Integration

E2E tests are part of the PR workflow:
- **Trigger**: Automatic on PR open, reopen, or synchronize
- **Dependency**: Requires successful unit tests and preview deployment
- **Reports**: Test results and videos uploaded as GitHub Actions artifacts
- **Notifications**: Failed tests trigger Copilot notifications on PRs

For CI configuration details, see `.github/workflows/pr-tests.yml`.
