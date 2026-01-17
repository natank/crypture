import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { healthRouter } from './routes/health';
import { 
  requestLogger, 
  responseLogger, 
  errorLogger, 
  morganLogger, 
  apiLogger 
} from './middleware/logger';
import { 
  corsMiddleware, 
  corsLogger, 
  apiCors 
} from './middleware/cors';
import { specs, swaggerUi } from './config/swagger';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Enhanced Middleware Stack
app.use(requestLogger); // Add request ID and start time
app.use(corsLogger); // Log CORS requests
app.use(helmet()); // Security headers

// Environment-aware CORS
if (NODE_ENV === 'development') {
  app.use(corsMiddleware()); // Development CORS (permissive)
} else {
  app.use(corsMiddleware()); // Production CORS (strict)
}

app.use(morganLogger()); // Enhanced request logging
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies with size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

// API-specific middleware for development
if (NODE_ENV === 'development') {
  app.use('/api', apiLogger); // Detailed API logging in development
}

// Routes with enhanced CORS
app.use('/api/health', apiCors.health, healthRouter);

// API Documentation
app.use('/api-docs', apiCors.dev, swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Crypture Backend API Documentation'
}));

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    message: 'Crypture Backend Proxy Service',
    version: '1.0.0',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    documentation: '/api-docs',
    health: '/api/health'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Enhanced error handler
app.use(errorLogger);
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const requestId = (_req as any).requestId || 'unknown';
  
  res.status(err.status || 500).json({
    error: NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
    message: NODE_ENV === 'production' ? 'Something went wrong' : err.stack,
    timestamp: new Date().toISOString(),
    requestId: requestId
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Crypture Backend Proxy Service running on http://${HOST}:${PORT}`);
  console.log(`📊 Environment: ${NODE_ENV}`);
  console.log(`🔗 Health check: http://${HOST}:${PORT}/api/health`);
  console.log(`📅 Started at: ${new Date().toISOString()}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

export default app;
