import { hashPassword, comparePasswords } from '../utils/bcrypt';
import { generateToken, generateRefreshToken } from '../utils/jwt';
import { validateEmail, validatePassword } from '../utils/validators';
import { ApiError } from '../middleware/errorHandler';

interface User {
  id: string;
  email: string;
  role: string;
  hospitalId: string;
  twoFactorEnabled: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
  requiresTwoFactor?: boolean;
}

/**
 * Authentication Service
 * Handles user registration, login, and token management
 */
export class AuthService {
  /**
   * Authenticate user with email and password
   */
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { email, password } = credentials;

    if (!validateEmail(email)) {
      throw new ApiError(400, 'Invalid email format', 'INVALID_EMAIL');
    }

    // TODO: Fetch user from database
    // const user = await UserRepository.findByEmail(email);

    // if (!user) {
    //   throw new ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
    // }

    // const passwordValid = await comparePasswords(password, user.passwordHash);
    // if (!passwordValid) {
    //   throw new ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
    // }

    // Mock user for now
    const user: User = {
      id: 'user_123',
      email,
      role: 'doctor',
      hospitalId: 'hosp_123',
      twoFactorEnabled: false,
    };

    if (user.twoFactorEnabled) {
      return {
        token: '',
        refreshToken: '',
        user,
        requiresTwoFactor: true,
      };
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      hospitalId: user.hospitalId,
    });

    const refreshToken = generateRefreshToken(user.id);

    return {
      token,
      refreshToken,
      user,
    };
  }

  /**
   * Register a new user
   */
  static async register(data: {
    email: string;
    password: string;
    fullName: string;
    hospitalId: string;
  }) {
    if (!validateEmail(data.email)) {
      throw new ApiError(400, 'Invalid email format', 'INVALID_EMAIL');
    }

    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.valid) {
      throw new ApiError(
        400,
        passwordValidation.message || 'Invalid password',
        'WEAK_PASSWORD'
      );
    }

    // TODO: Check if user already exists
    // const existing = await UserRepository.findByEmail(data.email);
    // if (existing) {
    //   throw new ApiError(409, 'Email already registered', 'EMAIL_EXISTS');
    // }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // TODO: Create user in database
    // const user = await UserRepository.create({
    //   email: data.email,
    //   passwordHash,
    //   fullName: data.fullName,
    //   hospitalId: data.hospitalId,
    //   role: 'receptionist', // Default role
    // });

    return {
      success: true,
      message: 'User registered successfully',
      // user: { id: user.id, email: user.email, role: user.role },
    };
  }

  /**
   * Verify 2FA code
   */
  static async verify2FA(
    userId: string,
    code: string
  ): Promise<{ token: string; refreshToken: string }> {
    // TODO: Implement TOTP verification
    // const isValid = await TOTPService.verify(userId, code);
    // if (!isValid) {
    //   throw new ApiError(401, 'Invalid 2FA code', 'INVALID_2FA_CODE');
    // }

    // TODO: Fetch user from database
    const user: User = {
      id: userId,
      email: 'user@example.com',
      role: 'doctor',
      hospitalId: 'hosp_123',
      twoFactorEnabled: true,
    };

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      hospitalId: user.hospitalId,
    });

    const refreshToken = generateRefreshToken(user.id);

    return { token, refreshToken };
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(email: string): Promise<void> {
    if (!validateEmail(email)) {
      throw new ApiError(400, 'Invalid email format', 'INVALID_EMAIL');
    }

    // TODO: Find user and send reset email
    // const user = await UserRepository.findByEmail(email);
    // if (!user) {
    //   // Don't reveal if email exists for security
    //   return;
    // }

    // const resetToken = await PasswordResetService.createReset(user.id);
    // await EmailService.sendPasswordResetEmail(email, resetToken);
  }

  /**
   * Reset password with token
   */
  static async resetPassword(
    token: string,
    newPassword: string
  ): Promise<void> {
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      throw new ApiError(
        400,
        passwordValidation.message || 'Invalid password',
        'WEAK_PASSWORD'
      );
    }

    // TODO: Verify reset token and update password
    // const userId = await PasswordResetService.verifyToken(token);
    // if (!userId) {
    //   throw new ApiError(400, 'Invalid or expired reset token', 'INVALID_TOKEN');
    // }

    // const passwordHash = await hashPassword(newPassword);
    // await UserRepository.update(userId, { passwordHash });
    // await PasswordResetService.invalidateToken(token);
  }
}
