import { render, screen, fireEvent } from "@testing-library/react";
import AssetRow from ".";
import type { PortfolioAsset } from "@hooks/useUIState";

const mockAsset: PortfolioAsset = {
  id: "btc",
  name: "Bitcoin",
  symbol: "btc",
  quantity: 0.5,
};

describe("AssetRow", () => {
  it("renders asset name and quantity", () => {
    render(<AssetRow asset={mockAsset} onDelete={() => {}} />);
    expect(screen.getByText(/btc \(bitcoin\)/i)).toBeInTheDocument();
    expect(screen.getByText(/qty: 0.5/i)).toBeInTheDocument();
  });

  it("fires delete handler on click", () => {
    const handleDelete = vi.fn();
    render(<AssetRow asset={mockAsset} onDelete={handleDelete} />);
    fireEvent.click(screen.getByRole("button", { name: /delete btc/i }));
    expect(handleDelete).toHaveBeenCalledWith("btc");
  });
});
