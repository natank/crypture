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
    <div className="flex justify-end gap-4 mt-6">
      <button
        className="bg-gray-100 text-gray-900 font-button px-4 py-2 rounded-md hover:bg-gray-200"
        data-testid="export-button"
        aria-label="Export Portfolio"
        onClick={onExport}
      >
        📤 Export
      </button>
      <button
        className="bg-gray-100 text-gray-900 font-button px-4 py-2 rounded-md hover:bg-gray-200"
        data-testid="import-button"
        aria-label="Import Portfolio"
        onClick={onImport}
      >
        📥 Import
      </button>
    </div>
  );
}
