import { test, expect } from "@e2e/test-setup";
import { mockCoinGeckoMarkets, mockCoinGeckoChartData } from "@e2e/mocks/mockCoinGecko";

/**
 * E2E Tests for Backlog Item 24 - Price Alerts & Notifications
 * REQ-013-notifications
 * 
 * Tests the alert management flow:
 * - Opening/closing alerts panel
 * - Creating price alerts
 * - Viewing and managing alerts
 * - Alert triggering (simulated)
 */

test.describe("Price Alerts - Panel Management", () => {
  test.beforeEach(async ({ page }) => {
    mockCoinGeckoMarkets(page);
    mockCoinGeckoChartData(page);
  });

  test("opens alerts panel when clicking bell icon", async ({ page }) => {
    await page.goto("/portfolio");

    // Find and click the alerts button (bell icon)
    const alertButton = page.getByRole("button", { name: /alerts/i });
    await expect(alertButton).toBeVisible();
    await alertButton.click();

    // Verify panel opens
    const alertsPanel = page.locator('[role="dialog"][aria-label="Price Alerts"]');
    await expect(alertsPanel).toBeVisible({ timeout: 3000 });
  });

  test("closes alerts panel with close button", async ({ page }) => {
    await page.goto("/portfolio");

    // Open panel
    await page.getByRole("button", { name: /alerts/i }).click();
    const alertsPanel = page.locator('[role="dialog"][aria-label="Price Alerts"]');
    await expect(alertsPanel).toBeVisible();

    // Close panel
    await alertsPanel.getByRole("button", { name: /close/i }).click();
    await expect(alertsPanel).not.toBeVisible({ timeout: 3000 });
  });

  test("closes alerts panel when clicking backdrop", async ({ page }) => {
    await page.goto("/portfolio");

    // Open panel
    await page.getByRole("button", { name: /alerts/i }).click();
    const alertsPanel = page.locator('[role="dialog"][aria-label="Price Alerts"]');
    await expect(alertsPanel).toBeVisible();

    // Click backdrop (outside panel)
    await page.locator('[data-testid="alerts-backdrop"]').click({ force: true });
    await expect(alertsPanel).not.toBeVisible({ timeout: 3000 });
  });

  test("shows empty state when no alerts exist", async ({ page }) => {
    // Clear localStorage to ensure no alerts
    await page.goto("/portfolio");
    await page.evaluate(() => localStorage.removeItem("crypture_alerts"));
    await page.reload();

    // Open panel
    await page.getByRole("button", { name: /alerts/i }).click();
    const alertsPanel = page.locator('[role="dialog"][aria-label="Price Alerts"]');

    // Verify empty state message (matches "No active alerts. Create one to get notified!")
    await expect(alertsPanel.getByText(/no active alerts/i)).toBeVisible();
  });
});

