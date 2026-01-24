/**
 * AlertsPanel Component - Slide-out panel for alert management
 * REQ-013-notifications / Backlog Item 24
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AlertForm from '@components/AlertForm';
import AlertList from '@components/AlertList';
import type {
  PriceAlert,
  CreateAlertInput,
  UpdateAlertInput,
} from 'types/alert';
import type { MarketCoin } from 'types/market';

interface AlertsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  availableCoins: MarketCoin[];
  portfolioCoins?: MarketCoin[];
  activeAlerts: PriceAlert[];
  triggeredAlerts: PriceAlert[];
  mutedAlerts: PriceAlert[];
  isLoading: boolean;
  error: string | null;
  createAlert: (input: CreateAlertInput) => PriceAlert | null;
  updateAlert: (id: string, updates: UpdateAlertInput) => PriceAlert | null;
  deleteAlert: (id: string) => boolean;
  muteAlert: (id: string) => PriceAlert | null;
  reactivateAlert: (id: string) => PriceAlert | null;
}

export default function AlertsPanel({
  isOpen,
  onClose,
  availableCoins,
  portfolioCoins = [],
  activeAlerts,
  triggeredAlerts,
  mutedAlerts,
  isLoading,
  error,
  createAlert,
  updateAlert,
  deleteAlert,
  muteAlert,
  reactivateAlert,
}: AlertsPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingAlert, setEditingAlert] = useState<PriceAlert | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showForm) {
          setShowForm(false);
          setEditingAlert(null);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
    return undefined;
  }, [isOpen, showForm, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen && panelRef.current) {
      panelRef.current.focus();
    }
  }, [isOpen]);

  const handleCreateAlert = (input: CreateAlertInput) => {
    if (editingAlert) {
      updateAlert(editingAlert.id, {
        condition: input.condition,
        targetPrice: input.targetPrice,
      });
    } else {
      createAlert(input);
    }
    setShowForm(false);
    setEditingAlert(null);
  };

  const handleEdit = (alert: PriceAlert) => {
    setEditingAlert(alert);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingAlert(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={onClose}
            aria-hidden="true"
            data-testid="alerts-backdrop"
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl z-50 overflow-hidden flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Price Alerts"
            tabIndex={-1}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                🔔 Price Alerts
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Close alerts panel"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {showForm ? (
                <AlertForm
                  onSubmit={handleCreateAlert}
                  onCancel={handleCancelForm}
                  editAlert={editingAlert ?? undefined}
                  availableCoins={availableCoins}
                  portfolioCoins={portfolioCoins}
                  isLoading={isLoading}
                />
              ) : (
                <>
                  {/* Create Alert Button */}
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors mb-4 focus-ring"
                  >
                    <span className="text-lg">+</span>
                    Create Alert
                  </button>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Loading State */}
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
                    </div>
                  ) : (
                    <>
                      {/* Active Alerts */}
                      <AlertList
                        alerts={activeAlerts}
                        title="Active Alerts"
                        emptyMessage="No active alerts. Create one to get notified!"
                        onEdit={handleEdit}
                        onDelete={deleteAlert}
                        onMute={muteAlert}
                      />

                      {/* Triggered Alerts */}
                      {triggeredAlerts.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <AlertList
                            alerts={triggeredAlerts}
                            title="Triggered"
                            onDelete={deleteAlert}
                            onReactivate={reactivateAlert}
                          />
                        </div>
                      )}

                      {/* Muted Alerts (future) */}
                      {mutedAlerts.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <AlertList
                            alerts={mutedAlerts}
                            title="Muted"
                            onDelete={deleteAlert}
                            onReactivate={reactivateAlert}
                          />
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400">
              Alerts are checked when the app is open
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
