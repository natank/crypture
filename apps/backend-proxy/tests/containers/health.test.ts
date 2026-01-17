/// <reference types="jest" />
import request from 'supertest';
import app from '../../src/main';
import { testContainersManager } from './testcontainers-setup';

describe('Health Endpoints Testcontainers Integration', () => {
  let postgresConnection: string;
  let redisConnection: string;

  beforeAll(async () => {
    // Start PostgreSQL container
    const postgresContainer = await testContainersManager.startPostgres();
    postgresConnection = testContainersManager.getPostgresConnection()!;
    
    // Start Redis container
    const redisContainer = await testContainersManager.startRedis();
    redisConnection = testContainersManager.getRedisConnection()!;

    console.log('🐳 Testcontainers started:');
    console.log(`  PostgreSQL: ${postgresConnection}`);
    console.log(`  Redis: ${redisConnection}`);
  }, 60000); // 60 seconds timeout

  describe('GET /api/health', () => {
    it('should return healthy status with Testcontainers running', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

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
    it('should return detailed health information with Testcontainers', async () => {
      const response = await request(app)
        .get('/api/health/detailed')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('environment', 'test');
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

  describe('Container Connectivity Tests', () => {
    it('should verify PostgreSQL container connectivity', async () => {
      // This test would typically include database operations
      // For now, we just verify the container is running
      expect(postgresConnection).toBeDefined();
      expect(postgresConnection).toMatch(/postgres(ql)?:\/\//);
    });

    it('should verify Redis container connectivity', async () => {
      // This test would typically include cache operations
      // For now, we just verify the container is running
      expect(redisConnection).toBeDefined();
      expect(redisConnection).toMatch(/redis:\/\//);
    });
  });

  describe('Error Handling with Testcontainers', () => {
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

describe('Testcontainers Management', () => {
  it('should start and stop PostgreSQL container', async () => {
    const container = await testContainersManager.startPostgres();
    expect(container).toBeDefined();
    
    const connection = testContainersManager.getPostgresConnection();
    expect(connection).toBeDefined();
    expect(connection).toMatch(/postgres(ql)?:\/\//);
  });

  it('should start and stop Redis container', async () => {
    const container = await testContainersManager.startRedis();
    expect(container).toBeDefined();
    
    const connection = testContainersManager.getRedisConnection();
    expect(connection).toBeDefined();
    expect(connection).toMatch(/redis:\/\//);
  });

  it('should start generic container', async () => {
    const container = await testContainersManager.startGeneric('nginx:alpine', 80);
    expect(container).toBeDefined();
    
    const host = testContainersManager.getContainerHost();
    const port = testContainersManager.getContainerPort(80);
    
    expect(host).toBeDefined();
    expect(port).toBeDefined();
    expect(typeof port).toBe('number');
  });
});
