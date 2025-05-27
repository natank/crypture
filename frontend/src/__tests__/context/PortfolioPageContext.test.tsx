import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  usePortfolioContext,
  PortfolioPageContext,
} from "@context/usePortfolioContext";
import PortfolioPageProvider from "@context/PortfolioPageProvider";

// Mock values to inject into the context
const mockContextValue = {
  portfolio: [{ id: "btc", name: "Bitcoin", symbol: "BTC", quantity: 1 }],
  addAsset: vi.fn(),
  removeAsset: vi.fn(),
  resetPortfolio: vi.fn(),
};

// Consumer test component
function ConsumerComponent() {
  const context = usePortfolioContext();
  return (
    <>
      <div data-testid="asset-name">{context.portfolio[0].name}</div>
      <button onClick={() => context.removeAsset("btc")}>Delete BTC</button>
    </>
  );
}

describe("PortfolioPageContext", () => {
  it("throws error if used outside provider", () => {
    expect(() => render(<ConsumerComponent />)).toThrowError(
      /usePortfolioContext must be used within a PortfolioPageProvider/
    );
  });

  it("provides context correctly when wrapped in provider", () => {
    render(
      <PortfolioPageContext.Provider value={mockContextValue}>
        <ConsumerComponent />
      </PortfolioPageContext.Provider>
    );

    expect(screen.getByTestId("asset-name")).toHaveTextContent("Bitcoin");
  });

  it("calls removeAsset from context", () => {
    render(
      <PortfolioPageContext.Provider value={mockContextValue}>
        <ConsumerComponent />
      </PortfolioPageContext.Provider>
    );

    screen.getByText("Delete BTC").click();
    expect(mockContextValue.removeAsset).toHaveBeenCalledWith("btc");
  });

  it("renders children inside PortfolioPageProvider", () => {
    render(
      <PortfolioPageProvider>
        <div data-testid="child">Hello Context</div>
      </PortfolioPageProvider>
    );
    expect(screen.getByTestId("child")).toHaveTextContent("Hello Context");
  });
});
