import { renderHook, act } from '@testing-library/react';
import { useDemoOnboarding } from '@hooks/useDemoOnboarding';
import * as storage from '@services/localStorageService';
import type { CoinInfo } from '@services/coinService';

const mockCoinMap: Record<string, CoinInfo> = {
  btc: { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', current_price: 50000 },
  eth: {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'eth',
    current_price: 3000,
  },
  sol: { id: 'solana', name: 'Solana', symbol: 'sol', current_price: 100 },
  ada: { id: 'cardano', name: 'Cardano', symbol: 'ada', current_price: 0.5 },
  dot: { id: 'polkadot', name: 'Polkadot', symbol: 'dot', current_price: 7 },
} as Record<string, CoinInfo>;

describe('useDemoOnboarding', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('showWelcomeModal', () => {
    it('returns true when portfolio is empty, not loading, and onboarding not complete', () => {
      const { result } = renderHook(() => useDemoOnboarding(0, false));
      expect(result.current.showWelcomeModal).toBe(true);
    });

    it('returns false when still loading', () => {
      const { result } = renderHook(() => useDemoOnboarding(0, true));
      expect(result.current.showWelcomeModal).toBe(false);
    });

    it('returns false when portfolio has assets', () => {
      const { result } = renderHook(() => useDemoOnboarding(3, false));
      expect(result.current.showWelcomeModal).toBe(false);
    });

    it('returns false when onboarding was previously completed', () => {
      storage.setOnboardingComplete();
      const { result } = renderHook(() => useDemoOnboarding(0, false));
      expect(result.current.showWelcomeModal).toBe(false);
    });
  });

  describe('acceptDemo', () => {
    it('calls addAsset for each demo coin found in coinMap', () => {
      const addAsset = vi.fn();
      const { result } = renderHook(() => useDemoOnboarding(0, false));

      act(() => {
        result.current.acceptDemo(addAsset, mockCoinMap);
      });

      expect(addAsset).toHaveBeenCalledTimes(5);
      expect(addAsset).toHaveBeenCalledWith({
        coinInfo: mockCoinMap.btc,
        quantity: 0.5,
      });
      expect(addAsset).toHaveBeenCalledWith({
        coinInfo: mockCoinMap.eth,
        quantity: 4.2,
      });
      expect(addAsset).toHaveBeenCalledWith({
        coinInfo: mockCoinMap.sol,
        quantity: 25,
      });
      expect(addAsset).toHaveBeenCalledWith({
        coinInfo: mockCoinMap.ada,
        quantity: 1500,
      });
      expect(addAsset).toHaveBeenCalledWith({
        coinInfo: mockCoinMap.dot,
        quantity: 100,
      });
    });

    it('skips coins not found in coinMap', () => {
      const addAsset = vi.fn();
      const partialMap = { btc: mockCoinMap.btc } as Record<string, CoinInfo>;
      const { result } = renderHook(() => useDemoOnboarding(0, false));

      act(() => {
        result.current.acceptDemo(addAsset, partialMap);
      });

      expect(addAsset).toHaveBeenCalledTimes(1);
      expect(addAsset).toHaveBeenCalledWith({
        coinInfo: mockCoinMap.btc,
        quantity: 0.5,
      });
    });

    it('marks onboarding as complete', () => {
      const addAsset = vi.fn();
      const { result } = renderHook(() => useDemoOnboarding(0, false));

      act(() => {
        result.current.acceptDemo(addAsset, mockCoinMap);
      });

      expect(storage.isOnboardingComplete()).toBe(true);
    });

    it('hides the modal after accepting', () => {
      const addAsset = vi.fn();
      const { result } = renderHook(() => useDemoOnboarding(0, false));

      act(() => {
        result.current.acceptDemo(addAsset, mockCoinMap);
      });

      expect(result.current.showWelcomeModal).toBe(false);
    });
  });

  describe('dismissDemo', () => {
    it('marks onboarding as complete without adding assets', () => {
      const { result } = renderHook(() => useDemoOnboarding(0, false));

      act(() => {
        result.current.dismissDemo();
      });

      expect(storage.isOnboardingComplete()).toBe(true);
    });

    it('hides the modal after dismissing', () => {
      const { result } = renderHook(() => useDemoOnboarding(0, false));

      act(() => {
        result.current.dismissDemo();
      });

      expect(result.current.showWelcomeModal).toBe(false);
    });
  });
});
