import React, { useRef, useState } from 'react';
import Icon from '@components/Icon';

type ExportImportControlsProps = {
  onExport: (format: 'csv' | 'json') => void;
  onImport?: (file: File) => void;
  portfolioCount?: number;
};

export default function ExportImportControls({
  onExport,
  onImport,
  portfolioCount = 0,
}: ExportImportControlsProps) {
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleExportClick = () => {
    setIsExporting(true);
    try {
      onExport(format);
    } finally {
      // Small delay to show loading state
      setTimeout(() => setIsExporting(false), 300);
    }
  };

  const handleImportClick = () => {
    if (!onImport) return;
    fileInputRef.current?.click();
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!onImport) return;
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      // reset value to allow re-selecting the same file
      e.currentTarget.value = '';
    }
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
          onChange={(e) => setFormat(e.target.value as 'csv' | 'json')}
          className="text-base rounded-md border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-brand-primary focus:outline-none"
        >
          <option value="csv">CSV (.csv)</option>
          <option value="json">JSON (.json)</option>
        </select>
        <Icon
          glyph={'ⓘ'}
          title="Choose a format for download."
          className="text-gray-400 text-sm cursor-default select-none"
        />
      </div>

      {/* Hidden file input for Import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.csv,application/json,text/csv"
        className="hidden"
        onChange={handleFileChange}
        data-testid="import-file-input"
      />

      {/* Action Buttons */}
      {/* Screen reader hints for complex actions */}
      <p id="export-help" className="sr-only">
        Exports your current portfolio to a file using the selected format.
      </p>
      <p id="import-help" className="sr-only">
        Imports a portfolio from a JSON or CSV file. You will be able to preview
        the result and choose to merge or replace your current portfolio.
      </p>

      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handleExportClick}
          className="bg-brand-primary text-white font-button px-4 py-2 rounded-md hover:bg-purple-700 transition tap-44 focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Export Portfolio"
          aria-describedby="export-help"
          data-testid="export-button"
          title="Download portfolio in selected format"
          disabled={isExporting || portfolioCount === 0}
        >
          {isExporting ? (
            <>
              <span className="animate-spin inline-block">⏳</span> Exporting...
            </>
          ) : (
            <>
              <Icon glyph={'📤'} /> Export Portfolio
            </>
          )}
        </button>

        {onImport && (
          <button
            onClick={handleImportClick}
            className="bg-brand-accent text-white font-button px-4 py-2 rounded-md hover:bg-emerald-600 transition tap-44 focus-ring"
            aria-label="Import Portfolio"
            aria-describedby="import-help"
            data-testid="import-button"
            title="Select a JSON/CSV file to import"
          >
            <Icon glyph={'📥'} /> Import Portfolio
          </button>
        )}
      </div>
    </div>
  );
}
