import { renderHook, act } from "@testing-library/react";
import { usePortfolio } from "../../src/hooks/usePortfolio";
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
    const { result } = renderHook(() => usePortfolio());
    expect(result.current.portfolio).toEqual([]);
  });

  it("adds a new asset", () => {
    const { result } = renderHook(() => usePortfolio());
    act(() => {
      result.current.addAsset(btc);
    });
    expect(result.current.portfolio).toEqual([btc]);
  });

  it("merges quantity for duplicate asset", () => {
    const { result } = renderHook(() => usePortfolio());

    act(() => {
      result.current.addAsset({ ...btc, quantity: 1 });
      result.current.addAsset({ ...btc, quantity: 2 });
    });

    expect(result.current.portfolio).toEqual([{ ...btc, quantity: 3 }]);
  });

  it("adds multiple distinct assets", () => {
    const { result } = renderHook(() => usePortfolio());

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
    const { result } = renderHook(() => usePortfolio());

    act(() => {
      result.current.addAsset(btc);
      result.current.addAsset(eth);
      result.current.removeAsset("bitcoin");
    });

    expect(result.current.portfolio).toEqual([eth]);
  });

  it("resets the portfolio", () => {
    const { result } = renderHook(() => usePortfolio());

    act(() => {
      result.current.addAsset(btc);
      result.current.addAsset(eth);
      result.current.resetPortfolio();
    });

    expect(result.current.portfolio).toEqual([]);
  });
});
