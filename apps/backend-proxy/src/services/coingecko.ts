import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  CoinGeckoPriceData,
  CoinGeckoMarketData,
  CoinGeckoSimplePrice,
  CoinGeckoSearchResponse,
  CoinGeckoTrendingResponse,
  CoinGeckoCategoriesResponse,
  CoinGeckoGlobalResponse,
} from '../types/coingecko';

export class CoinGeckoService {
  private api: AxiosInstance;
  private readonly baseURL = 'https://api.coingecko.com/api/v3';
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // 1 second

  constructor() {
    // Create headers with API key if available
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (process.env.COINGECKO_API_KEY) {
      headers['x-cg-demo-api-key'] = process.env.COINGECKO_API_KEY;
    }

    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000, // 10 seconds
      headers,
    });

    // Request interceptor for error handling
    this.api.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        console.error('❌ CoinGecko API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for rate limiting
    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 429) {
          console.warn(
            '⚠️ Rate limit exceeded. Consider upgrading to CoinGecko Pro API.'
          );
        }
        return Promise.reject(error);
      }
    );
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    retries: number = this.maxRetries
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      if (retries === 0) {
        throw error;
      }

      const axiosError = error as AxiosError;
      const isRetryable =
        axiosError.code === 'ECONNRESET' ||
        axiosError.code === 'ETIMEDOUT' ||
        (axiosError.response?.status && axiosError.response.status >= 500);

      if (!isRetryable) {
        throw error;
      }

      await this.sleep(this.retryDelay * (this.maxRetries - retries + 1));

      return this.retryRequest(requestFn, retries - 1);
    }
  }

  async getSimplePrice(
    ids: string,
    currencies: string = 'usd'
  ): Promise<CoinGeckoSimplePrice> {
    return this.retryRequest(async () => {
      const response = await this.api.get('/simple/price', {
        params: {
          ids,
          vs_currencies: currencies,
          include_market_cap: 'true',
          include_24hr_vol: 'true',
          include_24hr_change: 'true',
          include_last_updated_at: 'true',
        },
      });
      return response.data;
    });
  }

  async getCoinsMarkets(
    vsCurrency: string = 'usd',
    order: string = 'market_cap_desc',
    perPage: number = 100,
    page: number = 1,
    sparkline: boolean = false
  ): Promise<CoinGeckoPriceData[]> {
    return this.retryRequest(async () => {
      const response = await this.api.get('/coins/markets', {
        params: {
          vs_currency: vsCurrency,
          order,
          per_page: perPage,
          page,
          sparkline,
          price_change_percentage: '1h,24h,7d,14d,30d,200d,1y',
        },
      });
      return response.data;
    });
  }

  async getCoinById(id: string): Promise<any> {
    return this.retryRequest(async () => {
      const response = await this.api.get(`/coins/${id}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: false,
        },
      });
      return response.data;
    });
  }

  async search(query: string): Promise<CoinGeckoSearchResponse> {
    return this.retryRequest(async () => {
      const response = await this.api.get('/search', {
        params: { query },
      });
      return response.data;
    });
  }

  async getTrending(): Promise<CoinGeckoTrendingResponse> {
    return this.retryRequest(async () => {
      const response = await this.api.get('/search/trending');
      return response.data;
    });
  }

  async getCategories(): Promise<CoinGeckoCategoriesResponse> {
    return this.retryRequest(async () => {
      const response = await this.api.get('/coins/categories');
      return response.data;
    });
  }

  async getGlobal(): Promise<CoinGeckoGlobalResponse> {
    return this.retryRequest(async () => {
      const response = await this.api.get('/global');
      return response.data;
    });
  }

  async getMarketChart(
    id: string,
    vsCurrency: string = 'usd',
    days: number = 7
  ): Promise<any> {
    return this.retryRequest(async () => {
      const response = await this.api.get(`/coins/${id}/market_chart`, {
        params: {
          vs_currency: vsCurrency,
          days,
        },
      });
      return response.data;
    });
  }

  // Health check for CoinGecko API
  async ping(): Promise<boolean> {
    try {
      const response = await this.api.get('/ping');
      return response.status === 200;
    } catch (error) {
      console.error('❌ CoinGecko API ping failed:', error);
      return false;
    }
  }

  // Get rate limit information
  async getRateLimitInfo(): Promise<{
    limit: number;
    remaining: number;
  } | null> {
    try {
      const response = await this.api.get(
        '/simple/price?ids=bitcoin&vs_currencies=usd'
      );
      const limit = response.headers['x-ratelimit-requests-limit'];
      const remaining = response.headers['x-ratelimit-requests-remaining'];

      if (limit && remaining) {
        return {
          limit: parseInt(limit),
          remaining: parseInt(remaining),
        };
      }

      return null;
    } catch (error) {
      console.error('❌ Failed to get rate limit info:', error);
      return null;
    }
  }

  /**
   * Test method to verify API key is being sent correctly
   */
  async testApiKey(): Promise<{ headers: any; url: string }> {
    try {
      const response = await this.api.get('/ping');
      return {
        headers: response.config.headers,
        url: response.config.url || 'unknown',
      };
    } catch (error) {
      if (error && typeof error === 'object' && 'config' in error) {
        const axiosError = error as { config: { headers: any; url?: string } };
        return {
          headers: axiosError.config.headers,
          url: axiosError.config.url || 'unknown',
        };
      }
      throw error;
    }
  }
}
