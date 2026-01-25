import { CoinGeckoClient } from '@crypture/api-client';
import type {
  CoinGeckoPriceData,
  CoinGeckoSimplePrice,
  CoinGeckoSearchResponse,
  CoinGeckoTrendingResponse,
  CoinGeckoGlobalResponse,
  CoinGeckoCategoriesResponse,
} from '@crypture/shared-types';

// Initialize the CoinGecko client with the backend proxy URL
const client = new CoinGeckoClient({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 30000,
});

/**
 * CoinGecko API Service
 * Provides methods to interact with the CoinGecko API through the backend proxy
 */
export const coinGeckoApiService = {
  /**
   * Ping the CoinGecko API to check if it's available
   */
  async ping(): Promise<boolean> {
    try {
      const response = await client.ping();
      return response.data?.status === 'healthy';
    } catch (error) {
      console.error('CoinGecko ping failed:', error);
      return false;
    }
  },

  /**
   * Get simple price data for coins
   */
  async getSimplePrice(
    coinIds: string[],
    vsCurrencies: string[] = ['usd']
  ): Promise<CoinGeckoSimplePrice | null> {
    try {
      const response = await client.getSimplePrice(coinIds, vsCurrencies);
      return response.data || null;
    } catch (error) {
      console.error('Failed to fetch simple price:', error);
      return null;
    }
  },

  /**
   * Get market data for coins
   */
  async getCoinsMarkets(params?: {
    vsCurrency?: string;
    ids?: string[];
    category?: string;
    order?: string;
    perPage?: number;
    page?: number;
  }): Promise<CoinGeckoPriceData[]> {
    try {
      const response = await client.getCoinsMarkets(params);
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch coins markets:', error);
      throw error;
    }
  },

  /**
   * Get detailed data for a specific coin
   */
  async getCoinById(coinId: string): Promise<CoinGeckoPriceData | null> {
    try {
      const response = await client.getCoinById(coinId);
      return response.data || null;
    } catch (error) {
      console.error(`Failed to fetch coin ${coinId}:`, error);
      throw error;
    }
  },

  /**
   * Search for coins, exchanges, and categories
   */
  async search(query: string): Promise<CoinGeckoSearchResponse | null> {
    try {
      const response = await client.search(query);
      return response.data || null;
    } catch (error) {
      console.error('Failed to search:', error);
      return null;
    }
  },

  /**
   * Get trending coins
   */
  async getTrending(): Promise<CoinGeckoTrendingResponse | null> {
    try {
      const response = await client.getTrending();
      return response.data || null;
    } catch (error) {
      console.error('Failed to fetch trending coins:', error);
      throw error;
    }
  },

  /**
   * Get market chart data for a coin
   */
  async getMarketChart(
    coinId: string,
    params?: {
      vsCurrency?: string;
      days?: number;
      interval?: string;
    }
  ) {
    try {
      const response = await client.getMarketChart(coinId, params);
      return response.data || null;
    } catch (error) {
      console.error(`Failed to fetch market chart for ${coinId}:`, error);
      throw error;
    }
  },

  /**
   * Get global market data
   */
  async getGlobal(): Promise<CoinGeckoGlobalResponse> {
    try {
      const response = await client.getGlobal();
      return response.data;
    } catch (error) {
      console.error('Failed to fetch global market data:', error);
      throw error;
    }
  },

  /**
   * Get coin categories
   */
  async getCategories(): Promise<CoinGeckoCategoriesResponse> {
    try {
      const response = await client.getCategories();
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  },

  /**
   * Check backend health
   */
  async checkHealth() {
    try {
      const response = await client.getHealth();
      return response;
    } catch (error) {
      console.error('Health check failed:', error);
      return null;
    }
  },
};
