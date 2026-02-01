import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
});

// Reference global types
/// <reference path="./types/global.d.ts" />

import { healthRouter } from './routes/health';
import { coingeckoRouter } from './routes/coingecko';
import { requestLogger, morganLogger, apiLogger } from './middleware/logger';
import { corsLogger, apiCors } from './middleware/cors';
import { apiRateLimiter, proxyRateLimiter } from './middleware/rateLimiter';
import { specs, swaggerUi } from './config/swagger';

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Enhanced Middleware Stack
app.use(requestLogger); // Add request ID and start time
app.use(corsLogger); // Log CORS requests
app.use(helmet()); // Security headers

app.use(morganLogger()); // Enhanced request logging
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies with size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

// Handle JSON parsing errors specifically
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err instanceof SyntaxError && 'body' in err) {
      const requestId = (req as ExtendedRequest).requestId || 'unknown';
      return res.status(400).json({
        error: 'Invalid JSON',
        message: 'Malformed JSON in request body',
        timestamp: new Date().toISOString(),
        requestId: requestId,
      });
    }
    return next(err);
  }
);

// API-specific middleware for development
if (NODE_ENV === 'development') {
  app.use('/api', apiLogger); // Detailed API logging in development
}

// Apply rate limiting to API routes
app.use('/api', apiRateLimiter); // General API rate limiting (50 req/min)

// Routes with enhanced CORS and specific rate limiting
app.use('/api/health', apiCors.health, healthRouter);
app.use('/api/coingecko', apiCors.api, proxyRateLimiter, coingeckoRouter); // Use strict API CORS for coingecko

// API Documentation
app.use(
  '/api-docs',
  apiCors.dev,
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Crypture Backend API Documentation',
  })
);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    message: 'Crypture Backend Proxy Service',
    version: '1.0.0',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    documentation: '/api-docs',
    health: '/api/health',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  });
});

// Enhanced error handler
app.use(
  (
    err: Error & { status?: number },
    req: express.Request,
    res: express.Response
  ) => {
    const requestId = (req as ExtendedRequest).requestId || 'unknown';

    res.status(err.status || 500).json({
      error: NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
      message: NODE_ENV === 'production' ? 'Something went wrong' : err.stack,
      timestamp: new Date().toISOString(),
      requestId: requestId,
    });
  }
);

// Start server only if this file is run directly
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(
      `🚀 Crypture Backend Proxy Service running on http://${HOST}:${PORT}`
    );
    console.log(`📊 Environment: ${NODE_ENV}`);
    console.log(`🔗 Health check: http://${HOST}:${PORT}/api/health`);
    console.log(`📅 Started at: ${new Date().toISOString()}`);
  });

  process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });
}

export default app;
