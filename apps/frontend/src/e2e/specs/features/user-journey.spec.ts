import { test, expect } from '@playwright/test';

const LANDING_URL = '/';
const REGISTER_URL = '/register';
const PORTFOLIO_URL = '/portfolio';

test.describe('User Journey - Landing Page to Registration', () => {
  test.beforeEach(async ({ page }) => {
    // Capture console errors
    page.on('pageerror', (error) => {
      console.log('Page error:', error.message);
    });

    await page.goto(LANDING_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  test('should have complete user journey entry points', async ({ page }) => {
    // Check for primary CTA in hero section
    const primaryButton = page
      .getByRole('link', { name: /get started free/i })
      .first();
    await expect(primaryButton).toBeVisible();
    await expect(primaryButton).toHaveAttribute('href', '/register');

    // Check for secondary CTA in How It Works section
    const secondaryButtons = page.getByRole('link', {
      name: /get started for free/i,
    });
    await expect(secondaryButtons).toHaveCount(1);
    await expect(secondaryButtons.first()).toHaveAttribute('href', '/register');

    // Check for demo option
    const demoButton = page.getByRole('link', { name: /view demo/i });
    await expect(demoButton).toBeVisible();
    await expect(demoButton).toHaveAttribute('href', '/portfolio');

    // Check for learn more option
    const learnMoreButton = page.getByRole('link', { name: /learn more/i });
    await expect(learnMoreButton).toBeVisible();
    await expect(learnMoreButton).toHaveAttribute('href', '/#features');
  });

  test('should navigate to registration from primary CTA', async ({ page }) => {
    // Click primary "Get Started Free" button
    const primaryButton = page
      .getByRole('link', { name: /get started free/i })
      .first();
    await primaryButton.click();

    // Should navigate to registration page
    await expect(page).toHaveURL(REGISTER_URL);
    await expect(
      page.locator('h1:has-text("Create your account")')
    ).toBeVisible();
  });

  test('should navigate to registration from secondary CTA', async ({
    page,
  }) => {
    // Scroll to How It Works section
    await page.locator('#how-it-works').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Click secondary "Get Started for Free" button
    const secondaryButton = page.getByRole('link', {
      name: /get started for free/i,
    });
    await secondaryButton.click();

    // Should navigate to registration page
    await expect(page).toHaveURL(REGISTER_URL);
    await expect(
      page.locator('h1:has-text("Create your account")')
    ).toBeVisible();
  });

  test('should navigate to portfolio from demo CTA', async ({ page }) => {
    // Click "View Demo" button
    const demoButton = page.getByRole('link', { name: /view demo/i });
    await demoButton.click();

    // Should navigate to portfolio page
    await expect(page).toHaveURL(PORTFOLIO_URL);
  });

  test('should scroll to features from learn more CTA', async ({ page }) => {
    // Get initial scroll position
    const initialY = await page.evaluate(() => window.scrollY);

    // Click "Learn More" button
    const learnMoreButton = page.getByRole('link', { name: /learn more/i });
    await learnMoreButton.click();

    // Should scroll to features section
    await page.waitForTimeout(1000);
    const finalY = await page.evaluate(() => window.scrollY);
    expect(finalY).toBeGreaterThan(initialY);

    // Features section should be visible
    const featuresSection = page.locator('#features');
    await expect(featuresSection).toBeVisible();
  });
});

test.describe('User Journey - Complete Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    page.on('pageerror', (error) => {
      console.log('Page error:', error.message);
    });
  });

  test('should complete full user journey from landing to registration', async ({
    page,
  }) => {
    // Start at landing page
    await page.goto(LANDING_URL);
    await page.waitForLoadState('networkidle');

    // Navigate to registration
    const primaryButton = page
      .getByRole('link', { name: /get started free/i })
      .first();
    await primaryButton.click();

    // Should be on registration page
    await expect(page).toHaveURL(REGISTER_URL);
    await expect(
      page.locator('h1:has-text("Create your account")')
    ).toBeVisible();

    // Verify registration form elements
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByLabel(/^password$/i)).toBeVisible();
    await expect(page.getByLabel(/confirm password/i)).toBeVisible();
    await expect(
      page.getByRole('button', { name: /create account/i })
    ).toBeVisible();
  });

  test('should maintain route consistency throughout journey', async ({
    page,
  }) => {
    await page.goto(LANDING_URL);

    // All registration links should use /register
    const registerLinks = page.getByRole('link', { name: /get started/i });
    const count = await registerLinks.count();

    for (let i = 0; i < count; i++) {
      const link = registerLinks.nth(i);
      await expect(link).toHaveAttribute('href', '/register');
    }

    // No /signup links should exist
    const signupLinks = page.locator('a[href*="/signup"]');
    await expect(signupLinks).toHaveCount(0);
  });
});

