import { render, screen } from "@testing-library/react";
import PortfolioHeader from ".";

describe("PortfolioHeader", () => {
  it("renders with a total value", () => {
    render(<PortfolioHeader totalValue="12345.67" lastUpdatedAt={12333333} />);
    const valueDisplay = screen.getByTestId("total-value");

    expect(valueDisplay).toBeInTheDocument();
    expect(valueDisplay).toHaveTextContent(/\$12,346/);
  });

  it("renders fallback when no value is provided", () => {
    render(<PortfolioHeader />);

    const valueDisplay = screen.getByTestId("total-value");

    expect(valueDisplay).toBeInTheDocument();
    expect(valueDisplay).toHaveTextContent(/^💰\s*—$/);
  });

  it("renders last updated timestamp if provided", () => {
    const now = Date.now();
    render(<PortfolioHeader totalValue="9999" lastUpdatedAt={now} />);

    expect(screen.getByText(/Last updated:.*s ago/i)).toBeInTheDocument();
  });
});
