import React from "react";

type ExportImportControlsProps = {
  onExport: () => void;
  onImport: () => void;
};

export default function ExportImportControls({
  onExport,
  onImport,
}: ExportImportControlsProps) {
  return (
    <div className="flex justify-end gap-4 mt-6 md:gap-6 lg:gap-8">
      <button
        className="bg-brand-primary text-white font-button px-4 py-2 rounded-md hover:bg-purple-700 transition"
        data-testid="export-button"
        aria-label="Export Portfolio"
        onClick={onExport}
      >
        📤 Export Portfolio
      </button>
      <button
        className="bg-brand-accent text-white font-button px-4 py-2 rounded-md hover:bg-emerald-600 transition"
        data-testid="import-button"
        aria-label="Import Portfolio"
        onClick={onImport}
      >
        📥 Import Portfolio
      </button>
    </div>
  );
}