test.describe("Price Alerts - Creating Alerts", () => {
  test.beforeEach(async ({ page }) => {
    mockCoinGeckoMarkets(page);
    mockCoinGeckoChartData(page);
    // Clear alerts before each test
    await page.goto("/portfolio");
    await page.evaluate(() => localStorage.removeItem("crypture_alerts"));
    await page.reload();
  });

  test("creates a price alert with 'above' condition", async ({ page }) => {
    await page.goto("/portfolio");

    // Open alerts panel
    await page.getByRole("button", { name: /alerts/i }).click();
    const alertsPanel = page.locator('[role="dialog"][aria-label="Price Alerts"]');
    await expect(alertsPanel).toBeVisible();

    // Click "Create Alert" button
    await alertsPanel.getByRole("button", { name: /create alert/i }).click();

    // Fill in alert form - use search input to find coin
    const searchInput = alertsPanel.getByPlaceholder(/search or select/i);
    await searchInput.click();
    await searchInput.fill("bitcoin");

    // Click on Bitcoin in dropdown
    await alertsPanel.getByRole("button", { name: /bitcoin/i }).first().click();

    // Condition defaults to "above", but click to ensure
    await alertsPanel.getByRole("button", { name: /above/i }).click();

    // Enter target price
    const priceInput = alertsPanel.getByPlaceholder("0.00");
    await priceInput.fill("35000");

    // Submit
    await alertsPanel.getByRole("button", { name: /create alert/i }).last().click();

    // Verify alert appears in list
    await expect(alertsPanel.getByText(/BTC/i)).toBeVisible();
    await expect(alertsPanel.getByText(/\$35,000/)).toBeVisible();
  });

  test("creates a price alert with 'below' condition", async ({ page }) => {
    await page.goto("/portfolio");

    // Open alerts panel
    await page.getByRole("button", { name: /alerts/i }).click();
    const alertsPanel = page.locator('[role="dialog"][aria-label="Price Alerts"]');

    // Click create button
    await alertsPanel.getByRole("button", { name: /create alert/i }).click();

    // Select Ethereum via search
    const searchInput = alertsPanel.getByPlaceholder(/search or select/i);
    await searchInput.click();
    await searchInput.fill("ethereum");
    await alertsPanel.getByRole("button", { name: /ethereum/i }).first().click();

    // Select condition (below)
    await alertsPanel.getByRole("button", { name: /below/i }).click();

    // Enter target price
    const priceInput = alertsPanel.getByPlaceholder("0.00");
    await priceInput.fill("1800");

    // Submit
    await alertsPanel.getByRole("button", { name: /create alert/i }).last().click();

    // Verify alert appears
    await expect(alertsPanel.getByText(/ETH/i)).toBeVisible();
    await expect(alertsPanel.getByText(/\$1,800/)).toBeVisible();
  });

  test("shows validation error for missing coin selection", async ({ page }) => {
    await page.goto("/portfolio");

    // Open alerts panel
    await page.getByRole("button", { name: /alerts/i }).click();
    const alertsPanel = page.locator('[role="dialog"][aria-label="Price Alerts"]');

    // Click create button
    await alertsPanel.getByRole("button", { name: /create alert/i }).first().click();

    // Enter price but don't select coin
    const priceInput = alertsPanel.getByPlaceholder("0.00");
    await priceInput.fill("35000");

    // Try to submit without selecting coin - use the submit button in the form
    await alertsPanel.locator('form').getByRole("button", { name: /create alert/i }).click();

    // Verify error message
    await expect(alertsPanel.getByText(/select a coin/i)).toBeVisible();
  });

  test("shows validation error for missing target price", async ({ page }) => {
    await page.goto("/portfolio");

    // Open alerts panel
    await page.getByRole("button", { name: /alerts/i }).click();
    const alertsPanel = page.locator('[role="dialog"][aria-label="Price Alerts"]');

    // Click create button
    await alertsPanel.getByRole("button", { name: /create alert/i }).click();

    // Select coin but don't enter price
    const searchInput = alertsPanel.getByPlaceholder(/search or select/i);
    await searchInput.click();
    await searchInput.fill("bitcoin");
    await alertsPanel.getByRole("button", { name: /bitcoin/i }).first().click();

    // Try to submit without price
    await alertsPanel.getByRole("button", { name: /create alert/i }).last().click();

    // Verify error message
    await expect(alertsPanel.getByText(/valid price/i)).toBeVisible();
  });

  test("cancels alert creation", async ({ page }) => {
    await page.goto("/portfolio");

    // Open alerts panel
    await page.getByRole("button", { name: /alerts/i }).click();
    const alertsPanel = page.locator('[role="dialog"][aria-label="Price Alerts"]');

    // Click create button
    await alertsPanel.getByRole("button", { name: /create alert/i }).click();

    // Click cancel
    await alertsPanel.getByRole("button", { name: /cancel/i }).click();

    // Verify form is hidden and Create Alert button is shown again
    await expect(alertsPanel.getByRole("button", { name: /create alert/i })).toBeVisible();
  });
});

