import React from "react";
import { render, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePortfolioImportExport } from "@hooks/usePortfolioImportExport";
import type { CoinInfo } from "@services/coinService";

vi.mock("@services/portfolioIOService", () => ({
  parsePortfolioFile: vi.fn(),
}));

vi.mock("@utils/exportPortfolio", () => ({
  exportPortfolio: vi.fn().mockReturnValue("content"),
}));

vi.mock("@utils/filename", () => ({
  buildExportFilename: vi.fn().mockReturnValue("portfolio-2025-08-24.json"),
}));

import { parsePortfolioFile } from "@services/portfolioIOService";
import { exportPortfolio } from "@utils/exportPortfolio";
import { buildExportFilename } from "@utils/filename";

function setupHook(args: Parameters<typeof usePortfolioImportExport>[0]) {
  let current: ReturnType<typeof usePortfolioImportExport> | null = null;
  function Harness() {
    current = usePortfolioImportExport(args);
    return null;
  }
  render(<Harness />);
  return {
    get: () => {
      if (!current) throw new Error("Hook not initialized");
      return current;
    },
  };
}

describe("usePortfolioImportExport", () => {
  const btc: CoinInfo = { id: "bitcoin", symbol: "btc", name: "Bitcoin" } as CoinInfo;
  const eth: CoinInfo = { id: "ethereum", symbol: "eth", name: "Ethereum" } as CoinInfo;
  const coinMap: Record<string, CoinInfo> = { btc, eth };
  let addAsset: ReturnType<typeof vi.fn>;
  let resetPortfolio: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.resetAllMocks();
    addAsset = vi.fn();
    resetPortfolio = vi.fn();
  });

  it("parses file and sets preview; replace applies and resets portfolio", async () => {
    (parsePortfolioFile as unknown as vi.Mock).mockResolvedValue([
      { asset: "btc", quantity: 1.5 },
      { asset: "eth", quantity: 3 },
    ]);

    const hook = setupHook({
      coinMap,
      addAsset: addAsset as any,
      resetPortfolio: resetPortfolio as any,
      portfolio: [],
      priceMap: { btc: 50000, eth: 3000 },
    });

    const file = new File([JSON.stringify([])], "portfolio.json", { type: "application/json" });

    await act(async () => {
      await hook.get().onFileSelected(file);
    });

    expect(hook.get().importPreview).toEqual([
      { asset: "btc", quantity: 1.5 },
      { asset: "eth", quantity: 3 },
    ]);

    act(() => hook.get().applyReplace());

    expect(resetPortfolio).toHaveBeenCalledTimes(1);
    expect(addAsset).toHaveBeenCalledTimes(2);
    expect(addAsset).toHaveBeenNthCalledWith(1, { coinInfo: btc, quantity: 1.5 });
    expect(addAsset).toHaveBeenNthCalledWith(2, { coinInfo: eth, quantity: 3 });
    expect(hook.get().importPreview).toBeNull();
  });

  it("merge applies without reset", async () => {
    (parsePortfolioFile as unknown as vi.Mock).mockResolvedValue([
      { asset: "btc", quantity: 2 },
    ]);

    const hook = setupHook({
      coinMap,
      addAsset: addAsset as any,
      resetPortfolio: resetPortfolio as any,
      portfolio: [],
      priceMap: { btc: 50000 },
    });

    await act(async () => {
      await hook.get().onFileSelected(new File(["[]"], "portfolio.json", { type: "application/json" }));
    });

    act(() => hook.get().applyMerge());

    expect(resetPortfolio).not.toHaveBeenCalled();
    expect(addAsset).toHaveBeenCalledWith({ coinInfo: btc, quantity: 2 });
  });

  it("sets error when parse fails", async () => {
    (parsePortfolioFile as unknown as vi.Mock).mockRejectedValue(new Error("Invalid file"));

    const hook = setupHook({
      coinMap,
      addAsset: addAsset as any,
      resetPortfolio: resetPortfolio as any,
      portfolio: [],
      priceMap: {},
    });

    await act(async () => {
      await hook.get().onFileSelected(new File([""], "bad.csv", { type: "text/csv" }));
    });

    expect(hook.get().importError).toBe("Invalid file");
  });

  it("exports using util and filename builder, triggers download", () => {
    const hook = setupHook({
      coinMap,
      addAsset: addAsset as any,
      resetPortfolio: resetPortfolio as any,
      portfolio: [
        { coinInfo: btc, quantity: 1 },
        { coinInfo: eth, quantity: 2 },
      ],
      priceMap: { btc: 50000, eth: 3000 },
    });

    // Polyfill URL methods if missing in JSDOM
    if (!(URL as any).createObjectURL) {
      (URL as any).createObjectURL = vi.fn();
    }
    if (!(URL as any).revokeObjectURL) {
      (URL as any).revokeObjectURL = vi.fn();
    }
    const createObjectURLSpy = vi
      .spyOn(URL, "createObjectURL" as any)
      .mockReturnValue("blob:url" as any);
    const revokeSpy = vi.spyOn(URL, "revokeObjectURL" as any).mockImplementation(() => {});

    const removeSpy = vi.fn();
    const clickSpy = vi.fn();
    const appendSpy = vi
      .spyOn(document.body, "appendChild")
      .mockImplementation((node: any) => {
        // Attach spies to the real anchor element created by JSDOM
        (node as HTMLAnchorElement).click = clickSpy as any;
        (node as HTMLAnchorElement).remove = removeSpy as any;
        return node;
      });

    act(() => hook.get().exportPortfolio("json"));

    expect(exportPortfolio).toHaveBeenCalled();
    expect(buildExportFilename).toHaveBeenCalledWith("json");
    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
    expect(revokeSpy).toHaveBeenCalledWith("blob:url");
    expect(appendSpy).toHaveBeenCalled();
  });
});
