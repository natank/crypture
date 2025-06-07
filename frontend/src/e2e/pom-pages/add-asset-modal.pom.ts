import { Page, Locator } from "@playwright/test";

export class AddAssetModal {
  readonly page: Page;
  readonly modal: Locator;
  readonly assetSelect: Locator;
  readonly quantityInput: Locator;
  readonly confirmButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = page.getByRole("dialog", { name: /add crypto asset/i });

    this.assetSelect = this.modal.getByRole("combobox");
    this.quantityInput = this.modal.getByLabel(/quantity/i);
    this.confirmButton = this.modal.getByRole("button", { name: /add asset/i });
    this.cancelButton = this.modal.getByRole("button", { name: /cancel/i });
    this.errorMessage = this.modal.getByText(/invalid/i);
  }

  async openAndAdd(symbol: string, quantity: number) {
    await this.page.getByTestId("add-asset-button").click();

    // Attempt dropdown-based selection first
    try {
      const labelMap: Record<string, string> = {
        BTC: "Bitcoin (BTC)",
        ETH: "Ethereum (ETH)",
      };
      await this.assetSelect.selectOption({ label: labelMap[symbol] });
    } catch {
      // Re-query selector as a fallback input if dropdown failed
      const fallbackInput = this.page.locator("input[name='asset']");
      await fallbackInput.fill(symbol);
    }

    await this.quantityInput.fill(quantity.toString());
    await this.confirmButton.click();
  }

  async open() {
    await this.page.getByTestId("add-asset-button").click();
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
