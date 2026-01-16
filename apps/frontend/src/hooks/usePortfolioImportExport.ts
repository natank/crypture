import { useState } from 'react';
import { buildExportFilename } from '@utils/filename';
import { exportPortfolio as exportPortfolioUtil } from '@utils/exportPortfolio';
import {
  parsePortfolioFile,
  type ImportedAsset,
} from '@services/portfolioIOService';
import type { CoinInfo } from '@services/coinService';

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
  const [importPreview, setImportPreview] = useState<ImportedAsset[] | null>(
    null
  );
  const [importError, setImportError] = useState<string | null>(null);

  const onFileSelected = async (file: File) => {
    try {
      setImportError(null);
      const imported = await parsePortfolioFile(file);
      setImportPreview(imported);
    } catch (e: unknown) {
      const message =
        e instanceof Error
          ? e.message
          : 'Failed to import portfolio. Please check the file format.';
      setImportError(message);
    }
  };

  const applyReplace = () => {
    if (!importPreview) return { added: 0, skipped: 0 };

    resetPortfolio();
    let added = 0;
    let skipped = 0;

    for (const item of importPreview) {
      const coinInfo = coinMap[item.asset];
      if (!coinInfo) {
        skipped++;
        continue;
      }
      addAsset({ coinInfo, quantity: item.quantity });
      added++;
    }

    setImportPreview(null);
    return { added, skipped };
  };

  const applyMerge = () => {
    if (!importPreview) return { added: 0, updated: 0, skipped: 0 };

    let added = 0;
    let updated = 0;
    let skipped = 0;

    for (const item of importPreview) {
      const coinInfo = coinMap[item.asset];
      if (!coinInfo) {
        skipped++;
        continue;
      }

      // Check if asset already exists in portfolio
      const existingAsset = portfolio.find(
        (asset) => asset.coinInfo.id === coinInfo.id
      );

      addAsset({ coinInfo, quantity: item.quantity });

      if (existingAsset) {
        updated++;
      } else {
        added++;
      }
    }

    setImportPreview(null);
    return { added, updated, skipped };
  };

  const dismissPreview = () => setImportPreview(null);

  const exportPortfolio = (format: 'csv' | 'json') => {
    const items = portfolio.map((a) => ({
      asset: a.coinInfo.symbol.toLowerCase(),
      quantity: a.quantity,
    }));
    const content = exportPortfolioUtil(items, priceMap, format);
    const mime =
      format === 'csv'
        ? 'text/csv;charset=utf-8'
        : 'application/json;charset=utf-8';
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const filename = buildExportFilename(format);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    return { filename, count: portfolio.length };
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
