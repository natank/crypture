import { usePortfolioState } from "@hooks/usePortfolioState";
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";

describe("usePortfolio", () => {
  const btc = {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    quantity: 1,
  };

  const eth = {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
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
});

describe("getAssetById", () => {
  it("returns the correct asset when given a valid ID", () => {
    const { result } = renderHook(() => usePortfolioState());

    act(() => {
      result.current.addAsset({
        id: "btc",
        symbol: "BTC",
        name: "Bitcoin",
        quantity: 1,
      });
      result.current.addAsset({
        id: "eth",
        symbol: "ETH",
        name: "Ethereum",
        quantity: 2,
      });
    });

    const btc = result.current.getAssetById("btc");
    const eth = result.current.getAssetById("eth");

    expect(btc?.name).toBe("Bitcoin");
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
        id: "btc",
        symbol: "BTC",
        name: "Bitcoin",
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
