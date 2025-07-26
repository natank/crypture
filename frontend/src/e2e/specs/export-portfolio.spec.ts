import { test, expect } from "../fixtures";
import { mockCoinGeckoMarkets } from "@e2e/mocks/mockCoinGecko";

test.describe.skip("Export Portfolio", () => {
  test("user can export portfolio as CSV", async ({ page, portfolioPage }) => {
    await mockCoinGeckoMarkets(page); // ✅ ensure BTC & ETH are available

    await portfolioPage.addAsset("BTC", 2);
    await portfolioPage.selectExportFormat("CSV");

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      portfolioPage.clickExportButton(),
    ]);

    const filename = await download.suggestedFilename();
    expect(filename).toMatch(/^portfolio-\d{4}-\d{2}-\d{2}\.csv$/);

    await download.saveAs(`./downloads/${filename}`);
  });
});
