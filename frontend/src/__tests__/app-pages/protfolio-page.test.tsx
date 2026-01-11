import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PortfolioPage from "@pages/PortfolioPage";
import { describe, it, expect } from "vitest";

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

vi.mock("@hooks/useCoinList", () => ({
  useCoinList: () => ({
    coins: [{ id: "btc", name: "Bitcoin", symbol: "btc", current_price: 3000 }],
    loading: false,
    error: null,
    lastUpdatedAt: Date.now(),
  }),
}));

vi.mock("@hooks/usePriceMap", () => ({
  usePriceMap: () => ({
    btc: 3000,
  }),
}));

vi.mock("@hooks/useCoinSearch", () => ({
  useCoinSearch: () => ({
    search: "",
    setSearch: vi.fn(),
    filteredCoins: [
      { id: "btc", name: "Bitcoin", symbol: "btc", current_price: 3000 },
    ],
  }),
}));

vi.mock("@hooks/useAlerts", () => ({
  useAlerts: () => ({
    alerts: [],
    activeAlerts: [],
    triggeredAlerts: [],
    alertCount: { active: 0, triggered: 0, total: 0 },
    isLoading: false,
    error: null,
    createAlert: vi.fn(),
    updateAlert: vi.fn(),
    deleteAlert: vi.fn(),
    muteAlert: vi.fn(),
    reactivateAlert: vi.fn(),
    refreshAlerts: vi.fn(),
  }),
}));

vi.mock("@hooks/useAlertPolling", () => ({
  useAlertPolling: () => ({
    triggeredAlerts: [],
    isPolling: false,
    lastChecked: null,
    checkNow: vi.fn(),
    dismissTriggeredAlert: vi.fn(),
    clearAllTriggered: vi.fn(),
  }),
}));

vi.mock("@services/notificationService", () => ({
  isNotificationSupported: () => true,
  getPermissionStatus: () => 'default',
  requestPermission: vi.fn().mockResolvedValue('granted'),
  sendNotification: vi.fn().mockReturnValue(true),
  sendAlertNotification: vi.fn().mockReturnValue(true),
}));

