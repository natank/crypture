import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';

// Custom token for request duration
morgan.token('duration', (req: Request, res: Response) => {
  const startTime = (req as any)._startTime;
  if (startTime) {
    const duration = Date.now() - startTime;
    return `${duration}ms`;
  }
  return '-';
});

// Custom token for request ID
morgan.token('request-id', (req: Request) => {
  return (req as any).requestId || '-';
});

// Custom format for development
const developmentFormat = ':method :url :status :res[content-length] - :response-time ms (:duration total) [:request-id]';

// Custom format for production
const productionFormat = 'combined';

// Middleware to add request ID and start time
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Add request ID for tracking
  (req as any).requestId = Math.random().toString(36).substring(2, 15);
  
  // Add start time for duration calculation
  (req as any)._startTime = Date.now();
  
  // Log request start
  if (process.env.NODE_ENV === 'development') {
    console.log(`🚀 [${(req as any).requestId}] ${req.method} ${req.url} - Request started`);
  }
  
  next();
};

// Response logging middleware
export const responseLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = (req as any)._startTime || Date.now();
  const requestId = (req as any).requestId || '-';
  
  // Override res.end to log response
  const originalEnd = res.end.bind(res);
  res.end = function(...args: any[]) {
    const duration = Date.now() - startTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ [${requestId}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
    }
    
    return originalEnd(...args);
  };
  
  next();
};

// Error logging middleware
export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const requestId = (req as any).requestId || '-';
  
  console.error(`❌ [${requestId}] ${req.method} ${req.url} - Error: ${err.message}`);
  
  if (process.env.NODE_ENV === 'development') {
    console.error(`❌ [${requestId}] Stack: ${err.stack}`);
  }
  
  next(err);
};

// Morgan middleware configuration
export const morganLogger = () => {
  if (process.env.NODE_ENV === 'development') {
    return morgan(developmentFormat, {
      stream: {
        write: (message: string) => {
          console.log(`📝 ${message.trim()}`);
        }
      }
    });
  } else {
    return morgan(productionFormat);
  }
};

// API-specific logging middleware
export const apiLogger = (req: Request, res: Response, next: NextFunction) => {
  const requestId = (req as any).requestId || '-';
  const timestamp = new Date().toISOString();
  
  // Log API request details
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔍 [${requestId}] ${timestamp} - API Request:`);
    console.log(`   Method: ${req.method}`);
    console.log(`   URL: ${req.url}`);
    console.log(`   Headers: ${JSON.stringify(req.headers, null, 2)}`);
    
    if (req.body && Object.keys(req.body).length > 0) {
      console.log(`   Body: ${JSON.stringify(req.body, null, 2)}`);
    }
    
    if (req.query && Object.keys(req.query).length > 0) {
      console.log(`   Query: ${JSON.stringify(req.query, null, 2)}`);
    }
  }
  
  next();
};
