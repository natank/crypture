import { renderHook, act } from '@testing-library/react';
import { useAssetHighlight } from '@hooks/useAssetHighlight';
import { vi } from 'vitest';

describe('useAssetHighlight', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns false initially when trigger is 0', () => {
    const { result } = renderHook(() => useAssetHighlight('btc', 0));
    expect(result.current).toBe(false);
  });

  it('returns true when trigger increments from 0', () => {
    const { result, rerender } = renderHook(
      ({ trigger }) => useAssetHighlight('btc', trigger),
      { initialProps: { trigger: 0 } }
    );

    expect(result.current).toBe(false);

    // Trigger highlight
    rerender({ trigger: 1 });
    expect(result.current).toBe(true);
  });

  it('returns false after 3 seconds', () => {
    const { result, rerender } = renderHook(
      ({ trigger }) => useAssetHighlight('btc', trigger),
      { initialProps: { trigger: 0 } }
    );

    // Trigger highlight
    rerender({ trigger: 1 });
    expect(result.current).toBe(true);

    // Fast-forward 3 seconds
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current).toBe(false);
  });

  it('resets timer when trigger increments again', () => {
    const { result, rerender } = renderHook(
      ({ trigger }) => useAssetHighlight('btc', trigger),
      { initialProps: { trigger: 0 } }
    );

    // First trigger
    rerender({ trigger: 1 });
    expect(result.current).toBe(true);

    // Advance 2 seconds (not enough to clear)
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current).toBe(true);

    // Trigger again (should reset timer)
    rerender({ trigger: 2 });
    expect(result.current).toBe(true);

    // Advance another 2 seconds (total 4s from first trigger, but only 2s from second)
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current).toBe(true);

    // Advance 1 more second (3s from second trigger)
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current).toBe(false);
  });

  it('cleans up timeout on unmount', () => {
    const { unmount, rerender } = renderHook(
      ({ trigger }) => useAssetHighlight('btc', trigger),
      { initialProps: { trigger: 0 } }
    );

    rerender({ trigger: 1 });

    // Unmount before timeout completes
    unmount();

    // Should not throw or cause issues
    act(() => {
      vi.advanceTimersByTime(3000);
    });
  });
});
