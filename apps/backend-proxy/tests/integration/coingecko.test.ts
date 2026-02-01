// Mock the CoinGeckoService BEFORE importing the app
jest.mock('../../src/services/coingecko');

import request from 'supertest';
import app from '../../src/main';
import { CoinGeckoService } from '../../src/services/coingecko';

const MockedCoinGeckoService = CoinGeckoService as jest.MockedClass<
  typeof CoinGeckoService
>;

describe('CoinGecko Routes - Basic Tests', () => {
  let mockService: jest.Mocked<CoinGeckoService>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockService = {
      ping: jest.fn().mockResolvedValue(true),
      getRateLimitInfo: jest.fn(),
      getSimplePrice: jest.fn(),
      getCoinsMarkets: jest.fn(),
      getCoinById: jest.fn(),
      search: jest.fn(),
      getTrending: jest.fn(),
      getCategories: jest.fn(),
      getGlobal: jest.fn(),
      getMarketChart: jest.fn(),
      testApiKey: jest.fn(),
    } as unknown as jest.Mocked<CoinGeckoService>;

    MockedCoinGeckoService.mockImplementation(() => mockService);
  });
  it('should return 404 for non-existent CoinGecko endpoint', async () => {
    const response = await request(app)
      .get('/api/coingecko/non-existent')
      .expect(404);

    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('timestamp');
    // Note: 404 responses from Express 404 handler don't have requestId
  });

  it('should return 400 for missing required parameters', async () => {
    const response = await request(app)
      .get('/api/coingecko/simple/price')
      .expect(400);

    expect(response.body).toEqual({
      error: 'Bad Request',
      message: 'Missing required parameter: ids',
      timestamp: expect.any(String),
      requestId: expect.any(String),
    });
  });

  it('should return 400 for missing query parameter', async () => {
    const response = await request(app)
      .get('/api/coingecko/search')
      .expect(400);

    expect(response.body).toEqual({
      error: 'Bad Request',
      message: 'Missing required parameter: query',
      timestamp: expect.any(String),
      requestId: expect.any(String),
    });
  });

  it('should return 404 for missing coin id', async () => {
    const response = await request(app)
      .get('/api/coingecko/coins/')
      .expect(404);

    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('timestamp');
    // Note: 404 responses from Express 404 handler don't have requestId
  });

  it('should have proper CORS headers', async () => {
    const response = await request(app)
      .get('/api/health')
      .set('Origin', 'http://localhost:5173')
      .expect(200);

    expect(response.headers).toHaveProperty('access-control-allow-origin');
    expect(response.headers['access-control-allow-origin']).toBe(
      'http://localhost:5173'
    );
  });

  it('should have proper request ID in error responses', async () => {
    const response = await request(app)
      .get('/api/coingecko/simple/price')
      .expect(400);

    expect(response.body).toHaveProperty('requestId');
    expect(typeof response.body.requestId).toBe('string');
    expect(response.body.requestId).toMatch(/^[a-z0-9]+$/);
  });
});
