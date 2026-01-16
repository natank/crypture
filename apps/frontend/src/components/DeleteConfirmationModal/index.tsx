import React from "react";
import { Trash2, X, Check } from "lucide-react";

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
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="modal-content card flex flex-col gap-8 sm:gap-6 p-6 sm:p-8" >
        <h2
          id="delete-modal-title"
          className="text-2xl sm:text-3xl font-bold text-error text-balance mb-2 flex items-center gap-2"
        >
          <Trash2 className="w-6 h-6 sm:w-8 sm:h-8" aria-hidden="true" />
          Remove {assetName}?
        </h2>
        <p className="text-base text-text-muted text-balance">
          This action will permanently delete this asset from your portfolio.<br />
          Are you sure you want to proceed?
        </p>
        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={onCancel}
            className="btn btn-outline flex items-center gap-2"
          >
            <X className="w-4 h-4" aria-hidden="true" />
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn bg-error hover:bg-error/90 focus-visible:ring-error flex items-center gap-2"
          >
            <Check className="w-4 h-4" aria-hidden="true" />
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}
