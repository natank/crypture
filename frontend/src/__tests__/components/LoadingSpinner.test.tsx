import { render, screen } from "@testing-library/react";
import LoadingSpinner from "@components/LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders with default label", () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders without label when label is empty string", () => {
    render(<LoadingSpinner label="" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("applies fullScreen layout when fullScreen=true", () => {
    const { container } = render(<LoadingSpinner fullScreen />);
    expect(container.firstChild).toHaveClass("h-screen");
  });
});
