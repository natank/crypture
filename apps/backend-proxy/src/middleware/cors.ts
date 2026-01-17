import cors from 'cors';
import { Request, Response, NextFunction } from 'express';

// CORS configuration options
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allowed origins
    const allowedOrigins = [
      process.env.CORS_ORIGIN || 'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000'
    ];
    
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      console.warn(`🚫 CORS Warning: ${msg}`);
      callback(new Error(msg), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma'
  ],
  exposedHeaders: [
    'X-Total-Count',
    'X-Page-Count',
    'X-Current-Page',
    'X-Per-Page'
  ],
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Development CORS middleware with more permissive settings
export const developmentCors = cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: '*',
  exposedHeaders: '*',
  maxAge: 86400
});

// Production CORS middleware with strict settings
export const productionCors = cors(corsOptions);

// Environment-aware CORS middleware
export const corsMiddleware = () => {
  return process.env.NODE_ENV === 'development' ? developmentCors : productionCors;
};

// Custom CORS logging middleware
export const corsLogger = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  const requestId = (req as any).requestId || '-';
  
  if (origin && process.env.NODE_ENV === 'development') {
    console.log(`🌐 [${requestId}] CORS Request from origin: ${origin}`);
  }
  
  next();
};

// API-specific CORS configuration for different endpoints
export const apiCors = {
  // Health endpoints - allow all origins
  health: cors({
    origin: true,
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    maxAge: 86400
  }),
  
  // API endpoints - strict CORS
  api: cors(corsOptions),
  
  // Development endpoints - permissive CORS
  dev: cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: '*',
    maxAge: 86400
  })
};
