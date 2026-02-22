import { test, expect } from '@playwright/test';

const LANDING_URL = '/';
const PORTFOLIO_URL = '/portfolio';
const REGISTER_URL = '/register';
const LOGIN_URL = '/login';

test.describe('Privacy-First User Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Capture console errors
    page.on('pageerror', (error) => {
      console.log('Page error:', error.message);
    });

    await page.goto(LANDING_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  test('should have privacy-first landing page CTAs', async ({ page }) => {
    // Check for primary CTA leading to portfolio (no registration required)
    const primaryButton = page.getByRole('link', { name: /get started free/i });
    await expect(primaryButton).toBeVisible();
    await expect(primaryButton).toHaveAttribute('href', '/portfolio');

    // Check for informational CTA
    const learnMoreButton = page.getByRole('link', { name: /learn more/i });
    await expect(learnMoreButton).toBeVisible();
    await expect(learnMoreButton).toHaveAttribute('href', '/#features');

    // Should NOT have "View Demo" button (removed)
    const viewDemoButton = page.getByRole('link', { name: /view demo/i });
    await expect(viewDemoButton).toHaveCount(0);

    // Should NOT have secondary registration CTA in How It Works
    const secondaryRegisterButtons = page.getByRole('link', {
      name: /get started for free/i,
    });
    await expect(secondaryRegisterButtons).toHaveCount(0);
  });

  test('should navigate to portfolio without registration', async ({
    page,
  }) => {
    // Click primary "Get Started Free" button
    const primaryButton = page.getByRole('link', { name: /get started free/i });
    await primaryButton.click();

    // Should navigate to portfolio page directly
    await expect(page).toHaveURL(PORTFOLIO_URL);

    // Portfolio should load without requiring authentication
    await expect(page.locator('text=Total Portfolio Value')).toBeVisible({
      timeout: 5000,
    });
  });

  test('should have header authentication options on landing page', async ({
    page,
  }) => {
    // Check for header authentication buttons
    const loginButton = page.getByRole('link', { name: /login/i });
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toHaveAttribute('href', '/login');

    const signUpButton = page.getByRole('link', { name: /sign up/i });
    await expect(signUpButton).toBeVisible();
    await expect(signUpButton).toHaveAttribute('href', '/register');

    // Authentication should be optional, not forced
    await expect(loginButton).toHaveClass(/border/);
    await expect(signUpButton).toHaveClass(/bg-indigo-600/);
  });

  test('should have header authentication options in mobile menu', async ({
    page,
  }) => {
    // Open mobile menu
    const mobileMenuButton = page.getByRole('button', {
      name: /open main menu/i,
    });
    await mobileMenuButton.click();
    await page.waitForTimeout(500);

    // Check for mobile authentication buttons
    const mobileLoginButton = page.getByRole('link', { name: /login/i });
    await expect(mobileLoginButton).toBeVisible();

    const mobileSignUpButton = page.getByRole('link', { name: /sign up/i });
    await expect(mobileSignUpButton).toBeVisible();
  });

  test('should allow optional registration from header', async ({ page }) => {
    // Click header "Sign Up" button
    const signUpButton = page.getByRole('link', { name: /sign up/i });
    await signUpButton.click();

    // Should navigate to registration page
    await expect(page).toHaveURL(REGISTER_URL);
    await expect(
      page.locator('h1:has-text("Create your account")')
    ).toBeVisible();
  });

  test('should allow optional login from header', async ({ page }) => {
    // Click header "Login" button
    const loginButton = page.getByRole('link', { name: /login/i });
    await loginButton.click();

    // Should navigate to login page
    await expect(page).toHaveURL(LOGIN_URL);
  });
});