test.describe("Price Alerts - Managing Alerts", () => {
  test.beforeEach(async ({ page }) => {
    mockCoinGeckoMarkets(page);
    mockCoinGeckoChartData(page);
  });

  test("displays existing alerts in the panel", async ({ page }) => {
    // Seed alerts in localStorage with correct format
    await page.goto("/portfolio");
    await page.evaluate(() => {
      const data = {
        alerts: [
          {
            id: "test-alert-1",
            coinId: "bitcoin",
            coinSymbol: "BTC",
            coinName: "Bitcoin",
            condition: "above",
            targetPrice: 35000,
            status: "active",
            createdAt: Date.now(),
          },
          {
            id: "test-alert-2",
            coinId: "ethereum",
            coinSymbol: "ETH",
            coinName: "Ethereum",
            condition: "below",
            targetPrice: 1800,
            status: "active",
            createdAt: Date.now() - 1000,
          },
        ],
        notificationsEnabled: true,
        lastChecked: Date.now(),
      };
      localStorage.setItem("crypture_alerts", JSON.stringify(data));
    });
    await page.reload();

    // Open alerts panel
    await page.getByRole("button", { name: /alerts/i }).click();
    const alertsPanel = page.locator('[role="dialog"][aria-label="Price Alerts"]');

    // Verify both alerts are displayed
    await expect(alertsPanel.getByText(/BTC/)).toBeVisible();
    await expect(alertsPanel.getByText(/ETH/)).toBeVisible();
    await expect(alertsPanel.getByText(/\$35,000/)).toBeVisible();
    await expect(alertsPanel.getByText(/\$1,800/)).toBeVisible();
  });

  test("shows delete confirmation modal when deleting alert (KI-02)", async ({ page }) => {
    // Seed alerts with correct format
    await page.goto("/portfolio");
    await page.evaluate(() => {
      const data = {
        alerts: [
          { id: "1", coinId: "bitcoin", coinSymbol: "BTC", coinName: "Bitcoin", condition: "above", targetPrice: 35000, status: "active", createdAt: Date.now() },
          { id: "2", coinId: "ethereum", coinSymbol: "ETH", coinName: "Ethereum", condition: "below", targetPrice: 1800, status: "active", createdAt: Date.now() },
        ],
        notificationsEnabled: true,
        lastChecked: Date.now(),
      };
      localStorage.setItem("crypture_alerts", JSON.stringify(data));
    });
    await page.reload();

    // Open alerts panel
    await page.getByRole("button", { name: /alerts/i }).click();
    const alertsPanel = page.locator('[role="dialog"][aria-label="Price Alerts"]');

    // Find BTC alert item and open its actions menu (⋮ button)
    const btcAlert = alertsPanel.locator('[data-testid="alert-item"]').filter({ hasText: /BTC/ }).first();
    await btcAlert.locator('button').last().click(); // The ⋮ actions button

    // Click delete in the dropdown
    await page.getByRole("button", { name: /delete/i }).click();

    // Verify confirmation modal appears
    const confirmModal = page.locator('[role="dialog"][aria-labelledby="delete-alert-modal-title"]');
    await expect(confirmModal).toBeVisible();
    
    // Verify modal shows alert details
    await expect(confirmModal.getByText(/delete price alert/i)).toBeVisible();
    await expect(confirmModal.getByText(/Bitcoin/i)).toBeVisible();
    await expect(confirmModal.getByText(/BTC/i)).toBeVisible();
    await expect(confirmModal.getByText(/\$35,000/)).toBeVisible();
  });

  test("cancels alert deletion from confirmation modal (KI-02)", async ({ page }) => {
    // Seed alert with correct format
    await page.goto("/portfolio");
    await page.evaluate(() => {
      const data = {
        alerts: [
          { id: "1", coinId: "bitcoin", coinSymbol: "BTC", coinName: "Bitcoin", condition: "above", targetPrice: 35000, status: "active", createdAt: Date.now() },
        ],
        notificationsEnabled: true,
        lastChecked: Date.now(),
      };
      localStorage.setItem("crypture_alerts", JSON.stringify(data));
    });
    await page.reload();

    // Open alerts panel
    await page.getByRole("button", { name: /alerts/i }).click();
    const alertsPanel = page.locator('[role="dialog"][aria-label="Price Alerts"]');

    // Open actions menu and click delete
    const btcAlert = alertsPanel.locator('[data-testid="alert-item"]').first();
    await btcAlert.locator('button').last().click();
    await page.getByRole("button", { name: /delete/i }).click();

    // Verify confirmation modal appears
    const confirmModal = page.locator('[role="dialog"][aria-labelledby="delete-alert-modal-title"]');
    await expect(confirmModal).toBeVisible();

    // Click Cancel button
    await confirmModal.getByRole("button", { name: /cancel/i }).click();

    // Verify modal closes
    await expect(confirmModal).not.toBeVisible();

    // Verify alert still exists in panel
    await expect(alertsPanel.locator('[data-testid="alert-item"]').filter({ hasText: /BTC/ })).toBeVisible();
  });

  test("cancels alert deletion by clicking backdrop (KI-02)", async ({ page }) => {
    // Seed alert with correct format
    await page.goto("/portfolio");
    await page.evaluate(() => {
      const data = {
        alerts: [
          { id: "1", coinId: "bitcoin", coinSymbol: "BTC", coinName: "Bitcoin", condition: "above", targetPrice: 35000, status: "active", createdAt: Date.now() },
        ],
        notificationsEnabled: true,
        lastChecked: Date.now(),
      };
      localStorage.setItem("crypture_alerts", JSON.stringify(data));
    });
    await page.reload();

    // Open alerts panel
    await page.getByRole("button", { name: /alerts/i }).click();
    const alertsPanel = page.locator('[role="dialog"][aria-label="Price Alerts"]');

    // Open actions menu and click delete
    const btcAlert = alertsPanel.locator('[data-testid="alert-item"]').first();
    await btcAlert.locator('button').last().click();
    await page.getByRole("button", { name: /delete/i }).click();

    // Verify confirmation modal appears
    const confirmModal = page.locator('[role="dialog"][aria-labelledby="delete-alert-modal-title"]');
    await expect(confirmModal).toBeVisible();

    // Click backdrop (outside modal content)
    await page.locator('.modal').click({ position: { x: 5, y: 5 } });

    // Verify modal closes
    await expect(confirmModal).not.toBeVisible();

    // Verify alert still exists
    await expect(alertsPanel.locator('[data-testid="alert-item"]').filter({ hasText: /BTC/ })).toBeVisible();
  });

  test("cancels alert deletion with Escape key (KI-02)", async ({ page }) => {
    // Seed alert with correct format
    await page.goto("/portfolio");
    await page.evaluate(() => {
      const data = {
        alerts: [
          { id: "1", coinId: "bitcoin", coinSymbol: "BTC", coinName: "Bitcoin", condition: "above", targetPrice: 35000, status: "active", createdAt: Date.now() },
        ],
        notificationsEnabled: true,
        lastChecked: Date.now(),
      };
      localStorage.setItem("crypture_alerts", JSON.stringify(data));
    });
    await page.reload();

    // Open alerts panel
    await page.getByRole("button", { name: /alerts/i }).click();
    const alertsPanel = page.locator('[role="dialog"][aria-label="Price Alerts"]');

    // Open actions menu and click delete
    const btcAlert = alertsPanel.locator('[data-testid="alert-item"]').first();
    await btcAlert.locator('button').last().click();
    await page.getByRole("button", { name: /delete/i }).click();

    // Verify confirmation modal appears
    const confirmModal = page.locator('[role="dialog"][aria-labelledby="delete-alert-modal-title"]');
    await expect(confirmModal).toBeVisible();

    // Press Escape key
    await page.keyboard.press('Escape');

    // Verify modal closes
    await expect(confirmModal).not.toBeVisible();

    // Verify alert still exists
    await expect(alertsPanel.locator('[data-testid="alert-item"]').filter({ hasText: /BTC/ })).toBeVisible();
  });

  test("confirms and deletes alert from confirmation modal (KI-02)", async ({ page }) => {
    // Seed alerts with correct format
    await page.goto("/portfolio");
    await page.evaluate(() => {
      const data = {
        alerts: [
          { id: "1", coinId: "bitcoin", coinSymbol: "BTC", coinName: "Bitcoin", condition: "above", targetPrice: 35000, status: "active", createdAt: Date.now() },
          { id: "2", coinId: "ethereum", coinSymbol: "ETH", coinName: "Ethereum", condition: "below", targetPrice: 1800, status: "active", createdAt: Date.now() },
        ],
        notificationsEnabled: true,
        lastChecked: Date.now(),
      };
      localStorage.setItem("crypture_alerts", JSON.stringify(data));
    });
    await page.reload();

    // Open alerts panel
    await page.getByRole("button", { name: /alerts/i }).click();
    const alertsPanel = page.locator('[role="dialog"][aria-label="Price Alerts"]');

    // Find BTC alert item and open its actions menu
    const btcAlert = alertsPanel.locator('[data-testid="alert-item"]').filter({ hasText: /BTC/ }).first();
    await btcAlert.locator('button').last().click();

    // Click delete in the dropdown
    await page.getByRole("button", { name: /delete/i }).click();

    // Verify confirmation modal appears
    const confirmModal = page.locator('[role="dialog"][aria-labelledby="delete-alert-modal-title"]');
    await expect(confirmModal).toBeVisible();

    // Click Confirm Delete button
    await confirmModal.getByRole("button", { name: /confirm delete/i }).click();

    // Verify modal closes
    await expect(confirmModal).not.toBeVisible();

    // Verify BTC alert is removed
    await expect(alertsPanel.locator('[data-testid="alert-item"]').filter({ hasText: /BTC/ })).not.toBeVisible({ timeout: 3000 });

    // Verify ETH alert still exists
    await expect(alertsPanel.getByText(/ETH/)).toBeVisible();
  });

  test("mutes an alert", async ({ page }) => {
    // Seed alert with correct format
    await page.goto("/portfolio");
    await page.evaluate(() => {
      const data = {
        alerts: [
          { id: "1", coinId: "bitcoin", coinSymbol: "BTC", coinName: "Bitcoin", condition: "above", targetPrice: 35000, status: "active", createdAt: Date.now() },
        ],
        notificationsEnabled: true,
        lastChecked: Date.now(),
      };
      localStorage.setItem("crypture_alerts", JSON.stringify(data));
    });
    await page.reload();

    // Open alerts panel
    await page.getByRole("button", { name: /alerts/i }).click();
    const alertsPanel = page.locator('[role="dialog"][aria-label="Price Alerts"]');

    // Find BTC alert item and open its actions menu
    const btcAlert = alertsPanel.locator('[data-testid="alert-item"]').first();
    await btcAlert.locator('button').last().click();

    // Click mute in the dropdown
    await page.getByRole("button", { name: /mute/i }).click();

    // Verify alert shows muted status - look for the Muted section header
    await expect(alertsPanel.getByRole("heading", { name: /Muted/i })).toBeVisible();
  });

  test("reactivates a muted alert", async ({ page }) => {
    // Seed a muted alert with correct format
    await page.goto("/portfolio");
    await page.evaluate(() => {
      const data = {
        alerts: [
          {
            id: "test-alert-muted",
            coinId: "bitcoin",
            coinSymbol: "BTC",
            coinName: "Bitcoin",
            condition: "above",
            targetPrice: 35000,
            status: "muted",
            createdAt: Date.now(),
          },
        ],
        notificationsEnabled: true,
        lastChecked: Date.now(),
      };
      localStorage.setItem("crypture_alerts", JSON.stringify(data));
    });
    await page.reload();

    // Open alerts panel - use aria-label since badge won't show for muted alerts
    await page.getByRole("button", { name: /price alerts/i }).click();
    const alertsPanel = page.locator('[role="dialog"][aria-label="Price Alerts"]');
    await expect(alertsPanel).toBeVisible();

    // Verify muted section is visible
    await expect(alertsPanel.getByRole("heading", { name: /Muted/i })).toBeVisible();

    // Find muted alert and open its actions menu
    const mutedAlert = alertsPanel.locator('[data-testid="alert-item"]').first();
    await mutedAlert.locator('button').last().click();

    // Click reactivate in the dropdown
    await page.getByRole("button", { name: /reactivate/i }).click();

    // Verify alert is active again - look for the Active Alerts section with the alert
    await expect(alertsPanel.getByRole("heading", { name: /Active Alerts/i })).toBeVisible();
    await expect(alertsPanel.locator('[data-testid="alert-item"]').filter({ hasText: /BTC/ })).toBeVisible();
  });

  test("edits an existing alert", async ({ page }) => {
    // Seed alert with correct format
    await page.goto("/portfolio");
    await page.evaluate(() => {
      const data = {
        alerts: [
          { id: "1", coinId: "bitcoin", coinSymbol: "BTC", coinName: "Bitcoin", condition: "above", targetPrice: 35000, status: "active", createdAt: Date.now() },
        ],
        notificationsEnabled: true,
        lastChecked: Date.now(),
      };
      localStorage.setItem("crypture_alerts", JSON.stringify(data));
    });
    await page.reload();

    // Open alerts panel
    await page.getByRole("button", { name: /alerts/i }).click();
    const alertsPanel = page.locator('[role="dialog"][aria-label="Price Alerts"]');

    // Find BTC alert item and open its actions menu
    const btcAlert = alertsPanel.locator('[data-testid="alert-item"]').first();
    await btcAlert.locator('button').last().click();

    // Click edit in the dropdown
    await page.getByRole("button", { name: /edit/i }).click();

    // Change target price
    const priceInput = alertsPanel.getByPlaceholder("0.00");
    await priceInput.clear();
    await priceInput.fill("40000");

    // Save changes
    await alertsPanel.getByRole("button", { name: /update alert/i }).click();

    // Verify new price is displayed
    await expect(alertsPanel.getByText(/\$40,000/)).toBeVisible();
  });
});

