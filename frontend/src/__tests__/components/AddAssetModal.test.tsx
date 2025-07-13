vi.mock("focus-trap-react", () => ({
  FocusTrap: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, beforeEach, vi } from "vitest";
import { AddAssetModal } from "@components/AddAssetModal";

// Mocks
const mockSetSelectedCoin = vi.fn();
const mockSetQuantity = vi.fn();
const mockHandleSubmit = vi.fn();
const mockUseAddAssetForm = vi.fn();

// Stub `useAddAssetForm` hook
vi.mock("@hooks/useAddAssetForm", () => ({
  useAddAssetForm: () => mockUseAddAssetForm(),
}));

vi.mock("@components/AssetSelector", () => ({
  AssetSelector: ({
    onSelect,
    disabled,
  }: {
    onSelect: (asset: {
      id: string;
      name: string;
      symbol: string;
      quantity: number;
    }) => void;
    disabled: boolean;
  }) => (
    <button
      onClick={() =>
        onSelect({
          id: "btc",
          name: "Bitcoin",
          symbol: "BTC",
          quantity: 1,
        })
      }
      disabled={disabled}
    >
      Mock Asset Selector
    </button>
  ),
}));

beforeEach(() => {
  beforeEach(() => {
    mockUseAddAssetForm.mockReturnValue({
      setSelectedCoin: mockSetSelectedCoin,
      quantity: "",
      setQuantity: mockSetQuantity,
      loading: false,
      error: null,
      handleSubmit: mockHandleSubmit,
    });
  });
});

describe("AddAssetModal", () => {
  it("renders modal with all fields and buttons", () => {
    const mockOnClose = vi.fn();
    const mockAddAsset = vi.fn();

    mockUseAddAssetForm.mockReturnValue({
      setSelectedCoin: mockSetSelectedCoin,
      quantity: "",
      setQuantity: mockSetQuantity,
      loading: false,
      error: null,
      handleSubmit: mockHandleSubmit,
    });

    render(
      <AddAssetModal
        onClose={mockOnClose}
        addAsset={mockAddAsset}
        coins={[]} // can be empty for most tests
        search=""
        setSearch={vi.fn()}
      />
    );
    // Assert modal heading by role + accessible name
    expect(
      screen.getByRole("heading", { name: /add crypto asset/i })
    ).toBeInTheDocument();

    // Assert quantity input by label
    expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument();

    // Assert asset selector label
    expect(screen.getByText("Asset")).toBeInTheDocument();

    // Assert asset selector button (mock)
    expect(
      screen.getByRole("button", { name: /mock asset selector/i })
    ).toBeInTheDocument();

    // Assert specific button text
    expect(
      screen.getByRole("button", { name: /add asset/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /cancel adding asset/i })
    ).toBeInTheDocument();
  });

  it("updates quantity input via typing", () => {
    const mockOnClose = vi.fn();
    const mockAddAsset = vi.fn();

    const setQuantitySpy = vi.fn();

    mockUseAddAssetForm.mockReturnValue({
      setSelectedCoin: mockSetSelectedCoin,
      quantity: "",
      setQuantity: setQuantitySpy,
      loading: false,
      error: null,
      handleSubmit: mockHandleSubmit,
    });

    render(
      <AddAssetModal
        onClose={mockOnClose}
        addAsset={mockAddAsset}
        coins={[]} // can be empty for most tests
        search=""
        setSearch={vi.fn()}
      />
    );
    const input = screen.getByLabelText(/quantity/i);
    fireEvent.change(input, { target: { value: "1.23" } });

    expect(setQuantitySpy).toHaveBeenCalledWith("1.23");
  });

  it("calls handleSubmit when Add Asset button is clicked", () => {
    const mockOnClose = vi.fn();
    const mockAddAsset = vi.fn();

    const handleSubmitSpy = vi.fn();

    mockUseAddAssetForm.mockReturnValue({
      setSelectedCoin: mockSetSelectedCoin,
      quantity: "1",
      setQuantity: mockSetQuantity,
      loading: false,
      error: null,
      handleSubmit: handleSubmitSpy,
    });

    render(
      <AddAssetModal
        onClose={mockOnClose}
        addAsset={mockAddAsset}
        coins={[]}
        search=""
        setSearch={vi.fn()}
      />
    );

    const submitButton = screen.getByRole("button", { name: /add asset/i });

    fireEvent.click(submitButton);

    expect(handleSubmitSpy).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Cancel button is clicked", () => {
    const mockOnClose = vi.fn();
    const mockAddAsset = vi.fn();

    mockUseAddAssetForm.mockReturnValue({
      setSelectedCoin: mockSetSelectedCoin,
      quantity: "",
      setQuantity: mockSetQuantity,
      loading: false,
      error: null,
      handleSubmit: mockHandleSubmit,
    });

    render(
      <AddAssetModal
        onClose={mockOnClose}
        addAsset={mockAddAsset}
        coins={[]}
        search=""
        setSearch={vi.fn()}
      />
    );
    const cancelButton = screen.getByRole("button", {
      name: /cancel adding asset/i,
    });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("disables form controls when loading is true", () => {
    const mockOnClose = vi.fn();
    const mockAddAsset = vi.fn();

    mockUseAddAssetForm.mockReturnValue({
      setSelectedCoin: mockSetSelectedCoin,
      quantity: "1.23",
      setQuantity: mockSetQuantity,
      loading: true,
      error: null,
      handleSubmit: mockHandleSubmit,
    });

    render(
      <AddAssetModal
        onClose={mockOnClose}
        addAsset={mockAddAsset}
        coins={[]}
        search=""
        setSearch={vi.fn()}
      />
    );
    const quantityInput = screen.getByLabelText(/quantity/i);
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    const assetSelector = screen.getByRole("button", {
      name: /mock asset selector/i,
    });

    // fallback: use getAllByRole since add + cancel are both buttons
    const buttons = screen.getAllByRole("button");
    const addButton = buttons.find((btn) => btn !== cancelButton);

    expect(quantityInput).toBeDisabled();
    expect(cancelButton).toBeDisabled();
    expect(addButton).toBeDefined();
    expect(addButton).toBeDisabled();
    expect(assetSelector).toBeDisabled();
  });

  it("shows error message when error is present", () => {
    const mockOnClose = vi.fn();
    const mockAddAsset = vi.fn();

    const testError = "Quantity must be a positive number.";

    mockUseAddAssetForm.mockReturnValue({
      setSelectedCoin: mockSetSelectedCoin,
      quantity: "0",
      setQuantity: mockSetQuantity,
      loading: false,
      error: testError,
      handleSubmit: mockHandleSubmit,
    });

    render(
      <AddAssetModal
        onClose={mockOnClose}
        addAsset={mockAddAsset}
        coins={[]}
        search=""
        setSearch={vi.fn()}
      />
    );
    // Error message should appear in the alert role
    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(testError);
  });

  it("triggers setSelectedCoin via AssetSelector", () => {
    const mockOnClose = vi.fn();
    const mockAddAsset = vi.fn();

    const mockCoin = {
      id: "btc",
      name: "Bitcoin",
      symbol: "BTC",
      quantity: 1,
    };

    const setSelectedCoin = vi.fn();

    mockUseAddAssetForm.mockReturnValue({
      setSelectedCoin,
      quantity: "",
      setQuantity: vi.fn(),
      loading: false,
      error: null,
      handleSubmit: vi.fn(),
    });

    render(
      <AddAssetModal
        onClose={mockOnClose}
        addAsset={mockAddAsset}
        coins={[]}
        search=""
        setSearch={vi.fn()}
      />
    );
    // The mocked AssetSelector is just a button we can click
    const selectorButton = screen.getByRole("button", {
      name: /mock asset selector/i,
    });
    fireEvent.click(selectorButton);

    expect(setSelectedCoin).toHaveBeenCalledWith(mockCoin);
  });

  it("does not crash from FocusTrap’s initialFocus (mocked)", () => {
    const mockOnClose = vi.fn();
    const mockAddAsset = vi.fn();

    // Return minimal valid form state
    mockUseAddAssetForm.mockReturnValue({
      setSelectedCoin: mockSetSelectedCoin,
      quantity: "",
      setQuantity: mockSetQuantity,
      loading: false,
      error: null,
      handleSubmit: mockHandleSubmit,
    });

    // Confirm that rendering does not throw
    expect(() =>
      render(
        <AddAssetModal
          onClose={mockOnClose}
          addAsset={mockAddAsset}
          coins={[]}
          search=""
          setSearch={vi.fn()}
        />
      )
    ).not.toThrow();

    // Optional: confirm that heading still renders
    expect(
      screen.getByRole("heading", { name: /add crypto asset/i })
    ).toBeInTheDocument();
  });
});
