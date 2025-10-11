import { test, expect } from "@e2e/test-setup";
import { mockCoinGeckoMarkets, mockCoinGeckoChartData } from "@e2e/mocks/mockCoinGecko";

/**
 * E2E Tests for User Story 17 - Phase 2: Add Asset Notifications
 * 
 * Tests notification toasts for:
 * - Adding new assets
 * - Adding to existing assets
 * - Validation errors
 */

test.describe("Add Asset Notifications", () => {
  test.beforeEach(async ({ page }) => {
    // Mock CoinGecko API to avoid external requests
    mockCoinGeckoMarkets(page);
    mockCoinGeckoChartData(page);
  });

  test("shows success notification when adding new asset", async ({ page }) => {
    await page.goto("/portfolio");

    // Open Add Asset modal
    await page.getByRole("button", { name: /add asset/i }).click();

    // Fill in asset and quantity
    await page.locator("select#asset-select").selectOption({ label: "Bitcoin (BTC)" });
    await page.getByLabel(/quantity/i).fill("1.5");

    // Submit
    await page
      .getByRole("dialog")
      .getByRole("button", { name: /add asset/i })
      .click();

    // Verify success toast appears with correct message
    const toast = page.locator('[role="status"]', { hasText: /Added 1.5 BTC to your portfolio/i });
    await expect(toast).toBeVisible({ timeout: 3000 });

    // Verify toast has proper ARIA attributes
    await expect(toast).toHaveAttribute("aria-live", "polite");

    // Verify toast auto-dismisses after ~4 seconds
    await expect(toast).not.toBeVisible({ timeout: 6000 });
  });

  test("shows different message when adding to existing asset", async ({ page }) => {
    await page.goto("/portfolio");

    // Add first BTC purchase
    await page.getByRole("button", { name: /add asset/i }).click();
    await page.locator("select#asset-select").selectOption({ label: "Bitcoin (BTC)" });
    await page.getByLabel(/quantity/i).fill("1.0");
    await page
      .getByRole("dialog")
      .getByRole("button", { name: /add asset/i })
      .click();

    // Wait for modal to close (modal closing means asset was added successfully)
    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 3000 });
    
    // Verify first asset appears in portfolio
    await expect(page.getByText(/Bitcoin/)).toBeVisible();
    await expect(page.getByText(/Qty: 1/)).toBeVisible();

    // Add second BTC purchase (to existing asset)
    // Note: Label now shows "Bitcoin (BTC) - Owned: 1" due to our feature
    await page.getByRole("button", { name: /add asset/i }).click();
    const modal2 = page.getByRole("dialog");
    await modal2.locator("select#asset-select").selectOption({ value: "bitcoin" }); // Use value instead of label
    await modal2.getByLabel(/quantity/i).fill("0.5");
    await modal2.getByRole("button", { name: /add asset/i }).click();

    // Verify toast shows cumulative total message
    const toast = page.locator('[role="status"]', {
      hasText: /Added 0.5 BTC.*Total.*1.5 BTC/i,
    });
    await expect(toast).toBeVisible({ timeout: 3000 });
    
    // Verify the asset quantity was updated in the portfolio
    await expect(page.getByText(/Qty: 1.5/)).toBeVisible();
  });

  test("shows error notification for validation failures", async ({ page }) => {
    await page.goto("/portfolio");

    // Open Add Asset modal
    await page.getByRole("button", { name: /add asset/i }).click();

    // Try to submit without selecting asset (validation error)
    await page.getByLabel(/quantity/i).fill("1.0");
    await page
      .getByRole("dialog")
      .getByRole("button", { name: /add asset/i })
      .click();

    // Verify error toast appears (use first() to avoid strict mode violation)
    const errorToast = page.locator('[role="alert"]', {
      hasText: /required/i,
    }).first();
    await expect(errorToast).toBeVisible({ timeout: 3000 });

    // Verify error toast has assertive aria-live for immediate announcement
    await expect(errorToast).toHaveAttribute("aria-live", "assertive");

    // Verify error toast stays longer (8s default)
    await page.waitForTimeout(5000);
    await expect(errorToast).toBeVisible(); // Still visible after 5s
  });

  test("shows owned quantity in asset selector", async ({ page }) => {
    await page.goto("/portfolio");

    // Add BTC first
    await page.getByRole("button", { name: /add asset/i }).click();
    await page.locator("select#asset-select").selectOption({ label: "Bitcoin (BTC)" });
    await page.getByLabel(/quantity/i).fill("2.5");
    await page
      .getByRole("dialog")
      .getByRole("button", { name: /add asset/i })
      .click();

    // Wait for success toast to dismiss
    await expect(
      page.locator('[role="status"]', { hasText: /Added 2.5 BTC/i })
    ).not.toBeVisible({ timeout: 6000 });

    // Open modal again
    await page.getByRole("button", { name: /add asset/i }).click();

    // Verify Bitcoin option now shows "- Owned: 2.5"
    const btcOption = page.locator('select#asset-select option', {
      hasText: /Bitcoin.*Owned: 2.5/i,
    });
    await expect(btcOption).toBeAttached();

    // Verify assets not owned don't show "Owned" text
    const ethOption = page.locator('select#asset-select option', {
      hasText: /Ethereum/i,
    });
    await expect(ethOption).toBeAttached();
    await expect(ethOption).not.toHaveText(/Owned/);
  });
});

