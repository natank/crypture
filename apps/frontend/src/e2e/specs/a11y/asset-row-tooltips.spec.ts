import { test, expect } from '@playwright/test';

test.describe('Asset Row Tooltips (KI-03 Extended)', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to portfolio page
    await page.goto('/portfolio');
    
    // Check if we have assets, if not add one for testing
    const assetRow = page.locator('[data-testid^="asset-row-"]').first();
    const hasAssets = await assetRow.isVisible().catch(() => false);
    
    if (!hasAssets) {
      // Add Bitcoin as test asset using the same approach as other tests
      await page.getByTestId("add-asset-button").click();
      
      // Wait for dialog to appear
      await page.getByRole("dialog", { name: /add crypto asset/i }).waitFor({ state: 'visible' });
      
      // Use the specific asset select by test ID
      const assetSelect = page.getByTestId("asset-select");
      await assetSelect.selectOption('Bitcoin (BTC)');
      
      // Fill quantity and confirm
      await page.getByLabel(/quantity/i).fill('1.5');
      await page.getByTestId("confirm-add-asset").click();
      
      // Wait for asset to be added and row to appear
      await page.waitForSelector('[data-testid^="asset-row-"]', { timeout: 5000 });
      await page.waitForTimeout(500); // Small delay for tooltip initialization
    }
  });

  test('should show tooltip on hover for view details button', async ({ page }) => {
    // Find the first asset row's view button
    const assetRow = page.locator('[data-testid^="asset-row-"]').first();
    const viewButton = assetRow.locator('[aria-label*="View"]');
    await expect(viewButton).toBeVisible();
    
    // Hover over the view button
    await viewButton.hover();
    
    // Check that tooltip appears
    const tooltip = page.locator('[role="tooltip"]');
    await expect(tooltip).toBeVisible();
    
    // Check tooltip content
    const tooltipText = await tooltip.textContent();
    expect(tooltipText).toContain('details');
  });

  test('should show tooltip on hover for edit button', async ({ page }) => {
    // Find the first asset row's edit button
    const assetRow = page.locator('[data-testid^="asset-row-"]').first();
    const editButton = assetRow.locator('[aria-label*="Edit"]');
    await expect(editButton).toBeVisible();
    
    // Hover over the edit button
    await editButton.hover();
    
    // Check that tooltip appears
    const tooltip = page.locator('[role="tooltip"]');
    await expect(tooltip).toBeVisible();
    
    // Check tooltip content - should use full coin name, not symbol
    const tooltipText = await tooltip.textContent();
    expect(tooltipText).toContain('Edit');
    expect(tooltipText).toContain('quantity');
    // Should not contain symbol abbreviations like BTC, ETH, etc.
    expect(tooltipText).not.toMatch(/\b(BTC|ETH|ADA|DOT|LINK|UNI|AAVE|SUSHI|COMP|MKR)\b/);
  });

  test('should show tooltip on hover for delete button', async ({ page }) => {
    // Find the first asset row's delete button
    const assetRow = page.locator('[data-testid^="asset-row-"]').first();
    const deleteButton = assetRow.locator('[aria-label*="Delete"]');
    await expect(deleteButton).toBeVisible();
    
    // Hover over the delete button
    await deleteButton.hover();
    
    // Check that tooltip appears
    const tooltip = page.locator('[role="tooltip"]');
    await expect(tooltip).toBeVisible();
    
    // Check tooltip content - should use full coin name, not symbol
    const tooltipText = await tooltip.textContent();
    expect(tooltipText).toContain('Delete');
    // Should not contain symbol abbreviations like BTC, ETH, etc.
    expect(tooltipText).not.toMatch(/\b(BTC|ETH|ADA|DOT|LINK|UNI|AAVE|SUSHI|COMP|MKR)\b/);
  });

  test('should be keyboard accessible', async ({ page }) => {
    // Find the first asset row's view button and focus it
    const assetRow = page.locator('[data-testid^="asset-row-"]').first();
    const viewButton = assetRow.locator('[aria-label*="View"]');
    await viewButton.focus();
    
    // Check that button is focused
    await expect(viewButton).toBeFocused();
    
    // Tooltip should appear on focus
    const tooltip = page.locator('[role="tooltip"]');
    await expect(tooltip).toBeVisible();
    
    // Dismiss tooltip with Escape
    await page.keyboard.press('Escape');
    await expect(tooltip).not.toBeVisible();
    
    // Focus should return to button
    await expect(viewButton).toBeFocused();
  });
});
