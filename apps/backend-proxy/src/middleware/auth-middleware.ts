import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/supabase-client';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        email_confirmed_at?: string;
      };
    }
  }
}

/**
 * Authentication middleware to verify JWT token and attach user to request
 */
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
      });
    }

    // Verify token with Supabase
    const userData = await authService.verifyToken(token);

    if (!userData.user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    // Attach user to request object
    req.user = {
      id: userData.user.id,
      email: userData.user.email || '',
      email_confirmed_at: userData.user.email_confirmed_at,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

/**
 * Optional authentication middleware - doesn't fail if no token
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const userData = await authService.verifyToken(token);
      
      if (userData.user) {
        req.user = {
          id: userData.user.id,
          email: userData.user.email || '',
          email_confirmed_at: userData.user.email_confirmed_at,
        };
      }
    }

    next();
  } catch (error) {
    // Don't fail for optional auth, just continue without user
    console.error('Optional auth error:', error);
    next();
  }
};

/**
 * Check if user is authenticated (for route guards)
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }
  next();
};

/**
 * Check if user has confirmed email
 */
export const requireEmailConfirmation = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  if (!req.user.email_confirmed_at) {
    return res.status(403).json({
      success: false,
      message: 'Email confirmation required',
    });
  }

  next();
};
