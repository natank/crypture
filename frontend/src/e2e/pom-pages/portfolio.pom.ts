import type { Locator, Page } from "@playwright/test";

export class PortfolioPage {
  readonly page: Page;

  // Header
  readonly header: Locator;

  // Top Action Controls
  readonly addAssetButton: Locator;
  readonly exportButton: Locator;
  readonly importButton: Locator;
  readonly exportFormatSelect: Locator;
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

  // Chart
  readonly chartContainerBySymbol: (symbol: string) => Locator;
  readonly timeRangeButtonByDays: (symbol: string, days: number) => Locator;

  constructor(page: Page) {
    this.page = page;

    // General Layout
    this.header = page.getByText(/total portfolio value/i);

    // Action Buttons
    this.addAssetButton = page.getByTestId("add-asset-button");
    this.exportButton = page.getByTestId("export-button");
    this.importButton = page.getByTestId("import-button");
    this.exportFormatSelect = page.getByLabel(/select file format/i);

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
      this.assetRow(symbol).getByText(new RegExp(`Qty:\\s*\\d+(\\.\\d+)?`, "i"));

    // Chart
    this.chartContainerBySymbol = (symbol: string) =>
      page.locator(`[data-testid='asset-chart-container-${symbol.toUpperCase()}']`);
    this.timeRangeButtonByDays = (symbol: string, days: number) =>
      this.chartContainerBySymbol(symbol).getByTestId(`time-range-button-${days}`);
    this.chartBySymbol = (symbol: string) =>
      this.chartContainerBySymbol(symbol).locator("canvas");
    this.chartLegendBySymbol = (symbol: string) =>
      this.chartContainerBySymbol(symbol).locator("[data-testid='chart-legend']");
    this.chartLegendItemBySymbolAndLabel = (symbol: string, label: string) =>
      this.chartLegendBySymbol(symbol).locator(`text=${label}`);
  }

  // --------- Page Actions ---------

  async goto() {
    await this.page.goto("/");
  }

  async openAddAssetModal() {
    await this.addAssetButton.click();
  }

  async selectExportFormat(label: "CSV" | "JSON") {
    const value = label.toLowerCase();
    await this.exportFormatSelect.selectOption(value);
  }

  async clickExportButton() {
    await this.exportButton.click();
  }

  async addAsset(symbol: string, quantity: number) {
    await this.openAddAssetModal();

    // First try selecting by option value which is CoinGecko coin.id
    const idMap: Record<string, string> = { BTC: "bitcoin", ETH: "ethereum" };
    const labelMap: Record<string, string> = {
      BTC: "Bitcoin (BTC)",
      ETH: "Ethereum (ETH)",
    };

    const regex = new RegExp(`\\(${symbol}\\)`, "i");

    try {
      const value = idMap[symbol] ?? symbol.toLowerCase();
      await this.modalAssetSelect.selectOption({ value });
    } catch {
      try {
        // Fallback to exact label
        await this.modalAssetSelect.selectOption({ label: labelMap[symbol] ?? symbol });
      } catch {
        // Final fallback: find option containing (SYMBOL) and select by its value
        const option = this.modalAssetSelect
          .locator("option")
          .filter({ hasText: regex });
        const valueAttr = await option.first().getAttribute("value");
        if (!valueAttr) throw new Error(`No option found for symbol ${symbol}`);
        await this.modalAssetSelect.selectOption(valueAttr);
      }
    }
    await this.modalQuantityInput.fill(quantity.toString());
    await this.modalConfirmButton.click();
  }

  async isModalVisible(): Promise<boolean> {
    return await this.modal.isVisible();
  }

  async toggleChart(symbol: string) {
    await this.assetRow(symbol).click();
  }

  async isChartVisible(symbol: string): Promise<boolean> {
    return await this.chartContainerBySymbol(symbol).isVisible();
  }

  async selectTimeRange(symbol: string, days: 7 | 30 | 365) {
    await this.timeRangeButtonByDays(symbol, days).click();
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
    return this.assetRow(symbol).locator(`text=Qty: ${expectedQty}`);
  }

  async reload() {
    await this.page.reload();
  }

  emptyState() {
    // Prefer stable test id for empty state
    return this.page.getByTestId("empty-state");
  }

  async isEmptyStateVisible() {
    // Match current empty state copy and be tolerant to future tweaks
    const emptyState = this.page.getByText(
      /No assets yet\.|No assets yet|Your portfolio is empty\./i
    );
    return await emptyState.isVisible();
  }
}