test.describe("Price Alerts - Badge Count", () => {
  test.beforeEach(async ({ page }) => {
    mockCoinGeckoMarkets(page);
    mockCoinGeckoChartData(page);
  });

  test("shows badge count for active alerts", async ({ page }) => {
    // Seed alerts with correct format
    await page.goto("/portfolio");
    await page.evaluate(() => {
      const data = {
        alerts: [
          { id: "1", coinId: "bitcoin", coinSymbol: "BTC", coinName: "Bitcoin", condition: "above", targetPrice: 35000, status: "active", createdAt: Date.now() },
          { id: "2", coinId: "ethereum", coinSymbol: "ETH", coinName: "Ethereum", condition: "below", targetPrice: 1800, status: "active", createdAt: Date.now() },
        ],
        notificationsEnabled: true,
        lastChecked: Date.now(),
      };
      localStorage.setItem("crypture_alerts", JSON.stringify(data));
    });
    await page.reload();

    // Verify badge shows "2"
    const badge = page.locator('[data-testid="alert-badge"]');
    await expect(badge).toContainText("2");
  });

  test("shows badge for triggered alerts", async ({ page }) => {
    // Seed a triggered alert with correct format
    await page.goto("/portfolio");
    await page.evaluate(() => {
      const data = {
        alerts: [
          { id: "1", coinId: "bitcoin", coinSymbol: "BTC", coinName: "Bitcoin", condition: "above", targetPrice: 35000, status: "triggered", createdAt: Date.now(), triggeredAt: Date.now() },
        ],
        notificationsEnabled: true,
        lastChecked: Date.now(),
      };
      localStorage.setItem("crypture_alerts", JSON.stringify(data));
    });
    await page.reload();

    // Verify badge is visible
    const badge = page.locator('[data-testid="alert-badge"]');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText("1");
  });

  test("updates badge when alert is deleted", async ({ page }) => {
    // Seed 2 alerts with correct format
    await page.goto("/portfolio");
    await page.evaluate(() => {
      const data = {
        alerts: [
          { id: "1", coinId: "bitcoin", coinSymbol: "BTC", coinName: "Bitcoin", condition: "above", targetPrice: 35000, status: "active", createdAt: Date.now() },
          { id: "2", coinId: "ethereum", coinSymbol: "ETH", coinName: "Ethereum", condition: "below", targetPrice: 1800, status: "active", createdAt: Date.now() },
        ],
        notificationsEnabled: true,
        lastChecked: Date.now(),
      };
      localStorage.setItem("crypture_alerts", JSON.stringify(data));
    });
    await page.reload();

    // Verify initial badge shows "2"
    const badge = page.locator('[data-testid="alert-badge"]');
    await expect(badge).toContainText("2");

    // Open panel and delete one alert
    await page.getByRole("button", { name: /alerts/i }).click();
    const alertsPanel = page.locator('[role="dialog"][aria-label="Price Alerts"]');
    
    // Find BTC alert and open actions menu
    const btcAlert = alertsPanel.locator('[data-testid="alert-item"]').filter({ hasText: /BTC/ }).first();
    await btcAlert.locator('button').last().click();
    await page.getByRole("button", { name: /delete/i }).click();

    // Confirm deletion in modal (KI-02)
    const confirmModal = page.locator('[role="dialog"][aria-labelledby="delete-alert-modal-title"]');
    await expect(confirmModal).toBeVisible();
    await confirmModal.getByRole("button", { name: /confirm delete/i }).click();

    // Verify BTC alert is removed from the panel
    await expect(alertsPanel.locator('[data-testid="alert-item"]').filter({ hasText: /BTC/ })).not.toBeVisible();
    
    // Verify only 1 alert remains in the panel
    await expect(alertsPanel.locator('[data-testid="alert-item"]')).toHaveCount(1);

    // Close panel and reload to verify persistence
    await alertsPanel.getByRole("button", { name: /close/i }).click();
    await page.reload();

    // Verify badge now shows "1" after reload
    await expect(badge).toContainText("1");
  });

  test("updates badge immediately when alert is created (KI-01)", async ({ page }) => {
    // Clear alerts to start fresh
    await page.goto("/portfolio");
    await page.evaluate(() => localStorage.removeItem("crypture_alerts"));
    await page.reload();

    // Verify badge is not visible initially (no alerts)
    const badge = page.locator('[data-testid="alert-badge"]');
    await expect(badge).not.toBeVisible();

    // Open alerts panel
    await page.getByRole("button", { name: /alerts/i }).click();
    const alertsPanel = page.locator('[role="dialog"][aria-label="Price Alerts"]');
    await expect(alertsPanel).toBeVisible();

    // Create an alert
    await alertsPanel.getByRole("button", { name: /create alert/i }).click();
    const searchInput = alertsPanel.getByPlaceholder(/search or select/i);
    await searchInput.click();
    await searchInput.fill("bitcoin");
    await alertsPanel.getByRole("button", { name: /bitcoin/i }).first().click();
    const priceInput = alertsPanel.getByPlaceholder("0.00");
    await priceInput.fill("35000");
    await alertsPanel.getByRole("button", { name: /create alert/i }).last().click();

    // Verify badge updates immediately WITHOUT closing panel or reloading
    await expect(badge).toBeVisible({ timeout: 1000 });
    await expect(badge).toContainText("1");

    // Create a second alert
    await alertsPanel.getByRole("button", { name: /create alert/i }).click();
    await searchInput.click();
    await searchInput.fill("ethereum");
    await alertsPanel.getByRole("button", { name: /ethereum/i }).first().click();
    await priceInput.fill("2000");
    await alertsPanel.getByRole("button", { name: /create alert/i }).last().click();

    // Verify badge updates to "2" immediately
    await expect(badge).toContainText("2", { timeout: 1000 });
  });

  test("updates badge immediately when alert is deleted (KI-01)", async ({ page }) => {
    // Seed 2 alerts
    await page.goto("/portfolio");
    await page.evaluate(() => {
      const data = {
        alerts: [
          { id: "1", coinId: "bitcoin", coinSymbol: "BTC", coinName: "Bitcoin", condition: "above", targetPrice: 35000, status: "active", createdAt: Date.now() },
          { id: "2", coinId: "ethereum", coinSymbol: "ETH", coinName: "Ethereum", condition: "below", targetPrice: 1800, status: "active", createdAt: Date.now() },
        ],
        notificationsEnabled: true,
        lastChecked: Date.now(),
      };
      localStorage.setItem("crypture_alerts", JSON.stringify(data));
    });
    await page.reload();

    // Verify initial badge shows "2"
    const badge = page.locator('[data-testid="alert-badge"]');
    await expect(badge).toContainText("2");

    // Open panel and delete one alert
    await page.getByRole("button", { name: /alerts/i }).click();
    const alertsPanel = page.locator('[role="dialog"][aria-label="Price Alerts"]');
    
    const btcAlert = alertsPanel.locator('[data-testid="alert-item"]').filter({ hasText: /BTC/ }).first();
    await btcAlert.locator('button').last().click();
    await page.getByRole("button", { name: /delete/i }).click();

    // Confirm deletion in modal (KI-02)
    const confirmModal = page.locator('[role="dialog"][aria-labelledby="delete-alert-modal-title"]');
    await confirmModal.getByRole("button", { name: /confirm delete/i }).click();

    // Verify badge updates immediately to "1" WITHOUT closing panel or reloading
    await expect(badge).toContainText("1", { timeout: 1000 });

    // Delete the second alert
    const ethAlert = alertsPanel.locator('[data-testid="alert-item"]').filter({ hasText: /ETH/ }).first();
    await ethAlert.locator('button').last().click();
    await page.getByRole("button", { name: /delete/i }).click();

    // Confirm second deletion
    await confirmModal.getByRole("button", { name: /confirm delete/i }).click();

    // Verify badge disappears immediately when no alerts remain
    await expect(badge).not.toBeVisible({ timeout: 1000 });
  });
});

