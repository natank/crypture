import { test as base } from '@playwright/test';
import { AddAssetModal } from '@e2e/pom-pages/add-asset-modal.pom';
import { DeleteConfirmationModal } from '@e2e/pom-pages/delete-confirmation-modal.pom';
import { PortfolioPage } from '@e2e/pom-pages/portfolio.pom';
import {
  mockCoinGeckoMarkets,
  mockCoinGeckoChartData,
  mockCoinGeckoCoinDetails,
} from './mocks/mockCoinGecko';

type Fixtures = {
  portfolioPage: PortfolioPage;
  addAssetModal: AddAssetModal;
  deleteModal: DeleteConfirmationModal;
};

export const test = base.extend<Fixtures>({
  // Start fresh with no storage state for each test
  storageState: undefined,

  portfolioPage: async ({ page, context }, run) => {
    // Clear all storage before setting up mocks
    await context.clearCookies();

    // Set up mocks first
    await mockCoinGeckoMarkets(page);
    await mockCoinGeckoChartData(page);
    await mockCoinGeckoCoinDetails(page);

    // Navigate to portfolio page first, then clear storage
    const portfolioPage = new PortfolioPage(page);
    await portfolioPage.goto();

    // Clear storage after navigating to the actual page
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await run(portfolioPage);
  },

  addAssetModal: async ({ page }, run) => {
    const addModal = new AddAssetModal(page);
    await run(addModal);
  },

  deleteModal: async ({ page }, run) => {
    const deleteModal = new DeleteConfirmationModal(page);
    await run(deleteModal);
  },
});

export { expect } from '@playwright/test';
