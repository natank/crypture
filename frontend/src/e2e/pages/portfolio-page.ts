import type { Locator, Page } from "@playwright/test";

export class PortfolioPage {
  readonly page: Page;
  readonly header: Locator;
  readonly addAssetButton: Locator;
  readonly exportButton: Locator;
  readonly importButton: Locator;
  readonly filterInput: Locator;
  readonly sortDropdown: Locator;
  readonly modal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByText(/total portfolio value/i);
    this.addAssetButton = page.getByRole("button", { name: /add asset/i });
    this.exportButton = page.getByRole("button", { name: /export/i });
    this.importButton = page.getByRole("button", { name: /import/i });
    this.filterInput = page.getByPlaceholder("Filter assets...");
    this.sortDropdown = page.getByLabel("Sort:");
    this.modal = page.getByRole("dialog");
  }

  async goto() {
    await this.page.goto("/");
  }

  async openAddAssetModal() {
    await this.addAssetButton.click();
  }

  async isModalVisible(): Promise<boolean> {
    return await this.modal.isVisible();
  }
}
