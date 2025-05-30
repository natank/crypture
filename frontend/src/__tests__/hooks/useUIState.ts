// src/hooks/__tests__/useUIState.test.ts
import { renderHook, act } from "@testing-library/react";
import { useUIState } from "@hooks/useUIState";

describe("useUIState", () => {
  it("should default to modal closed", () => {
    const { result } = renderHook(() => useUIState());
    expect(result.current.showModal).toBe(false);
  });

  it("should open the modal", () => {
    const { result } = renderHook(() => useUIState());
    act(() => result.current.openModal());
    expect(result.current.showModal).toBe(true);
  });

  it("should close the modal", () => {
    const { result } = renderHook(() => useUIState());

    act(() => result.current.openModal());
    expect(result.current.showModal).toBe(true);

    act(() => result.current.closeModal());
    expect(result.current.showModal).toBe(false);
  });

  it("should retain a ref to the add button", () => {
    const { result } = renderHook(() => useUIState());
    expect(result.current.addButtonRef).toBeDefined();
    expect(result.current.addButtonRef.current).toBe(null);
  });
});
