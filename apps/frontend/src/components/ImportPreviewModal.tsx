import React from "react";

export type ImportItem = { asset: string; quantity: number };

type Props = {
  items: ImportItem[];
  onCancel: () => void;
  onReplace: () => void;
  onMerge: () => void;
};

export default function ImportPreviewModal({ items, onCancel, onReplace, onMerge }: Props) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-preview-title"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-surface rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6">
        <h2 id="import-preview-title" className="text-lg font-semibold mb-4">
          Preview Imported Portfolio
        </h2>

        <div className="max-h-80 overflow-auto border rounded-md">
          <table className="min-w-full text-sm">
            <thead className="bg-muted sticky top-0">
              <tr>
                <th className="text-left px-3 py-2 font-medium">Asset</th>
                <th className="text-right px-3 py-2 font-medium">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-3 py-4 text-center text-muted-foreground">
                    No items parsed
                  </td>
                </tr>
              ) : (
                items.map((it, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-3 py-2">{it.asset.toUpperCase()}</td>
                    <td className="px-3 py-2 text-right">{it.quantity}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          Choose how to apply the import:
          <ul className="list-disc ml-5 mt-1">
            <li><strong>Replace</strong>: Clears current portfolio, then imports these items.</li>
            <li><strong>Merge</strong>: Adds quantities to existing items, creates new ones if needed.</li>
          </ul>
        </div>

        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-muted hover:bg-muted/80 transition"
          >
            Cancel
          </button>
          <button
            onClick={onMerge}
            className="px-4 py-2 rounded-md bg-brand-accent text-white hover:bg-emerald-600 transition"
            data-testid="import-merge-button"
          >
            Merge Import
          </button>
          <button
            onClick={onReplace}
            className="px-4 py-2 rounded-md bg-brand-primary text-white hover:bg-blue-700 transition"
            data-testid="import-replace-button"
          >
            Replace Portfolio
          </button>
        </div>
      </div>
    </div>
  );
}
