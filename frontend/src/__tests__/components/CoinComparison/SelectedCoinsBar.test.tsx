import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SelectedCoinsBar } from "@components/CoinComparison/SelectedCoinsBar";

const mockCoins = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", image: "https://example.com/btc.png" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", image: "https://example.com/eth.png" },
];

describe("SelectedCoinsBar", () => {
  it("renders nothing when no coins are selected", () => {
    const { container } = render(
      <SelectedCoinsBar
        coins={[]}
        onRemove={vi.fn()}
        maxCoins={3}
        isLoading={new Set()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders selected coins with their names and symbols", () => {
    render(
      <SelectedCoinsBar
        coins={mockCoins}
        onRemove={vi.fn()}
        maxCoins={3}
        isLoading={new Set()}
      />
    );

    expect(screen.getByText("Bitcoin")).toBeInTheDocument();
    expect(screen.getByText("BTC")).toBeInTheDocument();
    expect(screen.getByText("Ethereum")).toBeInTheDocument();
    expect(screen.getByText("ETH")).toBeInTheDocument();
  });

  it("renders coin images when available", () => {
    render(
      <SelectedCoinsBar
        coins={mockCoins}
        onRemove={vi.fn()}
        maxCoins={3}
        isLoading={new Set()}
      />
    );

    // Images have aria-hidden="true" so they have role="presentation"
    const images = document.querySelectorAll("img");
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute("src", "https://example.com/btc.png");
    expect(images[1]).toHaveAttribute("src", "https://example.com/eth.png");
  });

  it("renders loading placeholder when coin is loading and has no image", () => {
    const coinsWithoutImage = [
      { id: "bitcoin", name: "Bitcoin", symbol: "BTC", image: "" },
    ];

    render(
      <SelectedCoinsBar
        coins={coinsWithoutImage}
        onRemove={vi.fn()}
        maxCoins={3}
        isLoading={new Set(["bitcoin"])}
      />
    );

    const loadingPlaceholder = document.querySelector(".animate-pulse");
    expect(loadingPlaceholder).toBeInTheDocument();
  });

  it("calls onRemove when remove button is clicked", () => {
    const onRemove = vi.fn();

    render(
      <SelectedCoinsBar
        coins={mockCoins}
        onRemove={onRemove}
        maxCoins={3}
        isLoading={new Set()}
      />
    );

    fireEvent.click(screen.getByTestId("remove-coin-bitcoin"));
    expect(onRemove).toHaveBeenCalledWith("bitcoin");

    fireEvent.click(screen.getByTestId("remove-coin-ethereum"));
    expect(onRemove).toHaveBeenCalledWith("ethereum");
  });

  it("shows available slots message when under max coins", () => {
    render(
      <SelectedCoinsBar
        coins={[mockCoins[0]]}
        onRemove={vi.fn()}
        maxCoins={3}
        isLoading={new Set()}
      />
    );

    expect(screen.getByText("2 more slots available")).toBeInTheDocument();
  });

  it("shows singular slot message when 1 slot remaining", () => {
    render(
      <SelectedCoinsBar
        coins={mockCoins}
        onRemove={vi.fn()}
        maxCoins={3}
        isLoading={new Set()}
      />
    );

    expect(screen.getByText("1 more slot available")).toBeInTheDocument();
  });

  it("does not show slots message when at max coins", () => {
    const threeCoins = [
      ...mockCoins,
      { id: "solana", name: "Solana", symbol: "SOL", image: "" },
    ];

    render(
      <SelectedCoinsBar
        coins={threeCoins}
        onRemove={vi.fn()}
        maxCoins={3}
        isLoading={new Set()}
      />
    );

    expect(screen.queryByText(/more slot/)).not.toBeInTheDocument();
  });

  it("has accessible remove button labels", () => {
    render(
      <SelectedCoinsBar
        coins={mockCoins}
        onRemove={vi.fn()}
        maxCoins={3}
        isLoading={new Set()}
      />
    );

    expect(
      screen.getByRole("button", { name: "Remove Bitcoin from comparison" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Remove Ethereum from comparison" })
    ).toBeInTheDocument();
  });
});
