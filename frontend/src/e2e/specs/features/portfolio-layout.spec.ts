// e2e/specs/portfolio-layout.spec.ts
import { test, expect } from "@e2e/test-setup";
import { PortfolioPage } from "@e2e/pom-pages/portfolio.pom";
import { mockCoinGeckoMarkets } from "@e2e/mocks/mockCoinGecko";

test.describe("Portfolio Overview Layout", () => {
  test.beforeEach(async ({ page }) => {
    const portfolioPage = new PortfolioPage(page);
    await portfolioPage.goto();
  });

  test("renders layout with total value header", async ({ page }) => {
    mockCoinGeckoMarkets(page);

    const portfolioPage = new PortfolioPage(page);
    await portfolioPage.goto();

    await expect(portfolioPage.header).toBeVisible();
    await expect(portfolioPage.header).toHaveText(/total portfolio value/i);
  });

  test("displays Add, Export, and Import buttons", async ({ page }) => {
    const portfolio = new PortfolioPage(page);
    mockCoinGeckoMarkets(page);

    await portfolio.goto();

    // Assert all three footer buttons are visible
    await expect(portfolio.addAssetButton).toBeVisible();
    await expect(portfolio.exportButton).toBeVisible();
    await expect(portfolio.importButton).toBeVisible();
  });

  test("renders filter input and sort dropdown", async ({ page }) => {
    mockCoinGeckoMarkets(page);
    const portfolioPage = new PortfolioPage(page);
    await portfolioPage.goto();

    await expect(portfolioPage.filterInput).toBeVisible();
    await expect(portfolioPage.sortDropdown).toBeVisible();
  });

  test("opens modal when Add Asset is clicked", async ({ page }) => {
    await mockCoinGeckoMarkets(page);
    const portfolio = new PortfolioPage(page);
    await portfolio.goto();

    await portfolio.openAddAssetModal();

    await expect(portfolio.modal).toBeVisible();
  });
});
