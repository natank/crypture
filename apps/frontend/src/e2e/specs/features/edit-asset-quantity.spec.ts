import { test, expect } from '@e2e/test-setup';
import {
  mockCoinGeckoMarkets,
  mockCoinGeckoChartData,
  mockCoinGeckoCoinDetails,
} from '@e2e/mocks/mockCoinGecko';

// Helper function to select asset in custom dropdown
async function selectAsset(page: any, symbol: string) {
  // Click to open the dropdown
  await page.getByTestId('asset-select').click();

  // Wait for dropdown options to be visible
  const dropdownOptions = page.locator('[role="option"]');
  await dropdownOptions.first().waitFor({ state: 'visible', timeout: 10000 });

  // Find and click the option containing the symbol
  const symbolOption = dropdownOptions
    .filter({ hasText: new RegExp(`\\(${symbol}\\)`, 'i') })
    .first();
  await symbolOption.waitFor({ state: 'visible', timeout: 5000 });
  await symbolOption.click();
}

test.describe('Edit Asset Quantity', () => {
  test.beforeEach(async ({ page }) => {
    mockCoinGeckoMarkets(page);
    mockCoinGeckoChartData(page);
    mockCoinGeckoCoinDetails(page);
    await page.goto('/portfolio');
    await expect(page.getByText(/Your Assets/i)).toBeVisible();
  });

  test('should edit asset quantity via inline edit', async ({ page }) => {
    await page.getByRole('button', { name: /add asset/i }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await selectAsset(page, 'BTC');
    await dialog.getByLabel('Quantity').fill('1.5');
    await dialog.getByRole('button', { name: /add asset/i }).click();

    await expect(page.getByText(/Qty: 1.5/)).toBeVisible();

    await page
      .getByRole('button', { name: /Edit Bitcoin quantity/i })
      .last()
      .click({ force: true });

    const input = page.getByLabel(/Edit quantity for Bitcoin/i);
    await expect(input).toBeVisible();
    await expect(input).toHaveValue('1.5');

    await input.clear();
    await input.fill('2.75');
    await page
      .getByRole('button', { name: /Save changes/i })
      .last()
      .click();

    await expect(page.getByText(/Qty: 2.75/)).toBeVisible();

    const totalValue = await page.getByText(/\$/).first();
    await expect(totalValue).toBeVisible();
  });

  test('should cancel edit and restore original quantity', async ({ page }) => {
    await page.getByRole('button', { name: /add asset/i }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await selectAsset(page, 'ETH');
    await dialog.getByLabel('Quantity').fill('5.0');
    await dialog.getByRole('button', { name: /add asset/i }).click();

    await expect(page.getByText(/Qty: 5/)).toBeVisible();

    await page
      .getByRole('button', { name: /Edit Ethereum quantity/i })
      .last()
      .click({ force: true });

    const input = page.getByLabel(/Edit quantity for Ethereum/i);
    await input.clear();
    await input.fill('999');
    await page
      .getByRole('button', { name: /Cancel editing/i })
      .last()
      .click();

    await expect(page.getByText(/Qty: 5/)).toBeVisible();
    await expect(page.getByText(/Qty: 999/)).not.toBeVisible();
  });

  test('should save with Enter key', async ({ page }) => {
    await page.getByRole('button', { name: /add asset/i }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await selectAsset(page, 'BTC');
    await dialog.getByLabel('Quantity').fill('3.0');
    await dialog.getByRole('button', { name: /add asset/i }).click();

    await expect(page.getByText(/Qty: 3/)).toBeVisible();

    await page
      .getByRole('button', { name: /Edit Bitcoin quantity/i })
      .last()
      .click({ force: true });
    const input = page.getByLabel(/Edit quantity for Bitcoin/i);
    await input.clear();
    await input.fill('4.5');
    await input.press('Enter');

    await expect(page.getByText(/Qty: 4.5/)).toBeVisible();
  });

  test('should cancel with Escape key', async ({ page }) => {
    await page.getByRole('button', { name: /add asset/i }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await selectAsset(page, 'BTC');
    await dialog.getByLabel('Quantity').fill('2.0');
    await dialog.getByRole('button', { name: /add asset/i }).click();

    await expect(page.getByText(/Qty: 2/)).toBeVisible();

    await page
      .getByRole('button', { name: /Edit Bitcoin quantity/i })
      .last()
      .click({ force: true });
    const input = page.getByLabel(/Edit quantity for Bitcoin/i);
    await input.clear();
    await input.fill('999');
    await input.press('Escape');

    await expect(page.getByText(/Qty: 2/)).toBeVisible();
  });

  test('should display validation error for negative numbers', async ({
    page,
  }) => {
    await page.getByRole('button', { name: /add asset/i }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await selectAsset(page, 'BTC');
    await dialog.getByLabel('Quantity').fill('1.0');
    await dialog.getByRole('button', { name: /add asset/i }).click();

    await expect(page.getByText(/Qty: 1/)).toBeVisible();

    await page
      .getByRole('button', { name: /Edit Bitcoin quantity/i })
      .last()
      .click({ force: true });
    const input = page.getByLabel(/Edit quantity for Bitcoin/i);
    await input.clear();
    await input.fill('-5');
    await page
      .getByRole('button', { name: /Save changes/i })
      .last()
      .click();

    await expect(
      page.getByText(/Quantity must be greater than zero/i)
    ).toBeVisible();

    const saveButton = page
      .getByRole('button', { name: /Save changes/i })
      .last();
    await expect(saveButton).toBeDisabled();
  });

  test('should display validation error for zero', async ({ page }) => {
    await page.getByRole('button', { name: /add asset/i }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await selectAsset(page, 'ETH');
    await dialog.getByLabel('Quantity').fill('1.0');
    await dialog.getByRole('button', { name: /add asset/i }).click();

    await expect(page.getByText(/Qty: 1/)).toBeVisible();

    await page
      .getByRole('button', { name: /Edit Ethereum quantity/i })
      .last()
      .click({ force: true });
    const input = page.getByLabel(/Edit quantity for Ethereum/i);
    await input.clear();
    await input.fill('0');
    await page
      .getByRole('button', { name: /Save changes/i })
      .last()
      .click();

    await expect(
      page.getByText(/Quantity must be greater than zero/i)
    ).toBeVisible();
  });

  test('should display validation error for too many decimals', async ({
    page,
  }) => {
    await page.getByRole('button', { name: /add asset/i }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await selectAsset(page, 'BTC');
    await dialog.getByLabel('Quantity').fill('1.0');
    await dialog.getByRole('button', { name: /add asset/i }).click();

    await expect(page.getByText(/Qty: 1/)).toBeVisible();

    await page
      .getByRole('button', { name: /Edit Bitcoin quantity/i })
      .last()
      .click({ force: true });
    const input = page.getByLabel(/Edit quantity for Bitcoin/i);
    await input.clear();
    await input.fill('1.123456789');
    await page
      .getByRole('button', { name: /Save changes/i })
      .last()
      .click();

    await expect(
      page.getByText(/Maximum 8 decimal places allowed/i)
    ).toBeVisible();
  });

  test('should persist edited quantity after page reload', async ({ page }) => {
    await page.getByRole('button', { name: /add asset/i }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await selectAsset(page, 'BTC');
    await dialog.getByLabel('Quantity').fill('1.0');
    await dialog.getByRole('button', { name: /add asset/i }).click();

    await expect(page.getByText(/Qty: 1/)).toBeVisible();

    await page
      .getByRole('button', { name: /Edit Bitcoin quantity/i })
      .last()
      .click({ force: true });
    const input = page.getByLabel(/Edit quantity for Bitcoin/i);
    await input.clear();
    await input.fill('7.5');
    await input.press('Enter');

    await expect(page.getByText(/Qty: 7.5/)).toBeVisible();

    await page.reload();
    await expect(page.getByText(/Your Assets/i)).toBeVisible();
    await expect(page.getByText(/Qty: 7.5/)).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    await page.getByRole('button', { name: /add asset/i }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await selectAsset(page, 'BTC');
    await dialog.getByLabel('Quantity').fill('1.0');
    await dialog.getByRole('button', { name: /add asset/i }).click();

    await expect(page.getByText(/Qty: 1/)).toBeVisible();

    const editButton = page
      .getByRole('button', { name: /Edit Bitcoin quantity/i })
      .last();
    await editButton.click({ force: true });

    const input = page.getByLabel(/Edit quantity for Bitcoin/i);
    await expect(input).toBeVisible();
    await input.fill('9.9');

    await page.keyboard.press('Tab');
    const saveButton = page
      .getByRole('button', { name: /Save changes/i })
      .last();
    await expect(saveButton).toBeVisible();
    await expect(saveButton).toBeEnabled();

    await page.keyboard.press('Tab');
    const cancelButton = page
      .getByRole('button', { name: /Cancel editing/i })
      .last();
    await expect(cancelButton).toBeVisible();
    await expect(cancelButton).toBeEnabled();
  });

  test('should disable delete button during edit mode', async ({ page }) => {
    await page.getByRole('button', { name: /add asset/i }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await selectAsset(page, 'BTC');
    await dialog.getByLabel('Quantity').fill('1.0');
    await dialog.getByRole('button', { name: /add asset/i }).click();

    await expect(page.getByText(/Qty: 1/)).toBeVisible();

    await page
      .getByRole('button', { name: /Edit Bitcoin quantity/i })
      .last()
      .click({ force: true });

    const deleteButton = page
      .getByRole('button', { name: /Delete Bitcoin/i })
      .last();
    await expect(deleteButton).toBeDisabled();
  });
});

test.describe('Edit Asset Quantity - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should have touch-friendly edit controls on mobile', async ({
    page,
  }) => {
    mockCoinGeckoMarkets(page);
    mockCoinGeckoChartData(page);
    mockCoinGeckoCoinDetails(page);
    await page.goto('/portfolio');
    await expect(page.getByText(/Your Assets/i)).toBeVisible();

    await page.getByRole('button', { name: /add asset/i }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await selectAsset(page, 'BTC');
    await dialog.getByLabel('Quantity').fill('1.0');
    await dialog.getByRole('button', { name: /add asset/i }).click();

    await expect(page.getByText(/Qty: 1/)).toBeVisible();

    const editButton = page
      .getByRole('button', { name: /Edit Bitcoin quantity/i })
      .last();
    const box = await editButton.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);

    await editButton.click({ force: true });

    const saveButton = page
      .getByRole('button', { name: /Save changes/i })
      .last();
    const saveBox = await saveButton.boundingBox();
    expect(saveBox).not.toBeNull();
    expect(saveBox!.width).toBeGreaterThanOrEqual(44);
    expect(saveBox!.height).toBeGreaterThanOrEqual(44);
  });
});
