import { test, expect } from '../../fixtures';

test.describe('PortfolioPage CoinGecko Attribution', () => {
  test('should display CoinGecko attribution in footer when portfolio has assets', async ({
    portfolioPage,
  }) => {
    const page = portfolioPage.page;

    // Add an asset so attribution becomes visible
    await portfolioPage.addAsset('BTC', 1);

    // Check for attribution in footer (compact variant)
    const footerAttribution = page
      .locator('footer')
      .locator('text=Data provided by CoinGecko');
    await expect(footerAttribution).toBeVisible();

    // Check that attribution links to CoinGecko
    const attributionLink = page
      .locator('footer')
      .locator('a[href*="coingecko.com"]');
    await expect(attributionLink).toBeVisible();
    await expect(attributionLink).toHaveAttribute('target', '_blank');
    await expect(attributionLink).toHaveAttribute('rel', 'noopener noreferrer');

    // Check for UTM parameters
    const href = await attributionLink.getAttribute('href');
    expect(href).toMatch(/utm_source=crypture/);
  });

  test('should display attribution in footer with proper styling', async ({
    portfolioPage,
  }) => {
    const page = portfolioPage.page;

    // Add an asset so attribution becomes visible
    await portfolioPage.addAsset('BTC', 1);

    // Check for attribution in footer with compact variant styling
    const footerAttribution = page
      .locator('footer')
      .locator('text=Data provided by CoinGecko');
    await expect(footerAttribution).toBeVisible();

    // Verify it's the compact variant (smaller text, gray color)
    const attributionContainer = footerAttribution.locator('..').locator('..');
    await expect(attributionContainer).toHaveClass(/text-xs/);
    await expect(attributionContainer).toHaveClass(/text-gray-500/);

    // Ensure no duplicate attributions in main content area
    const mainContentAttributions = page
      .locator('main')
      .locator('text=Data provided by CoinGecko');
    await expect(mainContentAttributions).not.toBeVisible();
  });

  test('should not display attribution when portfolio is empty', async ({
    portfolioPage,
  }) => {
    const page = portfolioPage.page;

    // Wait for empty state
    await expect(page.getByTestId('empty-state')).toBeVisible({
      timeout: 10000,
    });

    // Check that attribution is NOT present when portfolio is empty
    const portfolioAttribution = page.locator(
      'text=Data provided by CoinGecko'
    );
    await expect(portfolioAttribution).not.toBeVisible();
  });

  test('attribution should be accessible', async ({ portfolioPage }) => {
    const page = portfolioPage.page;

    // Add an asset so attribution becomes visible
    await portfolioPage.addAsset('BTC', 1);

    // Wait for attribution to be visible in footer
    const attribution = page
      .locator('footer')
      .locator('text=Data provided by CoinGecko');
    await expect(attribution).toBeVisible();

    // Test ARIA labels on attribution links
    const attributionLink = page
      .locator('footer')
      .locator('a[href*="coingecko.com"]');
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
    const attribution = page
      .locator('footer')
      .locator('text=Data provided by CoinGecko');
    await expect(attribution).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(attribution).toBeVisible();
  });
});
