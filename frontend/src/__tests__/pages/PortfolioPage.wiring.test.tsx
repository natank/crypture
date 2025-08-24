import { render, screen, fireEvent } from "@testing-library/react";
import * as hooks from "@hooks/usePortfolioImportExport";
import * as coinList from "@hooks/useCoinList";
import PortfolioPage from "@pages/PortfolioPage";

// Mock child components that are heavy/irrelevant for wiring
vi.mock("@components/AssetList", () => ({
  default: ({ disabled }: { disabled?: boolean }) => (
    <div>
      <button data-testid="add-asset-button" disabled={!!disabled} />
    </div>
  ),
}));
vi.mock("@components/FilterSortControls", () => ({
  default: ({ disabled }: { disabled?: boolean }) => (
    <div data-testid="filter-sort" data-disabled={disabled ? "true" : "false"} />
  ),
}));
vi.mock("@components/PortfolioHeader", () => ({ default: () => <div data-testid="header" /> }));
vi.mock("@components/AppFooter", () => ({ default: () => <div data-testid="footer" /> }));
vi.mock("@components/AddAssetModal", () => ({ AddAssetModal: () => null }));
vi.mock("@components/DeleteConfirmationModal", () => ({ default: () => null }));

vi.mock("@hooks/useCoinList", () => {
  const impl = vi.fn(() => ({
    coins: [],
    loading: false,
    error: null,
    lastUpdatedAt: Date.now(),
    refreshing: false,
    retry: vi.fn(),
  }));
  return { useCoinList: impl };
});
vi.mock("@hooks/usePriceMap", () => ({ usePriceMap: () => ({}) }));
vi.mock("@hooks/useCoinSearch", () => ({ useCoinSearch: (coins: any[]) => ({ search: "", setSearch: () => {}, filteredCoins: coins }) }));
vi.mock("@hooks/useUIState", () => ({
  useUIState: () => ({
    shouldShowAddAssetModal: false,
    shouldShowDeleteConfirmationModal: false,
    cancelDeleteAsset: () => {},
    assetIdPendingDeletion: null,
    openAddAssetModal: () => {},
    closeAddAssetModal: () => {},
    addButtonRef: { current: null },
    requestDeleteAsset: () => {},
  }),
}));
vi.mock("@hooks/useFilterSort", () => ({ useFilterSort: (portfolio: any[]) => ({
  sortedFilteredAssets: portfolio,
  setSortOption: () => {},
  setFilterText: () => {},
  filterText: "",
  sortOption: "name",
}) }));
vi.mock("@hooks/usePortfolioState", () => ({ usePortfolioState: () => ({
  portfolio: [],
  addAsset: vi.fn(),
  removeAsset: vi.fn(),
  getAssetById: () => undefined,
  totalValue: 0,
  resetPortfolio: vi.fn(),
}) }));

vi.mock("@components/ExportImportControls", () => ({
  __esModule: true,
  default: ({ onExport, onImport }: any) => (
    <div>
      <button data-testid="export-json" onClick={() => onExport("json")}>export json</button>
      <input
        data-testid="import-input"
        type="file"
        onChange={(e: any) => onImport?.(new File(["[]"], "portfolio.json", { type: "application/json" }))}
      />
    </div>
  ),
}));

// Spy and control the import/export hook
const mockHook = {
  importPreview: [{ asset: "btc", quantity: 1.5 }],
  importError: null as string | null,
  onFileSelected: vi.fn(),
  applyMerge: vi.fn(),
  applyReplace: vi.fn(),
  dismissPreview: vi.fn(),
  exportPortfolio: vi.fn(),
};

vi.spyOn(hooks, "usePortfolioImportExport").mockImplementation(() => mockHook as any);

