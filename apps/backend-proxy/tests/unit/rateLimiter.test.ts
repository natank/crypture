import request from 'supertest';
import express from 'express';
import { apiRateLimiter, proxyRateLimiter } from '../../src/middleware/rateLimiter';

describe('Rate Limiter Middleware', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    // Mock console methods to avoid noise in tests
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console methods
    jest.restoreAllMocks();
  });

  describe('apiRateLimiter', () => {
    beforeEach(() => {
      app.use('/api/test', apiRateLimiter, (req, res) => {
        res.json({ message: 'success' });
      });
    });

    it('should allow requests within rate limit', async () => {
      const response = await request(app)
        .get('/api/test')
        .expect(200);

      expect(response.body).toEqual({ message: 'success' });
    });

    it('should include rate limit headers', async () => {
      const response = await request(app)
        .get('/api/test')
        .expect(200);

      expect(response.headers).toHaveProperty('ratelimit-limit');
      expect(response.headers).toHaveProperty('ratelimit-remaining');
      expect(response.headers).toHaveProperty('ratelimit-reset');
    });

    it('should block requests exceeding rate limit', async () => {
      // Make 50 requests (the limit)
      for (let i = 0; i < 50; i++) {
        await request(app).get('/api/test');
      }

      // 51st request should be blocked
      const response = await request(app)
        .get('/api/test')
        .expect(429);

      expect(response.body).toHaveProperty('error', 'Rate Limit Exceeded');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('requestId');
      expect(response.body).toHaveProperty('retryAfter', 60);
    });
  });

  describe('proxyRateLimiter', () => {
    beforeEach(() => {
      app.use('/proxy/test', proxyRateLimiter, (req, res) => {
        res.json({ message: 'success' });
      });
    });

    it('should allow requests within rate limit', async () => {
      const response = await request(app)
        .get('/proxy/test')
        .expect(200);

      expect(response.body).toEqual({ message: 'success' });
    });

    it('should have higher limit than apiRateLimiter', async () => {
      // Make 50 requests (would exceed apiRateLimiter but not proxyRateLimiter)
      for (let i = 0; i < 50; i++) {
        await request(app).get('/proxy/test').expect(200);
      }

      // 51st request should still succeed with proxyRateLimiter
      const response = await request(app)
        .get('/proxy/test')
        .expect(200);

      expect(response.body).toEqual({ message: 'success' });
    });
  });

  describe('Rate limit response format', () => {
    it('should return proper error format when rate limit exceeded', async () => {
      const testApp = express();
      testApp.use(express.json());
      testApp.use('/test', apiRateLimiter, (req, res) => {
        res.json({ message: 'success' });
      });

      // Exhaust rate limit
      for (let i = 0; i < 50; i++) {
        await request(testApp).get('/test');
      }

      // Next request should return rate limit error
      const response = await request(testApp)
        .get('/test')
        .expect(429);

      expect(response.body).toMatchObject({
        error: 'Rate Limit Exceeded',
        message: expect.any(String),
        timestamp: expect.any(String),
        requestId: expect.any(String),
        retryAfter: 60
      });
    });
  });
});
