/**
 * Unit tests for notificationService
 * REQ-013-notifications / Backlog Item 24 / Story 2
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import * as notificationService from '@services/notificationService';

// Create a mock Notification class using a proper class-based approach
const createMockNotification = (permission: NotificationPermission = 'default') => {
  const mockClose = vi.fn();

  // Create a proper class that can be instantiated with `new`
  class MockNotificationClass {
    static permission: NotificationPermission = permission;
    static requestPermission = vi.fn().mockResolvedValue('granted' as NotificationPermission);

    public onclick: ((this: Notification, ev: Event) => unknown) | null = null;
    public close = mockClose;

    constructor(_title: string, _options?: NotificationOptions) {
      // Constructor captures title/options if needed for assertions
    }
  }

  // Wrap with vi.fn() to enable toHaveBeenCalledWith assertions
  const SpyableCtor = vi.fn(
    (title: string, options?: NotificationOptions) =>
      new MockNotificationClass(title, options)
  ) as unknown as typeof Notification;

  // Copy static properties to the spyable constructor
  Object.defineProperty(SpyableCtor, 'permission', {
    get: () => MockNotificationClass.permission,
    set: (v: NotificationPermission) => (MockNotificationClass.permission = v),
    configurable: true,
  });

  (SpyableCtor as typeof Notification).requestPermission =
    MockNotificationClass.requestPermission;

  return SpyableCtor;
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
    // Restore original
    if (originalNotification) {
      (global as { Notification?: typeof Notification }).Notification =
        originalNotification;
    } else {
      delete (global as { Notification?: typeof Notification }).Notification;
    }
  });

  describe('isNotificationSupported', () => {
    it('returns true when Notification API is available', () => {
      (global as { Notification?: typeof Notification }).Notification =
        createMockNotification();
      expect(notificationService.isNotificationSupported()).toBe(true);
    });

    it('returns false when Notification API is not available', () => {
      delete (global as { Notification?: typeof Notification }).Notification;
      expect(notificationService.isNotificationSupported()).toBe(false);
    });
  });

  describe('getPermissionStatus', () => {
    it('returns "unsupported" when Notification API is not available', () => {
      delete (global as { Notification?: typeof Notification }).Notification;
      expect(notificationService.getPermissionStatus()).toBe('unsupported');
    });

    it('returns current permission status', () => {
      (global as { Notification?: typeof Notification }).Notification =
        createMockNotification('granted');
      expect(notificationService.getPermissionStatus()).toBe('granted');
    });

    it('returns "default" when not yet requested', () => {
      (global as { Notification?: typeof Notification }).Notification =
        createMockNotification('default');
      expect(notificationService.getPermissionStatus()).toBe('default');
    });
  });

  describe('requestPermission', () => {
    it('returns "unsupported" when Notification API is not available', async () => {
      delete (global as { Notification?: typeof Notification }).Notification;
      const result = await notificationService.requestPermission();
      expect(result).toBe('unsupported');
    });

    it('returns permission result on success', async () => {
      const MockNotif = createMockNotification();
      MockNotif.requestPermission = vi.fn().mockResolvedValue('granted');
      (global as { Notification?: typeof Notification }).Notification =
        MockNotif;

      const result = await notificationService.requestPermission();
      expect(result).toBe('granted');
    });

    it('returns "denied" on error', async () => {
      const MockNotif = createMockNotification();
      MockNotif.requestPermission = vi
        .fn()
        .mockRejectedValue(new Error('Test error'));
      (global as { Notification?: typeof Notification }).Notification =
        MockNotif;

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
      delete (global as { Notification?: typeof Notification }).Notification;
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = notificationService.sendNotification({
        title: 'Test',
        body: 'Test body',
      });

      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });

    it('returns false when permission is not granted', () => {
      (global as { Notification?: typeof Notification }).Notification =
        createMockNotification('denied');
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = notificationService.sendNotification({
        title: 'Test',
        body: 'Test body',
      });

      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });

    it('creates notification when permission is granted', () => {
      const MockNotif = createMockNotification('granted');
      (global as { Notification?: typeof Notification }).Notification =
        MockNotif;

      const result = notificationService.sendNotification({
        title: 'Test Alert',
        body: 'Price reached target',
      });

      expect(result).toBe(true);
      expect(MockNotif).toHaveBeenCalledWith(
        'Test Alert',
        expect.objectContaining({
          body: 'Price reached target',
        })
      );
    });
  });

  describe('sendAlertNotification', () => {
    it('formats price alert notification correctly for "above" condition', () => {
      const MockNotif = createMockNotification('granted');
      (global as { Notification?: typeof Notification }).Notification =
        MockNotif;

      notificationService.sendAlertNotification('BTC', 'above', 100000, 101000);

      expect(MockNotif).toHaveBeenCalledWith(
        '🔔 Price Alert: BTC',
        expect.objectContaining({
          body: expect.stringContaining('above'),
        })
      );
    });

    it('formats price alert notification correctly for "below" condition', () => {
      const MockNotif = createMockNotification('granted');
      (global as { Notification?: typeof Notification }).Notification =
        MockNotif;

      notificationService.sendAlertNotification('ETH', 'below', 2500, 2400);

      expect(MockNotif).toHaveBeenCalledWith(
        '🔔 Price Alert: ETH',
        expect.objectContaining({
          body: expect.stringContaining('below'),
        })
      );
    });
  });
});
