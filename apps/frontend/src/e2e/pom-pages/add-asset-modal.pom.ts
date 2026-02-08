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

    // Open custom dropdown and select asset by symbol
    await this.assetTrigger.click();
    await this.filterInput.fill(symbol);
    const labelMap: Record<string, string> = {
      BTC: 'Bitcoin (BTC)',
      ETH: 'Ethereum (ETH)',
    };
    const optionLabel = labelMap[symbol] ?? symbol;
    await this.modal
      .getByRole('option', { name: new RegExp(optionLabel, 'i') })
      .click();

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
