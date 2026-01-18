import type {
  CoinGeckoPriceData,
  CoinGeckoSimplePrice,
  CoinGeckoSearchResponse,
  CoinGeckoTrendingResponse,
  CoinGeckoCategoriesResponse,
  CoinGeckoGlobalResponse,
  CoinGeckoMarketChartResponse,
  ApiResponse,
  HealthResponse,
} from '@crypture/shared-types';

export interface CoinGeckoClientConfig {
  baseUrl: string;
  timeout?: number;
}

export class CoinGeckoClient {
  private baseUrl: string;
  private timeout: number;

  constructor(config: CoinGeckoClientConfig) {
    this.baseUrl = config.baseUrl;
    this.timeout = config.timeout || 30000;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json() as { message?: string };
        throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data as ApiResponse<T>;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async ping(): Promise<ApiResponse<{ status: string; message: string }>> {
    return this.request('/api/coingecko/ping');
  }

  async getSimplePrice(
    ids: string[],
    vsCurrencies: string[] = ['usd']
  ): Promise<ApiResponse<CoinGeckoSimplePrice>> {
    const params = new URLSearchParams({
      ids: ids.join(','),
      vs_currencies: vsCurrencies.join(','),
      include_market_cap: 'true',
      include_24hr_vol: 'true',
      include_24hr_change: 'true',
      include_last_updated_at: 'true',
    });

    return this.request(`/api/coingecko/simple/price?${params}`);
  }

  async getCoinsMarkets(params?: {
    vsCurrency?: string;
    ids?: string[];
    category?: string;
    order?: string;
    perPage?: number;
    page?: number;
    sparkline?: boolean;
    priceChangePercentage?: string;
  }): Promise<ApiResponse<CoinGeckoPriceData[]>> {
    const searchParams = new URLSearchParams({
      vs_currency: params?.vsCurrency || 'usd',
      order: params?.order || 'market_cap_desc',
      per_page: String(params?.perPage || 100),
      page: String(params?.page || 1),
      sparkline: String(params?.sparkline || false),
    });

    if (params?.ids) {
      searchParams.set('ids', params.ids.join(','));
    }
    if (params?.category) {
      searchParams.set('category', params.category);
    }
    if (params?.priceChangePercentage) {
      searchParams.set('price_change_percentage', params.priceChangePercentage);
    }

    return this.request(`/api/coingecko/coins/markets?${searchParams}`);
  }

  async getCoinById(id: string): Promise<ApiResponse<CoinGeckoPriceData>> {
    return this.request(`/api/coingecko/coins/${id}`);
  }

  async search(query: string): Promise<ApiResponse<CoinGeckoSearchResponse>> {
    const params = new URLSearchParams({ query });
    return this.request(`/api/coingecko/search?${params}`);
  }

  async getTrending(): Promise<ApiResponse<CoinGeckoTrendingResponse>> {
    return this.request('/api/coingecko/search/trending');
  }

  async getCategories(): Promise<ApiResponse<CoinGeckoCategoriesResponse>> {
    return this.request('/api/coingecko/coins/categories');
  }

  async getGlobal(): Promise<ApiResponse<CoinGeckoGlobalResponse>> {
    return this.request('/api/coingecko/global');
  }

  async getMarketChart(
    id: string,
    params?: {
      vsCurrency?: string;
      days?: number;
      interval?: string;
    }
  ): Promise<ApiResponse<CoinGeckoMarketChartResponse>> {
    const searchParams = new URLSearchParams({
      vs_currency: params?.vsCurrency || 'usd',
      days: String(params?.days || 7),
    });

    if (params?.interval) {
      searchParams.set('interval', params.interval);
    }

    return this.request(`/api/coingecko/coins/${id}/market_chart?${searchParams}`);
  }

  async getHealth(): Promise<HealthResponse> {
    const response = await this.request<HealthResponse>('/api/health');
    return response.data || response as unknown as HealthResponse;
  }
}
