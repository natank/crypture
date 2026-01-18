import request from 'supertest';
import app from '../../src/main';

describe('CoinGecko Routes - Basic Tests', () => {
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
      requestId: expect.any(String)
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
      requestId: expect.any(String)
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
      .get('/api/coingecko/ping')
      .set('Origin', 'http://localhost:5173')
      .expect(200);

    expect(response.headers).toHaveProperty('access-control-allow-origin');
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
  });

  it('should have proper request ID in response', async () => {
    const response = await request(app)
      .get('/api/coingecko/ping');

    // May return 200 or 503 depending on API availability
    expect([200, 503]).toContain(response.status);
    expect(response.body).toHaveProperty('requestId');
    expect(typeof response.body.requestId).toBe('string');
    expect(response.body.requestId).toMatch(/^[a-z0-9]+$/);
  });
});
