import React from "react";

type DeleteConfirmationModalProps = {
  assetName: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteConfirmationModal({
  assetName,
  isOpen,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full space-y-4">
        <h2
          id="delete-modal-title"
          className="text-xl font-semibold text-gray-900"
        >
          🗑️ Remove {assetName}?
        </h2>
        <p className="text-sm text-gray-700">
          This action will permanently delete this asset from your portfolio.
          Are you sure you want to proceed?
        </p>
        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={onCancel}
            className="bg-gray-100 text-gray-900 font-button px-4 py-2 rounded-md hover:bg-gray-200"
          >
            ❌ Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white font-button px-4 py-2 rounded-md hover:bg-red-700"
          >
            ✅ Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}
