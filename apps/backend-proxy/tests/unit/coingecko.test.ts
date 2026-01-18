import { CoinGeckoService } from '../../src/services/coingecko';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const MockedAxios = axios as jest.Mocked<typeof axios>;

describe('CoinGeckoService', () => {
  let service: CoinGeckoService;
  let mockAxiosInstance: jest.Mocked<any>;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Mock environment variable
    delete process.env.COINGECKO_API_KEY;
    
    // Create a mock axios instance
    mockAxiosInstance = {
      get: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() }
      }
    };

    // Mock axios.create to return our mock instance
    MockedAxios.create = jest.fn().mockReturnValue(mockAxiosInstance);
    
    // Mock console methods to avoid noise in tests
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
    
    // Create service instance
    service = new CoinGeckoService();
  });

  afterEach(() => {
    // Restore console methods
    jest.restoreAllMocks();
  });

  describe('Constructor', () => {
    it('should create axios instance with correct configuration', () => {
      expect(MockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.coingecko.com/api/v3',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    });

    it('should include API key in headers when available', () => {
      // Mock environment variable
      const originalApiKey = process.env.COINGECKO_API_KEY;
      process.env.COINGECKO_API_KEY = 'test-api-key';

      // Create new service instance
      const serviceWithApiKey = new CoinGeckoService();

      expect(MockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.coingecko.com/api/v3',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'x-cg-demo-api-key': 'test-api-key'
        }
      });

      // Restore original environment variable
      process.env.COINGECKO_API_KEY = originalApiKey;
    });

    it('should set up request and response interceptors', () => {
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalledTimes(1);
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalledTimes(1);
    });
  });

  describe('ping', () => {
    it('should return true when ping is successful', async () => {
      mockAxiosInstance.get.mockResolvedValue({ status: 200 });

      const result = await service.ping();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/ping');
      expect(result).toBe(true);
    });

    it('should return false when ping fails', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Network error'));

      const result = await service.ping();

      expect(result).toBe(false);
    });
  });

  describe('getSimplePrice', () => {
    it('should make correct API call', async () => {
      const mockResponse = {
        data: { bitcoin: { usd: 43250.50 } }
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await service.getSimplePrice('bitcoin,ethereum', 'usd');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/simple/price', {
        params: {
          ids: 'bitcoin,ethereum',
          vs_currencies: 'usd',
          include_market_cap: 'true',
          include_24hr_vol: 'true',
          include_24hr_change: 'true',
          include_last_updated_at: 'true'
        }
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should retry on network errors', async () => {
      // First call fails, second succeeds
      const networkError = new Error('Connection reset') as any;
      networkError.code = 'ECONNRESET';
      networkError.isAxiosError = true;
      
      mockAxiosInstance.get
        .mockRejectedValueOnce(networkError)
        .mockResolvedValueOnce({ data: { bitcoin: { usd: 43250.50 } } });

      const result = await service.getSimplePrice('bitcoin', 'usd');

      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ bitcoin: { usd: 43250.50 } });
    });

    it('should not retry on client errors', async () => {
      const clientError = new Error('Client error') as any;
      clientError.response = { status: 400 };
      clientError.isAxiosError = true;
      
      mockAxiosInstance.get.mockRejectedValue(clientError);

      await expect(service.getSimplePrice('bitcoin', 'usd')).rejects.toThrow();
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCoinsMarkets', () => {
    it('should make correct API call with default parameters', async () => {
      const mockResponse = {
        data: [
          {
            id: 'bitcoin',
            symbol: 'btc',
            name: 'Bitcoin',
            current_price: 43250.50
          }
        ]
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await service.getCoinsMarkets();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 100,
          page: 1,
          sparkline: false,
          price_change_percentage: '1h,24h,7d,14d,30d,200d,1y'
        }
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should make correct API call with custom parameters', async () => {
      const mockResponse = { data: [] };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      await service.getCoinsMarkets('eur', 'market_cap_asc', 50, 2, true);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/coins/markets', {
        params: {
          vs_currency: 'eur',
          order: 'market_cap_asc',
          per_page: 50,
          page: 2,
          sparkline: true,
          price_change_percentage: '1h,24h,7d,14d,30d,200d,1y'
        }
      });
    });
  });

  describe('getCoinById', () => {
    it('should make correct API call', async () => {
      const mockResponse = {
        data: {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin'
        }
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await service.getCoinById('bitcoin');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/coins/bitcoin', {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: false
        }
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('search', () => {
    it('should make correct API call', async () => {
      const mockResponse = {
        data: {
          coins: [
            {
              id: 'bitcoin',
              name: 'Bitcoin',
              symbol: 'btc'
            }
          ]
        }
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await service.search('bitcoin');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/search', {
        params: { query: 'bitcoin' }
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getTrending', () => {
    it('should make correct API call', async () => {
      const mockResponse = {
        data: {
          coins: [
            {
              item: {
                id: 'bitcoin',
                name: 'Bitcoin',
                symbol: 'btc'
              }
            }
          ]
        }
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await service.getTrending();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/search/trending');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getCategories', () => {
    it('should make correct API call', async () => {
      const mockResponse = { data: [] };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await service.getCategories();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/coins/categories');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getGlobal', () => {
    it('should make correct API call', async () => {
      const mockResponse = {
        data: {
          active_cryptocurrencies: 23456,
          markets: 789
        }
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await service.getGlobal();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/global');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getMarketChart', () => {
    it('should make correct API call with default parameters', async () => {
      const mockResponse = {
        data: {
          prices: [[1642694400000, 43250.50]],
          market_caps: [[1642694400000, 845000000000]],
          total_volumes: [[1642694400000, 12345678900]]
        }
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await service.getMarketChart('bitcoin');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/coins/bitcoin/market_chart', {
        params: {
          vs_currency: 'usd',
          days: 7,
          interval: 'daily'
        }
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should use hourly interval for 1 day chart', async () => {
      const mockResponse = { data: { prices: [] } };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      await service.getMarketChart('bitcoin', 'usd', 1);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/coins/bitcoin/market_chart', {
        params: {
          vs_currency: 'usd',
          days: 1,
          interval: 'hourly'
        }
      });
    });

    it('should use custom parameters', async () => {
      const mockResponse = { data: { prices: [] } };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      await service.getMarketChart('ethereum', 'eur', 30);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/coins/ethereum/market_chart', {
        params: {
          vs_currency: 'eur',
          days: 30,
          interval: 'daily'
        }
      });
    });
  });

  describe('getRateLimitInfo', () => {
    it('should return rate limit info when headers are present', async () => {
      const mockResponse = {
        headers: {
          'x-ratelimit-requests-limit': '100',
          'x-ratelimit-requests-remaining': '85'
        }
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await service.getRateLimitInfo();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/simple/price?ids=bitcoin&vs_currencies=usd');
      expect(result).toEqual({
        limit: 100,
        remaining: 85
      });
    });

    it('should return null when headers are missing', async () => {
      const mockResponse = {
        headers: {}
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await service.getRateLimitInfo();

      expect(result).toBeNull();
    });

    it('should return null on error', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Network error'));

      const result = await service.getRateLimitInfo();

      expect(result).toBeNull();
    });
  });

  describe('Retry Logic', () => {
    it('should retry up to maxRetries times', async () => {
      // Fail 3 times, then succeed
      const networkError = new Error('Connection reset') as any;
      networkError.code = 'ECONNRESET';
      networkError.isAxiosError = true;
      
      mockAxiosInstance.get
        .mockRejectedValueOnce(networkError)
        .mockRejectedValueOnce(networkError)
        .mockRejectedValueOnce(networkError)
        .mockResolvedValueOnce({ data: { bitcoin: { usd: 43250.50 } } });

      const result = await service.getSimplePrice('bitcoin', 'usd');

      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(4);
      expect(result).toEqual({ bitcoin: { usd: 43250.50 } });
    }, 10000);

    it('should fail after max retries exhausted', async () => {
      // Always fail
      const networkError = new Error('Network error') as any;
      networkError.code = 'ECONNRESET';
      networkError.isAxiosError = true;
      
      mockAxiosInstance.get.mockRejectedValue(networkError);

      await expect(service.getSimplePrice('bitcoin', 'usd')).rejects.toThrow();
      
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(4); // 1 initial + 3 retries
    }, 10000);

    it('should not retry on non-retryable errors', async () => {
      const notRetryableError = new Error('Not found') as any;
      notRetryableError.response = { status: 404 };
      notRetryableError.isAxiosError = true;
      
      mockAxiosInstance.get.mockRejectedValue(notRetryableError);

      await expect(service.getSimplePrice('bitcoin', 'usd')).rejects.toThrow();
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
    });
  });
});
