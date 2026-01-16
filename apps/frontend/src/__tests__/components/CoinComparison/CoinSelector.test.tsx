import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CoinSelector } from "@components/CoinComparison/CoinSelector";

const mockCoins = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", current_price: 50000 },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", current_price: 3000 },
  { id: "solana", name: "Solana", symbol: "SOL", current_price: 100 },
];

describe("CoinSelector", () => {
  it("renders search input", () => {
    render(
      <CoinSelector
        coins={mockCoins}
        onSelect={vi.fn()}
        excludeIds={[]}
      />
    );

    expect(screen.getByTestId("coin-selector-input")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search coins to add...")).toBeInTheDocument();
  });

  it("shows filtered results when typing", () => {
    render(
      <CoinSelector
        coins={mockCoins}
        onSelect={vi.fn()}
        excludeIds={[]}
      />
    );

    const input = screen.getByTestId("coin-selector-input");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "bit" } });

    expect(screen.getByTestId("coin-selector-results")).toBeInTheDocument();
    expect(screen.getByText("Bitcoin")).toBeInTheDocument();
    expect(screen.queryByText("Ethereum")).not.toBeInTheDocument();
  });

  it("filters by symbol as well as name", () => {
    render(
      <CoinSelector
        coins={mockCoins}
        onSelect={vi.fn()}
        excludeIds={[]}
      />
    );

    const input = screen.getByTestId("coin-selector-input");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "eth" } });

    expect(screen.getByText("Ethereum")).toBeInTheDocument();
  });

  it("excludes coins in excludeIds", () => {
    render(
      <CoinSelector
        coins={mockCoins}
        onSelect={vi.fn()}
        excludeIds={["bitcoin"]}
      />
    );

    const input = screen.getByTestId("coin-selector-input");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "b" } });

    // Bitcoin should be excluded, but Solana (has 'b' in symbol) should show
    expect(screen.queryByText("Bitcoin")).not.toBeInTheDocument();
  });

  it("calls onSelect when a coin is clicked", () => {
    const onSelect = vi.fn();

    render(
      <CoinSelector
        coins={mockCoins}
        onSelect={onSelect}
        excludeIds={[]}
      />
    );

    const input = screen.getByTestId("coin-selector-input");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "bitcoin" } });

    fireEvent.click(screen.getByText("Bitcoin"));

    expect(onSelect).toHaveBeenCalledWith(mockCoins[0]);
  });

  it("clears search and closes dropdown after selection", () => {
    render(
      <CoinSelector
        coins={mockCoins}
        onSelect={vi.fn()}
        excludeIds={[]}
      />
    );

    const input = screen.getByTestId("coin-selector-input");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "bitcoin" } });
    fireEvent.click(screen.getByText("Bitcoin"));

    expect(input).toHaveValue("");
    expect(screen.queryByTestId("coin-selector-results")).not.toBeInTheDocument();
  });

  it("shows 'No coins found' when no matches", () => {
    render(
      <CoinSelector
        coins={mockCoins}
        onSelect={vi.fn()}
        excludeIds={[]}
      />
    );

    const input = screen.getByTestId("coin-selector-input");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "xyz123" } });

    expect(screen.getByText("No coins found")).toBeInTheDocument();
  });

  it("disables input when disabled prop is true", () => {
    render(
      <CoinSelector
        coins={mockCoins}
        onSelect={vi.fn()}
        excludeIds={[]}
        disabled
      />
    );

    expect(screen.getByTestId("coin-selector-input")).toBeDisabled();
  });

  it("shows error message when error prop is provided", () => {
    render(
      <CoinSelector
        coins={mockCoins}
        onSelect={vi.fn()}
        excludeIds={[]}
        error="Failed to load coins"
      />
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Failed to load coins")).toBeInTheDocument();
    expect(screen.queryByTestId("coin-selector-input")).not.toBeInTheDocument();
  });

  it("closes dropdown on Escape key", () => {
    render(
      <CoinSelector
        coins={mockCoins}
        onSelect={vi.fn()}
        excludeIds={[]}
      />
    );

    const input = screen.getByTestId("coin-selector-input");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "bit" } });

    expect(screen.getByTestId("coin-selector-results")).toBeInTheDocument();

    fireEvent.keyDown(input, { key: "Escape" });

    expect(screen.queryByTestId("coin-selector-results")).not.toBeInTheDocument();
  });

  it("does not show dropdown when search is empty", () => {
    render(
      <CoinSelector
        coins={mockCoins}
        onSelect={vi.fn()}
        excludeIds={[]}
      />
    );

    const input = screen.getByTestId("coin-selector-input");
    fireEvent.focus(input);

    expect(screen.queryByTestId("coin-selector-results")).not.toBeInTheDocument();
  });

  it("limits results to 10 items", () => {
    const manyCoins = Array.from({ length: 20 }, (_, i) => ({
      id: `coin-${i}`,
      name: `Coin ${i}`,
      symbol: `C${i}`,
      current_price: i * 100,
    }));

    render(
      <CoinSelector
        coins={manyCoins}
        onSelect={vi.fn()}
        excludeIds={[]}
      />
    );

    const input = screen.getByTestId("coin-selector-input");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "coin" } });

    const buttons = screen.getAllByRole("option");
    expect(buttons).toHaveLength(10);
  });
});
