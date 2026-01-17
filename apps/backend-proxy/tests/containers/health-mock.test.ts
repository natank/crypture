/// <reference types="jest" />
import request from 'supertest';
import app from '../../src/main';

// Mock testcontainers for environments without Docker
jest.mock('@testcontainers/postgresql', () => ({
  PostgreSqlContainer: jest.fn().mockImplementation(() => ({
    withDatabase: jest.fn().mockReturnThis(),
    withUsername: jest.fn().mockReturnThis(),
    withPassword: jest.fn().mockReturnThis(),
    withReuse: jest.fn().mockReturnThis(),
    withExposedPorts: jest.fn().mockReturnThis(),
    withStartupTimeout: jest.fn().mockReturnThis(),
    start: jest.fn().mockResolvedValue({
      getConnectionUri: jest.fn().mockReturnValue('postgresql://test_user:test_password@localhost:5432/crypture_test'),
      getHost: jest.fn().mockReturnValue('localhost'),
      getMappedPort: jest.fn().mockReturnValue(5432),
    }),
    stop: jest.fn().mockResolvedValue(undefined),
  })),
}));

jest.mock('@testcontainers/redis', () => ({
  RedisContainer: jest.fn().mockImplementation(() => ({
    withReuse: jest.fn().mockReturnThis(),
    withExposedPorts: jest.fn().mockReturnThis(),
    withStartupTimeout: jest.fn().mockReturnThis(),
    start: jest.fn().mockResolvedValue({
      getHost: jest.fn().mockReturnValue('localhost'),
      getMappedPort: jest.fn().mockReturnValue(6379),
    }),
    stop: jest.fn().mockResolvedValue(undefined),
  })),
}));

jest.mock('testcontainers', () => ({
  GenericContainer: jest.fn().mockImplementation(() => ({
    withReuse: jest.fn().mockReturnThis(),
    withExposedPorts: jest.fn().mockReturnThis(),
    withStartupTimeout: jest.fn().mockReturnThis(),
    start: jest.fn().mockResolvedValue({
      getHost: jest.fn().mockReturnValue('localhost'),
      getMappedPort: jest.fn().mockReturnValue(80),
    }),
    stop: jest.fn().mockResolvedValue(undefined),
  })),
}));

describe('Health Endpoints Mock Testcontainers Integration', () => {
  describe('GET /api/health', () => {
    it('should return healthy status with mock containers', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

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
        .expect('Content-Type', /json/);
    });

    it('should have memory usage information', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.memory).toHaveProperty('used');
      expect(response.body.memory).toHaveProperty('total');
      expect(typeof response.body.memory.used).toBe('number');
      expect(typeof response.body.memory.total).toBe('number');
    });

    it('should have services status information', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.services).toHaveProperty('database');
      expect(response.body.services).toHaveProperty('cache');
      expect(response.body.services).toHaveProperty('external_apis');
    });
  });

  describe('GET /api/health/detailed', () => {
    it('should return detailed health information', async () => {
      const response = await request(app)
        .get('/api/health/detailed')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('memory');
      expect(response.body).toHaveProperty('services');
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
      await request(app)
        .get('/api/non-existent-route')
        .expect(404);
    });

    it('should handle invalid HTTP methods', async () => {
      await request(app)
        .patch('/api/health')
        .expect(404);
    });
  });
});

describe('Testcontainers Mock Management', () => {
  it('should validate mock setup', async () => {
    // This test validates that our mock setup works correctly
    const { PostgreSqlContainer } = require('@testcontainers/postgresql');
    const { RedisContainer } = require('@testcontainers/redis');
    const { GenericContainer } = require('testcontainers');

    // Test PostgreSQL mock
    const postgresContainer = new PostgreSqlContainer();
    const postgres = await postgresContainer.start();
    expect(postgres.getConnectionUri()).toBe('postgresql://test_user:test_password@localhost:5432/crypture_test');

    // Test Redis mock
    const redisContainer = new RedisContainer();
    const redis = await redisContainer.start();
    expect(redis.getHost()).toBe('localhost');
    expect(redis.getMappedPort(6379)).toBe(6379);

    // Test GenericContainer mock
    const genericContainer = new GenericContainer('nginx:alpine');
    const generic = await genericContainer.start();
    expect(generic.getHost()).toBe('localhost');
    expect(generic.getMappedPort(80)).toBe(80);
  });
});
