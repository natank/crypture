import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useAlertPolling } from '@hooks/useAlertPolling';
import * as alertService from '@services/alertService';
import * as notificationService from '@services/notificationService';
import type { PriceAlert } from 'types/alert';

// Mock the services
vi.mock('@services/alertService', () => ({
  getActiveAlerts: vi.fn(),
  checkAlertCondition: vi.fn(),
  updateAlert: vi.fn(),
  getNotificationsEnabled: vi.fn(),
  updateLastCheckedTime: vi.fn(),
}));

vi.mock('@services/notificationService', () => ({
  sendAlertNotification: vi.fn(),
}));

const mockActiveAlert: PriceAlert = {
  id: 'alert-1',
  coinId: 'bitcoin',
  coinSymbol: 'BTC',
  coinName: 'Bitcoin',
  coinImage: 'https://example.com/btc.png',
  condition: 'above',
  targetPrice: 55000,
  status: 'active',
  createdAt: Date.now(),
};

const mockActiveAlert2: PriceAlert = {
  id: 'alert-2',
  coinId: 'ethereum',
  coinSymbol: 'ETH',
  coinName: 'Ethereum',
  condition: 'below',
  targetPrice: 2500,
  status: 'active',
  createdAt: Date.now(),
};

describe('useAlertPolling', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    // Default mock implementations
    vi.mocked(alertService.getActiveAlerts).mockReturnValue([]);
    vi.mocked(alertService.checkAlertCondition).mockReturnValue(false);
    vi.mocked(alertService.getNotificationsEnabled).mockReturnValue(false);
    vi.mocked(alertService.updateAlert).mockImplementation((id, updates) => ({
      ...mockActiveAlert,
      id,
      ...updates,
    }));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns initial state correctly', () => {
    const priceMap = { bitcoin: 50000 };

    const { result } = renderHook(() =>
      useAlertPolling(priceMap, { enabled: false })
    );

    expect(result.current.triggeredAlerts).toEqual([]);
    expect(result.current.isPolling).toBe(false);
    expect(result.current.lastChecked).toBe(null);
  });

  it('checks alerts immediately when enabled', () => {
    const priceMap = { bitcoin: 50000 };
    vi.mocked(alertService.getActiveAlerts).mockReturnValue([mockActiveAlert]);

    renderHook(() => useAlertPolling(priceMap, { enabled: true }));

    expect(alertService.getActiveAlerts).toHaveBeenCalled();
  });

  it('does not check alerts when disabled', () => {
    const priceMap = { bitcoin: 50000 };

    renderHook(() => useAlertPolling(priceMap, { enabled: false }));

    expect(alertService.getActiveAlerts).not.toHaveBeenCalled();
  });

  it('checks alerts at specified interval', () => {
    const priceMap = { bitcoin: 50000 };
    vi.mocked(alertService.getActiveAlerts).mockReturnValue([]);

    renderHook(() =>
      useAlertPolling(priceMap, { enabled: true, intervalMs: 60000 })
    );

    // Initial check
    expect(alertService.getActiveAlerts).toHaveBeenCalledTimes(1);

    // Advance by 1 minute
    act(() => {
      vi.advanceTimersByTime(60000);
    });

    expect(alertService.getActiveAlerts).toHaveBeenCalledTimes(2);

    // Advance by another minute
    act(() => {
      vi.advanceTimersByTime(60000);
    });

    expect(alertService.getActiveAlerts).toHaveBeenCalledTimes(3);
  });

  it('triggers alert when condition is met', () => {
    const priceMap = { bitcoin: 60000 }; // Price above target
    vi.mocked(alertService.getActiveAlerts).mockReturnValue([mockActiveAlert]);
    vi.mocked(alertService.checkAlertCondition).mockReturnValue(true);

    const { result } = renderHook(() =>
      useAlertPolling(priceMap, { enabled: true })
    );

    expect(alertService.updateAlert).toHaveBeenCalledWith('alert-1', {
      status: 'triggered',
    });
    expect(result.current.triggeredAlerts).toHaveLength(1);
    expect(result.current.triggeredAlerts[0].alert.id).toBe('alert-1');
    expect(result.current.triggeredAlerts[0].currentPrice).toBe(60000);
  });

  it('does not trigger alert when condition is not met', () => {
    const priceMap = { bitcoin: 50000 }; // Price below target
    vi.mocked(alertService.getActiveAlerts).mockReturnValue([mockActiveAlert]);
    vi.mocked(alertService.checkAlertCondition).mockReturnValue(false);

    const { result } = renderHook(() =>
      useAlertPolling(priceMap, { enabled: true })
    );

    expect(alertService.updateAlert).not.toHaveBeenCalled();
    expect(result.current.triggeredAlerts).toHaveLength(0);
  });

  it('skips alerts without price data', () => {
    const priceMap = {}; // No price data for bitcoin
    vi.mocked(alertService.getActiveAlerts).mockReturnValue([mockActiveAlert]);

    const { result } = renderHook(() =>
      useAlertPolling(priceMap, { enabled: true })
    );

    expect(alertService.checkAlertCondition).not.toHaveBeenCalled();
    expect(result.current.triggeredAlerts).toHaveLength(0);
  });

  it('sends browser notification when enabled', () => {
    const priceMap = { bitcoin: 60000 };
    vi.mocked(alertService.getActiveAlerts).mockReturnValue([mockActiveAlert]);
    vi.mocked(alertService.checkAlertCondition).mockReturnValue(true);
    vi.mocked(alertService.getNotificationsEnabled).mockReturnValue(true);

    renderHook(() => useAlertPolling(priceMap, { enabled: true }));

    expect(notificationService.sendAlertNotification).toHaveBeenCalledWith(
      'BTC',
      'above',
      55000,
      60000,
      'https://example.com/btc.png'
    );
  });

  it('does not send browser notification when disabled', () => {
    const priceMap = { bitcoin: 60000 };
    vi.mocked(alertService.getActiveAlerts).mockReturnValue([mockActiveAlert]);
    vi.mocked(alertService.checkAlertCondition).mockReturnValue(true);
    vi.mocked(alertService.getNotificationsEnabled).mockReturnValue(false);

    renderHook(() => useAlertPolling(priceMap, { enabled: true }));

    expect(notificationService.sendAlertNotification).not.toHaveBeenCalled();
  });

  it('calls onAlertTriggered callback when alert triggers', () => {
    const priceMap = { bitcoin: 60000 };
    const onAlertTriggered = vi.fn();
    vi.mocked(alertService.getActiveAlerts).mockReturnValue([mockActiveAlert]);
    vi.mocked(alertService.checkAlertCondition).mockReturnValue(true);

    renderHook(() =>
      useAlertPolling(priceMap, { enabled: true, onAlertTriggered })
    );

    expect(onAlertTriggered).toHaveBeenCalledTimes(1);
    expect(onAlertTriggered).toHaveBeenCalledWith(
      expect.objectContaining({
        alert: expect.objectContaining({ id: 'alert-1' }),
        currentPrice: 60000,
      })
    );
  });

  it('updates lastChecked timestamp after checking', () => {
    const priceMap = { bitcoin: 50000 };
    vi.mocked(alertService.getActiveAlerts).mockReturnValue([]);

    const { result } = renderHook(() =>
      useAlertPolling(priceMap, { enabled: true })
    );

    expect(result.current.lastChecked).not.toBe(null);
    expect(alertService.updateLastCheckedTime).toHaveBeenCalled();
  });

  it('checkNow triggers immediate check', () => {
    const priceMap = { bitcoin: 50000 };
    vi.mocked(alertService.getActiveAlerts).mockReturnValue([]);

    const { result } = renderHook(() =>
      useAlertPolling(priceMap, { enabled: true })
    );

    // Initial check
    expect(alertService.getActiveAlerts).toHaveBeenCalledTimes(1);

    // Manual check
    act(() => {
      result.current.checkNow();
    });

    expect(alertService.getActiveAlerts).toHaveBeenCalledTimes(2);
  });

  it('dismissTriggeredAlert removes specific alert from list', () => {
    const priceMap = { bitcoin: 60000, ethereum: 2000 };
    vi.mocked(alertService.getActiveAlerts).mockReturnValue([
      mockActiveAlert,
      mockActiveAlert2,
    ]);
    vi.mocked(alertService.checkAlertCondition).mockReturnValue(true);
    vi.mocked(alertService.updateAlert).mockImplementation((id) => ({
      ...(id === 'alert-1' ? mockActiveAlert : mockActiveAlert2),
      status: 'triggered',
    }));

    const { result } = renderHook(() =>
      useAlertPolling(priceMap, { enabled: true })
    );

    expect(result.current.triggeredAlerts).toHaveLength(2);

    act(() => {
      result.current.dismissTriggeredAlert('alert-1');
    });

    expect(result.current.triggeredAlerts).toHaveLength(1);
    expect(result.current.triggeredAlerts[0].alert.id).toBe('alert-2');
  });

  it('clearAllTriggered removes all triggered alerts', () => {
    const priceMap = { bitcoin: 60000, ethereum: 2000 };
    vi.mocked(alertService.getActiveAlerts).mockReturnValue([
      mockActiveAlert,
      mockActiveAlert2,
    ]);
    vi.mocked(alertService.checkAlertCondition).mockReturnValue(true);

    const { result } = renderHook(() =>
      useAlertPolling(priceMap, { enabled: true })
    );

    expect(result.current.triggeredAlerts).toHaveLength(2);

    act(() => {
      result.current.clearAllTriggered();
    });

    expect(result.current.triggeredAlerts).toHaveLength(0);
  });

  it('clears interval on unmount', () => {
    const priceMap = { bitcoin: 50000 };
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');

    const { unmount } = renderHook(() =>
      useAlertPolling(priceMap, { enabled: true, intervalMs: 60000 })
    );

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it('stops polling when enabled changes to false', () => {
    const priceMap = { bitcoin: 50000 };
    vi.mocked(alertService.getActiveAlerts).mockReturnValue([]);

    const { rerender } = renderHook(
      ({ enabled }) =>
        useAlertPolling(priceMap, { enabled, intervalMs: 60000 }),
      { initialProps: { enabled: true } }
    );

    // Initial check
    expect(alertService.getActiveAlerts).toHaveBeenCalledTimes(1);

    // Disable polling
    rerender({ enabled: false });

    // Advance time - should not trigger more checks
    act(() => {
      vi.advanceTimersByTime(120000);
    });

    // Still only 1 call (the initial one)
    expect(alertService.getActiveAlerts).toHaveBeenCalledTimes(1);
  });

  it('handles multiple alerts triggering at once', () => {
    const priceMap = { bitcoin: 60000, ethereum: 2000 };
    vi.mocked(alertService.getActiveAlerts).mockReturnValue([
      mockActiveAlert,
      mockActiveAlert2,
    ]);
    vi.mocked(alertService.checkAlertCondition).mockReturnValue(true);

    const { result } = renderHook(() =>
      useAlertPolling(priceMap, { enabled: true })
    );

    expect(result.current.triggeredAlerts).toHaveLength(2);
    expect(alertService.updateAlert).toHaveBeenCalledTimes(4); // 2 alerts × 2 calls each
  });

  it('uses default interval of 5 minutes', () => {
    const priceMap = { bitcoin: 50000 };
    vi.mocked(alertService.getActiveAlerts).mockReturnValue([]);

    renderHook(() => useAlertPolling(priceMap, { enabled: true }));

    // Initial check
    expect(alertService.getActiveAlerts).toHaveBeenCalledTimes(1);

    // Advance by 4 minutes - should not trigger
    act(() => {
      vi.advanceTimersByTime(4 * 60 * 1000);
    });
    expect(alertService.getActiveAlerts).toHaveBeenCalledTimes(1);

    // Advance by 1 more minute (total 5 minutes) - should trigger
    act(() => {
      vi.advanceTimersByTime(60 * 1000);
    });
    expect(alertService.getActiveAlerts).toHaveBeenCalledTimes(2);
  });
});
