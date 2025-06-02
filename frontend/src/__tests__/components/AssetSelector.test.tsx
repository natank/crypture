import React from "react";

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AssetSelector } from "@components/AssetSelector";
import { CoinContext, CoinContextType } from "@context/CoinContext";

const mockCoins = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", current_price: 2000 },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", current_price: 2000 },
];
const mockBaseContext: CoinContextType = {
  coins: mockCoins,
  originalCoins: mockCoins,
  search: "",
  setSearch: vi.fn(),
  loading: false,
  error: null,
  priceMap: {
    bitcoin: 30000,
    ethereum: 2000,
  },
};
describe("AssetSelector", () => {
  it("renders dropdown options", () => {
    render(
      <CoinContext.Provider value={mockBaseContext}>
        <AssetSelector onSelect={vi.fn()} />
      </CoinContext.Provider>
    );
    expect(screen.getByText("Select a crypto asset")).toBeInTheDocument();
    expect(screen.getByText("Bitcoin (BTC)")).toBeInTheDocument();
    expect(screen.getByText("Ethereum (ETH)")).toBeInTheDocument();
  });

  it("calls onSelect when asset is selected", () => {
    const onSelect = vi.fn();
    render(
      <CoinContext.Provider value={mockBaseContext}>
        <AssetSelector onSelect={onSelect} />
      </CoinContext.Provider>
    );

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "ethereum" },
    });

    expect(onSelect).toHaveBeenCalledWith(mockCoins[1]);
  });

  it("disables UI when `disabled` is true", () => {
    render(
      <CoinContext.Provider value={mockBaseContext}>
        <AssetSelector onSelect={vi.fn()} disabled={true} />
      </CoinContext.Provider>
    );
    expect(screen.getByRole("combobox")).toBeDisabled();
    expect(screen.getByPlaceholderText("Search assets...")).toBeDisabled();
  });

  it("shows loading state", () => {
    const loadingContext: CoinContextType = {
      ...mockBaseContext,
      loading: true,
    };

    render(
      <CoinContext.Provider value={loadingContext}>
        <AssetSelector onSelect={vi.fn()} />
      </CoinContext.Provider>
    );

    expect(screen.getByText("Loading assets...")).toBeInTheDocument();
  });

  it("shows error message", () => {
    const errorContext: CoinContextType = {
      ...mockBaseContext,
      error: "API error",
    };

    render(
      <CoinContext.Provider value={errorContext}>
        <AssetSelector onSelect={vi.fn()} />
      </CoinContext.Provider>
    );

    expect(screen.getByText("⚠️ API error")).toBeInTheDocument();
  });
});
