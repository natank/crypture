// src/hooks/__tests__/useUIState.test.ts
import { renderHook, act } from '@testing-library/react';
import { useUIState } from '@hooks/useUIState';

describe('useUIState', () => {
  it('should default to modal closed', () => {
    const { result } = renderHook(() => useUIState());
    expect(result.current.shouldShowAddAssetModal).toBe(false);
  });

  it('should default to delete confirmation modal closed and no asset selected', () => {
    const { result } = renderHook(() => useUIState());

    expect(result.current.shouldShowDeleteConfirmationModal).toBe(false);
    expect(result.current.assetIdPendingDeletion).toBeNull();
  });

  it('should open the modal', () => {
    const { result } = renderHook(() => useUIState());
    act(() => result.current.openAddAssetModal());
    expect(result.current.shouldShowAddAssetModal).toBe(true);
  });

  it('should close the modal', () => {
    const { result } = renderHook(() => useUIState());

    act(() => result.current.openAddAssetModal());
    expect(result.current.shouldShowAddAssetModal).toBe(true);

    act(() => result.current.closeAddAssetModal());
    expect(result.current.shouldShowAddAssetModal).toBe(false);
  });

  it('should retain a ref to the add button', () => {
    const { result } = renderHook(() => useUIState());
    expect(result.current.addButtonRef).toBeDefined();
    expect(result.current.addButtonRef.current).toBe(null);
  });

  it('should open delete confirmation modal and set asset ID on requestDeleteAsset', () => {
    const { result } = renderHook(() => useUIState());

    act(() => {
      result.current.requestDeleteAsset('btc');
    });

    expect(result.current.shouldShowDeleteConfirmationModal).toBe(true);
    expect(result.current.assetIdPendingDeletion).toBe('btc');
  });

  it('should clear asset ID and close modal on cancelDeleteAsset', () => {
    const { result } = renderHook(() => useUIState());

    act(() => {
      result.current.requestDeleteAsset('btc');
      result.current.cancelDeleteAsset();
    });

    expect(result.current.shouldShowDeleteConfirmationModal).toBe(false);
    expect(result.current.assetIdPendingDeletion).toBeNull();
  });
  it('should handle re-requesting delete after cancellation', () => {
    const { result } = renderHook(() => useUIState());

    act(() => {
      result.current.requestDeleteAsset('btc');
      result.current.cancelDeleteAsset();
      result.current.requestDeleteAsset('eth');
    });

    expect(result.current.shouldShowDeleteConfirmationModal).toBe(true);
    expect(result.current.assetIdPendingDeletion).toBe('eth');
  });
});
