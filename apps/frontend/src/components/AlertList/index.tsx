/**
 * AlertList Component - Display and manage alerts
 * REQ-013-notifications / Backlog Item 24
 */

import { useState } from 'react';
import { Bell, VolumeX, Trash2, Edit, Circle, Check } from 'lucide-react';
import AlertDeleteConfirmationModal from '@components/AlertDeleteConfirmationModal';
import type { PriceAlert } from 'types/alert';

interface AlertListProps {
  alerts: PriceAlert[];
  title: string;
  emptyMessage?: string;
  onEdit?: (alert: PriceAlert) => void;
  onDelete?: (id: string) => void;
  onMute?: (id: string) => void;
  onReactivate?: (id: string) => void;
}

export default function AlertList({
  alerts,
  title,
  emptyMessage = 'No alerts',
  onEdit,
  onDelete,
  onMute,
  onReactivate,
}: AlertListProps) {
  if (alerts.length === 0) {
    return (
      <div className="py-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-400 dark:text-gray-500 italic">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="py-2">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
        {title} ({alerts.length})
      </h3>
      <div className="space-y-2">
        {alerts.map((alert) => (
          <AlertItem
            key={alert.id}
            alert={alert}
            onEdit={onEdit}
            onDelete={onDelete}
            onMute={onMute}
            onReactivate={onReactivate}
          />
        ))}
      </div>
    </div>
  );
}

interface AlertItemProps {
  alert: PriceAlert;
  onEdit?: (alert: PriceAlert) => void;
  onDelete?: (id: string) => void;
  onMute?: (id: string) => void;
  onReactivate?: (id: string) => void;
}

function AlertItem({
  alert,
  onEdit,
  onDelete,
  onMute,
  onReactivate,
}: AlertItemProps) {
  const [showActions, setShowActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  const formatRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const statusConfig = {
    active: {
      badge: (
        <Circle
          className="w-3 h-3 text-green-500 fill-green-500"
          aria-hidden="true"
        />
      ),
      label: 'Active',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
    },
    triggered: {
      badge: <Check className="w-3 h-3 text-amber-500" aria-hidden="true" />,
      label: 'Triggered',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      borderColor: 'border-amber-200 dark:border-amber-800',
    },
    muted: {
      badge: <VolumeX className="w-3 h-3 text-gray-500" aria-hidden="true" />,
      label: 'Muted',
      bgColor: 'bg-gray-50 dark:bg-gray-800',
      borderColor: 'border-gray-200 dark:border-gray-700',
    },
  };

  const config = statusConfig[alert.status];
  const conditionSymbol = alert.condition === 'above' ? '>' : '<';

  return (
    <div
      data-testid="alert-item"
      className={`relative p-3 rounded-lg border ${config.bgColor} ${config.borderColor}`}
    >
      <div className="flex items-start gap-3">
        {/* Coin Image */}
        {alert.coinImage && (
          <img
            src={alert.coinImage}
            alt={alert.coinName}
            className="w-8 h-8 rounded-full flex-shrink-0"
          />
        )}

        {/* Alert Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 dark:text-white">
              {alert.coinSymbol}
            </span>
            <span
              className={`text-sm ${
                alert.condition === 'above'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {conditionSymbol} {formatPrice(alert.targetPrice)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs">{config.badge}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {config.label}
            </span>
            {alert.triggeredAt && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                • {formatRelativeTime(alert.triggeredAt)}
              </span>
            )}
          </div>
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Alert actions"
          >
            ⋮
          </button>
          {showActions && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowActions(false)}
              />
              <div className="absolute right-0 mt-1 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-[120px]">
                {alert.status === 'active' && onEdit && (
                  <button
                    onClick={() => {
                      onEdit(alert);
                      setShowActions(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" aria-hidden="true" />
                    Edit
                  </button>
                )}
                {alert.status === 'active' && onMute && (
                  <button
                    onClick={() => {
                      onMute(alert.id);
                      setShowActions(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <VolumeX className="w-4 h-4" aria-hidden="true" />
                    Mute
                  </button>
                )}
                {(alert.status === 'muted' || alert.status === 'triggered') &&
                  onReactivate && (
                    <button
                      onClick={() => {
                        onReactivate(alert.id);
                        setShowActions(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <Bell className="w-4 h-4" aria-hidden="true" />
                      Reactivate
                    </button>
                  )}
                {onDelete && (
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setShowActions(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                    Delete
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <AlertDeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onConfirm={() => {
          onDelete?.(alert.id);
          setShowDeleteConfirm(false);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
        alert={{
          coinName: alert.coinName,
          coinSymbol: alert.coinSymbol,
          condition: alert.condition,
          targetPrice: alert.targetPrice,
        }}
      />
    </div>
  );
}
