import { useState } from "react";
import { buildExportFilename } from "@utils/filename";
import { exportPortfolio as exportPortfolioUtil } from "@utils/exportPortfolio";
import { parsePortfolioFile, type ImportedAsset } from "@services/portfolioIOService";
import type { CoinInfo } from "@services/coinService";

export type UsePortfolioImportExportArgs = {
  coinMap: Record<string, CoinInfo>;
  addAsset: (args: { coinInfo: CoinInfo; quantity: number }) => void;
  resetPortfolio: () => void;
  portfolio: { coinInfo: CoinInfo; quantity: number }[];
  priceMap: Record<string, number>;
};

export function usePortfolioImportExport({
  coinMap,
  addAsset,
  resetPortfolio,
  portfolio,
  priceMap,
}: UsePortfolioImportExportArgs) {
  const [importPreview, setImportPreview] = useState<ImportedAsset[] | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const onFileSelected = async (file: File) => {
    try {
      setImportError(null);
      const imported = await parsePortfolioFile(file);
      setImportPreview(imported);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to import portfolio. Please check the file format.";
      setImportError(message);
    }
  };

  const applyReplace = () => {
    if (!importPreview) return;
    resetPortfolio();
    for (const item of importPreview) {
      const coinInfo = coinMap[item.asset];
      if (!coinInfo) continue;
      addAsset({ coinInfo, quantity: item.quantity });
    }
    setImportPreview(null);
  };

  const applyMerge = () => {
    if (!importPreview) return;
    for (const item of importPreview) {
      const coinInfo = coinMap[item.asset];
      if (!coinInfo) continue;
      addAsset({ coinInfo, quantity: item.quantity });
    }
    setImportPreview(null);
  };

  const dismissPreview = () => setImportPreview(null);

  const exportPortfolio = (format: "csv" | "json") => {
    const items = portfolio.map((a) => ({
      asset: a.coinInfo.symbol.toLowerCase(),
      quantity: a.quantity,
    }));
    const content = exportPortfolioUtil(items, priceMap, format);
    const mime = format === "csv" ? "text/csv;charset=utf-8" : "application/json;charset=utf-8";
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const filename = buildExportFilename(format);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return {
    importPreview,
    importError,
    onFileSelected,
    applyReplace,
    applyMerge,
    dismissPreview,
    exportPortfolio,
  };
}
