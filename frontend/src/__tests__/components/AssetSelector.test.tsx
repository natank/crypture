import React from "react";

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AssetSelector } from "@components/AssetSelector";
import * as useCoinSearchModule from "@hooks/useCoinSearch";

const mockCoins = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
];

describe("AssetSelector", () => {
  beforeEach(() => {
    vi.spyOn(useCoinSearchModule, "useCoinSearch").mockReturnValue({
      coins: mockCoins,
      originalCoins: mockCoins,
      search: "",
      setSearch: vi.fn(),
      loading: false,
      error: null,
    });
  });

  it("renders dropdown options", () => {
    render(<AssetSelector onSelect={vi.fn()} />);
    expect(screen.getByText("Select a crypto asset")).toBeInTheDocument();
    expect(screen.getByText("Bitcoin (BTC)")).toBeInTheDocument();
    expect(screen.getByText("Ethereum (ETH)")).toBeInTheDocument();
  });

  it("calls onSelect when asset is selected", () => {
    const onSelect = vi.fn();
    render(<AssetSelector onSelect={onSelect} />);

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "ethereum" },
    });

    expect(onSelect).toHaveBeenCalledWith(mockCoins[1]);
  });

  it("disables UI when `disabled` is true", () => {
    render(<AssetSelector onSelect={vi.fn()} disabled={true} />);
    expect(screen.getByRole("combobox")).toBeDisabled();
    expect(screen.getByPlaceholderText("Search assets...")).toBeDisabled();
  });

  it("shows loading state", () => {
    vi.spyOn(useCoinSearchModule, "useCoinSearch").mockReturnValueOnce({
      coins: [],
      originalCoins: [],
      search: "",
      setSearch: vi.fn(),
      loading: true,
      error: null,
    });

    render(<AssetSelector onSelect={vi.fn()} />);
    expect(screen.getByText("Loading assets...")).toBeInTheDocument();
  });

  it("shows error message", () => {
    vi.spyOn(useCoinSearchModule, "useCoinSearch").mockReturnValueOnce({
      coins: [],
      originalCoins: [],
      search: "",
      setSearch: vi.fn(),
      loading: false,
      error: "API error",
    });

    render(<AssetSelector onSelect={vi.fn()} />);
    expect(screen.getByText("⚠️ API error")).toBeInTheDocument();
  });
});
