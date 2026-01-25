import { test as base } from '@playwright/test';
import { AddAssetModal } from '@e2e/pom-pages/add-asset-modal.pom';
import { DeleteConfirmationModal } from '@e2e/pom-pages/delete-confirmation-modal.pom';
import { PortfolioPage } from '@e2e/pom-pages/portfolio.pom';
import {
  mockCoinGeckoMarkets,
  mockCoinGeckoChartData,
} from './mocks/mockCoinGecko';

type Fixtures = {
  portfolioPage: PortfolioPage;
  addAssetModal: AddAssetModal;
  deleteModal: DeleteConfirmationModal;
};

export const test = base.extend<Fixtures>({
  portfolioPage: async ({ page }, run) => {
    await mockCoinGeckoMarkets(page);
    await mockCoinGeckoChartData(page);
    const portfolioPage = new PortfolioPage(page);
    await portfolioPage.goto();
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
