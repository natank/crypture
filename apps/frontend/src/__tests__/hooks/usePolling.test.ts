import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { usePolling } from '@hooks/usePolling';

describe('usePolling', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllTimers();
  });

  it('calls the callback immediately if immediate=true', () => {
    vi.useFakeTimers(); // ✅ needed here

    const callback = vi.fn();
    renderHook(() => usePolling(callback, { interval: 1000, immediate: true }));

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not call the callback immediately if immediate=false', () => {
    vi.useFakeTimers(); // ✅

    const callback = vi.fn();
    renderHook(() =>
      usePolling(callback, { interval: 1000, immediate: false })
    );

    expect(callback).not.toHaveBeenCalled();
  });

  it('calls the callback on each interval', () => {
    vi.useFakeTimers(); // ✅

    const callback = vi.fn();
    renderHook(() => usePolling(callback, { interval: 5000 }));

    expect(callback).toHaveBeenCalledTimes(1); // immediate by default

    vi.advanceTimersByTime(15000);
    expect(callback).toHaveBeenCalledTimes(4); // 1 immediate + 3 intervals
  });

  it('clears the interval on unmount', () => {
    vi.useFakeTimers(); // ✅

    const clearSpy = vi.spyOn(globalThis, 'clearInterval');

    const { unmount } = renderHook(() =>
      usePolling(() => {}, { interval: 5000 })
    );

    unmount();
    expect(clearSpy).toHaveBeenCalled();
  });

  it('uses the latest callback after re-render', () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] }); // ✅ critical fix

    const firstCallback = vi.fn();
    const updatedCallback = vi.fn();

    const { rerender } = renderHook(
      ({ cb }) => usePolling(cb, { interval: 5000 }),
      { initialProps: { cb: firstCallback } }
    );

    vi.advanceTimersByTime(5000);
    expect(firstCallback).toHaveBeenCalledTimes(2); // immediate + 1

    rerender({ cb: updatedCallback });

    vi.advanceTimersByTime(5000);
    expect(updatedCallback).toHaveBeenCalledTimes(1);
  });
});
