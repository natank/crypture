import request from 'supertest';
import app from '../../src/main';

describe('Middleware Integration Tests', () => {
  describe('CORS Headers', () => {
    it('should return CORS headers for requests with allowed Origin', async () => {
      const response = await request(app)
        .get('/api/health')
        .set('Origin', 'http://localhost:5173')
        .expect(200);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    });

    it('should not return CORS headers for requests without Origin', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.headers).not.toHaveProperty('access-control-allow-origin');
    });
  });

  describe('Security Headers', () => {
    it('should include security headers from Helmet', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-xss-protection');
      expect(response.headers).toHaveProperty('strict-transport-security');
      expect(response.headers).toHaveProperty('content-security-policy');
    });

    it('should have proper CSP policy', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      const csp = response.headers['content-security-policy'];
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("script-src 'self'");
    });
  });

  describe('Request Validation', () => {
    it('should validate missing required parameters', async () => {
      const response = await request(app)
        .get('/api/coingecko/simple/price')
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Bad Request');
      expect(response.body).toHaveProperty('message', 'Missing required parameter: ids');
      expect(response.body).toHaveProperty('requestId');
    });

    it('should validate missing query parameters', async () => {
      const response = await request(app)
        .get('/api/coingecko/search')
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Bad Request');
      expect(response.body).toHaveProperty('message', 'Missing required parameter: query');
      expect(response.body).toHaveProperty('requestId');
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON gracefully', async () => {
      const response = await request(app)
        .post('/api/coingecko/search')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('requestId');
    });

    it('should handle 404 errors with proper format', async () => {
      const response = await request(app)
        .get('/api/non-existent-endpoint')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});
