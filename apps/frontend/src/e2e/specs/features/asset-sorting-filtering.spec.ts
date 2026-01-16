import { test, expect } from '@playwright/test';
import { PortfolioPage } from '@e2e/pom-pages/portfolio.pom';

// Test suite for sorting and filtering assets

test.describe('Portfolio Asset Sorting and Filtering', () => {
  let portfolioPage: PortfolioPage;

  test.beforeEach(async ({ page }) => {
    portfolioPage = new PortfolioPage(page);
    await portfolioPage.goto();
  });

  test('should sort assets by name A-Z', async () => {
    await portfolioPage.sortByName('asc');
    const sortedAssets = await portfolioPage.getAssetNames();
    expect(sortedAssets).toEqual([...sortedAssets].sort());
  });

  test('should sort assets by name Z-A', async () => {
    await portfolioPage.sortByName('desc');
    const sortedAssets = await portfolioPage.getAssetNames();
    expect(sortedAssets).toEqual([...sortedAssets].sort().reverse());
  });

  test('should sort assets by value high to low', async () => {
    await portfolioPage.sortByValue('desc');
    const sortedValues = await portfolioPage.getAssetValues();
    expect(sortedValues).toEqual([...sortedValues].sort((a, b) => b - a));
  });

  test('should sort assets by value low to high', async () => {
    await portfolioPage.sortByValue('asc');
    const sortedValues = await portfolioPage.getAssetValues();
    expect(sortedValues).toEqual([...sortedValues].sort((a, b) => a - b));
  });

  test('should filter assets by partial name match', async () => {
    await portfolioPage.filterByName('partialName');
    const filteredAssets = await portfolioPage.getAssetNames();
    expect(filteredAssets.every((name) => name.includes('partialName'))).toBe(
      true
    );
  });
});
