import { usePortfolioState } from "@hooks/usePortfolioState";
import { renderHook, act } from "@testing-library/react";
import { useState } from "react";
import { describe, it, expect } from "vitest";

describe("usePortfolio", () => {
  const btc = {
    coinInfo: {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      current_price: 2000,
    },
    quantity: 1,
  };

  const eth = {
    coinInfo: {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      current_price: 3000,
    },
    quantity: 2,
  };

  it("starts with an empty portfolio", () => {
    const { result } = renderHook(() => usePortfolioState());
    expect(result.current.portfolio).toEqual([]);
  });

  it("adds a new asset", () => {
    const { result } = renderHook(() => usePortfolioState());
    act(() => {
      result.current.addAsset(btc);
    });
    expect(result.current.portfolio).toEqual([btc]);
  });

  it("merges quantity for duplicate asset", () => {
    const { result } = renderHook(() => usePortfolioState());

    act(() => {
      result.current.addAsset({ ...btc, quantity: 1 });
      result.current.addAsset({ ...btc, quantity: 2 });
    });

    expect(result.current.portfolio).toEqual([{ ...btc, quantity: 3 }]);
  });

  it("adds multiple distinct assets", () => {
    const { result } = renderHook(() => usePortfolioState());

    act(() => {
      result.current.addAsset(btc);
      result.current.addAsset(eth);
    });

    expect(result.current.portfolio).toHaveLength(2);
    expect(result.current.portfolio).toEqual(
      expect.arrayContaining([btc, eth])
    );
  });

  it("removes an asset by ID", () => {
    const { result } = renderHook(() => usePortfolioState());

    act(() => {
      result.current.addAsset(btc);
      result.current.addAsset(eth);
      result.current.removeAsset("bitcoin");
    });

    expect(result.current.portfolio).toEqual([eth]);
  });

  it("resets the portfolio", () => {
    const { result } = renderHook(() => usePortfolioState());

    act(() => {
      result.current.addAsset(btc);
      result.current.addAsset(eth);
      result.current.resetPortfolio();
    });

    expect(result.current.portfolio).toEqual([]);
  });

  it("updates asset quantity", () => {
    const { result } = renderHook(() => usePortfolioState());

    act(() => {
      result.current.addAsset(btc);
      result.current.updateAssetQuantity("bitcoin", 5);
    });

    expect(result.current.portfolio).toEqual([{ ...btc, quantity: 5 }]);
  });

  it("does not mutate state when updating quantity", () => {
    const { result } = renderHook(() => usePortfolioState());

    act(() => {
      result.current.addAsset(btc);
      result.current.addAsset(eth);
    });

    const portfolioBefore = result.current.portfolio;

    act(() => {
      result.current.updateAssetQuantity("bitcoin", 3);
    });

    // Ensure immutability
    expect(result.current.portfolio).not.toBe(portfolioBefore);
    expect(result.current.portfolio[0].quantity).toBe(3);
    expect(result.current.portfolio[1]).toEqual(eth); // ETH unchanged
  });

  it("updates total value when quantity is updated", () => {
    const prices = { btc: 30000 };
    const { result } = renderHook(() => usePortfolioState(prices));

    act(() => {
      result.current.addAsset({
        coinInfo: {
          id: "bitcoin",
          name: "Bitcoin",
          symbol: "BTC",
          current_price: 30000,
        },
        quantity: 1,
      });
    });

    expect(result.current.totalValue).toBe(30000);

    act(() => {
      result.current.updateAssetQuantity("bitcoin", 2);
    });

    expect(result.current.totalValue).toBe(60000);
  });

  it("handles updating non-existent asset gracefully", () => {
    const { result } = renderHook(() => usePortfolioState());

    act(() => {
      result.current.addAsset(btc);
      result.current.updateAssetQuantity("nonexistent", 10);
    });

    // Portfolio should remain unchanged
    expect(result.current.portfolio).toEqual([btc]);
  });
});

describe("getAssetById", () => {
  it("returns the correct asset when given a valid ID", () => {
    const { result } = renderHook(() => usePortfolioState());

    act(() => {
      result.current.addAsset({
        coinInfo: {
          id: "btc",
          symbol: "BTC",
          name: "Bitcoin",
          current_price: 2000,
        },
        quantity: 1,
      });
      result.current.addAsset({
        coinInfo: {
          id: "eth",
          symbol: "ETH",
          name: "Ethereum",
          current_price: 2000,
        },
        quantity: 2,
      });
    });

    const btc = result.current.getAssetById("btc");
    const eth = result.current.getAssetById("eth");

    expect(btc?.coinInfo.name).toBe("Bitcoin");
    expect(eth?.quantity).toBe(2);
  });

  it("returns undefined for an unknown asset ID", () => {
    const { result } = renderHook(() => usePortfolioState());

    const asset = result.current.getAssetById("nonexistent-id");

    expect(asset).toBeUndefined();
  });

  it("reacts to portfolio changes (asset removed)", () => {
    const { result } = renderHook(() => usePortfolioState());

    act(() => {
      result.current.addAsset({
        coinInfo: {
          id: "btc",
          symbol: "BTC",
          name: "Bitcoin",
          current_price: 2000,
        },
        quantity: 1,
      });
    });

    const btcBefore = result.current.getAssetById("btc");
    expect(btcBefore).not.toBeUndefined();

    act(() => {
      result.current.removeAsset("btc");
    });

    const btcAfter = result.current.getAssetById("btc");
    expect(btcAfter).toBeUndefined();
  });
});

