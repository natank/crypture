import { render, screen } from "@testing-library/react";
import PortfolioHeader from ".";

describe("PortfolioHeader", () => {
  it("renders with a total value", () => {
    render(<PortfolioHeader totalValue="12345.67" />);
    expect(
      screen.getByText(/💰 Total Portfolio Value: \$12,346/i)
    ).toBeInTheDocument();
  });

  it("renders fallback when no value is provided", () => {
    render(<PortfolioHeader />);
    expect(
      screen.getByText(/💰 Total Portfolio Value: —/i)
    ).toBeInTheDocument();
  });
});
