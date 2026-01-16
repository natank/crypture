/**
 * useAlertPolling Hook - Periodic alert condition checking
 * REQ-013-notifications / Backlog Item 24 / Story 2
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import type { PriceAlert } from 'types/alert';
import * as alertService from '@services/alertService';
import * as notificationService from '@services/notificationService';

export interface TriggeredAlert {
  alert: PriceAlert;
  currentPrice: number;
  triggeredAt: number;
}

export interface UseAlertPollingOptions {
  /** Polling interval in milliseconds (default: 5 minutes) */
  intervalMs?: number;
  /** Whether polling is enabled (default: true) */
  enabled?: boolean;
  /** Callback when an alert is triggered */
  onAlertTriggered?: (triggered: TriggeredAlert) => void;
}

export interface UseAlertPollingReturn {
  /** Recently triggered alerts (cleared after acknowledgment) */
  triggeredAlerts: TriggeredAlert[];
  /** Whether polling is currently active */
  isPolling: boolean;
  /** Last time alerts were checked */
  lastChecked: number | null;
  /** Manually trigger a check */
  checkNow: () => void;
  /** Dismiss a triggered alert notification */
  dismissTriggeredAlert: (alertId: string) => void;
  /** Clear all triggered alert notifications */
  clearAllTriggered: () => void;
}

const DEFAULT_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function useAlertPolling(
  priceMap: Record<string, number>,
  options: UseAlertPollingOptions = {}
): UseAlertPollingReturn {
  const {
    intervalMs = DEFAULT_INTERVAL,
    enabled = true,
    onAlertTriggered,
  } = options;

  const [triggeredAlerts, setTriggeredAlerts] = useState<TriggeredAlert[]>([]);
  const [lastChecked, setLastChecked] = useState<number | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isVisibleRef = useRef(true);

  // Use refs to avoid recreating checkAlerts on every priceMap/callback change
  const priceMapRef = useRef(priceMap);
  const onAlertTriggeredRef = useRef(onAlertTriggered);

  // Keep refs in sync
  useEffect(() => {
    priceMapRef.current = priceMap;
  }, [priceMap]);

  useEffect(() => {
    onAlertTriggeredRef.current = onAlertTriggered;
  }, [onAlertTriggered]);

  const checkAlerts = useCallback(() => {
    if (!enabled) return;

    setIsPolling(true);
    const activeAlerts = alertService.getActiveAlerts();
    const newlyTriggered: TriggeredAlert[] = [];
    const currentPriceMap = priceMapRef.current;

    for (const alert of activeAlerts) {
      const currentPrice = currentPriceMap[alert.coinId];

      if (currentPrice === undefined) {
        continue; // Skip if we don't have price data
      }

      const isTriggered = alertService.checkAlertCondition(alert, currentPrice);

      if (isTriggered) {
        // Update alert status to triggered
        const updatedAlert = alertService.updateAlert(alert.id, {
          status: 'triggered',
        });

        if (updatedAlert) {
          // Add triggeredAt timestamp
          alertService.updateAlert(alert.id, {
            status: 'triggered',
          });

          const triggered: TriggeredAlert = {
            alert: { ...updatedAlert, triggeredAt: Date.now() },
            currentPrice,
            triggeredAt: Date.now(),
          };

          newlyTriggered.push(triggered);

          // Send browser notification if enabled
          if (alertService.getNotificationsEnabled()) {
            notificationService.sendAlertNotification(
              alert.coinSymbol,
              alert.condition,
              alert.targetPrice,
              currentPrice,
              alert.coinImage
            );
          }

          // Call callback if provided
          onAlertTriggeredRef.current?.(triggered);
        }
      }
    }

    if (newlyTriggered.length > 0) {
      setTriggeredAlerts((prev) => [...newlyTriggered, ...prev]);
    }

    setLastChecked(Date.now());
    alertService.updateLastCheckedTime();
    setIsPolling(false);
  }, [enabled]); // Only depend on enabled, use refs for priceMap and callback

  // Handle visibility change - pause polling when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === 'visible';

      // Check immediately when becoming visible again
      if (isVisibleRef.current && enabled) {
        checkAlerts();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, checkAlerts]);

  // Set up polling interval
  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Initial check
    checkAlerts();

    // Set up interval
    intervalRef.current = setInterval(() => {
      if (isVisibleRef.current) {
        checkAlerts();
      }
    }, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, intervalMs, checkAlerts]);

  const dismissTriggeredAlert = useCallback((alertId: string) => {
    setTriggeredAlerts((prev) => prev.filter((t) => t.alert.id !== alertId));
  }, []);

  const clearAllTriggered = useCallback(() => {
    setTriggeredAlerts([]);
  }, []);

  return {
    triggeredAlerts,
    isPolling,
    lastChecked,
    checkNow: checkAlerts,
    dismissTriggeredAlert,
    clearAllTriggered,
  };
}
