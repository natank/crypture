import { render, screen } from "@testing-library/react";
import PortfolioHeader from ".";

describe("PortfolioHeader", () => {
  it("renders with a total value", () => {
    render(<PortfolioHeader totalValue="12345.67" lastUpdatedAt={12333333} />);
    const [valueDisplay] = screen.getAllByText(
      (_, el) =>
        el?.textContent?.includes("💰 Total Portfolio Value: $12,346") || false
    );
    expect(valueDisplay).toBeInTheDocument();
  });

  it("renders fallback when no value is provided", () => {
    render(<PortfolioHeader />);

    expect(screen.getByTestId("total-value")).toHaveTextContent(
      "💰 Total Portfolio Value: —"
    );
  });

  it("renders last updated timestamp if provided", () => {
    const now = Date.now();
    render(<PortfolioHeader totalValue="9999" lastUpdatedAt={now} />);

    expect(screen.getByText(/Last updated:.*s ago/i)).toBeInTheDocument();
  });
});
