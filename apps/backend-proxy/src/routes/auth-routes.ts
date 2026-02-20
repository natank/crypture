import { Router } from 'express';
import { body } from 'express-validator';
import { authController } from '../controllers/auth-controller';
import { rateLimit } from 'express-rate-limit';
import {
  authenticateToken,
  requireAuth,
  requireEmailConfirmation,
} from '../middleware/auth-middleware';

const router = Router();

// Rate limiting for auth endpoints
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General rate limit for less sensitive endpoints
const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
});

// Validation rules
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

const resetPasswordValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
];

const updatePasswordValidation = [
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
];

// Routes
router.post(
  '/register',
  authRateLimit,
  registerValidation,
  authController.register
);
router.post('/login', authRateLimit, loginValidation, authController.login);
router.post('/logout', generalRateLimit, authController.logout);
router.post(
  '/reset-password',
  authRateLimit,
  resetPasswordValidation,
  authController.resetPassword
);
router.put(
  '/update-password',
  generalRateLimit,
  authenticateToken,
  requireAuth,
  updatePasswordValidation,
  authController.updatePassword
);
router.get(
  '/me',
  generalRateLimit,
  authenticateToken,
  requireAuth,
  authController.getCurrentUser
);
router.delete(
  '/account',
  generalRateLimit,
  authenticateToken,
  requireAuth,
  requireEmailConfirmation,
  authController.deleteAccount
);

export default router;
