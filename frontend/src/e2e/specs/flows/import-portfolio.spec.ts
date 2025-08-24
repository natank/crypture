import { test, expect } from "@e2e/fixtures";

// Verifies that selecting a JSON file imports assets into the portfolio and replaces existing data
 test.describe("Import Portfolio", () => {
  test("user can import portfolio from JSON", async ({ page, portfolioPage }) => {
    // Ensure page is loaded via fixture
    // Build JSON file contents for import
    const data = [
      { asset: "btc", quantity: 1.5 },
      { asset: "eth", quantity: 3 },
    ];

    // Set the hidden file input with our JSON buffer; this triggers the change event
    const input = page.getByTestId("import-file-input");
    await input.setInputFiles({
      name: "portfolio.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(data)),
    });

    // Click Import to match user flow (optional as setInputFiles fires change)
    await portfolioPage.importButton.click();

    // Validate imported assets are displayed
    await expect(portfolioPage.assetRow("BTC")).toBeVisible();
    await expect(portfolioPage.assetRow("ETH")).toBeVisible();

    // Quantities should match
    await expect(page.getByText("Qty: 1.5")).toBeVisible();
    await expect(page.getByText("Qty: 3")).toBeVisible();
  });
});