describe("PortfolioPage", () => {
  beforeEach(() => {
    vi.mock("@hooks/useCoinList", () => ({
      useCoinList: () => ({
        coins: [
          { id: "btc", name: "Bitcoin", symbol: "btc", current_price: 3000 },
        ],
        loading: false,
        error: null,
        lastUpdatedAt: Date.now(),
      }),
    }));

    vi.mock("@hooks/usePriceMap", () => ({
      usePriceMap: () => ({
        btc: 3000,
      }),
    }));

    vi.mock("@hooks/useCoinSearch", () => ({
      useCoinSearch: () => ({
        search: "",
        setSearch: vi.fn(),
        filteredCoins: [
          { id: "btc", name: "Bitcoin", symbol: "btc", current_price: 3000 },
        ],
      }),
    }));
  });

  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <PortfolioPage />
      </MemoryRouter>
    );
    expect(screen.getByTestId("total-value")).toHaveTextContent(
      /^💰\s*Total Portfolio Value:\s*\$\d{1,3}(,\d{3})*$/
    );
  });

  it("shows the Add, Export, and Import buttons", () => {
    render(
      <MemoryRouter>
        <PortfolioPage />
      </MemoryRouter>
    );
    expect(
      screen.getByRole("button", { name: /add asset/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /export/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /import/i })).toBeInTheDocument();
  });

  it("displays the filter input and sort dropdown", () => {
    render(
      <MemoryRouter>
        <PortfolioPage />
      </MemoryRouter>
    );
    // Use getAllByTestId since there may be multiple filter inputs on the page
    const filterInputs = screen.getAllByTestId("filter-input");
    expect(filterInputs.length).toBeGreaterThan(0);
    
    // Use getAllByLabelText since there may be multiple sort dropdowns
    const sortDropdowns = screen.getAllByLabelText(/sort/i);
    expect(sortDropdowns.length).toBeGreaterThan(0);
  });

  it("renders a static asset list row (placeholder content)", async () => {
    vi.resetModules();

    vi.doMock("@hooks/useCoinList", () => ({
      useCoinList: () => ({
        coins: [
          { id: "btc", name: "Bitcoin", symbol: "btc", current_price: 0 }, // still present
        ],
        loading: false,
        error: null,
        lastUpdatedAt: Date.now(),
      }),
    }));

    vi.doMock("@hooks/usePriceMap", () => ({
      usePriceMap: () => ({}), // ✅ no prices, triggers fallback UI
    }));

    vi.doMock("@hooks/useCoinSearch", () => ({
      useCoinSearch: () => ({
        search: "",
        setSearch: vi.fn(),
        filteredCoins: [],
      }),
    }));

    const { default: PortfolioPage } = await import("@pages/PortfolioPage");
    const { getByText } = render(
      <MemoryRouter>
        <PortfolioPage />
      </MemoryRouter>
    );

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
    const { getByLabelText, getByTestId } = render(
      <MemoryRouter>
        <PortfolioPage />
      </MemoryRouter>
    );

    // Simulate delete click
    const deleteButton = getByLabelText("Delete Bitcoin");
    fireEvent.click(deleteButton);

    // Assert modal appears
    expect(getByTestId("mock-delete-modal")).toBeInTheDocument();
  });
  it("provides correct assetName to DeleteConfirmationModal", async () => {
    const { getByLabelText, getByTestId } = render(
      <MemoryRouter>
        <PortfolioPage />
      </MemoryRouter>
    );

    // Trigger deletion of Bitcoin (BTC)
    fireEvent.click(getByLabelText("Delete Bitcoin"));

    // Assert modal contains Bitcoin's name
    expect(getByTestId("mock-delete-modal")).toHaveTextContent(
      "Confirm delete Bitcoin"
    );
  });
  it("passes priceMap to usePortfolioState and totalValue to PortfolioHeader", async () => {
    const mockPriceMap = { btc: 3000 };

    const mockUsePortfolioState = vi.fn(() => ({
      portfolio: [
        {
          coinInfo: { id: "btc", name: "Bitcoin", symbol: "btc" },
          quantity: 0.5,
        },
      ],
      removeAsset: vi.fn(),
      getAssetById: vi.fn(),
      addAsset: vi.fn(),
      totalValue: 12345,
    }));

    const mockPortfolioHeader = vi.fn(() => null); // ✅ define before mocking

    vi.resetModules(); // ✅ clear cache

    vi.doMock("@hooks/usePriceMap", () => ({
      usePriceMap: () => mockPriceMap,
    }));

    vi.doMock("@hooks/usePortfolioState", () => ({
      usePortfolioState: mockUsePortfolioState,
    }));

    vi.doMock("@components/PortfolioHeader", () => ({
      default: mockPortfolioHeader,
    }));

    const { render } = await import("@testing-library/react");
    const { default: PortfolioPage } = await import("@pages/PortfolioPage");

    render(
      <MemoryRouter>
        <PortfolioPage />
      </MemoryRouter>
    );

    expect(mockPortfolioHeader).toHaveBeenCalled();

    expect(mockPortfolioHeader).toHaveBeenCalled(); // ✅ type guard

    const props = (mockPortfolioHeader.mock.calls[0] as unknown as [any])[0];

    expect(props).toEqual(
      expect.objectContaining({
        totalValue: "12345",
        lastUpdatedAt: expect.any(Number),
      })
    );
    // ✅ Also confirm priceMap was passed to hook
    expect(mockUsePortfolioState).toHaveBeenCalledWith(
      mockPriceMap,
      expect.any(Object),
      expect.any(Boolean)
    );
  });
});

describe("PortfolioPage delete flow", () => {
  it("calls removeAsset and cancelDeleteAsset when confirm is clicked", () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <PortfolioPage />
      </MemoryRouter>
    );

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
    const { getByTestId } = render(
      <MemoryRouter>
        <PortfolioPage />
      </MemoryRouter>
    );
    expect(getByTestId("mock-add-asset-modal")).toBeInTheDocument();
  });
});
