/// <reference types="jest" />
import request from 'supertest';
import express from 'express';

// Mock environment variables before importing
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.CORS_ORIGIN = 'http://localhost:5173';

describe('Health Router Unit Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    // Create a test app with just the health router
    app = express();
    app.use(express.json());

    // Import and use the health router
    const { healthRouter } = require('../../src/routes/health');
    app.use('/api/health', healthRouter);

    // Add error handler
    app.use(
      (
        err: Error,
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction
      ) => {
        console.error('Test error:', err);
        res.status(500).json({ error: err.message });
      }
    );
  });

  describe('GET /api/health', () => {
    it('should return healthy status with correct structure', async () => {
      const response = await request(app).get('/api/health').expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('memory');
      expect(response.body).toHaveProperty('services');
    });

    it('should return correct content-type', async () => {
      await request(app)
        .get('/api/health')
        .expect('Content-Type', /json/)
        .expect(200);
    });

    it('should have memory usage information', async () => {
      const response = await request(app).get('/api/health').expect(200);

      expect(response.body.memory).toHaveProperty('used');
      expect(response.body.memory).toHaveProperty('total');
      expect(typeof response.body.memory.used).toBe('number');
      expect(typeof response.body.memory.total).toBe('number');
    });

    it('should have services status information', async () => {
      const response = await request(app).get('/api/health').expect(200);

      expect(response.body.services).toHaveProperty(
        'database',
        'not_implemented'
      );
      expect(response.body.services).toHaveProperty('cache', 'not_implemented');
      expect(response.body.services).toHaveProperty(
        'external_apis',
        'not_implemented'
      );
    });
  });

  describe('GET /api/health/detailed', () => {
    it('should return detailed health information', async () => {
      const response = await request(app)
        .get('/api/health/detailed')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('system');
      expect(response.body).toHaveProperty('configuration');
    });

    it('should return system information', async () => {
      const response = await request(app)
        .get('/api/health/detailed')
        .expect(200);

      expect(response.body.system).toHaveProperty('platform');
      expect(response.body.system).toHaveProperty('arch');
      expect(response.body.system).toHaveProperty('nodeVersion');
      expect(response.body.system).toHaveProperty('pid');
    });

    it('should return configuration information', async () => {
      const response = await request(app)
        .get('/api/health/detailed')
        .expect(200);

      expect(response.body.configuration).toHaveProperty('port');
      expect(response.body.configuration).toHaveProperty('host');
      expect(response.body.configuration).toHaveProperty('corsOrigin');
      expect(response.body.configuration).toHaveProperty('logLevel');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      await request(app).get('/non-existent-route').expect(404);
    });

    it('should handle invalid HTTP methods', async () => {
      await request(app).patch('/api/health').expect(404);
    });
  });
});
