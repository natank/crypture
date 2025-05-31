import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAddAssetForm } from "@hooks/useAddAssetForm";
import type { CoinInfo } from "@services/coinService";
import { PortfolioAsset } from "@hooks/usePortfolioState";

// 🧪 Mocks
let mockOnSubmit: (asset: PortfolioAsset) => void;
let mockOnClose: () => void;

const mockCoin: CoinInfo = {
  id: "bitcoin",
  symbol: "BTC",
  name: "Bitcoin",
};

beforeEach(() => {
  mockOnSubmit = vi.fn();
  mockOnClose = vi.fn();
});

describe("useAddAssetForm", () => {
  it("initializes with default state", () => {
    const { result } = renderHook(() =>
      useAddAssetForm(mockOnSubmit, mockOnClose)
    );

    expect(result.current.selectedCoin).toBeNull();
    expect(result.current.quantity).toBe("");
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("updates selectedCoin and quantity", () => {
    const { result } = renderHook(() =>
      useAddAssetForm(mockOnSubmit, mockOnClose)
    );

    act(() => {
      result.current.setSelectedCoin(mockCoin);
      result.current.setQuantity("2.5");
    });

    expect(result.current.selectedCoin).toEqual(mockCoin);
    expect(result.current.quantity).toBe("2.5");
  });

  it("sets error if validation fails (e.g. missing fields)", async () => {
    const { result } = renderHook(() =>
      useAddAssetForm(mockOnSubmit, mockOnClose)
    );

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.error).toMatch(/required/i);
    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("submits asset when input is valid", async () => {
    const { result } = renderHook(() =>
      useAddAssetForm(mockOnSubmit, mockOnClose)
    );

    // Set valid coin and quantity
    act(() => {
      result.current.setSelectedCoin({
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "BTC",
      });
      result.current.setQuantity("1.5");
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    // Validate the correct PortfolioAsset was submitted
    expect(mockOnSubmit).toHaveBeenCalledWith({
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      quantity: 1.5,
    });

    expect(mockOnClose).toHaveBeenCalled();
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("sets error if submission fails", async () => {
    const mockFailingSubmit = vi.fn().mockImplementation(() => {
      throw new Error("Simulated failure");
    });

    const mockCoin = {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
    };

    const { result } = renderHook(() =>
      useAddAssetForm(mockFailingSubmit, mockOnClose)
    );

    act(() => {
      result.current.setSelectedCoin(mockCoin);
      result.current.setQuantity("1");
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockFailingSubmit).toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
    expect(result.current.error).toMatch(/failed to add asset/i);
    expect(result.current.loading).toBe(false);
  });
});