test.describe("Add Asset Notifications - Edge Cases", () => {
  test.beforeEach(async ({ page }) => {
    // Mock CoinGecko API to avoid external requests
    mockCoinGeckoMarkets(page);
    mockCoinGeckoChartData(page);
  });

  test("shows error for invalid quantity (negative number)", async ({ page }) => {
    await page.goto("/portfolio");

    await page.getByRole("button", { name: /add asset/i }).click();
    await page.locator("select#asset-select").selectOption({ label: "Bitcoin (BTC)" });
    await page.getByLabel(/quantity/i).fill("-5");
    await page
      .getByRole("dialog")
      .getByRole("button", { name: /add asset/i })
      .click();

    // Verify error toast (use first() to avoid strict mode violation)
    const errorToast = page.locator('[role="alert"]', {
      hasText: /positive/i,
    }).first();
    await expect(errorToast).toBeVisible({ timeout: 3000 });
  });

  test("shows error for invalid quantity (zero)", async ({ page }) => {
    await page.goto("/portfolio");

    await page.getByRole("button", { name: /add asset/i }).click();
    await page.locator("select#asset-select").selectOption({ label: "Bitcoin (BTC)" });
    await page.getByLabel(/quantity/i).fill("0");
    await page
      .getByRole("dialog")
      .getByRole("button", { name: /add asset/i })
      .click();

    // Verify error toast (use first() to avoid strict mode violation)
    const errorToast = page.locator('[role="alert"]', {
      hasText: /greater than 0|positive/i,
    }).first();
    await expect(errorToast).toBeVisible({ timeout: 3000 });
  });

  test("modal closes only after successful addition", async ({ page }) => {
    await page.goto("/portfolio");

    // Open modal
    await page.getByRole("button", { name: /add asset/i }).click();
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    // Try to submit without selecting asset (validation error)
    await page.getByLabel(/quantity/i).fill("1.0");
    await modal.getByRole("button", { name: /add asset/i }).click();

    // Modal should still be visible after error
    await page.waitForTimeout(500);
    await expect(modal).toBeVisible();

    // Now submit valid data
    await page.locator("select#asset-select").selectOption({ label: "Bitcoin (BTC)" });
    await page.getByLabel(/quantity/i).clear();
    await page.getByLabel(/quantity/i).fill("1.0");
    await modal.getByRole("button", { name: /add asset/i }).click();

    // Modal should close after success
    await expect(modal).not.toBeVisible({ timeout: 3000 });

    // Success toast should have appeared (may already be visible or starting to fade)
    // We just verify the asset was added successfully
    await expect(page.getByText(/Qty: 1/)).toBeVisible();
  });
});

