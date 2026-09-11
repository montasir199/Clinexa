/**
 * Validate email address format
 * @param email - Email to validate
 * @returns True if valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

/**
 * Validate password strength
 * Requires: 8+ chars, uppercase, lowercase, number, special char
 * @param password - Password to validate
 * @returns Validation result with error message
 */
export function validatePassword(
  password: string
): { valid: boolean; message?: string } {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one uppercase letter',
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one lowercase letter',
    };
  }

  if (!/\d/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one number',
    };
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one special character',
    };
  }

  return { valid: true };
}

/**
 * Validate phone number (international format)
 * @param phone - Phone number to validate
 * @returns True if valid, false otherwise
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/[\s\-()]/g, ''));
}

/**
 * Validate national ID (Saudi Arabia format)
 * @param id - National ID to validate
 * @returns True if valid, false otherwise
 */
export function validateNationalId(id: string): boolean {
  // Saudi national ID format check
  const idRegex = /^\d{10}$/;
  if (!idRegex.test(id)) return false;

  // Luhn algorithm validation for Saudi ID
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    let digit = parseInt(id[i], 10);
    const weight = 11 - i;

    if (i % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit * weight;
  }

  return sum % 11 === 0;
}

/**
 * Validate VAT number (Saudi Arabia format)
 * @param vat - VAT number to validate
 * @returns True if valid, false otherwise
 */
export function validateVAT(vat: string): boolean {
  // Saudi VAT format: 15 digits
  return /^\d{15}$/.test(vat);
}

/**
 * Sanitize input to prevent XSS
 * @param input - Input string to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate CRUD operation input
 * @param data - Data to validate
 * @param requiredFields - Required field names
 * @returns Validation result with errors
 */
export function validateRequiredFields(
  data: Record<string, any>,
  requiredFields: string[]
): { valid: boolean; errors?: Record<string, string> } {
  const errors: Record<string, string> = {};

  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      errors[field] = `${field} is required`;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
}
