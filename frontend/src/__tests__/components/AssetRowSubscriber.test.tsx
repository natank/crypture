import React from "react";
import { render } from "@testing-library/react";
import AssetRowSubscriber from "@components/AssetRow/AssetRowSubscriber";
import { PortfolioPageContext } from "@context/usePortfolioContext";
import type { PortfolioAsset } from "@hooks/usePortfolio";

// Mock AssetRow component
vi.mock("@components/AssetRow", () => ({
  __esModule: true,
  default: vi.fn(() => <div data-testid="mock-asset-row" />),
}));

import AssetRow from "@components/AssetRow"; // Must be after vi.mock

const mockAsset: PortfolioAsset = {
  id: "btc",
  name: "Bitcoin",
  symbol: "btc",
  quantity: 0.5,
};

const mockContext = {
  portfolio: [mockAsset],
  addAsset: vi.fn(),
  removeAsset: vi.fn(),
  resetPortfolio: vi.fn(),
};

function renderWithContext(ui: React.ReactElement, context = mockContext) {
  return render(
    <PortfolioPageContext.Provider value={context}>
      {ui}
    </PortfolioPageContext.Provider>
  );
}

describe("AssetRowSubscriber", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("passes correct asset and onDelete to AssetRow", () => {
    renderWithContext(<AssetRowSubscriber assetId="btc" />);

    expect(AssetRow).toHaveBeenCalledTimes(1);
    expect(vi.mocked(AssetRow).mock.calls[0][0]).toEqual({
      asset: mockAsset,
      onDelete: mockContext.removeAsset,
    });
  });

  it("renders nothing if asset not found", () => {
    const { queryByTestId } = renderWithContext(
      <AssetRowSubscriber assetId="eth" />
    );
    expect(queryByTestId("mock-asset-row")).not.toBeInTheDocument();
  });
});
