import { fireEvent, render, screen } from "@testing-library/react";
import PortfolioPage from "@pages/PortfolioPage";
import { describe, it, expect } from "vitest";
import { useCoinContext } from "@context/useCoinContext";

const removeAsset = vi.fn();
const addAsset = vi.fn();
const cancelDeleteAsset = vi.fn();
const requestDeleteAsset = vi.fn();
const getAssetById = vi.fn((id: string) => ({
  coinInfo: {
    id,
    name: "Bitcoin",
    symbol: "btc",
  },
  quantity: 0.5,
}));

vi.mock("@components/DeleteConfirmationModal", () => ({
  default: ({
    isOpen,
    assetName,
    onConfirm,
  }: {
    isOpen: boolean;
    assetName: string;
    onConfirm: () => void;
  }) =>
    isOpen ? (
      <div data-testid="mock-delete-modal">
        Confirm delete {assetName}
        <button onClick={onConfirm} data-testid="confirm-delete">
          Confirm
        </button>
      </div>
    ) : null,
}));
vi.mock("@hooks/usePortfolioState", () => ({
  usePortfolioState: () => ({
    portfolio: [
      {
        coinInfo: {
          id: "btc",
          name: "Bitcoin",
          symbol: "btc",
        },
        quantity: 0.5,
      },
    ],
    removeAsset,
    getAssetById,
    addAsset,
    totalValue: 12345,
  }),
}));

// 🧪 Mock useUIState
vi.mock("@hooks/useUIState", () => ({
  useUIState: () => ({
    shouldShowDeleteConfirmationModal: true,
    assetIdPendingDeletion: "btc",
    cancelDeleteAsset,
    requestDeleteAsset,
    shouldShowAddAssetModal: false,
  }),
}));

vi.mock("@context/useCoinContext", () => ({
  useCoinContext: vi.fn(),
}));

describe("PortfolioPage", () => {
  beforeEach(() => {
    vi.mocked(useCoinContext).mockReturnValue({
      coins: [],
      loading: false,
      error: null,
      search: "",
      setSearch: vi.fn(),
      originalCoins: [],
      priceMap: {
        btc: 3000,
      },
      getPriceBySymbol: (symbol: string) => {
        const priceMap: Record<string, number> = { btc: 3000 };
        return priceMap[symbol.toLowerCase()];
      },
    });
  });
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

  it("renders a static asset list row (placeholder content)", async () => {
    vi.resetModules();

    vi.doMock("@context/useCoinContext", () => ({
      useCoinContext: () => ({
        coins: [],
        loading: false,
        error: null,
        search: "",
        setSearch: vi.fn(),
        originalCoins: [],
        priceMap: {}, // no prices => fallback UI
        getPriceBySymbol: () => undefined,
      }),
    }));

    const { default: PortfolioPage } = await import("@pages/PortfolioPage");
    const { getByText } = render(<PortfolioPage />);

    // Asset still renders
    expect(getByText(/btc/i)).toBeInTheDocument();

    // Fallback indicators
    expect(
      screen.getByText(
        (_, el) => el?.textContent?.replace(/\s+/g, " ").trim() === "Price: —"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        (_, el) => el?.textContent?.replace(/\s+/g, " ").trim() === "Total: —"
      )
    ).toBeInTheDocument();

    expect(screen.getAllByText(/price fetch failed/i)).toHaveLength(2);
  });

  it("renders DeleteConfirmationModal when delete is requested", async () => {
    const { getByLabelText, getByTestId } = render(<PortfolioPage />);

    // Simulate delete click
    const deleteButton = getByLabelText("Delete BTC");
    fireEvent.click(deleteButton);

    // Assert modal appears
    expect(getByTestId("mock-delete-modal")).toBeInTheDocument();
  });
  it("provides correct assetName to DeleteConfirmationModal", async () => {
    const { getByLabelText, getByTestId } = render(<PortfolioPage />);

    // Trigger deletion of Bitcoin (BTC)
    fireEvent.click(getByLabelText("Delete BTC"));

    // Assert modal contains Bitcoin's name
    expect(getByTestId("mock-delete-modal")).toHaveTextContent(
      "Confirm delete Bitcoin"
    );
  });
});

describe("PortfolioPage delete flow", () => {
  it("calls removeAsset and cancelDeleteAsset when confirm is clicked", () => {
    const { getByTestId } = render(<PortfolioPage />);

    const confirmButton = getByTestId("confirm-delete");
    fireEvent.click(confirmButton);

    expect(removeAsset).toHaveBeenCalledWith("btc");
    expect(cancelDeleteAsset).toHaveBeenCalled();
  });
});

describe("PortfolioPage (AddAssetModal rendering)", () => {
  beforeEach(() => {
    vi.resetModules(); // ensure isolation
    vi.doMock("@hooks/usePortfolioState", () => ({
      usePortfolioState: () => ({
        portfolio: [],
        addAsset: vi.fn(),
        removeAsset: vi.fn(),
        getAssetById: vi.fn(),
        totalValue: 12345,
      }),
    }));

    vi.doMock("@hooks/useUIState", () => ({
      useUIState: () => ({
        shouldShowAddAssetModal: true,
        closeAddAssetModal: vi.fn(),
        shouldShowDeleteConfirmationModal: false,
        assetIdPendingDeletion: null,
        cancelDeleteAsset: vi.fn(),
        requestDeleteAsset: vi.fn(),
      }),
    }));

    vi.doMock("@components/AddAssetModal", () => ({
      AddAssetModal: ({ onClose }: { onClose: () => void }) => (
        <div data-testid="mock-add-asset-modal">
          Add Modal
          <button onClick={onClose}>Close</button>
        </div>
      ),
    }));
  });

  it("renders AddAssetModal when shouldShowAddAssetModal is true", async () => {
    const { default: PortfolioPage } = await import("@pages/PortfolioPage");
    const { getByTestId } = render(<PortfolioPage />);
    expect(getByTestId("mock-add-asset-modal")).toBeInTheDocument();
  });
});
