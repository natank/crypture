/**
 * NotificationBanner Component - In-app alert notifications
 * REQ-013-notifications / Backlog Item 24 / Story 2
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PriceAlert } from 'types/alert';

interface TriggeredAlert {
  alert: PriceAlert;
  currentPrice: number;
  triggeredAt: number;
}

interface NotificationBannerProps {
  triggeredAlerts: TriggeredAlert[];
  onDismiss: (alertId: string) => void;
  onDismissAll: () => void;
  onViewAlerts: () => void;
}

export default function NotificationBanner({
  triggeredAlerts,
  onDismiss,
  onDismissAll,
  onViewAlerts,
}: NotificationBannerProps) {
  if (triggeredAlerts.length === 0) {
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  const latestAlert = triggeredAlerts[0];
  const hasMultiple = triggeredAlerts.length > 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-50 p-2"
        role="alert"
        aria-live="assertive"
      >
        <div className="max-w-2xl mx-auto">
          <div className="bg-amber-500 text-white rounded-lg shadow-lg p-3 flex items-center gap-3">
            {/* Bell Icon */}
            <span className="text-xl flex-shrink-0">🔔</span>

            {/* Alert Content */}
            <div className="flex-1 min-w-0">
              {hasMultiple ? (
                <p className="font-medium">
                  {triggeredAlerts.length} alerts triggered!
                </p>
              ) : (
                <>
                  <p className="font-medium">
                    Alert: {latestAlert.alert.coinSymbol} is now{' '}
                    {latestAlert.alert.condition === 'above'
                      ? 'above'
                      : 'below'}{' '}
                    {formatPrice(latestAlert.alert.targetPrice)}
                  </p>
                  <p className="text-sm text-amber-100">
                    Current price: {formatPrice(latestAlert.currentPrice)}
                  </p>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={onViewAlerts}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm font-medium transition-colors"
              >
                View
              </button>
              <button
                onClick={() =>
                  hasMultiple ? onDismissAll() : onDismiss(latestAlert.alert.id)
                }
                className="p-1 hover:bg-white/20 rounded transition-colors"
                aria-label="Dismiss notification"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
