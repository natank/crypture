import { test, expect } from '../../fixtures';

test.describe('PortfolioPage CoinGecko Attribution', () => {
  test('should display CoinGecko attribution when portfolio has assets', async ({
    portfolioPage,
  }) => {
    const page = portfolioPage.page;

    // Add an asset so attribution becomes visible
    await portfolioPage.addAsset('BTC', 1);

    // Check for attribution in PortfolioPage (standard variant)
    const portfolioAttribution = page.locator(
      'text=Data provided by CoinGecko'
    );
    await expect(portfolioAttribution.first()).toBeVisible();

    // Check that attribution links to CoinGecko
    const attributionLink = page.locator('a[href*="coingecko.com"]').first();
    await expect(attributionLink).toBeVisible();
    await expect(attributionLink).toHaveAttribute('target', '_blank');
    await expect(attributionLink).toHaveAttribute('rel', 'noopener noreferrer');

    // Check for UTM parameters
    const href = await attributionLink.getAttribute('href');
    expect(href).toMatch(/utm_source=crypture/);
  });

  test('should display compact attribution in AssetList when assets are present', async ({
    portfolioPage,
  }) => {
    const page = portfolioPage.page;

    // Add an asset so AssetList attribution becomes visible
    await portfolioPage.addAsset('BTC', 1);

    // Check for compact attribution in AssetList
    const assetListAttribution = page.locator('text=Source: CoinGecko');
    await expect(assetListAttribution).toBeVisible();

    // Verify it's the compact variant (smaller text)
    const attributionContainer = assetListAttribution
      .locator('..')
      .locator('..');
    await expect(attributionContainer).toHaveClass(/text-xs/);
  });

  test('should not display attribution in AssetList when portfolio is empty', async ({
    portfolioPage,
  }) => {
    const page = portfolioPage.page;

    // Wait for empty state
    await expect(page.getByTestId('empty-state')).toBeVisible({
      timeout: 10000,
    });

    // Check that compact attribution is NOT present in AssetList
    const assetListAttribution = page.locator('text=Source: CoinGecko');
    await expect(assetListAttribution).not.toBeVisible();
  });

  test('attribution should be accessible', async ({ portfolioPage }) => {
    const page = portfolioPage.page;

    // Add an asset so attribution becomes visible
    await portfolioPage.addAsset('BTC', 1);

    // Wait for attribution to be visible
    const attribution = page.locator('text=Data provided by CoinGecko');
    await expect(attribution.first()).toBeVisible();

    // Test ARIA labels on attribution links
    const attributionLink = page.locator('a[href*="coingecko.com"]').first();
    await expect(attributionLink).toHaveAttribute(
      'aria-label',
      /Visit CoinGecko website/
    );

    // Verify link is keyboard-focusable
    await attributionLink.focus();
    await expect(attributionLink).toBeFocused();
  });

  test('attribution should be responsive', async ({ portfolioPage }) => {
    const page = portfolioPage.page;

    // Add an asset so attribution becomes visible
    await portfolioPage.addAsset('BTC', 1);

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    const attribution = page.locator('text=Data provided by CoinGecko');
    await expect(attribution.first()).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(attribution.first()).toBeVisible();
  });
});
