import type { Locator, Page } from "@playwright/test";

export class PortfolioPage {
  readonly page: Page;

  // Header
  readonly header: Locator;

  // Top Action Controls
  readonly addAssetButton: Locator;
  readonly exportButton: Locator;
  readonly importButton: Locator;
  readonly filterInput: Locator;
  readonly sortDropdown: Locator;

  // Modal & Form
  readonly modal: Locator;
  readonly modalAssetSelect: Locator;
  readonly modalQuantityInput: Locator;
  readonly modalConfirmButton: Locator;
  readonly modalCancelButton: Locator;
  readonly modalErrorMessage: Locator;

  // Asset list
  readonly assetList: Locator;
  readonly assetItemBySymbol: (symbol: string) => Locator;
  readonly assetQuantityBySymbol: (symbol: string) => Locator;

  constructor(page: Page) {
    this.page = page;

    // General Layout
    this.header = page.getByText(/total portfolio value/i);

    // Action Buttons
    this.addAssetButton = page.getByTestId("add-asset-button");
    this.exportButton = page.getByTestId("export-button");
    this.importButton = page.getByTestId("import-button");

    // Filter/Sort Controls
    this.filterInput = page.getByPlaceholder("Search assets...");
    this.sortDropdown = page.getByTestId("sort-dropdown");

    // Modal Elements
    this.modal = page.getByRole("dialog");
    this.modalAssetSelect = this.modal.getByRole("combobox");
    this.modalQuantityInput = this.modal.getByLabel(/quantity/i);
    this.modalConfirmButton = this.modal.getByRole("button", {
      name: /add asset/i,
    });
    this.modalCancelButton = this.modal.getByRole("button", {
      name: /cancel/i,
    });
    this.modalErrorMessage = this.modal.getByText(/invalid/i);

    // Asset List
    this.assetList = page.locator("[data-testid='asset-list']");
    this.assetItemBySymbol = (symbol: string) =>
      page.getByText(new RegExp(`${symbol}\\s*\\(`, "i"));
    this.assetQuantityBySymbol = (symbol: string) =>
      page.getByText(new RegExp(`Qty:\\s*\\d+(\\.\\d+)?`, "i"));
  }

  // --------- Page Actions ---------

  async goto() {
    await this.page.goto("/");
  }

  async openAddAssetModal() {
    await this.addAssetButton.click();
  }

  async addAsset(symbol: string, quantity: number) {
    await this.openAddAssetModal();

    await this.modalAssetSelect.selectOption({ label: symbol });
    await this.modalQuantityInput.fill(quantity.toString());
    await this.modalConfirmButton.click();
  }

  async isModalVisible(): Promise<boolean> {
    return await this.modal.isVisible();
  }

  async openDeleteModalFor(symbol: string) {
    const deleteButton = this.page.getByLabel(`Delete ${symbol}`);
    await deleteButton.click();
  }

  assetRow(symbol: string) {
    return this.page.locator(
      `[data-testid="asset-row-${symbol.toUpperCase()}"]`
    );
  }
  // Method to sort assets by name
  async sortByName(order: "asc" | "desc") {
    await this.sortDropdown.selectOption(
      order === "asc" ? "name-asc" : "name-desc"
    );
  }

  // Method to sort assets by value
  async sortByValue(order: "asc" | "desc") {
    await this.sortDropdown.selectOption(
      order === "asc" ? "value-asc" : "value-desc"
    );
  }

  // Method to get asset names
  async getAssetNames(): Promise<string[]> {
    const assetNames = await this.assetList
      .locator(".asset-name")
      .allTextContents();
    return assetNames;
  }

  // Method to get asset values
  async getAssetValues(): Promise<number[]> {
    const assetValues = await this.assetList
      .locator(".asset-value")
      .evaluateAll((nodes) =>
        nodes.map((n) => parseFloat(n.textContent || "0"))
      );
    return assetValues;
  }

  // Method to filter assets by name
  async filterByName(partialName: string) {
    await this.filterInput.fill(partialName);
    await this.page.keyboard.press("Enter");
  }

  assetQuantity(symbol: string, expectedQty: number) {
    return this.page.locator(`text=Qty: ${expectedQty}`);
  }

  async reload() {
    await this.page.reload();
  }

  async isEmptyStateVisible() {
    return await this.page.locator("text=Your portfolio is empty.").isVisible();
  }
}
