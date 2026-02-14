import { useState, useCallback } from 'react';
import {
  isOnboardingComplete,
  setOnboardingComplete,
} from '@services/localStorageService';
import { DEMO_PORTFOLIO } from '@data/demoPortfolioData';
import type { CoinInfo } from '@services/coinService';

export function useDemoOnboarding(portfolioLength: number, isLoading: boolean) {
  const [dismissed, setDismissed] = useState(() => isOnboardingComplete());

  const showWelcomeModal = !isLoading && portfolioLength === 0 && !dismissed;

  const acceptDemo = useCallback(
    (
      addAsset: (asset: { coinInfo: CoinInfo; quantity: number }) => void,
      coinMap: Record<string, CoinInfo>
    ) => {
      for (const item of DEMO_PORTFOLIO) {
        const coinInfo = coinMap[item.asset];
        if (coinInfo) {
          addAsset({ coinInfo, quantity: item.qty });
        }
      }
      setOnboardingComplete();
      setDismissed(true);
    },
    []
  );

  const dismissDemo = useCallback(() => {
    setOnboardingComplete();
    setDismissed(true);
  }, []);

  return {
    showWelcomeModal,
    acceptDemo,
    dismissDemo,
  };
}
