import { render, screen, fireEvent } from "@testing-library/react";
import ErrorBanner from "@components/ErrorBanner";

describe("ErrorBanner", () => {
  it("renders message", () => {
    render(<ErrorBanner message="Something went wrong" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong");
  });

  it("renders retry button and fires callback", () => {
    const onRetry = vi.fn();
    render(<ErrorBanner message="Oops" onRetry={onRetry} />);
    fireEvent.click(screen.getByRole("button", { name: /retry/i }));
    expect(onRetry).toHaveBeenCalled();
  });
});
