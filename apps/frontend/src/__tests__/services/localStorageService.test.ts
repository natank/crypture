import { savePortfolio, loadPortfolio } from "@services/localStorageService";

describe("localStorageService", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as any).mockRestore?.();
  });

  it("saves and loads portfolio", () => {
    const data = [
      { asset: "btc", qty: 1 },
      { asset: "eth", qty: 2 },
    ];
    savePortfolio(data);
    const loaded = loadPortfolio();
    expect(loaded).toEqual(data);
  });

  it("handles JSON parse error on load gracefully", () => {
    localStorage.setItem("cryptoPortfolio", "not-json");
    const loaded = loadPortfolio();
    expect(loaded).toEqual([]);
    expect(console.error).toHaveBeenCalled();
  });
});
