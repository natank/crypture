import React, { useState } from "react";
import { exportPortfolio } from "@utils/exportPortfolio";
import { getFormattedDate } from "@utils/formatDate";

type ExportImportControlsProps = {
  portfolio: { asset: string; quantity: number }[];
  prices: Record<string, number>;
  onImport?: () => void;
};

export default function ExportImportControls({
  portfolio,
  prices,
  onImport,
}: ExportImportControlsProps) {
  const [format, setFormat] = useState<"csv" | "json">("csv");

  const handleExportClick = () => {
    const dataStr = exportPortfolio(portfolio, prices, format);
    const blob = new Blob([dataStr], {
      type: format === "json" ? "application/json" : "text/csv",
    });

    const url = URL.createObjectURL(blob);
    const filename = `portfolio-${getFormattedDate(new Date())}.${format}`;

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-8 bg-white border border-gray-200 rounded-lg shadow-sm px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Format Selector with Tooltip */}
      <div className="flex items-center gap-3">
        <label
          htmlFor="export-format"
          className="font-subtle text-sm text-gray-700"
        >
          Format:
        </label>
        <select
          id="export-format"
          aria-label="Select file format for export"
          value={format}
          onChange={(e) => setFormat(e.target.value as "csv" | "json")}
          className="text-base rounded-md border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-brand-primary focus:outline-none"
        >
          <option value="csv">CSV (.csv)</option>
          <option value="json">JSON (.json)</option>
        </select>
        <span
          title="Choose a format for download."
          className="text-gray-400 text-sm cursor-default select-none"
          aria-hidden="true"
        >
          ⓘ
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <button
          data-testid="export-button"
          onClick={handleExportClick}
          className="bg-brand-primary text-white font-button px-4 py-2 rounded-md hover:bg-purple-700 transition"
          aria-label={`Download portfolio as ${format.toUpperCase()} file`}
        >
          📤 Export Portfolio
        </button>

        {onImport && (
          <button
            data-testid="import-button"
            onClick={onImport}
            className="bg-brand-accent text-white font-button px-4 py-2 rounded-md hover:bg-emerald-600 transition"
            aria-label="Upload portfolio file"
          >
            📥 Import Portfolio
          </button>
        )}
      </div>
    </div>
  );
}
