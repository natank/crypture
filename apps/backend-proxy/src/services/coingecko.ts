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
    // Only log in non-test environments
    if (process.env.NODE_ENV !== 'test') {
      console.log(
        '🔍 CoinGecko Service Constructor - Debugging Environment Variables'
      );
      console.log(`📦 NODE_ENV: ${process.env.NODE_ENV}`);
      console.log(
        `🔑 COINGECKO_API_KEY exists: ${!!process.env.COINGECKO_API_KEY}`
      );
      console.log(
        `🔑 COINGECKO_API_KEY length: ${process.env.COINGECKO_API_KEY?.length || 0}`
      );
      console.log(
        `🔑 COINGECKO_API_KEY prefix: ${process.env.COINGECKO_API_KEY?.substring(0, 8) || 'undefined'}...`
      );
    }

    if (!process.env.COINGECKO_API_KEY) {
      if (process.env.NODE_ENV !== 'test') {
        console.warn(
          '⚠️  COINGECKO_API_KEY not found in environment variables. Using free tier with rate limits.'
        );
        console.warn(
          '🔧 To fix: Add COINGECKO_API_KEY to your Vercel environment variables'
        );
      }
    } else if (process.env.NODE_ENV !== 'test') {
      console.log('✅ COINGECKO_API_KEY found in environment variables');
    }

    // Create headers with API key if available
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (process.env.COINGECKO_API_KEY) {
      headers['x-cg-demo-api-key'] = process.env.COINGECKO_API_KEY;
      if (process.env.NODE_ENV !== 'test') {
        console.log('🔧 Added x-cg-demo-api-key header to requests');
      }
    }

    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000, // 10 seconds
      headers,
    });

    // Request interceptor for logging
    this.api.interceptors.request.use(
      (config) => {
        if (process.env.NODE_ENV !== 'test') {
          console.log(
            `📡 CoinGecko API Request: ${config.method?.toUpperCase()} ${config.url}`
          );
          console.log(`🔍 Request headers:`, Object.keys(config.headers));
          console.log(`🔍 Full headers object:`, config.headers);
          if (config.headers['x-cg-demo-api-key']) {
            const apiKey = config.headers['x-cg-demo-api-key'] as string;
            console.log(
              `✅ Using x-cg-demo-api-key header (length: ${apiKey.length})`
            );
            console.log(`✅ API Key prefix: ${apiKey.substring(0, 8)}...`);
            console.log(
              `✅ API Key starts with CG-: ${apiKey.startsWith('CG-')}`
            );
          } else {
            console.log(
              `❌ No API key header found - request may fail for premium endpoints`
            );
          }
        }
        return config;
      },
      (error) => {
        console.error('❌ CoinGecko API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging and rate limiting
    this.api.interceptors.response.use(
      (response) => {
        const rateLimit = response.headers['x-ratelimit-requests-limit'];
        const rateLimitRemaining =
          response.headers['x-ratelimit-requests-remaining'];

        if (rateLimit && rateLimitRemaining) {
          console.log(
            `📊 Rate Limit: ${rateLimitRemaining}/${rateLimit} requests remaining`
          );
        }

        return response;
      },
      (error) => {
        if (error.response?.status === 429) {
          console.warn(
            '⚠️  Rate limit exceeded. Consider upgrading to CoinGecko Pro API.'
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

      console.log(
        `🔄 Retrying request... (${this.maxRetries - retries + 1}/${this.maxRetries})`
      );
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
          interval: days === 1 ? 'hourly' : 'daily',
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
        url: response.config.url,
      };
    } catch (error) {
      if (error && typeof error === 'object' && 'config' in error) {
        const axiosError = error as { config: { headers: any; url: string } };
        return {
          headers: axiosError.config.headers,
          url: axiosError.config.url,
        };
      }
      throw error;
    }
  }
}
