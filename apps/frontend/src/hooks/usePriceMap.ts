// src/hooks/usePriceMap.ts
import { useMemo } from 'react';
import { type CoinInfo } from '@services/coinService';

export function usePriceMap(coins: CoinInfo[]) {
  return useMemo(() => {
    const map: Record<string, number> = {};

    for (const coin of coins) {
      const symbol = coin.symbol?.toLowerCase();
      const price = coin.current_price;

      if (symbol && typeof price === 'number' && !isNaN(price)) {
        map[symbol] = price;
      }
    }

    return map;
  }, [coins]);
}
