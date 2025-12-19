import type { Locator, Page } from "@playwright/test";

export class ComparisonPage {
    readonly page: Page;

    // Header & Navigation
    readonly header: Locator;
    readonly backButton: Locator;

    // Coin Selection
    readonly coinSelectorInput: Locator;
    readonly coinSelectorResults: Locator;
    readonly selectedCoinsBar: Locator;
    readonly emptyState: Locator;

    // Comparison Table
    readonly comparisonTable: Locator;
    readonly comparisonTableLoading: Locator;

    // Comparison Chart
    readonly comparisonChart: Locator;
    readonly comparisonChartLoading: Locator;
    readonly timeRangeButtons: Locator;

    // Error Display
    readonly errorAlert: Locator;

    constructor(page: Page) {
        this.page = page;

        // Header & Navigation
        this.header = page.getByRole("heading", { name: /compare coins/i });
        this.backButton = page.getByTestId("comparison-back");

        // Coin Selection
        this.coinSelectorInput = page.getByTestId("coin-selector-input");
        this.coinSelectorResults = page.getByTestId("coin-selector-results");
        this.selectedCoinsBar = page.getByTestId("selected-coins-bar");
        this.emptyState = page.getByTestId("comparison-empty");

        // Comparison Table
        this.comparisonTable = page.getByTestId("comparison-table");
        this.comparisonTableLoading = page.getByTestId("comparison-table-loading");

        // Comparison Chart
        this.comparisonChart = page.getByTestId("comparison-chart");
        this.comparisonChartLoading = page.getByTestId("comparison-chart-loading");
        this.timeRangeButtons = page.getByRole("group", { name: /time range selection/i });

        // Error Display
        this.errorAlert = page.getByRole("alert");
    }

    async goto() {
        await this.page.goto("/compare");
    }

    async gotoWithCoin(coinId: string) {
        await this.page.goto(`/compare?coin=${coinId}`);
    }

    async searchCoin(query: string) {
        await this.coinSelectorInput.fill(query);
    }

    async selectCoinFromResults(coinName: string) {
        await this.coinSelectorResults.getByText(coinName).click();
    }

    async removeCoin(coinId: string) {
        await this.page.getByTestId(`remove-coin-${coinId}`).click();
    }

    async selectTimeRange(range: string) {
        await this.timeRangeButtons.getByText(range).click();
    }

    async getSelectedCoinCount(): Promise<number> {
        const bar = await this.selectedCoinsBar.isVisible();
        if (!bar) return 0;
        const items = await this.selectedCoinsBar.locator('[role="listitem"]').count();
        return items;
    }

    async isTimeRangeSelected(range: string): Promise<boolean> {
        const button = this.timeRangeButtons.getByText(range);
        const pressed = await button.getAttribute("aria-pressed");
        return pressed === "true";
    }

    async getTableMetricValue(metricLabel: string, coinIndex: number): Promise<string> {
        const row = this.comparisonTable.locator("tr", { hasText: metricLabel });
        const cells = row.locator("td");
        // First cell is the label, subsequent cells are coin values
        return await cells.nth(coinIndex + 1).textContent() || "";
    }
}