test.describe("Delete Asset Notifications", () => {
  test.beforeEach(async ({ page }) => {
    // Mock CoinGecko API to avoid external requests
    mockCoinGeckoMarkets(page);
    mockCoinGeckoChartData(page);
  });

  test("shows success notification when deleting asset", async ({ page }) => {
    await page.goto("/portfolio");

    // First add an asset to delete
    await page.getByRole("button", { name: /add asset/i }).click();
    await page.locator("select#asset-select").selectOption({ label: "Bitcoin (BTC)" });
    await page.getByLabel(/quantity/i).fill("1.5");
    await page
      .getByRole("dialog")
      .getByRole("button", { name: /add asset/i })
      .click();

    // Wait for modal to close
    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 3000 });

    // Verify asset is in portfolio
    await expect(page.getByText(/Bitcoin/)).toBeVisible();

    // Click delete button (use last() to avoid strict mode violation with asset row)
    await page.getByRole("button", { name: /Delete BTC/i }).last().click();

    // Confirm deletion in modal
    const deleteModal = page.getByRole("dialog");
    await expect(deleteModal).toBeVisible();
    await expect(deleteModal.getByText(/Remove Bitcoin/i)).toBeVisible();
    
    await deleteModal.getByRole("button", { name: /Confirm Delete/i }).click();

    // Wait for modal to close
    await expect(deleteModal).not.toBeVisible({ timeout: 3000 });

    // Verify success toast appears with asset name
    const successToast = page.locator('[role="status"]', {
      hasText: /Removed.*Bitcoin/i,
    });
    await expect(successToast).toBeVisible({ timeout: 3000 });

    // Verify asset is removed from portfolio (check specific element, not just any text)
    await expect(page.getByTestId("asset-row-BTC")).not.toBeVisible();
  });

  test("delete confirmation modal + success notification flow", async ({ page }) => {
    await page.goto("/portfolio");

    // Add Ethereum for this test
    await page.getByRole("button", { name: /add asset/i }).click();
    await page.locator("select#asset-select").selectOption({ label: "Ethereum (ETH)" });
    await page.getByLabel(/quantity/i).fill("5.0");
    await page
      .getByRole("dialog")
      .getByRole("button", { name: /add asset/i })
      .click();

    // Wait for modal to close
    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 3000 });

    // Verify asset exists
    await expect(page.getByText(/Ethereum/)).toBeVisible();
    await expect(page.getByText(/Qty: 5/)).toBeVisible();

    // Click delete button (use last() to avoid strict mode violation with asset row)
    await page.getByRole("button", { name: /Delete ETH/i }).last().click();

    // Verify delete confirmation modal appears
    const deleteModal = page.getByRole("dialog");
    await expect(deleteModal).toBeVisible();
    await expect(deleteModal.getByText(/Ethereum/)).toBeVisible();

    // Cancel first time
    await deleteModal.getByRole("button", { name: /Cancel/i }).click();

    // Modal should close and asset should still be there
    await expect(deleteModal).not.toBeVisible({ timeout: 3000 });
    await expect(page.getByText(/Ethereum/)).toBeVisible();

    // Try deleting again
    await page.getByRole("button", { name: /Delete ETH/i }).last().click();
    await expect(deleteModal).toBeVisible();

    // Confirm deletion
    await deleteModal.getByRole("button", { name: /Confirm Delete/i }).click();

    // Wait for modal to close
    await expect(deleteModal).not.toBeVisible({ timeout: 3000 });

    // Verify success toast
    const successToast = page.locator('[role="status"]', {
      hasText: /Removed.*Ethereum/i,
    });
    await expect(successToast).toBeVisible({ timeout: 3000 });

    // Verify asset is removed (check specific element)
    await expect(page.getByTestId("asset-row-ETH")).not.toBeVisible();
  });

  test("shows empty state after deleting last asset", async ({ page }) => {
    await page.goto("/portfolio");

    // Add a single asset
    await page.getByRole("button", { name: /add asset/i }).click();
    await page.locator("select#asset-select").selectOption({ label: "Bitcoin (BTC)" });
    await page.getByLabel(/quantity/i).fill("1.0");
    await page
      .getByRole("dialog")
      .getByRole("button", { name: /add asset/i })
      .click();

    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 3000 });

    // Delete the only asset (use last() to avoid strict mode violation with asset row)
    await page.getByRole("button", { name: /Delete BTC/i }).last().click();
    const deleteModal = page.getByRole("dialog");
    await deleteModal.getByRole("button", { name: /Confirm Delete/i }).click();

    // Verify success toast
    const successToast = page.locator('[role="status"]', {
      hasText: /Removed Bitcoin/i,
    });
    await expect(successToast).toBeVisible({ timeout: 3000 });

    // Verify empty state message appears
    await expect(page.getByText(/No assets yet/i)).toBeVisible();
  });
});