describe("PortfolioPage wiring", () => {
  beforeEach(() => {
    Object.assign(mockHook, {
      importPreview: [{ asset: "btc", quantity: 1.5 }],
      importError: null,
      onFileSelected: vi.fn(),
      applyMerge: vi.fn(),
      applyReplace: vi.fn(),
      dismissPreview: vi.fn(),
      exportPortfolio: vi.fn(),
    });
  });

  afterEach(() => {
    // reset useCoinList mock to default non-error state
    (coinList.useCoinList as unknown as vi.Mock).mockImplementation(() => ({
      coins: [],
      loading: false,
      error: null,
      lastUpdatedAt: Date.now(),
      refreshing: false,
      retry: vi.fn(),
    }));
  });

  it("invokes retry when clicking Retry on error banner", () => {
    const retry = vi.fn();
    (coinList.useCoinList as unknown as vi.Mock).mockImplementation(() => ({
      coins: [],
      loading: false,
      error: "Network",
      lastUpdatedAt: Date.now(),
      refreshing: false,
      retry,
    }));

    render(<PortfolioPage />);
    const retryBtn = screen.getByRole("button", { name: /retry/i });
    fireEvent.click(retryBtn);
    expect(retry).toHaveBeenCalled();
  });

  it("shows updating spinner and disables add button when refreshing", () => {
    (coinList.useCoinList as unknown as vi.Mock).mockImplementation(() => ({
      coins: [],
      loading: false,
      error: null,
      lastUpdatedAt: Date.now(),
      refreshing: true,
      retry: vi.fn(),
    }));

    render(<PortfolioPage />);

    // Inline spinner should be present (role status from LoadingSpinner)
    expect(screen.getAllByRole("status").length).toBeGreaterThan(0);

    // Add button should be disabled
    const addBtn = screen.getByTestId("add-asset-button");
    expect(addBtn).toBeDisabled();

    // Filter/Sort controls should be disabled
    const filterSort = screen.getByTestId("filter-sort");
    expect(filterSort).toHaveAttribute("data-disabled", "true");
  });

  it("shows ImportPreviewModal when importPreview is present and triggers applyMerge", () => {
    render(<PortfolioPage />);

    // Modal should be shown
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Trigger merge button
    const mergeBtn = screen.getByTestId("import-merge-button");
    fireEvent.click(mergeBtn);
    expect(mockHook.applyMerge).toHaveBeenCalled();
  });

  it("ExportImportControls triggers export and import handlers wired from the hook", () => {
    render(<PortfolioPage />);

    fireEvent.click(screen.getByTestId("export-json"));
    expect(mockHook.exportPortfolio).toHaveBeenCalledWith("json");

    const input = screen.getByTestId("import-input");
    fireEvent.change(input);
    expect(mockHook.onFileSelected).toHaveBeenCalled();
  });

  it("triggers applyReplace when Replace is clicked in ImportPreviewModal", () => {
    render(<PortfolioPage />);

    const replaceBtn = screen.getByTestId("import-replace-button");
    fireEvent.click(replaceBtn);
    expect(mockHook.applyReplace).toHaveBeenCalled();
  });

  it("dismisses preview when Cancel is clicked in ImportPreviewModal", () => {
    render(<PortfolioPage />);

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelBtn);
    expect(mockHook.dismissPreview).toHaveBeenCalled();
  });

  it("shows general error banner when coin list has an error", () => {
    (coinList.useCoinList as unknown as vi.Mock).mockImplementation(() => ({
      coins: [],
      loading: false,
      error: "Network",
      lastUpdatedAt: Date.now(),
      refreshing: false,
      retry: vi.fn(),
    }));

    // Ensure importError is null so only general error shows (plus no detailed import error message)
    mockHook.importError = null;

    render(<PortfolioPage />);
    expect(screen.getByText(/Error loading prices. Please try again later\./i)).toBeInTheDocument();
  });

  it("shows general and specific import error banners when importError is set", () => {
    mockHook.importError = "Bad file format";

    render(<PortfolioPage />);
    // General banner rendered due to importError truthy
    expect(screen.getByText(/Error loading prices. Please try again later\./i)).toBeInTheDocument();
    // Specific import error banner
    expect(screen.getByText(/Bad file format/i)).toBeInTheDocument();
  });
});
