/**
 * Unit tests for notificationService
 * REQ-013-notifications / Backlog Item 24 / Story 2
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import * as notificationService from '@services/notificationService';

// Create a mock Notification class that tracks constructor calls
const createMockNotification = (permission: NotificationPermission = 'default') => {
  const mockClose = vi.fn();
  const calls: Array<{ title: string; options?: NotificationOptions }> = [];

  // Create a proper class that can be instantiated with `new`
  class MockNotificationClass {
    static permission: NotificationPermission = permission;
    static requestPermission = vi.fn().mockResolvedValue('granted' as NotificationPermission);

    public onclick: ((this: Notification, ev: Event) => unknown) | null = null;
    public close = mockClose;

    constructor(title: string, options?: NotificationOptions) {
      // Track constructor calls for assertions
      calls.push({ title, options });
    }
  }

  return { MockNotificationClass, calls, mockClose };
};

describe('notificationService', () => {
  let originalNotification: typeof Notification | undefined;

  beforeEach(() => {
    vi.clearAllMocks();
    // Store original (may be undefined in jsdom)
    originalNotification = (global as { Notification?: typeof Notification })
      .Notification;
  });

  afterEach(() => {
    // Restore original or delete
    if (originalNotification) {
      Object.defineProperty(window, 'Notification', {
        value: originalNotification,
        writable: true,
        configurable: true,
      });
    } else {
      delete (window as { Notification?: typeof Notification }).Notification;
    }
  });

  describe('isNotificationSupported', () => {
    it('returns true when Notification API is available', () => {
      const { MockNotificationClass } = createMockNotification();
      Object.defineProperty(window, 'Notification', {
        value: MockNotificationClass,
        writable: true,
        configurable: true,
      });
      expect(notificationService.isNotificationSupported()).toBe(true);
    });

    it('returns false when Notification API is not available', () => {
      delete (window as { Notification?: typeof Notification }).Notification;
      expect(notificationService.isNotificationSupported()).toBe(false);
    });
  });

  describe('getPermissionStatus', () => {
    it('returns "unsupported" when Notification API is not available', () => {
      delete (window as { Notification?: typeof Notification }).Notification;
      expect(notificationService.getPermissionStatus()).toBe('unsupported');
    });

    it('returns current permission status', () => {
      const { MockNotificationClass } = createMockNotification('granted');
      Object.defineProperty(window, 'Notification', {
        value: MockNotificationClass,
        writable: true,
        configurable: true,
      });
      expect(notificationService.getPermissionStatus()).toBe('granted');
    });

    it('returns "default" when not yet requested', () => {
      const { MockNotificationClass } = createMockNotification('default');
      Object.defineProperty(window, 'Notification', {
        value: MockNotificationClass,
        writable: true,
        configurable: true,
      });
      expect(notificationService.getPermissionStatus()).toBe('default');
    });
  });

  describe('requestPermission', () => {
    it('returns "unsupported" when Notification API is not available', async () => {
      delete (window as { Notification?: typeof Notification }).Notification;
      const result = await notificationService.requestPermission();
      expect(result).toBe('unsupported');
    });

    it('returns permission result on success', async () => {
      const { MockNotificationClass } = createMockNotification();
      MockNotificationClass.requestPermission = vi.fn().mockResolvedValue('granted');
      Object.defineProperty(window, 'Notification', {
        value: MockNotificationClass,
        writable: true,
        configurable: true,
      });

      const result = await notificationService.requestPermission();
      expect(result).toBe('granted');
    });

    it('returns "denied" on error', async () => {
      const { MockNotificationClass } = createMockNotification();
      MockNotificationClass.requestPermission = vi
        .fn()
        .mockRejectedValue(new Error('Test error'));
      Object.defineProperty(window, 'Notification', {
        value: MockNotificationClass,
        writable: true,
        configurable: true,
      });

      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const result = await notificationService.requestPermission();

      expect(result).toBe('denied');
      consoleSpy.mockRestore();
    });
  });

  describe('sendNotification', () => {
    it('returns false when Notification API is not available', () => {
      delete (window as { Notification?: typeof Notification }).Notification;
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = notificationService.sendNotification({
        title: 'Test',
        body: 'Test body',
      });

      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });

    it('returns false when permission is not granted', () => {
      const { MockNotificationClass } = createMockNotification('denied');
      Object.defineProperty(window, 'Notification', {
        value: MockNotificationClass,
        writable: true,
        configurable: true,
      });
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = notificationService.sendNotification({
        title: 'Test',
        body: 'Test body',
      });

      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });

    it('creates notification when permission is granted', () => {
      const { MockNotificationClass, calls } = createMockNotification('granted');
      Object.defineProperty(window, 'Notification', {
        value: MockNotificationClass,
        writable: true,
        configurable: true,
      });

      const result = notificationService.sendNotification({
        title: 'Test Alert',
        body: 'Price reached target',
      });

      expect(result).toBe(true);
      expect(calls).toHaveLength(1);
      expect(calls[0].title).toBe('Test Alert');
      expect(calls[0].options).toEqual(
        expect.objectContaining({
          body: 'Price reached target',
        })
      );
    });
  });

  describe('sendAlertNotification', () => {
    it('formats price alert notification correctly for "above" condition', () => {
      const { MockNotificationClass, calls } = createMockNotification('granted');
      Object.defineProperty(window, 'Notification', {
        value: MockNotificationClass,
        writable: true,
        configurable: true,
      });

      notificationService.sendAlertNotification('BTC', 'above', 100000, 101000);

      expect(calls).toHaveLength(1);
      expect(calls[0].title).toBe('🔔 Price Alert: BTC');
      expect(calls[0].options?.body).toContain('above');
    });

    it('formats price alert notification correctly for "below" condition', () => {
      const { MockNotificationClass, calls } = createMockNotification('granted');
      Object.defineProperty(window, 'Notification', {
        value: MockNotificationClass,
        writable: true,
        configurable: true,
      });

      notificationService.sendAlertNotification('ETH', 'below', 2500, 2400);

      expect(calls).toHaveLength(1);
      expect(calls[0].title).toBe('🔔 Price Alert: ETH');
      expect(calls[0].options?.body).toContain('below');
    });
  });
});