test.describe('Privacy-First Portfolio Access', () => {
  test.beforeEach(async ({ page }) => {
    page.on('pageerror', (error) => {
      console.log('Page error:', error.message);
    });
  });

  test('should access portfolio directly without authentication', async ({
    page,
  }) => {
    // Go directly to portfolio
    await page.goto(PORTFOLIO_URL);
    await page.waitForLoadState('networkidle');

    // Portfolio should load without requiring authentication
    await expect(page.locator('text=Total Portfolio Value')).toBeVisible({
      timeout: 5000,
    });

    // Should have header authentication options available
    const headerLoginButton = page.getByRole('link', { name: /login/i });
    await expect(headerLoginButton).toBeVisible();
  });

  test('should have consistent header authentication across pages', async ({
    page,
  }) => {
    // Test landing page
    await page.goto(LANDING_URL);
    await page.waitForLoadState('networkidle');

    const landingLoginButton = page.getByRole('link', { name: /login/i });
    await expect(landingLoginButton).toBeVisible();
    await expect(landingLoginButton).toHaveAttribute('href', '/login');

    // Test portfolio page
    await page.goto(PORTFOLIO_URL);
    await page.waitForLoadState('networkidle');

    const portfolioLoginButton = page.getByRole('link', { name: /login/i });
    await expect(portfolioLoginButton).toBeVisible();
    await expect(portfolioLoginButton).toHaveAttribute('href', '/login');
  });
});

test.describe('Privacy-First User Experience Validation', () => {
  test('should not force registration on any page', async ({ page }) => {
    // Test landing page
    await page.goto(LANDING_URL);
    await page.waitForLoadState('networkidle');

    // Should be able to navigate without registration
    const primaryButton = page.getByRole('link', { name: /get started free/i });
    await primaryButton.click();
    await expect(page).toHaveURL(PORTFOLIO_URL);

    // Portfolio should work without authentication
    await expect(page.locator('h1:has-text("Portfolio")')).toBeVisible({
      timeout: 5000,
    });
  });

  test('should have discoverable but optional authentication', async ({
    page,
  }) => {
    await page.goto(LANDING_URL);
    await page.waitForLoadState('networkidle');

    // Authentication options should be discoverable in header
    const signUpButton = page.getByRole('link', { name: /sign up/i });
    await expect(signUpButton).toBeVisible();

    // But should not be forced or intrusive
    await expect(signUpButton).toHaveClass(/text-sm/); // Subtle styling
  });

  test('should maintain privacy-first value proposition', async ({ page }) => {
    await page.goto(LANDING_URL);
    await page.waitForLoadState('networkidle');

    // Primary CTA should emphasize immediate access
    const primaryButton = page.getByRole('link', { name: /get started free/i });
    await expect(primaryButton).toHaveAttribute('href', '/portfolio');

    // Should not have any forced registration messaging
    const forcedRegistrationElements = page.locator(
      'text=register to continue'
    );
    await expect(forcedRegistrationElements).toHaveCount(0);
  });
});

test.describe('Privacy-First Cross-Browser Compatibility', () => {
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
      const primaryButton = page.getByRole('link', {
        name: /get started free/i,
      });
      await expect(primaryButton).toBeVisible();
      await expect(primaryButton).toHaveAttribute('href', '/portfolio');

      await primaryButton.click();
      await expect(page).toHaveURL(PORTFOLIO_URL);

      // Test header authentication
      const loginButton = page.getByRole('link', { name: /login/i });
      await expect(loginButton).toBeVisible();
    });
  });
});

test.describe('Privacy-First Mobile Responsiveness', () => {
  test('should work correctly on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto(LANDING_URL);
    await page.waitForLoadState('networkidle');

    // Test primary CTA
    const primaryButton = page.getByRole('link', { name: /get started free/i });
    await expect(primaryButton).toBeVisible();

    // Test mobile menu authentication
    const mobileMenuButton = page.getByRole('button', {
      name: /open main menu/i,
    });
    await mobileMenuButton.click();
    await page.waitForTimeout(500);

    const mobileLoginButton = page.getByRole('link', { name: /login/i });
    await expect(mobileLoginButton).toBeVisible();
  });

  test('should work correctly on tablet devices', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto(LANDING_URL);
    await page.waitForLoadState('networkidle');

    // Should show desktop navigation with auth buttons
    const desktopLoginButton = page.getByRole('link', { name: /login/i });
    await expect(desktopLoginButton).toBeVisible();
  });
});
