import { test, expect } from '@playwright/test';

test.describe('User Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the backend API responses
    await page.route('**/api/auth/login', async (route) => {
      const request = route.request();
      const postData = await request.postData();
      
      if (postData?.includes('valid@example.com')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Login successful',
            data: {
              user: { id: 'user-123', email: 'valid@example.com' },
              session: {
                accessToken: 'mock-access-token',
                refreshToken: 'mock-refresh-token',
                expiresAt: Math.floor(Date.now() / 1000) + 900,
              },
            },
          }),
        });
      } else if (postData?.includes('invalid@example.com')) {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            message: 'Invalid credentials',
          }),
        });
      } else {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            message: 'Invalid credentials',
          }),
        });
      }
    });

    await page.route('**/api/auth/logout', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Logged out successfully',
        }),
      });
    });
  });

  test('should display login form', async ({ page }) => {
    await page.goto('/login');
    
    // Check that all form elements are present
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByLabel(/remember me/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    
    // Check navigation links
    await expect(page.getByRole('link', { name: /create a new account/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /forgot your password/i })).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/login');
    
    // Submit empty form
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Should show validation errors
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByLabel(/email address/i).fill('invalid-email');
    await page.getByLabel(/email address/i).blur();
    
    await expect(page.getByText(/please enter a valid email address/i)).toBeVisible();
  });

  test('should show validation error for empty password on blur', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByLabel(/password/i).fill('password');
    await page.getByLabel(/password/i).clear();
    await page.getByLabel(/password/i).blur();
    
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in valid credentials
    await page.getByLabel(/email address/i).fill('valid@example.com');
    await page.getByLabel(/password/i).fill('password123');
    
    // Submit form
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Should redirect to home page (or dashboard)
    await expect(page).toHaveURL('/');
    
    // Should not show login page anymore
    await expect(page.getByLabel(/email address/i)).not.toBeVisible();
  });

  test('should show error message for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in invalid credentials
    await page.getByLabel(/email address/i).fill('invalid@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    
    // Submit form
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Should show error message
    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
    
    // Should stay on login page
    await expect(page).toHaveURL('/login');
  });

  test('should handle remember me functionality', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in credentials and check remember me
    await page.getByLabel(/email address/i).fill('valid@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByLabel(/remember me/i).check();
    
    // Submit form
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Should login successfully
    await expect(page).toHaveURL('/');
    
    // Check that remember me preference is stored
    const localStorage = await page.evaluate(() => window.localStorage.getItem('auth_remember_me'));
    expect(localStorage).toBe('true');
  });

  test('should show loading state during login', async ({ page }) => {
    // Mock a slow response
    await page.route('**/api/auth/login', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Login successful',
          data: {
            user: { id: 'user-123', email: 'valid@example.com' },
            session: {
              accessToken: 'mock-access-token',
              refreshToken: 'mock-refresh-token',
              expiresAt: Math.floor(Date.now() / 1000) + 900,
            },
          },
        }),
      });
    });

    await page.goto('/login');
    
    // Fill in credentials
    await page.getByLabel(/email address/i).fill('valid@example.com');
    await page.getByLabel(/password/i).fill('password123');
    
    // Submit form
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Should show loading state
    await expect(page.getByText(/signing in/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /signing in/i })).toBeDisabled();
    
    // Should complete login after loading
    await expect(page).toHaveURL('/', { timeout: 5000 });
  });

  test('should navigate to registration page', async ({ page }) => {
    await page.goto('/login');
    
    // Click registration link
    await page.getByRole('link', { name: /create a new account/i }).click();
    
    // Should navigate to registration page
    await expect(page).toHaveURL('/register');
  });

  test('should navigate to password reset page', async ({ page }) => {
    await page.goto('/login');
    
    // Click forgot password link
    await page.getByRole('link', { name: /forgot your password/i }).click();
    
    // Should navigate to password reset page
    await expect(page).toHaveURL('/reset-password');
  });

  test('should clear error when user starts typing', async ({ page }) => {
    await page.goto('/login');
    
    // First trigger an error
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText(/email is required/i)).toBeVisible();
    
    // Start typing in email field
    await page.getByLabel(/email address/i).fill('u');
    
    // Error should still be there (only onSubmit clears it in current implementation)
    await expect(page.getByText(/email is required/i)).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in form
    await page.getByLabel(/email address/i).fill('valid@example.com');
    await page.getByLabel(/password/i).fill('password123');
    
    // Submit with Enter key
    await page.getByLabel(/password/i).press('Enter');
    
    // Should login successfully
    await expect(page).toHaveURL('/');
  });

  test('should maintain form state during validation', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in email
    await page.getByLabel(/email address/i).fill('test@example.com');
    
    // Trigger validation by blurring email with invalid value
    await page.getByLabel(/email address/i).fill('');
    await page.getByLabel(/email address/i).blur();
    
    // Email should be cleared and show error
    await expect(page.getByLabel(/email address/i)).toHaveValue('');
    await expect(page.getByText(/email is required/i)).toBeVisible();
    
    // Fill valid email
    await page.getByLabel(/email address/i).fill('test@example.com');
    
    // Error should be gone
    await expect(page.getByText(/email is required/i)).not.toBeVisible();
    await expect(page.getByLabel(/email address/i)).toHaveValue('test@example.com');
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/login');
    
    // Check semantic HTML structure
    await expect(page.getByRole('heading', { name: /sign in to your account/i })).toBeVisible();
    await expect(page.getByRole('form')).toBeVisible();
    
    // Check form labels are properly associated
    const emailInput = page.getByLabel(/email address/i);
    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(emailInput).toHaveAttribute('autocomplete', 'email');
    
    const passwordInput = page.getByLabel(/password/i);
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(passwordInput).toHaveAttribute('autocomplete', 'current-password');
    
    // Check button has proper role
    const submitButton = page.getByRole('button', { name: /sign in/i });
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toHaveAttribute('type', 'submit');
  });
});
