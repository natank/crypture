import { render, screen, fireEvent } from "@testing-library/react";
import AssetList from ".";
import type { PortfolioAsset } from "@hooks/usePortfolio";

const mockAssets: PortfolioAsset[] = [
  { id: "btc", name: "Bitcoin", symbol: "btc", quantity: 0.5 },
  { id: "eth", name: "Ethereum", symbol: "eth", quantity: 1.2 },
];

describe("AssetList", () => {
  it("renders empty state when no assets", () => {
    render(<AssetList assets={[]} onDelete={() => {}} />);
    expect(
      screen.getByText(/no assets yet\. add one to begin/i)
    ).toBeInTheDocument();
  });

  it("renders list of assets", () => {
    render(<AssetList assets={mockAssets} onDelete={() => {}} />);
    expect(screen.getByText(/btc \(bitcoin\)/i)).toBeInTheDocument();
    expect(screen.getByText(/eth \(ethereum\)/i)).toBeInTheDocument();
  });

  it("calls delete handler when row button is clicked", () => {
    const handleDelete = vi.fn();
    render(<AssetList assets={mockAssets} onDelete={handleDelete} />);
    fireEvent.click(screen.getByRole("button", { name: /delete btc/i }));
    expect(handleDelete).toHaveBeenCalledWith("btc");
  });
});
