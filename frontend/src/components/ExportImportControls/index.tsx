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
    <div className="flex justify-end gap-4 mt-6 md:gap-6 lg:gap-8" >
      <button
        className="btn btn-outline rounded-md shadow-md transition duration-200 ease-in-out hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
        data-testid="export-button"
        aria-label="Export Portfolio"
        onClick={onExport}
      >
        📤 Export
      </button>
      <button
        className="btn btn-outline rounded-md shadow-md transition duration-200 ease-in-out hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
        data-testid="import-button"
        aria-label="Import Portfolio"
        onClick={onImport}
      >
        📥 Import
      </button>
    </div>
  );
}
