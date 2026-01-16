/**
 * Alert Service - CRUD operations and localStorage persistence
 * REQ-013-notifications / Backlog Item 24
 */

import type { PriceAlert, CreateAlertInput, UpdateAlertInput, AlertStatus } from 'types/alert';

const ALERTS_STORAGE_KEY = 'crypture_alerts';
const MAX_ALERTS = 50;

export interface StoredAlerts {
  alerts: PriceAlert[];
  notificationsEnabled: boolean;
  lastChecked: number;
}

function generateId(): string {
  return `alert_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function loadFromStorage(): StoredAlerts {
  try {
    const raw = localStorage.getItem(ALERTS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load alerts from localStorage:', err);
  }
  return {
    alerts: [],
    notificationsEnabled: true,
    lastChecked: Date.now(),
  };
}

function saveToStorage(data: StoredAlerts): void {
  try {
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save alerts to localStorage:', err);
  }
}

// --- CRUD Operations ---

export function getAllAlerts(): PriceAlert[] {
  return loadFromStorage().alerts;
}

export function getAlertById(id: string): PriceAlert | undefined {
  return loadFromStorage().alerts.find((alert) => alert.id === id);
}

export function getAlertsByStatus(status: AlertStatus): PriceAlert[] {
  return loadFromStorage().alerts.filter((alert) => alert.status === status);
}

export function getActiveAlerts(): PriceAlert[] {
  return getAlertsByStatus('active');
}

export function getTriggeredAlerts(): PriceAlert[] {
  return getAlertsByStatus('triggered');
}

export function createAlert(input: CreateAlertInput): PriceAlert {
  const stored = loadFromStorage();
  
  if (stored.alerts.length >= MAX_ALERTS) {
    throw new Error(`Maximum of ${MAX_ALERTS} alerts reached. Please delete some alerts first.`);
  }

  const newAlert: PriceAlert = {
    id: generateId(),
    coinId: input.coinId,
    coinSymbol: input.coinSymbol.toUpperCase(),
    coinName: input.coinName,
    coinImage: input.coinImage,
    condition: input.condition,
    targetPrice: input.targetPrice,
    status: 'active',
    createdAt: Date.now(),
  };

  stored.alerts.unshift(newAlert); // Add to beginning
  saveToStorage(stored);
  
  return newAlert;
}

export function updateAlert(id: string, updates: UpdateAlertInput): PriceAlert | null {
  const stored = loadFromStorage();
  const index = stored.alerts.findIndex((alert) => alert.id === id);
  
  if (index === -1) {
    return null;
  }

  const updatedAlert = {
    ...stored.alerts[index],
    ...updates,
  };
  
  stored.alerts[index] = updatedAlert;
  saveToStorage(stored);
  
  return updatedAlert;
}

export function deleteAlert(id: string): boolean {
  const stored = loadFromStorage();
  const index = stored.alerts.findIndex((alert) => alert.id === id);
  
  if (index === -1) {
    return false;
  }

  stored.alerts.splice(index, 1);
  saveToStorage(stored);
  
  return true;
}

export function triggerAlert(id: string): PriceAlert | null {
  return updateAlert(id, {
    status: 'triggered',
  });
}

export function muteAlert(id: string): PriceAlert | null {
  return updateAlert(id, {
    status: 'muted',
  });
}

export function reactivateAlert(id: string): PriceAlert | null {
  return updateAlert(id, {
    status: 'active',
  });
}

// --- Notification Settings ---

export function getNotificationsEnabled(): boolean {
  return loadFromStorage().notificationsEnabled;
}

export function setNotificationsEnabled(enabled: boolean): void {
  const stored = loadFromStorage();
  stored.notificationsEnabled = enabled;
  saveToStorage(stored);
}

// --- Alert Checking ---

export function checkAlertCondition(alert: PriceAlert, currentPrice: number): boolean {
  if (alert.status !== 'active') {
    return false;
  }
  
  if (alert.condition === 'above') {
    return currentPrice >= alert.targetPrice;
  } else {
    return currentPrice <= alert.targetPrice;
  }
}

export function getLastCheckedTime(): number {
  return loadFromStorage().lastChecked;
}

export function updateLastCheckedTime(): void {
  const stored = loadFromStorage();
  stored.lastChecked = Date.now();
  saveToStorage(stored);
}

// --- Utility ---

export function clearAllAlerts(): void {
  const stored = loadFromStorage();
  stored.alerts = [];
  saveToStorage(stored);
}

export function getAlertCount(): { active: number; triggered: number; total: number } {
  const alerts = getAllAlerts();
  return {
    active: alerts.filter((a) => a.status === 'active').length,
    triggered: alerts.filter((a) => a.status === 'triggered').length,
    total: alerts.length,
  };
}
