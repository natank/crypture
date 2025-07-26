// utils/exportPortfolio.ts

export type ExportFormat = "csv" | "json";

export interface PortfolioItem {
  asset: string; // asset symbol (e.g., BTC)
  quantity: number;
}

/**
 * Returns portfolio data as a CSV or JSON string.
 * Each entry includes: asset, quantity, and computed value.
 */
export function exportPortfolio(
  portfolio: PortfolioItem[],
  prices: Record<string, number>,
  format: ExportFormat
): string {
  const rows = portfolio.map(({ asset, quantity }) => {
    const price = prices[asset.toLocaleLowerCase()] ?? 0;
    const value = quantity * price;
    return {
      asset,
      quantity,
      value: Number.isFinite(value)
        ? Number(value).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : "0.00",
    };
  });

  if (format === "json") {
    return JSON.stringify(
      rows.map((r) => ({
        ...r,
        value: Number(r.value.replace(/,/g, "")),
      })),
      null,
      2
    );
  }

  if (format === "csv") {
    const header = ["Asset", "Quantity", "Value (USD)"];
    const lines = rows.map(({ asset, quantity, value }) => {
      const escaped = [asset, quantity.toString(), value].map((cell) =>
        cell.includes(",") ? `"${cell}"` : cell
      );
      return escaped.join(",");
    });
    return [header.join(","), ...lines].join("\n");
  }

  throw new Error(`Unsupported export format: ${format}`);
}
