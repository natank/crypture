import React from "react";
import { render, screen } from "@testing-library/react";
import AssetList from "@components/AssetList";
import { PortfolioAsset } from "@hooks/usePortfolioState";
import { vi } from "vitest";

// Mock useCoinContext
vi.mock("@context/useCoinContext", () => ({
  useCoinContext: () => ({
    getPriceBySymbol: (symbol: string) => {
      const prices: Record<string, number> = {
        btc: 30000,
        eth: 2000,
      };
      return prices[symbol.toLowerCase()];
    },
  }),
}));

const mockAssets: PortfolioAsset[] = [
  {
    coinInfo: {
      id: "btc",
      name: "Bitcoin",
      symbol: "btc",
      current_price: 0, // Ignored — we test price from context
    },
    quantity: 0.5,
  },
  {
    coinInfo: {
      id: "eth",
      name: "Ethereum",
      symbol: "eth",
      current_price: 0,
    },
    quantity: 1.2,
  },
];

describe("AssetList", () => {
  it("renders empty state when no assets", () => {
    render(
      <AssetList
        assets={[]}
        onDelete={() => {}}
        onAddAsset={vi.fn()}
        addButtonRef={React.createRef<HTMLButtonElement>()}
      />
    );
    expect(
      screen.getByText(/no assets yet\. add one to begin/i)
    ).toBeInTheDocument();
  });

  it("renders list of assets", () => {
    render(
      <AssetList
        assets={mockAssets}
        onDelete={() => {}}
        onAddAsset={vi.fn()}
        addButtonRef={React.createRef<HTMLButtonElement>()}
      />
    );
    expect(screen.getByText(/btc \(bitcoin\)/i)).toBeInTheDocument();
    expect(screen.getByText(/eth \(ethereum\)/i)).toBeInTheDocument();
  });

  it("calls delete handler when row button is clicked", () => {
    const handleDelete = vi.fn();
    render(
      <AssetList
        assets={mockAssets}
        onDelete={handleDelete}
        onAddAsset={vi.fn()}
        addButtonRef={React.createRef<HTMLButtonElement>()}
      />
    );
    screen.getByRole("button", { name: /delete btc/i }).click();
    expect(handleDelete).toHaveBeenCalledWith("btc");
  });

  it("renders correct price and total value for each asset", () => {
    render(
      <AssetList
        assets={mockAssets}
        onDelete={() => {}}
        onAddAsset={vi.fn()}
        addButtonRef={React.createRef<HTMLButtonElement>()}
      />
    );

    // BTC: 0.5 * 30,000 = 15,000
    expect(screen.getByText("Price: $30,000")).toBeInTheDocument();
    expect(screen.getByText("Total: $15,000")).toBeInTheDocument();

    // ETH: 1.2 * 2,000 = 2,400
    expect(screen.getByText("Price: $2,000")).toBeInTheDocument();
    expect(screen.getByText("Total: $2,400")).toBeInTheDocument();
  });
});
