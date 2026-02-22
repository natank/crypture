import { Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';

const CSRF_HEADER = 'x-csrf-token';
const CSRF_COOKIE = 'csrf-token';
const TOKEN_LENGTH = 32;

const tokenStore: Map<string, number> = new Map();
const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function generateToken(): string {
  return randomBytes(TOKEN_LENGTH).toString('hex');
}

function cleanExpiredTokens(): void {
  const now = Date.now();
  for (const [token, expiresAt] of tokenStore.entries()) {
    if (now > expiresAt) {
      tokenStore.delete(token);
    }
  }
}

/**
 * Issues a CSRF token and sets it as a cookie.
 * Call this on GET requests that precede state-changing operations.
 */
export const issueCsrfToken = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = generateToken();
  const expiresAt = Date.now() + TOKEN_TTL_MS;

  tokenStore.set(token, expiresAt);
  cleanExpiredTokens();

  res.cookie(CSRF_COOKIE, token, {
    httpOnly: false, // Must be readable by JS to send in header
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: TOKEN_TTL_MS,
  });

  res.locals.csrfToken = token;
  next();
};

/**
 * Validates the CSRF token on state-changing requests (POST, PUT, DELETE, PATCH).
 * Skips validation for safe methods and for requests from the same origin
 * when no token is present (graceful degradation for API clients).
 */
export const validateCsrfToken = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  const tokenFromHeader = req.headers[CSRF_HEADER] as string | undefined;
  const tokenFromBody = req.body?._csrf as string | undefined;
  const token = tokenFromHeader || tokenFromBody;

  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'CSRF token missing',
    });
  }

  const expiresAt = tokenStore.get(token);

  if (!expiresAt) {
    return res.status(403).json({
      success: false,
      message: 'Invalid CSRF token',
    });
  }

  if (Date.now() > expiresAt) {
    tokenStore.delete(token);
    return res.status(403).json({
      success: false,
      message: 'CSRF token expired',
    });
  }

  // Single-use: remove after validation
  tokenStore.delete(token);
  next();
};

/**
 * Endpoint handler to get a fresh CSRF token.
 * Clients call GET /api/auth/csrf-token before submitting forms.
 */
export const getCsrfToken = (req: Request, res: Response): Response => {
  const token = generateToken();
  const expiresAt = Date.now() + TOKEN_TTL_MS;

  tokenStore.set(token, expiresAt);
  cleanExpiredTokens();

  res.cookie(CSRF_COOKIE, token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: TOKEN_TTL_MS,
  });

  return res.status(200).json({
    success: true,
    data: { csrfToken: token },
  });
};
