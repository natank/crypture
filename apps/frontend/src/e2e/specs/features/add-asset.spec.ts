import { test, expect } from '@e2e/test-setup';

test.describe('Add Asset Modal Flow', () => {
  test.skip('should add a crypto asset and display it in the portfolio list', async ({
    page,
  }) => {
    // 1. Navigate to the app
    await page.goto('/');
    // 2. Click “➕ Add Asset” button
    await page.getByRole('button', { name: /add asset/i }).click();

    // 3. Wait for modal and select asset from custom dropdown
    await page.getByTestId('asset-select').click();
    await page.getByPlaceholder('Search assets...').fill('Bitcoin');
    await page.getByRole('option', { name: /Bitcoin \(BTC\)/i }).click();

    // 4. Fill in quantity
    await page.getByPlaceholder('0.5').fill('1.2');

    // 5. Click “Add Asset”
    await page
      .getByRole('dialog')
      .getByRole('button', { name: /add asset/i })
      .click();

    // 6. Confirm modal closes and asset appears
    await expect(page.getByText(/BTC \(Bitcoin\)/i)).toBeVisible();
    await expect(page.getByText(/Qty: 1.2/)).toBeVisible();
  });
});
