// __tests__/useCoinContext.test.tsx
import { renderHook } from "@testing-library/react";
import { useCoinContext } from "@context/useCoinContext";
import { CoinContext } from "@context/CoinContext";

const mockContext = {
  coins: [],
  loading: false,
  error: null,
  search: "",
  setSearch: vi.fn(),
  originalCoins: [],
  priceMap: {
    btc: 30000,
    eth: 2000,
  },
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CoinContext.Provider value={mockContext}>{children}</CoinContext.Provider>
);

describe("useCoinContext", () => {
  it("returns price by symbol (case-insensitive)", () => {
    const { result } = renderHook(() => useCoinContext(), { wrapper });

    expect(result.current.getPriceBySymbol("BTC")).toBe(30000);
    expect(result.current.getPriceBySymbol("eth")).toBe(2000);
    expect(result.current.getPriceBySymbol("xrp")).toBeUndefined();
  });

  it("throws error if used outside provider", () => {
    try {
      renderHook(() => useCoinContext()); // no wrapper
      throw new Error("Expected useCoinContext to throw, but it did not.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        expect(err.message).toMatch(/must be used within a <CoinProvider>/);
      } else {
        throw new Error("Caught non-Error exception");
      }
    }
  });
});
