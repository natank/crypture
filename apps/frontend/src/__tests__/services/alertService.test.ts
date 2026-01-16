/**
 * Unit tests for alertService
 * REQ-013-notifications / Backlog Item 24
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as alertService from '@services/alertService';
import type { PriceAlert } from 'types/alert';

describe('alertService', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('createAlert', () => {
    it('creates a new alert with correct properties', () => {
      const input = {
        coinId: 'bitcoin',
        coinSymbol: 'btc',
        coinName: 'Bitcoin',
        condition: 'above' as const,
        targetPrice: 100000,
      };

      const alert = alertService.createAlert(input);

      expect(alert.id).toMatch(/^alert_/);
      expect(alert.coinId).toBe('bitcoin');
      expect(alert.coinSymbol).toBe('BTC'); // Should be uppercased
      expect(alert.coinName).toBe('Bitcoin');
      expect(alert.condition).toBe('above');
      expect(alert.targetPrice).toBe(100000);
      expect(alert.status).toBe('active');
      expect(alert.createdAt).toBeLessThanOrEqual(Date.now());
    });

    it('persists alert to localStorage', () => {
      const input = {
        coinId: 'bitcoin',
        coinSymbol: 'btc',
        coinName: 'Bitcoin',
        condition: 'above' as const,
        targetPrice: 100000,
      };

      alertService.createAlert(input);
      const alerts = alertService.getAllAlerts();

      expect(alerts).toHaveLength(1);
      expect(alerts[0].coinId).toBe('bitcoin');
    });

    it('throws error when max alerts reached', () => {
      // Create 50 alerts (max)
      for (let i = 0; i < 50; i++) {
        alertService.createAlert({
          coinId: `coin-${i}`,
          coinSymbol: `C${i}`,
          coinName: `Coin ${i}`,
          condition: 'above',
          targetPrice: 100,
        });
      }

      // 51st should throw
      expect(() => {
        alertService.createAlert({
          coinId: 'coin-51',
          coinSymbol: 'C51',
          coinName: 'Coin 51',
          condition: 'above',
          targetPrice: 100,
        });
      }).toThrow('Maximum of 50 alerts reached');
    });
  });

  describe('getAllAlerts', () => {
    it('returns empty array when no alerts', () => {
      const alerts = alertService.getAllAlerts();
      expect(alerts).toEqual([]);
    });

    it('returns all created alerts', () => {
      alertService.createAlert({
        coinId: 'bitcoin',
        coinSymbol: 'BTC',
        coinName: 'Bitcoin',
        condition: 'above',
        targetPrice: 100000,
      });
      alertService.createAlert({
        coinId: 'ethereum',
        coinSymbol: 'ETH',
        coinName: 'Ethereum',
        condition: 'below',
        targetPrice: 2000,
      });

      const alerts = alertService.getAllAlerts();
      expect(alerts).toHaveLength(2);
    });
  });

  describe('getAlertById', () => {
    it('returns alert by id', () => {
      const created = alertService.createAlert({
        coinId: 'bitcoin',
        coinSymbol: 'BTC',
        coinName: 'Bitcoin',
        condition: 'above',
        targetPrice: 100000,
      });

      const found = alertService.getAlertById(created.id);
      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('returns undefined for non-existent id', () => {
      const found = alertService.getAlertById('non-existent');
      expect(found).toBeUndefined();
    });
  });

  describe('updateAlert', () => {
    it('updates alert properties', () => {
      const created = alertService.createAlert({
        coinId: 'bitcoin',
        coinSymbol: 'BTC',
        coinName: 'Bitcoin',
        condition: 'above',
        targetPrice: 100000,
      });

      const updated = alertService.updateAlert(created.id, {
        targetPrice: 120000,
        condition: 'below',
      });

      expect(updated).toBeDefined();
      expect(updated?.targetPrice).toBe(120000);
      expect(updated?.condition).toBe('below');
    });

    it('returns null for non-existent alert', () => {
      const result = alertService.updateAlert('non-existent', {
        targetPrice: 100,
      });
      expect(result).toBeNull();
    });
  });

  describe('deleteAlert', () => {
    it('deletes an existing alert', () => {
      const created = alertService.createAlert({
        coinId: 'bitcoin',
        coinSymbol: 'BTC',
        coinName: 'Bitcoin',
        condition: 'above',
        targetPrice: 100000,
      });

      const success = alertService.deleteAlert(created.id);
      expect(success).toBe(true);

      const alerts = alertService.getAllAlerts();
      expect(alerts).toHaveLength(0);
    });

    it('returns false for non-existent alert', () => {
      const success = alertService.deleteAlert('non-existent');
      expect(success).toBe(false);
    });
  });

  describe('triggerAlert', () => {
    it('sets alert status to triggered', () => {
      const created = alertService.createAlert({
        coinId: 'bitcoin',
        coinSymbol: 'BTC',
        coinName: 'Bitcoin',
        condition: 'above',
        targetPrice: 100000,
      });

      const triggered = alertService.triggerAlert(created.id);
      expect(triggered?.status).toBe('triggered');
    });
  });

  describe('muteAlert', () => {
    it('sets alert status to muted', () => {
      const created = alertService.createAlert({
        coinId: 'bitcoin',
        coinSymbol: 'BTC',
        coinName: 'Bitcoin',
        condition: 'above',
        targetPrice: 100000,
      });

      const muted = alertService.muteAlert(created.id);
      expect(muted?.status).toBe('muted');
    });
  });

  describe('reactivateAlert', () => {
    it('reactivates a triggered alert', () => {
      const created = alertService.createAlert({
        coinId: 'bitcoin',
        coinSymbol: 'BTC',
        coinName: 'Bitcoin',
        condition: 'above',
        targetPrice: 100000,
      });

      alertService.triggerAlert(created.id);
      const reactivated = alertService.reactivateAlert(created.id);
      expect(reactivated?.status).toBe('active');
    });
  });

  describe('getAlertsByStatus', () => {
    it('filters alerts by status', () => {
      alertService.createAlert({
        coinId: 'bitcoin',
        coinSymbol: 'BTC',
        coinName: 'Bitcoin',
        condition: 'above',
        targetPrice: 100000,
      });
      const alert2 = alertService.createAlert({
        coinId: 'ethereum',
        coinSymbol: 'ETH',
        coinName: 'Ethereum',
        condition: 'below',
        targetPrice: 2000,
      });
      alertService.triggerAlert(alert2.id);

      const active = alertService.getActiveAlerts();
      const triggered = alertService.getTriggeredAlerts();

      expect(active).toHaveLength(1);
      expect(triggered).toHaveLength(1);
    });
  });

  describe('checkAlertCondition', () => {
    it('returns true when price is above target for "above" condition', () => {
      const alert: PriceAlert = {
        id: 'test',
        coinId: 'bitcoin',
        coinSymbol: 'BTC',
        coinName: 'Bitcoin',
        condition: 'above',
        targetPrice: 100000,
        status: 'active',
        createdAt: Date.now(),
      };

      expect(alertService.checkAlertCondition(alert, 100001)).toBe(true);
      expect(alertService.checkAlertCondition(alert, 100000)).toBe(true);
      expect(alertService.checkAlertCondition(alert, 99999)).toBe(false);
    });

    it('returns true when price is below target for "below" condition', () => {
      const alert: PriceAlert = {
        id: 'test',
        coinId: 'bitcoin',
        coinSymbol: 'BTC',
        coinName: 'Bitcoin',
        condition: 'below',
        targetPrice: 100000,
        status: 'active',
        createdAt: Date.now(),
      };

      expect(alertService.checkAlertCondition(alert, 99999)).toBe(true);
      expect(alertService.checkAlertCondition(alert, 100000)).toBe(true);
      expect(alertService.checkAlertCondition(alert, 100001)).toBe(false);
    });

    it('returns false for non-active alerts', () => {
      const triggeredAlert: PriceAlert = {
        id: 'test',
        coinId: 'bitcoin',
        coinSymbol: 'BTC',
        coinName: 'Bitcoin',
        condition: 'above',
        targetPrice: 100000,
        status: 'triggered',
        createdAt: Date.now(),
      };

      expect(alertService.checkAlertCondition(triggeredAlert, 200000)).toBe(false);
    });
  });

  describe('getAlertCount', () => {
    it('returns correct counts', () => {
      const alert1 = alertService.createAlert({
        coinId: 'bitcoin',
        coinSymbol: 'BTC',
        coinName: 'Bitcoin',
        condition: 'above',
        targetPrice: 100000,
      });
      alertService.createAlert({
        coinId: 'ethereum',
        coinSymbol: 'ETH',
        coinName: 'Ethereum',
        condition: 'below',
        targetPrice: 2000,
      });
      alertService.triggerAlert(alert1.id);

      const count = alertService.getAlertCount();

      expect(count.active).toBe(1);
      expect(count.triggered).toBe(1);
      expect(count.total).toBe(2);
    });
  });

  describe('clearAllAlerts', () => {
    it('removes all alerts', () => {
      alertService.createAlert({
        coinId: 'bitcoin',
        coinSymbol: 'BTC',
        coinName: 'Bitcoin',
        condition: 'above',
        targetPrice: 100000,
      });
      alertService.createAlert({
        coinId: 'ethereum',
        coinSymbol: 'ETH',
        coinName: 'Ethereum',
        condition: 'below',
        targetPrice: 2000,
      });

      alertService.clearAllAlerts();
      const alerts = alertService.getAllAlerts();

      expect(alerts).toHaveLength(0);
    });
  });

  describe('notification settings', () => {
    it('defaults to notifications enabled', () => {
      expect(alertService.getNotificationsEnabled()).toBe(true);
    });

    it('can toggle notifications', () => {
      alertService.setNotificationsEnabled(false);
      expect(alertService.getNotificationsEnabled()).toBe(false);

      alertService.setNotificationsEnabled(true);
      expect(alertService.getNotificationsEnabled()).toBe(true);
    });
  });
});
