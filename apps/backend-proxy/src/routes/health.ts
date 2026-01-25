import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Get basic health status
 *     description: Returns the current health status of the backend service
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *       500:
 *         description: Service is unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', (_req, res) => {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    memory: {
      used:
        Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
      total:
        Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
    },
    services: {
      database: 'not_implemented',
      cache: 'not_implemented',
      external_apis: 'not_implemented',
    },
  };

  res.status(200).json(healthCheck);
});

/**
 * @swagger
 * /api/health/detailed:
 *   get:
 *     summary: Get detailed health status
 *     description: Returns detailed health status including system information and configuration
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Detailed health information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetailedHealthResponse'
 *       500:
 *         description: Service is unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/detailed', (_req, res) => {
  const detailedHealth = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    system: {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      pid: process.pid,
    },
    memory: {
      rss: Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100,
      heapTotal:
        Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
      heapUsed:
        Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
      external:
        Math.round((process.memoryUsage().external / 1024 / 1024) * 100) / 100,
    },
    services: {
      database: {
        status: 'not_implemented',
        message: 'Database service not yet implemented',
      },
      cache: {
        status: 'not_implemented',
        message: 'Cache service not yet implemented',
      },
      external_apis: {
        status: 'not_implemented',
        message: 'External API proxy not yet implemented',
      },
    },
    configuration: {
      port: process.env.PORT || 3000,
      host: process.env.HOST || 'localhost',
      corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      logLevel: process.env.LOG_LEVEL || 'info',
    },
  };

  res.status(200).json(detailedHealth);
});

/**
 * @swagger
 * /api/health/env-debug:
 *   get:
 *     summary: Debug environment variables (for troubleshooting)
 *     description: Returns environment variable status for debugging purposes
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Environment debug information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 timestamp:
 *                   type: string
 *                 environment:
 *                   type: string
 *                 coinGeckoApiKey:
 *                   type: object
 *                   properties:
 *                     exists:
 *                       type: boolean
 *                     length:
 *                       type: number
 *                     prefix:
 *                       type: string
 *                     startsWith:
 *                       type: boolean
 *                 corsOrigins:
 *                   type: object
 *                   properties:
 *                     corsOrigin:
 *                       type: string
 *                     corsOrigins:
 *                       type: string
 *                 otherVars:
 *                   type: object
 *                   properties:
 *                     port:
 *                       type: string
 *                     host:
 *                       type: string
 */
router.get('/env-debug', (_req, res) => {
  const envDebug = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    coinGeckoApiKey: {
      exists: !!process.env.COINGECKO_API_KEY,
      length: process.env.COINGECKO_API_KEY?.length || 0,
      prefix:
        process.env.COINGECKO_API_KEY?.substring(0, 8) + '...' || 'not_set',
      startsWith: process.env.COINGECKO_API_KEY?.startsWith('CG-') || false,
    },
    corsOrigins: {
      corsOrigin: process.env.CORS_ORIGIN || 'not_set',
      corsOrigins: process.env.CORS_ORIGINS || 'not_set',
    },
    otherVars: {
      port: process.env.PORT || 'not_set',
      host: process.env.HOST || 'not_set',
    },
  };

  res.status(200).json(envDebug);
});

/**
 * @swagger
 * /api/health/headers-test:
 *   get:
 *     summary: Test CoinGecko API headers (for debugging)
 *     description: Makes a test request to CoinGecko and shows the headers being sent
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Headers test result
 */
router.get('/headers-test', async (_req, res) => {
  try {
    // Import CoinGeckoService to test
    const { CoinGeckoService } = await import('../services/coingecko');
    const service = new CoinGeckoService();

    // Make a simple test request
    const response = await service.ping();

    res.status(200).json({
      success: true,
      message: 'CoinGecko API test successful',
      pingResult: response,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'CoinGecko API test failed',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

export { router as healthRouter };
