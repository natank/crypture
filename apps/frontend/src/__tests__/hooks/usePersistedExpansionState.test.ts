import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePersistedExpansionState } from '@hooks/usePersistedExpansionState';

describe('usePersistedExpansionState', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('initializes with empty expansion state', () => {
    const { result } = renderHook(() =>
      usePersistedExpansionState(['bitcoin', 'ethereum'])
    );

    expect(result.current.expandedAssets).toEqual([]);
    expect(result.current.isExpanded('bitcoin')).toBe(false);
    expect(result.current.isExpanded('ethereum')).toBe(false);
  });

  it('toggles expansion on and off', () => {
    const { result } = renderHook(() =>
      usePersistedExpansionState(['bitcoin', 'ethereum'])
    );

    // Toggle on
    act(() => {
      result.current.toggleExpansion('bitcoin');
    });

    expect(result.current.isExpanded('bitcoin')).toBe(true);
    expect(result.current.expandedAssets).toContain('bitcoin');

    // Toggle off
    act(() => {
      result.current.toggleExpansion('bitcoin');
    });

    expect(result.current.isExpanded('bitcoin')).toBe(false);
    expect(result.current.expandedAssets).not.toContain('bitcoin');
  });

  it('persists to sessionStorage', () => {
    const { result } = renderHook(() =>
      usePersistedExpansionState(['bitcoin', 'ethereum'])
    );

    act(() => {
      result.current.toggleExpansion('bitcoin');
    });

    const saved = sessionStorage.getItem('portfolio_expansion_state');
    expect(saved).toBeTruthy();
    const parsed = JSON.parse(saved!);
    expect(parsed.expandedAssets).toContain('bitcoin');
  });

  it('loads from sessionStorage on mount', () => {
    sessionStorage.setItem(
      'portfolio_expansion_state',
      JSON.stringify({
        expandedAssets: ['bitcoin', 'ethereum'],
      })
    );

    const { result } = renderHook(() =>
      usePersistedExpansionState(['bitcoin', 'ethereum', 'cardano'])
    );

    expect(result.current.isExpanded('bitcoin')).toBe(true);
    expect(result.current.isExpanded('ethereum')).toBe(true);
    expect(result.current.isExpanded('cardano')).toBe(false);
  });

  it('filters out stale asset IDs on load', () => {
    sessionStorage.setItem(
      'portfolio_expansion_state',
      JSON.stringify({
        expandedAssets: ['bitcoin', 'ethereum', 'removed-coin'],
      })
    );

    const { result } = renderHook(() =>
      usePersistedExpansionState(['bitcoin', 'ethereum'])
    );

    expect(result.current.expandedAssets).toEqual(['bitcoin', 'ethereum']);
    expect(result.current.expandedAssets).not.toContain('removed-coin');
  });

  it('handles invalid sessionStorage data gracefully', () => {
    sessionStorage.setItem('portfolio_expansion_state', 'invalid json');

    const { result } = renderHook(() =>
      usePersistedExpansionState(['bitcoin'])
    );

    expect(result.current.expandedAssets).toEqual([]);
  });

  it('clears all expanded assets', () => {
    const { result } = renderHook(() =>
      usePersistedExpansionState(['bitcoin', 'ethereum'])
    );

    act(() => {
      result.current.toggleExpansion('bitcoin');
      result.current.toggleExpansion('ethereum');
    });

    expect(result.current.expandedAssets).toHaveLength(2);

    act(() => {
      result.current.clearExpansion();
    });

    expect(result.current.expandedAssets).toEqual([]);
  });

  it('handles multiple expanded assets', () => {
    const { result } = renderHook(() =>
      usePersistedExpansionState(['bitcoin', 'ethereum', 'cardano'])
    );

    act(() => {
      result.current.toggleExpansion('bitcoin');
      result.current.toggleExpansion('ethereum');
      result.current.toggleExpansion('cardano');
    });

    expect(result.current.expandedAssets).toHaveLength(3);
    expect(result.current.isExpanded('bitcoin')).toBe(true);
    expect(result.current.isExpanded('ethereum')).toBe(true);
    expect(result.current.isExpanded('cardano')).toBe(true);
  });
});
