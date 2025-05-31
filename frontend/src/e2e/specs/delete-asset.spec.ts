import { test, expect } from "@e2e/fixtures";
import { mockCoinGeckoMarkets } from "@e2e/mocks/mockCoinGecko";

test("user can delete an asset", async ({
  page,
  portfolioPage,
  addAssetModal,
  deleteModal,
}) => {
  mockCoinGeckoMarkets(page);
  await addAssetModal.openAndAdd("BTC", 1.5);
  await portfolioPage.openDeleteModalFor("BTC");
  await deleteModal.confirm();
  await expect(portfolioPage.assetRow("BTC")).not.toBeVisible();
});
