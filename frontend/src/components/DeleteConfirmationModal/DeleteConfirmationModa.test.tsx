import { render, screen, fireEvent } from "@testing-library/react";
import DeleteConfirmationModal from "@components/DeleteConfirmationModal";

describe("DeleteConfirmationModal", () => {
  const setup = (propsOverride = {}) => {
    const props = {
      assetName: "BTC",
      isOpen: true,
      onConfirm: vi.fn(),
      onCancel: vi.fn(),
      ...propsOverride,
    };

    render(<DeleteConfirmationModal {...props} />);
    return props;
  };

  it("renders with asset name when open", () => {
    setup();
    expect(
      screen.getByRole("dialog", { name: /remove BTC/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/This action will permanently delete/i)
    ).toBeInTheDocument();
  });

  it("calls onConfirm when confirm button is clicked", () => {
    const { onConfirm } = setup();
    fireEvent.click(screen.getByRole("button", { name: /confirm delete/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when cancel button is clicked", () => {
    const { onCancel } = setup();
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("does not render when isOpen is false", () => {
    setup({ isOpen: false });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
