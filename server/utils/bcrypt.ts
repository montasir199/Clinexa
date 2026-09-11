import bcrypt from 'bcryptjs';

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);

/**
 * Hash a password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Compare plain text password with hashed password
 * @param password - Plain text password
 * @param hash - Hashed password
 * @returns True if passwords match, false otherwise
 */
export async function comparePasswords(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Check if a password needs rehashing (strength check)
 * @param hash - Existing password hash
 * @returns True if password should be rehashed
 */
export function shouldRehash(hash: string): boolean {
  // Extract rounds from bcrypt hash
  const match = hash.match(/^\$2[aby]\$(\d+)\$/);
  if (!match) return false;
  const rounds = parseInt(match[1], 10);
  return rounds < BCRYPT_ROUNDS;
}