test.describe("Price Alerts - Persistence", () => {
  test.beforeEach(async ({ page }) => {
    mockCoinGeckoMarkets(page);
    mockCoinGeckoChartData(page);
  });

  test("alerts persist after page reload", async ({ page }) => {
    await page.goto("/portfolio");
    await page.evaluate(() => localStorage.removeItem("crypture_alerts"));

    // Create an alert
    await page.getByRole("button", { name: /alerts/i }).click();
    const alertsPanel = page.locator('[role="dialog"][aria-label="Price Alerts"]');
    await alertsPanel.getByRole("button", { name: /create alert/i }).click();

    // Fill form - search for Bitcoin
    const searchInput = alertsPanel.getByPlaceholder(/search or select/i);
    await searchInput.click();
    await searchInput.fill("bitcoin");
    await alertsPanel.getByRole("button", { name: /bitcoin/i }).first().click();

    // Enter price
    const priceInput = alertsPanel.getByPlaceholder("0.00");
    await priceInput.fill("50000");
    
    // Submit
    await alertsPanel.getByRole("button", { name: /create alert/i }).last().click();

    // Verify alert was created
    await expect(alertsPanel.getByText(/BTC/)).toBeVisible();

    // Close panel and reload page
    await alertsPanel.getByRole("button", { name: /close/i }).click();
    await page.reload();

    // Reopen panel and verify alert persists
    await page.getByRole("button", { name: /alerts/i }).click();
    const alertsPanelAfterReload = page.locator('[role="dialog"][aria-label="Price Alerts"]');
    await expect(alertsPanelAfterReload.getByText(/BTC/)).toBeVisible();
    await expect(alertsPanelAfterReload.getByText(/\$50,000/)).toBeVisible();
  });
});
