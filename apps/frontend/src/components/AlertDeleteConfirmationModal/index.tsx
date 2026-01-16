/**
 * AlertDeleteConfirmationModal Component
 * Confirmation dialog for deleting price alerts
 * REQ-024-tech-debt / KI-02
 */

import React from 'react';
import { Trash2, X, Check } from 'lucide-react';

interface AlertDeleteConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  alert: {
    coinName: string;
    coinSymbol: string;
    condition: 'above' | 'below';
    targetPrice: number;
  };
}

export default function AlertDeleteConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  alert,
}: AlertDeleteConfirmationModalProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  const conditionSymbol = alert.condition === 'above' ? '>' : '<';
  const conditionText = `${conditionSymbol} ${formatPrice(alert.targetPrice)}`;

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-alert-modal-title"
      onClick={onCancel}
    >
      <div
        className="modal-content card flex flex-col gap-8 sm:gap-6 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="delete-alert-modal-title"
          className="text-2xl sm:text-3xl font-bold text-error text-balance mb-2 flex items-center gap-2"
        >
          <Trash2 className="w-6 h-6 sm:w-8 sm:h-8" aria-hidden="true" />
          Delete Price Alert?
        </h2>

        <div className="space-y-4">
          <p className="text-base text-text-muted text-balance">
            You are about to delete this alert:
          </p>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-gray-900 dark:text-white">
                {alert.coinName}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({alert.coinSymbol})
              </span>
            </div>
            <div
              className={`text-sm font-medium ${
                alert.condition === 'above'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              Condition: {conditionText}
            </div>
          </div>

          <p className="text-base text-text-muted text-balance">
            This action cannot be undone.
          </p>
        </div>

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
