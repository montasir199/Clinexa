import express, { Router } from 'express';
import { AuthService } from '../services/AuthService';
import { authenticateToken } from '../middleware/auth';
import { authRateLimiter, clearRateLimit } from '../middleware/rateLimiter';
import { errorHandler, ApiError, asyncHandler } from '../middleware/errorHandler';

const router: Router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user account
 */
router.post(
  '/register',
  authRateLimiter,
  asyncHandler(async (req, res) => {
    const { email, password, fullName, hospitalId } = req.body;

    if (!email || !password || !fullName) {
      throw new ApiError(
        400,
        'Missing required fields: email, password, fullName',
        'MISSING_FIELDS'
      );
    }

    const result = await AuthService.register({
      email,
      password,
      fullName,
      hospitalId,
    });

    res.status(201).json(result);
  })
);

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
router.post(
  '/login',
  authRateLimiter,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(
        400,
        'Email and password are required',
        'MISSING_CREDENTIALS'
      );
    }

    const result = await AuthService.login({ email, password });

    if (result.requiresTwoFactor) {
      res.status(200).json({
        success: true,
        message: '2FA required',
        requiresTwoFactor: true,
        tempToken: result.token, // Temporary token for 2FA verification
      });
      return;
    }

    // Clear rate limit on successful login
    clearRateLimit(req, 'auth-rate-limit');

    // Set secure HTTP-only cookie for refresh token
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: result.token,
      user: result.user,
    });
  })
);

/**
 * POST /api/auth/2fa/verify
 * Verify two-factor authentication code
 */
router.post(
  '/2fa/verify',
  asyncHandler(async (req, res) => {
    const { code } = req.body;
    const tempToken = req.headers.authorization?.split(' ')[1];

    if (!code || !tempToken) {
      throw new ApiError(
        400,
        '2FA code and temporary token are required',
        'MISSING_2FA_CODE'
      );
    }

    // TODO: Extract userId from tempToken (unverified)
    const userId = 'user_123';

    const result = await AuthService.verify2FA(userId, code);

    clearRateLimit(req, 'auth-rate-limit');

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: '2FA verified successfully',
      token: result.token,
    });
  })
);

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      throw new ApiError(
        401,
        'Refresh token is required',
        'NO_REFRESH_TOKEN'
      );
    }

    // TODO: Implement token refresh logic
    // const payload = verifyRefreshToken(refreshToken);
    // if (!payload) {
    //   throw new ApiError(401, 'Invalid refresh token', 'INVALID_REFRESH_TOKEN');
    // }

    // const user = await UserRepository.findById(payload.userId);
    // const newToken = generateToken({ ... });

    res.status(200).json({
      success: true,
      message: 'Token refreshed',
      // token: newToken,
    });
  })
);

/**
 * POST /api/auth/logout
 * Invalidate refresh token
 */
router.post('/logout', authenticateToken, asyncHandler(async (req, res) => {
  // Clear refresh token cookie
  res.clearCookie('refreshToken');

  // TODO: Invalidate refresh token in database

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
}));

/**
 * POST /api/auth/password-reset/request
 * Request password reset email
 */
router.post(
  '/password-reset/request',
  authRateLimiter,
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, 'Email is required', 'MISSING_EMAIL');
    }

    await AuthService.requestPasswordReset(email);

    res.status(200).json({
      success: true,
      message: 'If an account exists, a reset email has been sent',
    });
  })
);

/**
 * POST /api/auth/password-reset/confirm
 * Reset password with token
 */
router.post(
  '/password-reset/confirm',
  asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      throw new ApiError(
        400,
        'Token and new password are required',
        'MISSING_FIELDS'
      );
    }

    await AuthService.resetPassword(token, newPassword);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  })
);

export default router;
