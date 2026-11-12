import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';

/**
 * Verify a password against either PBKDF2 hash (from seed data) or bcrypt hash
 */
export function verifyPassword(password, storedHash) {
  if (!storedHash || !password) return false;

  // Check if it's our PBKDF2 hash format: pbkdf2_sha256$iterations$salt_hex$hash_hex
  if (storedHash.startsWith('pbkdf2_sha256$')) {
    const parts = storedHash.split('$');
    if (parts.length !== 4) return false;
    const iterations = parseInt(parts[1], 10);
    const salt = Buffer.from(parts[2], 'hex');
    const expectedHash = parts[3];
    const derived = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256');
    return derived.toString('hex') === expectedHash;
  }

  // Fallback to bcrypt
  try {
    return bcrypt.compareSync(password, storedHash);
  } catch (err) {
    return false;
  }
}

/**
 * Hash a password using bcrypt
 */
export function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

/**
 * Generate a non-guessable, secure QR token
 */
export function generateQRToken(eventId, studentId) {
  const randomBytes = crypto.randomBytes(8).toString('hex').toUpperCase();
  return `EVA-${eventId}-${studentId}-${randomBytes}`;
}
