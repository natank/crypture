/**
 * useAlerts Hook - Alert state management
 * REQ-013-notifications / Backlog Item 24
 */

import { useState, useCallback, useEffect } from 'react';
import type { PriceAlert, CreateAlertInput, UpdateAlertInput } from 'types/alert';
import * as alertService from '@services/alertService';

export interface UseAlertsReturn {
  alerts: PriceAlert[];
  activeAlerts: PriceAlert[];
  triggeredAlerts: PriceAlert[];
  mutedAlerts: PriceAlert[];
  alertCount: { active: number; triggered: number; muted: number; total: number };
  isLoading: boolean;
  error: string | null;
  createAlert: (input: CreateAlertInput) => PriceAlert | null;
  updateAlert: (id: string, updates: UpdateAlertInput) => PriceAlert | null;
  deleteAlert: (id: string) => boolean;
  muteAlert: (id: string) => PriceAlert | null;
  reactivateAlert: (id: string) => PriceAlert | null;
  refreshAlerts: () => void;
}

export function useAlerts(): UseAlertsReturn {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshAlerts = useCallback(() => {
    try {
      const loadedAlerts = alertService.getAllAlerts();
      setAlerts(loadedAlerts);
      setError(null);
    } catch (err) {
      setError('Failed to load alerts');
      console.error('Failed to load alerts:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshAlerts();
  }, [refreshAlerts]);

  const createAlert = useCallback((input: CreateAlertInput): PriceAlert | null => {
    try {
      const newAlert = alertService.createAlert(input);
      refreshAlerts();
      return newAlert;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create alert';
      setError(message);
      return null;
    }
  }, [refreshAlerts]);

  const updateAlert = useCallback((id: string, updates: UpdateAlertInput): PriceAlert | null => {
    try {
      const updated = alertService.updateAlert(id, updates);
      if (updated) {
        refreshAlerts();
      }
      return updated;
    } catch {
      setError('Failed to update alert');
      return null;
    }
  }, [refreshAlerts]);

  const deleteAlert = useCallback((id: string): boolean => {
    try {
      const success = alertService.deleteAlert(id);
      if (success) {
        refreshAlerts();
      }
      return success;
    } catch {
      setError('Failed to delete alert');
      return false;
    }
  }, [refreshAlerts]);

  const muteAlert = useCallback((id: string): PriceAlert | null => {
    try {
      const muted = alertService.muteAlert(id);
      if (muted) {
        refreshAlerts();
      }
      return muted;
    } catch {
      setError('Failed to mute alert');
      return null;
    }
  }, [refreshAlerts]);

  const reactivateAlert = useCallback((id: string): PriceAlert | null => {
    try {
      const reactivated = alertService.reactivateAlert(id);
      if (reactivated) {
        refreshAlerts();
      }
      return reactivated;
    } catch {
      setError('Failed to reactivate alert');
      return null;
    }
  }, [refreshAlerts]);

  const activeAlerts = alerts.filter((a) => a.status === 'active');
  const triggeredAlerts = alerts.filter((a) => a.status === 'triggered');
  const mutedAlerts = alerts.filter((a) => a.status === 'muted');
  const alertCount = {
    active: activeAlerts.length,
    triggered: triggeredAlerts.length,
    muted: mutedAlerts.length,
    total: alerts.length,
  };

  return {
    alerts,
    activeAlerts,
    triggeredAlerts,
    mutedAlerts,
    alertCount,
    isLoading,
    error,
    createAlert,
    updateAlert,
    deleteAlert,
    muteAlert,
    reactivateAlert,
    refreshAlerts,
  };
}
