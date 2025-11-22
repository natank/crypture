import type { Locator, Page } from "@playwright/test";

export class MarketPage {
    readonly page: Page;

    // Header & Controls
    readonly header: Locator;
    readonly refreshButton: Locator;
    readonly lastUpdatedText: Locator;
    readonly loadingIndicator: Locator;
    readonly errorBanner: Locator;
    readonly retryButton: Locator;

    // Metrics
    readonly totalMarketCap: Locator;
    readonly totalVolume: Locator;
    readonly btcDominance: Locator;
    readonly ethDominance: Locator;
    readonly activeCryptos: Locator;
    readonly activeMarkets: Locator;

    constructor(page: Page) {
        this.page = page;

        // Header & Controls
        this.header = page.getByRole("heading", { name: /market overview/i });
        this.refreshButton = page.getByRole("button", { name: /refresh/i });
        this.lastUpdatedText = page.getByText(/last updated/i);
        this.loadingIndicator = page.getByTestId("market-loading");
        this.errorBanner = page.getByRole("alert");
        this.retryButton = page.getByRole("button", { name: /retry/i });

        // Metrics - Using test IDs for stability as these are specific data points
        this.totalMarketCap = page.getByTestId("metric-total-market-cap");
        this.totalVolume = page.getByTestId("metric-total-volume");
        this.btcDominance = page.getByTestId("metric-btc-dominance");
        this.ethDominance = page.getByTestId("metric-eth-dominance");
        this.activeCryptos = page.getByTestId("metric-active-cryptos");
        this.activeMarkets = page.getByTestId("metric-active-markets");
    }

    async goto() {
        await this.page.goto("/market");
    }

    async refreshData() {
        await this.refreshButton.click();
    }

    async clickRetry() {
        await this.retryButton.click();
    }

    async getMetricValue(metric: Locator): Promise<string> {
        return await metric.locator('[data-testid="metric-value"]').textContent() || "";
    }

    async getMetricChange(metric: Locator): Promise<string> {
        return await metric.locator('[data-testid="metric-change"]').textContent() || "";
    }

    // Helper to check if all metrics are visible
    async areAllMetricsVisible(): Promise<boolean> {
        return await Promise.all([
            this.totalMarketCap.isVisible(),
            this.totalVolume.isVisible(),
            this.btcDominance.isVisible(),
            this.ethDominance.isVisible(),
            this.activeCryptos.isVisible(),
            this.activeMarkets.isVisible()
        ]).then(results => results.every(Boolean));
    }
}
