import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AssetMetricsPanel from "./index";
import type { MarketCoin } from "../../types/market";

const mockMetrics: MarketCoin = {
  id: "bitcoin",
  symbol: "btc",
  name: "Bitcoin",
  image: "https://example.com/btc.png",
  current_price: 45000,
  market_cap: 850000000000,
  market_cap_rank: 1,
  price_change_percentage_24h: 2.5,
  total_volume: 25000000000,
  high_24h: 46000,
  low_24h: 44000,
  ath: 69000,
  ath_date: "2021-11-10T00:00:00.000Z",
  ath_change_percentage: -35,
  atl: 67.81,
  atl_date: "2013-07-06T00:00:00.000Z",
  atl_change_percentage: 66300,
  circulating_supply: 19500000,
  total_supply: 19500000,
  max_supply: 21000000,
};

describe("AssetMetricsPanel", () => {
  describe("Loading state", () => {
    it("renders loading skeleton when isLoading is true", () => {
      render(
        <AssetMetricsPanel metrics={null} isLoading={true} error={null} />
      );

      expect(screen.getByTestId("asset-metrics-loading")).toBeInTheDocument();
      expect(screen.getByLabelText("Loading asset metrics")).toBeInTheDocument();
    });
  });

  describe("Error state", () => {
    it("renders error message when error is provided", () => {
      render(
        <AssetMetricsPanel
          metrics={null}
          isLoading={false}
          error="Failed to fetch metrics"
        />
      );

      expect(screen.getByTestId("asset-metrics-error")).toBeInTheDocument();
      expect(screen.getByText(/Failed to fetch metrics/)).toBeInTheDocument();
    });
  });

  describe("Empty state", () => {
    it("renders empty message when metrics is null", () => {
      render(
        <AssetMetricsPanel metrics={null} isLoading={false} error={null} />
      );

      expect(screen.getByTestId("asset-metrics-empty")).toBeInTheDocument();
      expect(screen.getByText("No metrics available")).toBeInTheDocument();
    });
  });

  describe("Metrics display", () => {
    it("renders all three columns with correct headings", () => {
      render(
        <AssetMetricsPanel metrics={mockMetrics} isLoading={false} error={null} />
      );

      expect(screen.getByText("Price Extremes")).toBeInTheDocument();
      expect(screen.getByText("Market Position")).toBeInTheDocument();
      expect(screen.getByText("Supply Info")).toBeInTheDocument();
    });

    it("displays ATH information correctly", () => {
      render(
        <AssetMetricsPanel metrics={mockMetrics} isLoading={false} error={null} />
      );

      expect(screen.getByText("ATH:")).toBeInTheDocument();
      expect(screen.getByText("$69,000.00")).toBeInTheDocument();
      expect(screen.getByText("Nov 10, 2021")).toBeInTheDocument();
      expect(screen.getByText("-35.00% from ATH")).toBeInTheDocument();
    });

    it("displays ATL information correctly", () => {
      render(
        <AssetMetricsPanel metrics={mockMetrics} isLoading={false} error={null} />
      );

      expect(screen.getByText("ATL:")).toBeInTheDocument();
      expect(screen.getByText("$67.81")).toBeInTheDocument();
      expect(screen.getByText("Jul 6, 2013")).toBeInTheDocument();
    });

    it("displays market position metrics", () => {
      render(
        <AssetMetricsPanel metrics={mockMetrics} isLoading={false} error={null} />
      );

      expect(screen.getByText("Rank")).toBeInTheDocument();
      expect(screen.getByText("#1")).toBeInTheDocument();
      expect(screen.getByText("Market Cap")).toBeInTheDocument();
      expect(screen.getByText("$850.00B")).toBeInTheDocument();
      expect(screen.getByText("24h Volume")).toBeInTheDocument();
      expect(screen.getByText("$25.00B")).toBeInTheDocument();
    });

    it("displays supply metrics", () => {
      render(
        <AssetMetricsPanel metrics={mockMetrics} isLoading={false} error={null} />
      );

      expect(screen.getByText("Circulating")).toBeInTheDocument();
      // 19.50M appears twice (circulating and total supply are the same in mock)
      expect(screen.getAllByText("19.50M")).toHaveLength(2);
      expect(screen.getByText("Total Supply")).toBeInTheDocument();
      expect(screen.getByText("Max Supply")).toBeInTheDocument();
      expect(screen.getByText("21.00M")).toBeInTheDocument();
    });

    it("displays supply progress bar when max supply exists", () => {
      render(
        <AssetMetricsPanel metrics={mockMetrics} isLoading={false} error={null} />
      );

      expect(screen.getByText("Supply Progress")).toBeInTheDocument();
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
      expect(screen.getByText("92.9%")).toBeInTheDocument();
    });
  });

  describe("Visual indicators", () => {
    it("shows Near ATH badge when price is within 10% of ATH", () => {
      const nearATHMetrics = {
        ...mockMetrics,
        ath_change_percentage: -5, // 5% below ATH
      };

      render(
        <AssetMetricsPanel metrics={nearATHMetrics} isLoading={false} error={null} />
      );

      expect(screen.getByText("Near ATH")).toBeInTheDocument();
    });

    it("does not show Near ATH badge when price is more than 10% below ATH", () => {
      render(
        <AssetMetricsPanel metrics={mockMetrics} isLoading={false} error={null} />
      );

      expect(screen.queryByText("Near ATH")).not.toBeInTheDocument();
    });

    it("shows Near ATL badge when price is within 20% of ATL", () => {
      const nearATLMetrics = {
        ...mockMetrics,
        atl_change_percentage: 15, // 15% above ATL
      };

      render(
        <AssetMetricsPanel metrics={nearATLMetrics} isLoading={false} error={null} />
      );

      expect(screen.getByText("Near ATL")).toBeInTheDocument();
    });

    it("does not show Near ATL badge when price is more than 20% above ATL", () => {
      render(
        <AssetMetricsPanel metrics={mockMetrics} isLoading={false} error={null} />
      );

      expect(screen.queryByText("Near ATL")).not.toBeInTheDocument();
    });
  });

  describe("Handling missing data", () => {
    it("displays Unlimited when max_supply is null", () => {
      const noMaxSupplyMetrics = {
        ...mockMetrics,
        max_supply: null,
      };

      render(
        <AssetMetricsPanel metrics={noMaxSupplyMetrics} isLoading={false} error={null} />
      );

      expect(screen.getByText("Unlimited")).toBeInTheDocument();
    });

    it("displays N/A when total_supply is null", () => {
      const noTotalSupplyMetrics = {
        ...mockMetrics,
        total_supply: null,
      };

      render(
        <AssetMetricsPanel metrics={noTotalSupplyMetrics} isLoading={false} error={null} />
      );

      expect(screen.getByText("N/A")).toBeInTheDocument();
    });

    it("does not show supply progress bar when max_supply is null", () => {
      const noMaxSupplyMetrics = {
        ...mockMetrics,
        max_supply: null,
      };

      render(
        <AssetMetricsPanel metrics={noMaxSupplyMetrics} isLoading={false} error={null} />
      );

      expect(screen.queryByText("Supply Progress")).not.toBeInTheDocument();
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper region role and label", () => {
      render(
        <AssetMetricsPanel metrics={mockMetrics} isLoading={false} error={null} />
      );

      expect(screen.getByRole("region", { name: "Asset metrics" })).toBeInTheDocument();
    });

    it("has proper alert role for error state", () => {
      render(
        <AssetMetricsPanel
          metrics={null}
          isLoading={false}
          error="Test error"
        />
      );

      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("has proper aria-busy attribute during loading", () => {
      render(
        <AssetMetricsPanel metrics={null} isLoading={true} error={null} />
      );

      expect(screen.getByTestId("asset-metrics-loading")).toHaveAttribute(
        "aria-busy",
        "true"
      );
    });
  });
});