describe("usePortfolioState – totalValue", () => {
  test("calculates total value for a single asset with known price", () => {
    const prices = { btc: 30000 }; // Price per BTC

    const { result } = renderHook(() => usePortfolioState(prices));

    act(() => {
      result.current.addAsset({
        coinInfo: {
          id: "bitcoin",
          symbol: "BTC",
          name: "Bitcoin",
          current_price: 3000,
        },
        quantity: 0.5,
      });
    });

    expect(result.current.totalValue).toBe(15000);
  });

  test("calculates total value for multiple assets with different prices", () => {
    const prices = {
      btc: 30000,
      eth: 2000,
      sol: 100,
    };

    const { result } = renderHook(() => usePortfolioState(prices));

    act(() => {
      result.current.addAsset({
        coinInfo: {
          id: "bitcoin",
          symbol: "BTC",
          name: "Bitcoin",
          current_price: 3000,
        },
        quantity: 0.5,
      });
      result.current.addAsset({
        coinInfo: {
          id: "ethereum",
          symbol: "ETH",
          name: "Ethereum",
          current_price: 3000,
        },
        quantity: 2,
      });
      result.current.addAsset({
        coinInfo: {
          id: "solana",
          symbol: "SOL",
          name: "Solana",
          current_price: 3000,
        },
        quantity: 10,
      });
    });

    // Total = (0.5 * 30000) + (2 * 2000) + (10 * 100) = 15000 + 4000 + 1000 = 20000
    expect(result.current.totalValue).toBe(20000);
  });

  test("ignores assets with missing price when computing total value", () => {
    const mockPrices = {
      btc: 30000,
      eth: undefined, // missing price
      crd: null, // invalid price
    };

    const { result } = renderHook(() => usePortfolioState(mockPrices));

    act(() => {
      result.current.addAsset({
        coinInfo: {
          id: "bitcoin",
          name: "Bitcoin",
          symbol: "BTC",
          current_price: 3000,
        },
        quantity: 1,
      });
      result.current.addAsset({
        coinInfo: {
          id: "ethereum",
          name: "Ethereum",
          symbol: "ETH",
          current_price: 3000,
        },
        quantity: 2,
      });
      result.current.addAsset({
        coinInfo: {
          id: "cardano",
          name: "Cardano",
          symbol: "ADA",
          current_price: 3000,
        },
        quantity: 100,
      });
    });

    expect(result.current.totalValue).toBe(30000); // only bitcoin has a valid price
  });

  test("returns zero when portfolio is empty", () => {
    const { result } = renderHook(() => usePortfolioState());

    expect(result.current.portfolio).toEqual([]);
    expect(result.current.totalValue).toBe(0);
  });

  test("returns zero when all assets have missing prices", () => {
    const { result } = renderHook(() => usePortfolioState({}));

    act(() => {
      result.current.addAsset({
        coinInfo: {
          id: "bitcoin",
          symbol: "BTC",
          name: "Bitcoin",
          current_price: 3000,
        },
        quantity: 1,
      });
      result.current.addAsset({
        coinInfo: {
          id: "ethereum",
          symbol: "ETH",
          name: "Ethereum",
          current_price: 3000,
        },
        quantity: 2,
      });
    });

    expect(result.current.totalValue).toBe(0);
  });

  test("updates total value when asset quantity changes", () => {
    const prices = { btc: 30000 };

    const { result } = renderHook(() => usePortfolioState(prices));

    act(() => {
      result.current.addAsset({
        coinInfo: {
          id: "bitcoin",
          name: "Bitcoin",
          symbol: "BTC",
          current_price: 3000,
        },
        quantity: 0.5,
      });
    });

    expect(result.current.totalValue).toBe(15000);

    act(() => {
      result.current.addAsset({
        coinInfo: {
          id: "bitcoin",
          name: "Bitcoin",
          symbol: "BTC",
          current_price: 3000,
        },
        quantity: 0.25,
      });
    });

    // New total: (0.5 + 0.25) * 30000 = 22500
    expect(result.current.totalValue).toBe(22500);
  });

  test("updates total value when price map changes", () => {
    // Wrapper to simulate reactivity to external price changes
    const useTestWrapper = () => {
      const [prices, setPrices] = useState<Record<string, number | undefined>>({
        btc: 30000,
      });
      const portfolioState = usePortfolioState(prices);
      return { ...portfolioState, setPrices };
    };

    const { result } = renderHook(() => useTestWrapper());

    // Add 1 BTC
    act(() => {
      result.current.addAsset({
        coinInfo: {
          id: "bitcoin",
          symbol: "BTC",
          name: "Bitcoin",
          current_price: 3000,
        },
        quantity: 1,
      });
    });

    // Initial total: 1 * 30000 = 30000
    expect(result.current.totalValue).toBe(30000);

    // Update price to 35000
    act(() => {
      result.current.setPrices({ btc: 35000 });
    });

    // Expect new total value: 1 * 35000 = 35000
    expect(result.current.totalValue).toBe(35000);
  });
});
