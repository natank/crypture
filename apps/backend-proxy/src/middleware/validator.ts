import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

// Reference the global ExtendedRequest interface
declare global {
  interface ExtendedRequest extends Express.Request {
    requestId?: string;
    _startTime?: number;
  }
}

/**
 * Middleware to handle validation errors from express-validator
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const requestId = (req as ExtendedRequest).requestId || 'unknown';

    res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid request parameters',
      errors: errors.array().map((err) => ({
        field: err.type === 'field' ? err.path : undefined,
        message: err.msg,
        value: err.type === 'field' ? err.value : undefined,
      })),
      timestamp: new Date().toISOString(),
      requestId,
    });
    return;
  }

  next();
};

/**
 * Wrapper to run validation chains and handle errors
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    // Check for errors
    handleValidationErrors(req, res, next);
  };
};
