import { render, screen } from "@testing-library/react";
import PortfolioPage from "./PortfolioPage";
import { describe, it, expect } from "vitest";

vi.mock("@hooks/usePortfolio", () => ({
  usePortfolio: () => ({
    portfolio: [
      {
        id: "btc",
        name: "Bitcoin",
        symbol: "btc",
        quantity: 0.5,
      },
    ],
    addAsset: vi.fn(),
  }),
}));
describe("PortfolioPage", () => {
  it("renders without crashing", () => {
    render(<PortfolioPage />);
    expect(screen.getByText(/total portfolio value/i)).toBeInTheDocument();
  });

  it("shows the Add, Export, and Import buttons", () => {
    render(<PortfolioPage />);
    expect(
      screen.getByRole("button", { name: /add asset/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /export/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /import/i })).toBeInTheDocument();
  });

  it("displays the filter input and sort dropdown", () => {
    render(<PortfolioPage />);
    expect(screen.getByPlaceholderText(/filter assets/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sort/i)).toBeInTheDocument();
  });

  it("renders a static asset list row (placeholder content)", () => {
    render(<PortfolioPage />);
    expect(screen.getByText(/btc/i)).toBeInTheDocument();
    expect(screen.getByText(/Price: —/)).toBeInTheDocument();
    expect(screen.getByText(/Total: —/)).toBeInTheDocument();
  });
});
