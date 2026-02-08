import { test, expect } from '@playwright/test';

test.describe('Top Movers - Distinct Gainers and Losers', () => {
  test('should display different coins in Top Gainers and Top Losers sections', async ({ page }) => {
    // Navigate to market overview page
    await page.goto('/market');
    
    // Wait for the page to load and top movers section to be visible
    await page.waitForSelector('[data-testid="top-movers-section"]', { timeout: 10000 });
    
    // Get all coin symbols from Top Gainers section
    const gainersSection = page.locator('h3:has-text("Top Gainers")').locator('..');
    const gainerCoins = await gainersSection.locator('[data-testid="coin-symbol"]').allTextContents();
    
    // Get all coin symbols from Top Losers section  
    const losersSection = page.locator('h3:has-text("Top Losers")').locator('..');
    const loserCoins = await losersSection.locator('[data-testid="coin-symbol"]').allTextContents();
    
    // Verify that both sections have coins
    expect(gainerCoins.length).toBeGreaterThan(0);
    expect(loserCoins.length).toBeGreaterThan(0);
    
    // Verify that no coin appears in both sections
    const overlappingCoins = gainerCoins.filter(coin => loserCoins.includes(coin));
    expect(overlappingCoins).toHaveLength(0);
    
    // Verify that gainers have positive percentage changes
    const gainerChanges = await gainersSection.locator('[data-testid="price-change"]').allTextContents();
    gainerChanges.forEach(change => {
      expect(change).toMatch(/^\+/); // Should start with + for positive changes
    });
    
    // Verify that losers have negative percentage changes
    const loserChanges = await losersSection.locator('[data-testid="price-change"]').allTextContents();
    loserChanges.forEach(change => {
      expect(change).toMatch(/^-/); // Should start with - for negative changes
    });
  });

  test('should handle loading state gracefully', async ({ page }) => {
    // Navigate to market overview page
    await page.goto('/market');
    
    // Check that loading skeletons are displayed initially
    await expect(page.locator('[data-testid="top-movers-loading"]')).toBeVisible();
    
    // Wait for content to load
    await page.waitForSelector('[data-testid="top-movers-section"]', { timeout: 10000 });
    
    // Verify loading state is gone
    await expect(page.locator('[data-testid="top-movers-loading"]')).not.toBeVisible();
  });
});
