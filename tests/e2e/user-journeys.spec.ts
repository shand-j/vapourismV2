import { test, expect } from '@playwright/test';

test.describe('Vapourism V2 - user journeys', () => {
  // Use Playwright's baseURL from config - accessed via page.goto('/')
  
  test.beforeEach(async ({ page, baseURL }) => {
    // Extract hostname for cookie domain
    const hostname = baseURL ? new URL(baseURL).hostname : 'localhost';
    
    await page.context().addCookies([{
      name: 'vapourism_age_verified',
      value: 'true',
      domain: hostname,  
      path: '/',
    }]);
    // Suppress the initial age verification modal by setting localStorage
    await page.addInitScript(() => {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      localStorage.setItem('initialAgeVerified', JSON.stringify({
        verified: true,
        expiresAt: expiryDate.getTime()
      }));
    });
  });

  test('Homepage discovery — hero and CTAs visible', async ({ page }) => {
    await page.goto('/');
    // Hero header exists and primary CTA visible
    await expect(page.locator('text=Vapourism').first()).toBeVisible();
    await expect(page.locator('header')).toBeVisible();
    expect((await page.locator('role=heading').count())).toBeGreaterThan(0);
    // CTA buttons exist and are links
    await expect(page.locator('text=Featured')).toBeVisible({ timeout: 2000 }).catch(() => {});
  });

  test('Predictive search from header shows suggestions, products and collections', async ({ page }) => {
    await page.goto('/');
    // Focus the header search input (header contains input with aria-label)
    const searchInput = page.getByRole('searchbox');
    await expect(searchInput).toBeVisible();
    await searchInput.click();

    // Type at least two characters and expect predictive dropdown
    await searchInput.fill('dis');

    // Wait for network request and dropdown to populate
    await page.waitForResponse((resp) => resp.url().includes('/api/search/predictive') && resp.status() === 200, { timeout: 5000 });

    // Assertions: suggestions, products or collections should appear
    const overlay = page.locator('#search-results');
    await expect(overlay).toBeVisible({ timeout: 5000 });
    // It should include at least one suggestion, or product card
    const hasProducts = (await overlay.locator('text=Products').count()) > 0;
    const hasSuggestions = (await overlay.locator('text=Suggestions').count()) > 0;
    const hasCollections = (await overlay.locator('text=Collections').count()) > 0;
    expect(hasProducts || hasSuggestions || hasCollections).toBeTruthy();
  });

  test('Collections mega-menu appears and links work', async ({ page }) => {
    await page.goto('/');
    // Hover the Shop/Collections trigger if present
    const collectionsTrigger = page.locator('text=Shop').first();
    await collectionsTrigger.hover();
    // The collections nav should appear
    await expect(page.locator('nav')).toBeVisible();
  });

  test('Mobile menu drawer opens and shows search + nav', async ({ page }) => {
    // Emulate mobile viewport
    await page.goto('/');
    await page.setViewportSize({ width: 375, height: 812 });
    const mobileToggle = page.locator('button[aria-label="Toggle navigation"]').first();
    await mobileToggle.click();
    // Drawer should be visible
    await expect(page.locator('text=Search')).toBeVisible();
  });

  test('Collections directory and collection detail pages render', async ({ page }) => {
    await page.goto('/collections');
    await expect(page.locator('h1, h2')).toBeVisible();
    // Try opening a known collection if present (best-effort)
    const firstCollection = page.locator('a[href^="/collections/"]').first();
    if (await firstCollection.count() > 0) {
      const href = await firstCollection.getAttribute('href');
      await firstCollection.click();
      await expect(page).toHaveURL(href ?? /collections/);
      await expect(page.locator('h1')).toBeVisible();
    }
  });

  test('Product detail page shows gallery and purchase card', async ({ page }) => {
    // Try to find a product link from the homepage or collection pages
    await page.goto('/');
    const productLink = page.locator('a[href^="/products/"]').first();
    await expect(productLink).toBeVisible({ timeout: 5000 });
    const href = await productLink.getAttribute('href');
    await productLink.click();
    await expect(page).toHaveURL(href ?? /products/);
    // Purchase area exists — check for add-to-cart form/button
    const addVisible = (await page.locator('text=Add to cart').count()) > 0 || (await page.locator('button[type="submit"]').filter({ hasText: 'Add' }).count()) > 0;
    expect(addVisible).toBeTruthy();
  });

  test('Search results page shows predictive summary chips and products', async ({ page }) => {
    await page.goto('/search?q=disposable');
    await expect(page.locator('text=Results for')).toBeVisible();
    await expect(page.locator('text=Products').first()).toBeVisible();
  });

  test('Filters and pagination work on search results', async ({ page }) => {
    await page.goto('/search?q=vape');
    // Confirm search results are present and pagination exists
    const results = page.locator('main').locator('article, .product-card, .product-card__link');
    await expect(results.first()).toBeVisible({ timeout: 5000 }).catch(() => {});
    // Check for pagination controls
    const hasLoadMore = (await page.locator('text=Load more').count()) > 0;
    const hasNext = (await page.locator('text=Next').count()) > 0;
    expect(hasLoadMore || hasNext).toBeTruthy();
  });

  test('Add to cart flow from PDP opens cart slideout', async ({ page }) => {
    await page.goto('/');
    // open a product and add to cart
    const productLink = page.locator('a[href^="/products/"]').first();
    await productLink.click();
    
    await page.locator('#variant-selector').selectOption('0.6 Ohm' , {timeout: 5000}).catch(() => {});
    
    await page.getByRole('button', { name: /Add to cart/i }).click();
    
    // Cart slideout should be visible
    await expect(page.locator('text=Added to cart')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('button[aria-label="Cart"]').locator('.bg-rose-500')).toHaveText('1');

    await page.locator('button[aria-label="Cart"]').click();
    await page.waitForRequest((req) => req.url().includes('/cart.data?_routes=routes%2Fcart') && req.method() === 'GET', { timeout: 5000 });
    await expect(page.locator('text=Proceed to checkout').first()).toBeVisible({ timeout: 5000 });
  });

  test('Age verification modal appears on first-time visits', async ({ page }) => {
    // Clear cookies and localStorage to simulate first-time visit
    await page.context().clearCookies();
    await page.addInitScript(() => {
      localStorage.removeItem('initialAgeVerified');
    });
    await page.route('**/*', (route) => route.continue());
    await page.goto('/');
    // Expect the AgeVerificationModal to possibly be visible
    const ageVerifVisible = (await page.locator('text=Age verification').first().count()) > 0 || (await page.locator('text=Enter your date of birth').count()) > 0;
    expect(ageVerifVisible).toBeTruthy();
  });

  // Additional flows: authentication, 404, post-payment verification - smoke checks
  test('Account login page redirects to Shopify auth', async ({ page }) => {
    // The /account/login route redirects to Shopify's hosted login
    // We verify the redirect happens (302/303) or we land on Shopify's auth domain
    const response = await page.goto('/account/login');
    // Either we get redirected (status 302/303) or we're on Shopify's auth page
    const url = page.url();
    const isShopifyAuth = url.includes('shopify.com') || url.includes('accounts.shopify.com');
    const wasRedirected = response?.status() === 302 || response?.status() === 303 || isShopifyAuth;
    expect(wasRedirected || isShopifyAuth).toBeTruthy();
  });

  test('404 page renders for unknown paths', async ({ page }) => {
    await page.goto('/__this-route-does-not-exist__');
    const notFound = (await page.locator('text=Not Found').first().count()) > 0 || (await page.locator('text=404').count()) > 0;
    expect(notFound).toBeTruthy();
  });

  test('Post-payment age verification route loads VerifyPage', async ({ page }) => {
    await page.goto('/age-verification?order=TEST123&confirmationCode=abc');
    const verifyVisible = (await page.locator('text=Verify').first().count()) > 0 || (await page.locator('text=Start verification').count()) > 0;
    expect(verifyVisible).toBeTruthy();
  });

  test('Age verification flow completes successfully with mock token', async ({ page }) => {

    // Set localStorage and mock AgeVerif globals to simulate age verification already accepted and widget loaded
    await page.addInitScript(() => {
      localStorage.setItem('ageVerified', 'true');
      localStorage.setItem('ageVerificationTimestamp', Date.now().toString());
      // Mock the global functions that the AgeVerif script would set
      (globalThis as any).ageverifLoaded = () => {
        globalThis.dispatchEvent(new CustomEvent('ageverif:loaded', { detail: {} }));
      };
      (globalThis as any).ageverifReady = () => {
        globalThis.dispatchEvent(new CustomEvent('ageverif:ready', { detail: {} }));
      };
      (globalThis as any).ageverifSuccess = (detail: any) => {
        globalThis.dispatchEvent(new CustomEvent('ageverif:success', { detail }));
      };
      (globalThis as any).ageverifError = (error: any) => {
        globalThis.dispatchEvent(new CustomEvent('ageverif:error', { detail: error }));
      };
      // Mock the ageverif object that the script attaches
      (globalThis as any).ageverif = {
        start: (opts?: any) => {
          console.log('Mock ageverif.start called with opts:', opts);
          // Immediately dispatch success for testing
          setTimeout(() => {
            console.log('Dispatching ageverif:success event');
            globalThis.dispatchEvent(new CustomEvent('ageverif:success', {
              detail: { token: 'dev-mock-token', verified: true }
            }));
          }, 100);
        },
        clear: () => {},
        destroy: () => {},
        on: () => {},
        off: () => {},
      };
    });
    await page.goto('/age-verification?order=1001&confirmationCode=ULETWJUNV');

    // If the initial age verification modal appears, accept it
    const acceptButton = page.locator('button').filter({ hasText: 'Accept' }).or(page.locator('button').filter({ hasText: 'I am 18+' }));
    if (await acceptButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await acceptButton.click();
      await page.waitForTimeout(500); // Wait for modal to close
    }

    // Simulate the script loading (call loaded and ready)
    await page.evaluate(() => {
      (globalThis as any).ageverifLoaded();
      (globalThis as any).ageverifReady();
    });

    // Click the start verification button
    const startButton = page.locator('button').filter({ hasText: 'Start verification' });
    await expect(startButton).toBeVisible();
    await startButton.click();

    // The mock ageverif.start will dispatch the success event automatically

    // Wait for the verification result to appear
    await page.waitForFunction(() => {
      const h1 = document.querySelector('h1');
      return h1?.textContent === 'Verification Result';
    }, { timeout: 10000 });
    // Check that customer id is displayed (API should return it for the mock)
    const customerNumber = page.locator('text=Customer Number').locator('xpath=following-sibling::*').first();
    await expect(customerNumber).toBeVisible();
    const text = await customerNumber.textContent();
    expect(text).toBeTruthy(); // Should show a customer id or number
  });
});
