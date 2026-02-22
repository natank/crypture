import { test, expect, type Page } from '@playwright/test';

const REGISTER_URL = '/register';

async function fillRegistrationForm(
  page: Page,
  email: string,
  password: string,
  confirmPassword: string
) {
  await page.getByLabel(/email address/i).fill(email);
  await page.getByLabel(/^password$/i).fill(password);
  await page.getByLabel(/confirm password/i).fill(confirmPassword);
}

test.describe('User Registration', () => {
  test.beforeEach(async ({ page }) => {
    // Capture console errors
    page.on('pageerror', (error) => {
      console.log('Page error:', error.message);
    });

    await page.goto(REGISTER_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  test('should display the registration form', async ({ page }) => {
    await expect(
      page.locator('h1:has-text("Create your account")')
    ).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByLabel(/^password$/i)).toBeVisible();
    await expect(page.getByLabel(/confirm password/i)).toBeVisible();
    await expect(
      page.getByRole('button', { name: /create account/i })
    ).toBeVisible();
  });

  test('should show email validation error for invalid email', async ({
    page,
  }) => {
    await page.getByLabel(/email address/i).fill('notanemail');
    await page.getByLabel(/email address/i).blur();
    await expect(page.getByText(/valid email/i)).toBeVisible();
  });

  test('should show password strength indicator', async ({ page }) => {
    await page.getByLabel(/^password$/i).fill('Abcdefg1');
    await expect(page.getByText(/good|strong|fair|weak/i)).toBeVisible();
  });

  test('should show error when passwords do not match', async ({ page }) => {
    await page.getByLabel(/^password$/i).fill('Abcdefg1');
    await page.getByLabel(/confirm password/i).fill('Different1');
    await page.getByLabel(/confirm password/i).blur();
    await expect(page.getByText(/do not match/i)).toBeVisible();
  });

  test('should show validation errors on submit with empty form', async ({
    page,
  }) => {
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page.getByRole('alert')).toContainText(/email is required/i);
  });

  test('should navigate to email verification step after successful registration', async ({
    page,
  }) => {
    await page.route('**/api/auth/register', (route) =>
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'User registered successfully',
        }),
      })
    );

    await fillRegistrationForm(
      page,
      'test@example.com',
      'Abcdefg1',
      'Abcdefg1'
    );
    await page.getByRole('button', { name: /create account/i }).click();

    await expect(
      page.getByRole('heading', { name: /check your email/i })
    ).toBeVisible();
    await expect(page.getByText('test@example.com')).toBeVisible();
    await expect(page.getByLabel(/verification code/i)).toBeVisible();
  });

  test('should show error message when registration fails', async ({
    page,
  }) => {
    await page.route('**/api/auth/register', (route) =>
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Email already in use',
        }),
      })
    );

    await fillRegistrationForm(
      page,
      'existing@example.com',
      'Abcdefg1',
      'Abcdefg1'
    );
    await page.getByRole('button', { name: /create account/i }).click();

    await expect(page.getByRole('alert')).toContainText(
      /email already in use/i
    );
  });

  test('should show loading state during registration', async ({ page }) => {
    await page.route('**/api/auth/register', async (route) => {
      await new Promise((r) => setTimeout(r, 500));
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'User registered successfully',
        }),
      });
    });

    await fillRegistrationForm(
      page,
      'test@example.com',
      'Abcdefg1',
      'Abcdefg1'
    );
    await page.getByRole('button', { name: /create account/i }).click();

    await expect(page.getByText(/creating account/i)).toBeVisible();
  });

  test('should complete full registration and verification flow', async ({
    page,
  }) => {
    await page.route('**/api/auth/register', (route) =>
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'User registered successfully',
        }),
      })
    );
    await page.route('**/api/auth/verify-email', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Email verified successfully',
        }),
      })
    );

    await fillRegistrationForm(
      page,
      'test@example.com',
      'Abcdefg1',
      'Abcdefg1'
    );
    await page.getByRole('button', { name: /create account/i }).click();

    await expect(
      page.getByRole('heading', { name: /check your email/i })
    ).toBeVisible();

    await page.getByLabel(/verification code/i).fill('123456');
    await page.getByRole('button', { name: /verify email/i }).click();

    await expect(
      page.getByRole('heading', { name: /account created/i })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /go to portfolio/i })
    ).toBeVisible();
  });

  test('should allow resending verification email', async ({ page }) => {
    await page.route('**/api/auth/register', (route) =>
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'User registered successfully',
        }),
      })
    );
    await page.route('**/api/auth/resend-verification', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Verification email resent',
        }),
      })
    );

    await fillRegistrationForm(
      page,
      'test@example.com',
      'Abcdefg1',
      'Abcdefg1'
    );
    await page.getByRole('button', { name: /create account/i }).click();

    await expect(
      page.getByRole('heading', { name: /check your email/i })
    ).toBeVisible();
    await page.getByRole('button', { name: /resend email/i }).click();

    await expect(page.getByRole('status')).toContainText(
      /resent successfully/i
    );
  });

  test('should have a link back to home', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: /back to home/i })
    ).toBeVisible();
  });

  test('should have a link to sign in', async ({ page }) => {
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible();
  });
});
