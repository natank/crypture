/// <reference types="jest" />
import request from 'supertest';
import app from '../../src/main';

describe('Health Endpoint Integration Tests', () => {
  let server: ReturnType<typeof app.listen>;

  beforeAll(async () => {
    // Start the server for integration tests on a different port
    server = app.listen(3002);
  });

  afterAll(async () => {
    // Close the server after tests
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
  });

  describe('GET /api/health', () => {
    it('should return 200 status code', async () => {
      const response = await request(app).get('/api/health').expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('environment', 'test');
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
    it('should return 200 status code for detailed health', async () => {
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

      expect(response.body.configuration).toHaveProperty('port', '3001');
      expect(response.body.configuration).toHaveProperty('host', 'localhost');
      expect(response.body.configuration).toHaveProperty(
        'corsOrigin',
        'http://localhost:5173'
      );
      expect(response.body.configuration).toHaveProperty('logLevel', 'info');
    });
  });

  describe('GET /', () => {
    it('should return root endpoint information', async () => {
      const response = await request(app).get('/').expect(200);

      expect(response.body).toHaveProperty(
        'message',
        'Crypture Backend Proxy Service'
      );
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('environment', 'test');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      await request(app)
        .get('/non-existent-route')
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('error', 'Not Found');
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('timestamp');
        });
    });

    it('should handle invalid HTTP methods', async () => {
      await request(app).patch('/api/health').expect(404);
    });
  });
});
