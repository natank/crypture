import { Page, Locator } from '@playwright/test';

export class AddAssetModal {
  readonly page: Page;
  readonly modal: Locator;
  readonly assetTrigger: Locator;
  readonly filterInput: Locator;
  readonly quantityInput: Locator;
  readonly confirmButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = page.getByRole('dialog', { name: /add crypto asset/i });

    this.assetTrigger = this.modal.getByTestId('asset-select');
    this.filterInput = this.modal.getByPlaceholder('Search assets...');
    this.quantityInput = this.modal.getByLabel(/quantity/i);
    this.confirmButton = this.modal.getByRole('button', { name: /add asset/i });
    this.cancelButton = this.modal.getByRole('button', { name: /cancel/i });
    this.errorMessage = this.modal.getByText(/invalid/i);
  }

  async openAndAdd(symbol: string, quantity: number) {
    await this.page.getByTestId('add-asset-button').click();

    // Wait for the asset selector button to be visible
    await this.assetTrigger.waitFor({ state: 'visible', timeout: 10000 });

    // Click to open the dropdown
    await this.assetTrigger.click();

    // Wait for dropdown options to be visible
    const dropdownOptions = this.modal.locator('[role="option"]');
    await dropdownOptions.first().waitFor({ state: 'visible', timeout: 10000 });

    // Find and click the option containing the symbol
    const symbolOption = dropdownOptions
      .filter({ hasText: new RegExp(`\\(${symbol}\\)`, 'i') })
      .first();
    await symbolOption.waitFor({ state: 'visible', timeout: 5000 });
    await symbolOption.click();

    await this.quantityInput.fill(quantity.toString());
    await this.confirmButton.click();
  }

  async open() {
    await this.page.getByTestId('add-asset-button').click();
  }

  async isVisible(): Promise<boolean> {
    return this.modal.isVisible();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async hasError(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }
}
