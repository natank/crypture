import { Router, Request, Response } from 'express';
import { CoinGeckoService } from '../services/coingecko';

/**
 * @swagger
 * /api/coingecko/ping:
 *   get:
 *     tags: [CoinGecko]
 *     summary: Check CoinGecko API availability
 *     description: Tests connectivity to the CoinGecko API
 *     responses:
 *       200:
 *         description: CoinGecko API is accessible
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [healthy, unhealthy]
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 requestId:
 *                   type: string
 *       503:
 *         description: CoinGecko API is not accessible
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

const router = Router();
const coingeckoService = new CoinGeckoService();

// Enhanced error handler for proxy routes
const handleProxyError = (error: any, req: Request, res: Response) => {
  const requestId = (req as any).requestId || 'unknown';
  
  if (error.response?.status === 429) {
    return res.status(429).json({
      error: 'Rate Limit Exceeded',
      message: 'CoinGecko API rate limit exceeded. Please try again later.',
      timestamp: new Date().toISOString(),
      requestId,
      retryAfter: error.response.headers['retry-after'] || 60
    });
  }

  if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
    return res.status(503).json({
      error: 'Service Unavailable',
      message: 'CoinGecko API is temporarily unavailable. Please try again later.',
      timestamp: new Date().toISOString(),
      requestId
    });
  }

  if (error.response?.status === 401) {
    return res.status(401).json({
      error: 'Authentication Error',
      message: 'Invalid CoinGecko API key.',
      timestamp: new Date().toISOString(),
      requestId
    });
  }

  if (error.response?.status >= 400 && error.response?.status < 500) {
    return res.status(error.response.status).json({
      error: 'Bad Request',
      message: error.response.data?.error || 'Invalid request to CoinGecko API.',
      timestamp: new Date().toISOString(),
      requestId
    });
  }

  // Default error response
  return res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred while proxying to CoinGecko API.',
    timestamp: new Date().toISOString(),
    requestId
  });
};

// GET /api/coingecko/ping - Health check for CoinGecko API
router.get('/ping', async (req: Request, res: Response) => {
  try {
    const isHealthy = await coingeckoService.ping();
    
    if (isHealthy) {
      res.json({
        status: 'healthy',
        message: 'CoinGecko API is accessible',
        timestamp: new Date().toISOString(),
        requestId: (req as any).requestId
      });
    } else {
      res.status(503).json({
        status: 'unhealthy',
        message: 'CoinGecko API is not accessible',
        timestamp: new Date().toISOString(),
        requestId: (req as any).requestId
      });
    }
  } catch (error) {
    handleProxyError(error, req, res);
  }
});

// GET /api/coingecko/rate-limit - Get rate limit information
/**
 * @swagger
 * /api/coingecko/rate-limit:
 *   get:
 *     tags: [CoinGecko]
 *     summary: Get rate limit information
 *     description: Returns current CoinGecko API rate limit status
 *     responses:
 *       200:
 *         description: Rate limit information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CoinGeckoRateLimitResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/rate-limit', async (req: Request, res: Response) => {
  try {
    const rateLimitInfo = await coingeckoService.getRateLimitInfo();
    
    if (rateLimitInfo) {
      res.json({
        rateLimit: rateLimitInfo.limit,
        remaining: rateLimitInfo.remaining,
        usage: rateLimitInfo.limit - rateLimitInfo.remaining,
        percentage: Math.round(((rateLimitInfo.limit - rateLimitInfo.remaining) / rateLimitInfo.limit) * 100),
        timestamp: new Date().toISOString(),
        requestId: (req as any).requestId
      });
    } else {
      res.json({
        message: 'Rate limit information not available (free tier)',
        timestamp: new Date().toISOString(),
        requestId: (req as any).requestId
      });
    }
  } catch (error) {
    handleProxyError(error, req, res);
  }
});

// GET /api/coingecko/simple/price - Get simple price data
/**
 * @swagger
 * /api/coingecko/simple/price:
 *   get:
 *     tags: [CoinGecko]
 *     summary: Get simple price data
 *     description: Returns current price data for specified cryptocurrencies
 *     parameters:
 *       - in: query
 *         name: ids
 *         required: true
 *         schema:
 *           type: string
 *           example: "bitcoin,ethereum"
 *         description: Comma-separated list of cryptocurrency IDs
 *       - in: query
 *         name: vs_currencies
 *         required: false
 *         schema:
 *           type: string
 *           default: "usd"
 *         description: Target currency for price conversion
 *     responses:
 *       200:
 *         description: Price data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CoinGeckoSimplePrice'
 *       400:
 *         description: Missing required parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/simple/price', async (req: Request, res: Response) => {
  try {
    const { ids, vs_currencies = 'usd' } = req.query;
    
    if (!ids) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required parameter: ids',
        timestamp: new Date().toISOString(),
        requestId: (req as any).requestId
      });
    }

    const priceData = await coingeckoService.getSimplePrice(
      ids as string, 
      vs_currencies as string
    );

    res.json({
      data: priceData,
      timestamp: new Date().toISOString(),
      requestId: (req as any).requestId
    });
    return;
  } catch (error) {
    return handleProxyError(error, req, res);
  }
});

// GET /api/coingecko/coins/markets - Get market data for multiple coins
/**
 * @swagger
 * /api/coingecko/coins/markets:
 *   get:
 *     tags: [CoinGecko]
 *     summary: Get market data for multiple coins
 *     description: Returns market data for multiple cryptocurrencies
 *     parameters:
 *       - in: query
 *         name: vs_currency
 *         required: false
 *         schema:
 *           type: string
 *           default: "usd"
 *         description: Target currency for price conversion
 *       - in: query
 *         name: order
 *         required: false
 *         schema:
 *           type: string
 *           default: "market_cap_desc"
 *         description: Sort order
 *       - in: query
 *         name: per_page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Number of results per page
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: sparkline
 *         required: false
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include sparkline data
 *     responses:
 *       200:
 *         description: Market data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CoinGeckoMarketData'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/coins/markets', async (req: Request, res: Response) => {
  try {
    const {
      vs_currency = 'usd',
      order = 'market_cap_desc',
      per_page = '100',
      page = '1',
      sparkline = 'false'
    } = req.query;

    const marketsData = await coingeckoService.getCoinsMarkets(
      vs_currency as string,
      order as string,
      parseInt(per_page as string),
      parseInt(page as string),
      sparkline === 'true'
    );

    res.json({
      data: marketsData,
      pagination: {
        page: parseInt(page as string),
        per_page: parseInt(per_page as string),
        total: marketsData.length
      },
      timestamp: new Date().toISOString(),
      requestId: (req as any).requestId
    });
    return;
  } catch (error) {
    return handleProxyError(error, req, res);
  }
});

// GET /api/coingecko/coins/:id - Get detailed information about a coin
/**
 * @swagger
 * /api/coingecko/coins/{id}:
 *   get:
 *     tags: [CoinGecko]
 *     summary: Get detailed information about a coin
 *     description: Returns detailed information about a specific cryptocurrency
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "bitcoin"
 *         description: Cryptocurrency ID
 *     responses:
 *       200:
 *         description: Coin data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   description: Detailed coin information
 *       404:
 *         description: Coin not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/coins/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required parameter: coin id',
        timestamp: new Date().toISOString(),
        requestId: (req as any).requestId
      });
    }

    const coinData = await coingeckoService.getCoinById(id);

    res.json({
      data: coinData,
      timestamp: new Date().toISOString(),
      requestId: (req as any).requestId
    });
    return;
  } catch (error) {
    return handleProxyError(error, req, res);
  }
});

// GET /api/coingecko/search - Search for coins, exchanges, etc.
/**
 * @swagger
 * /api/coingecko/search:
 *   get:
 *     tags: [CoinGecko]
 *     summary: Search for coins, exchanges, etc.
 *     description: Search for cryptocurrencies, exchanges, and other entities
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *           example: "bitcoin"
 *         description: Search query
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CoinGeckoSearchResponse'
 *       400:
 *         description: Missing required parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required parameter: query',
        timestamp: new Date().toISOString(),
        requestId: (req as any).requestId
      });
    }

    const searchData = await coingeckoService.search(query as string);

    res.json({
      data: searchData,
      timestamp: new Date().toISOString(),
      requestId: (req as any).requestId
    });
    return;
  } catch (error) {
    return handleProxyError(error, req, res);
  }
});

// GET /api/coingecko/search/trending - Get trending coins
/**
 * @swagger
 * /api/coingecko/search/trending:
 *   get:
 *     tags: [CoinGecko]
 *     summary: Get trending coins
 *     description: Returns top trending cryptocurrencies
 *     responses:
 *       200:
 *         description: Trending coins retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CoinGeckoTrendingResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/search/trending', async (req: Request, res: Response) => {
  try {
    const trendingData = await coingeckoService.getTrending();

    res.json({
      data: trendingData,
      timestamp: new Date().toISOString(),
      requestId: (req as any).requestId
    });
  } catch (error) {
    handleProxyError(error, req, res);
  }
});

// GET /api/coingecko/coins/categories - Get coin categories
/**
 * @swagger
 * /api/coingecko/coins/categories:
 *   get:
 *     tags: [CoinGecko]
 *     summary: Get coin categories
 *     description: Returns list of cryptocurrency categories
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CoinGeckoCategoriesResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/coins/categories', async (req: Request, res: Response) => {
  try {
    const categoriesData = await coingeckoService.getCategories();

    res.json({
      data: categoriesData,
      timestamp: new Date().toISOString(),
      requestId: (req as any).requestId
    });
  } catch (error) {
    handleProxyError(error, req, res);
  }
});

// GET /api/coingecko/global - Get global cryptocurrency data
/**
 * @swagger
 * /api/coingecko/global:
 *   get:
 *     tags: [CoinGecko]
 *     summary: Get global cryptocurrency data
 *     description: Returns global cryptocurrency market data
 *     responses:
 *       200:
 *         description: Global data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CoinGeckoGlobalResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/global', async (req: Request, res: Response) => {
  try {
    const globalData = await coingeckoService.getGlobal();

    res.json({
      data: globalData,
      timestamp: new Date().toISOString(),
      requestId: (req as any).requestId
    });
  } catch (error) {
    handleProxyError(error, req, res);
  }
});

// GET /api/coingecko/coins/:id/market_chart - Get market chart data
/**
 * @swagger
 * /api/coingecko/coins/{id}/market_chart:
 *   get:
 *     tags: [CoinGecko]
 *     summary: Get market chart data
 *     description: Returns historical market chart data for a cryptocurrency
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "bitcoin"
 *         description: Cryptocurrency ID
 *       - in: query
 *         name: vs_currency
 *         required: false
 *         schema:
 *           type: string
 *           default: "usd"
 *         description: Target currency for price conversion
 *       - in: query
 *         name: days
 *         required: false
 *         schema:
 *           type: integer
 *           default: 7
 *         description: Number of days of data
 *     responses:
 *       200:
 *         description: Market chart data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   description: Historical price data
 *       404:
 *         description: Coin not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/coins/:id/market_chart', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { vs_currency = 'usd', days = '7' } = req.query;
    
    if (!id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required parameter: coin id',
        timestamp: new Date().toISOString(),
        requestId: (req as any).requestId
      });
    }

    const chartData = await coingeckoService.getMarketChart(
      id,
      vs_currency as string,
      parseInt(days as string)
    );

    res.json({
      data: chartData,
      timestamp: new Date().toISOString(),
      requestId: (req as any).requestId
    });
    return;
  } catch (error) {
    return handleProxyError(error, req, res);
  }
});

export { router as coingeckoRouter };
