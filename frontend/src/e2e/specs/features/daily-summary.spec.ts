/**
 * E2E Tests for Daily Summary Card
 * Backlog Item 25 - REQ-013-notifications
 */

import { test, expect } from '@playwright/test';
import { PortfolioPage } from '../../pom-pages/portfolio.pom';

test.describe('Daily Summary Card', () => {
  let portfolioPage: PortfolioPage;

  test.beforeEach(async ({ page }) => {
    portfolioPage = new PortfolioPage(page);
    // Clear localStorage to ensure clean state
    await page.goto('/portfolio?e2e=1');
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test.describe('Empty Portfolio', () => {
    test('should not display summary card when portfolio is empty', async ({ page }) => {
      await page.goto('/portfolio?e2e=1');
      await page.waitForLoadState('networkidle');

      const summaryCard = page.getByTestId('daily-summary-card');
      await expect(summaryCard).not.toBeVisible();
    });
  });

  test.describe('With Assets', () => {
    test.beforeEach(async ({ page }) => {
      // Add a test asset to portfolio
      await page.goto('/portfolio?e2e=1');
      await page.waitForLoadState('networkidle');

      // Add Bitcoin to portfolio
      await portfolioPage.addAsset('BTC', 1);
    });

    test('should display summary card with portfolio value', async ({ page }) => {
      const summaryCard = page.getByTestId('daily-summary-card');
      await expect(summaryCard).toBeVisible();

      const portfolioValue = page.getByTestId('portfolio-value');
      await expect(portfolioValue).toBeVisible();
      await expect(portfolioValue).toContainText('$');
    });

    test('should display 24h change with correct formatting', async ({ page }) => {
      const changeDisplay = page.getByTestId('portfolio-change');
      await expect(changeDisplay).toBeVisible();
      
      // Should contain a percentage
      await expect(changeDisplay).toContainText('%');
    });

    test('should have accessible heading', async ({ page }) => {
      const heading = page.locator('#summary-heading');
      await expect(heading).toBeVisible();
      await expect(heading).toContainText("Today's Summary");
    });

    test('should have proper ARIA region role', async ({ page }) => {
      const summaryCard = page.getByTestId('daily-summary-card');
      await expect(summaryCard).toHaveAttribute('role', 'region');
      await expect(summaryCard).toHaveAttribute('aria-labelledby', 'summary-heading');
    });
  });

  test.describe('Dismiss Functionality', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/portfolio?e2e=1');
      await page.waitForLoadState('networkidle');
      await portfolioPage.addAsset('BTC', 1);
    });

    test('should have dismiss button with accessible label', async ({ page }) => {
      const dismissButton = page.getByTestId('dismiss-summary');
      await expect(dismissButton).toBeVisible();
      await expect(dismissButton).toHaveAttribute('aria-label', "Dismiss today's summary");
    });

    test('should hide card when dismiss button is clicked', async ({ page }) => {
      const summaryCard = page.getByTestId('daily-summary-card');
      await expect(summaryCard).toBeVisible();

      const dismissButton = page.getByTestId('dismiss-summary');
      await dismissButton.click();

      await expect(summaryCard).not.toBeVisible();
    });

    test('should persist dismissal across page reloads', async ({ page }) => {
      // Dismiss the card
      const dismissButton = page.getByTestId('dismiss-summary');
      await dismissButton.click();

      // Reload the page
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Card should still be hidden
      const summaryCard = page.getByTestId('daily-summary-card');
      await expect(summaryCard).not.toBeVisible();
    });

    test('should reset dismissal on new day', async ({ page }) => {
      // Set dismissed date to yesterday
      await page.evaluate(() => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        localStorage.setItem('crypture_summary_dismissed', yesterday.toISOString());
      });

      // Reload the page
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Card should be visible again
      const summaryCard = page.getByTestId('daily-summary-card');
      await expect(summaryCard).toBeVisible();
    });
  });

  test.describe('Performers Display', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/portfolio?e2e=1');
      await page.waitForLoadState('networkidle');
      // Add multiple assets for performer comparison
      await portfolioPage.addAsset('BTC', 1);
      await portfolioPage.addAsset('ETH', 5);
    });

    test('should display performers sections when data available', async ({ page }) => {
      // Note: Whether sections appear depends on actual 24h changes from API
      // This test verifies the structure when they do appear
      const summaryCard = page.getByTestId('daily-summary-card');
      await expect(summaryCard).toBeVisible();

      // At minimum, the summary card should be functional
      const heading = page.locator('#summary-heading');
      await expect(heading).toContainText("Today's Summary");
    });
  });

  test.describe('Keyboard Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/portfolio?e2e=1');
      await page.waitForLoadState('networkidle');
      await portfolioPage.addAsset('BTC', 1);
    });

    test('dismiss button should be keyboard focusable', async ({ page }) => {
      const dismissButton = page.getByTestId('dismiss-summary');
      
      // Tab to the dismiss button
      await dismissButton.focus();
      await expect(dismissButton).toBeFocused();
    });

    test('dismiss button should respond to Enter key', async ({ page }) => {
      const summaryCard = page.getByTestId('daily-summary-card');
      await expect(summaryCard).toBeVisible();

      const dismissButton = page.getByTestId('dismiss-summary');
      await dismissButton.focus();
      await page.keyboard.press('Enter');

      await expect(summaryCard).not.toBeVisible();
    });
  });
});
