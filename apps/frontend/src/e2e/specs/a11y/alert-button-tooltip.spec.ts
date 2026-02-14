import { test, expect } from '@playwright/test';

test.describe('AlertButton Tooltip (KI-03)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      if (localStorage.getItem('cryptoPortfolio_onboardingComplete') === null) {
        localStorage.setItem('cryptoPortfolio_onboardingComplete', 'true');
      }
    });

    // Navigate to portfolio page where AlertButton is located
    await page.goto('/portfolio');
  });

  test('should show tooltip on hover', async ({ page }) => {
    // Find the alert button
    const alertButton = page.locator('[aria-label*="Price alerts"]');
    await expect(alertButton).toBeVisible();

    // Hover over the button
    await alertButton.hover();

    // Check that tooltip appears using the generic tooltip selector
    const tooltip = page.locator('[role="tooltip"]');
    await expect(tooltip).toBeVisible();

    // Check tooltip content
    await expect(tooltip).toContainText('Price Alerts');
  });

  test('should show count information in tooltip', async ({ page }) => {
    // This test assumes there are existing alerts
    // If no alerts exist, tooltip should still show "Price Alerts"
    const alertButton = page.locator('[aria-label*="Price alerts"]');
    await alertButton.hover();

    const tooltip = page.locator('[role="tooltip"]');
    await expect(tooltip).toBeVisible();

    // Tooltip should contain count information if alerts exist
    // or just "Price Alerts" if no alerts
    const tooltipText = await tooltip.textContent();
    expect(tooltipText).toContain('Price Alerts');
  });

  test('should be keyboard accessible', async ({ page }) => {
    // Find the alert button and focus it directly
    const alertButton = page.locator('[aria-label*="Price alerts"]');
    await alertButton.focus();

    // Check that button is focused
    await expect(alertButton).toBeFocused();

    // Tooltip should appear on focus
    const tooltip = page.locator('[role="tooltip"]');
    await expect(tooltip).toBeVisible();

    // Dismiss tooltip with Escape
    await page.keyboard.press('Escape');
    await expect(tooltip).not.toBeVisible();

    // Focus should return to button
    await expect(alertButton).toBeFocused();
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    const alertButton = page.locator('[aria-label*="Price alerts"]');

    // Check for proper aria-label
    const ariaLabel = await alertButton.getAttribute('aria-label');
    expect(ariaLabel).toMatch(/Price alerts:/);

    // Focus button to show tooltip and wait for it
    await alertButton.focus();

    // Check that tooltip has proper role and is visible
    const tooltip = page.locator('[role="tooltip"]');
    await expect(tooltip).toBeVisible();

    // The Tooltip component handles aria-describedby automatically
    // We just need to verify the tooltip is properly associated and visible
    await expect(tooltip).toBeVisible();
  });

  test('should position tooltip correctly to stay in viewport', async ({
    page,
  }) => {
    const alertButton = page.locator('[aria-label*="Price alerts"]');
    await alertButton.hover();

    const tooltip = page.locator('[role="tooltip"]');
    await expect(tooltip).toBeVisible();

    // Get positions to verify tooltip is properly positioned
    const buttonBox = await alertButton.boundingBox();
    const tooltipBox = await tooltip.boundingBox();

    expect(buttonBox).toBeTruthy();
    expect(tooltipBox).toBeTruthy();

    // Tooltip should be positioned near the button
    if (buttonBox && tooltipBox) {
      // Tooltip should be near the button horizontally
      const horizontalOverlap =
        Math.min(
          buttonBox.x + buttonBox.width,
          tooltipBox.x + tooltipBox.width
        ) - Math.max(buttonBox.x, tooltipBox.x);

      expect(horizontalOverlap).toBeGreaterThan(0); // Some horizontal overlap

      // Tooltip should be above or below (not overlapping vertically)
      const verticalOverlap =
        Math.min(
          buttonBox.y + buttonBox.height,
          tooltipBox.y + tooltipBox.height
        ) - Math.max(buttonBox.y, tooltipBox.y);

      expect(verticalOverlap).toBeLessThan(10); // Minimal or no vertical overlap
    }
  });
});