test.describe('User Journey - Cross-Browser Compatibility', () => {
  ['chromium', 'firefox', 'webkit'].forEach((browserName) => {
    test(`should work correctly in ${browserName}`, async ({
      page,
      browserName,
    }) => {
      test.skip(
        browserName !== test.info().project.use.browserName,
        'This test runs in each browser separately'
      );

      await page.goto(LANDING_URL);
      await page.waitForLoadState('networkidle');

      // Test primary CTA
      const primaryButton = page
        .getByRole('link', { name: /get started free/i })
        .first();
      await expect(primaryButton).toBeVisible();
      await primaryButton.click();

      await expect(page).toHaveURL(REGISTER_URL);
      await expect(
        page.locator('h1:has-text("Create your account")')
      ).toBeVisible();
    });
  });
});

test.describe('User Journey - Mobile Responsiveness', () => {
  test('should work correctly on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto(LANDING_URL);
    await page.waitForLoadState('networkidle');

    // Test button visibility and accessibility on mobile
    const primaryButton = page
      .getByRole('link', { name: /get started free/i })
      .first();
    await expect(primaryButton).toBeVisible();

    // Should be able to click and navigate
    await primaryButton.click();
    await expect(page).toHaveURL(REGISTER_URL);
  });

  test('should work correctly on tablet devices', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto(LANDING_URL);
    await page.waitForLoadState('networkidle');

    // Test button layout on tablet
    const buttonContainer = page.locator('.flex-col.sm\\:flex-row');
    await expect(buttonContainer).toBeVisible();

    const primaryButton = page
      .getByRole('link', { name: /get started free/i })
      .first();
    await expect(primaryButton).toBeVisible();
    await primaryButton.click();
    await expect(page).toHaveURL(REGISTER_URL);
  });
});

test.describe('User Journey - Accessibility', () => {
  test('should be accessible via keyboard navigation', async ({ page }) => {
    await page.goto(LANDING_URL);
    await page.waitForLoadState('networkidle');

    // Tab through interactive elements
    await page.keyboard.press('Tab');

    // Should focus on first interactive element
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Should be able to navigate to primary CTA
    let foundPrimaryButton = false;
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const focused = page.locator(':focus');
      const text = await focused.textContent();
      if (text?.includes('Get Started Free')) {
        foundPrimaryButton = true;
        break;
      }
    }
    expect(foundPrimaryButton).toBe(true);

    // Should be able to activate with Enter key
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(REGISTER_URL);
  });

  test('should have proper ARIA labels and roles', async ({ page }) => {
    await page.goto(LANDING_URL);
    await page.waitForLoadState('networkidle');

    // Check for proper link roles
    const links = page.getByRole('link');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);

    // Check for proper headings
    const headings = page.getByRole('heading');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);

    // Main heading should be present
    const mainHeading = page.getByRole('heading', { level: 1 });
    await expect(mainHeading).toBeVisible();
  });
});

test.describe('User Journey - Performance', () => {
  test('should load quickly and be interactive', async ({ page }) => {
    const startTime = Date.now();

    await page.goto(LANDING_URL);
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // Should load within reasonable time (3 seconds)
    expect(loadTime).toBeLessThan(3000);

    // Primary CTA should be interactive quickly
    const primaryButton = page
      .getByRole('link', { name: /get started free/i })
      .first();
    await expect(primaryButton).toBeVisible({ timeout: 2000 });
  });

  test('should handle navigation smoothly', async ({ page }) => {
    await page.goto(LANDING_URL);
    await page.waitForLoadState('networkidle');

    const navigationStart = Date.now();

    // Navigate to registration
    const primaryButton = page
      .getByRole('link', { name: /get started free/i })
      .first();
    await primaryButton.click();

    await page.waitForLoadState('networkidle');
    await expect(
      page.locator('h1:has-text("Create your account")')
    ).toBeVisible();

    const navigationTime = Date.now() - navigationStart;

    // Navigation should be smooth and fast
    expect(navigationTime).toBeLessThan(2000);
  });
});
