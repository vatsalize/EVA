import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';

/**
 * Predefined Demonstration Coordinator Accounts
 * These correspond to the seeded demo coordinator accounts in data/dummy/coordinators.json
 */
export const PREDEFINED_DEMO_COORDINATOR_IDS = Object.freeze([
  'COO001',
  'COO002',
  'COO003',
  'COO004',
  'COO005',
  'COO006'
]);

export const DEMO_COORDINATOR_DEFAULT_PASSWORD = 'EVA-Demo@2026';

export const DEMO_COORDINATOR_ACCOUNTS = Object.freeze([
  {
    id: 'COO001',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@eva-demo.test',
    club: 'Coding Club',
    clubId: 'CLB001',
    role: 'Coordinator'
  },
  {
    id: 'COO002',
    name: 'Diya Verma',
    email: 'diya.verma@eva-demo.test',
    club: 'Robotics Club',
    clubId: 'CLB002',
    role: 'Coordinator'
  },
  {
    id: 'COO003',
    name: 'Kabir Mehta',
    email: 'kabir.mehta@eva-demo.test',
    club: 'Cultural Club',
    clubId: 'CLB003',
    role: 'Coordinator'
  },
  {
    id: 'COO004',
    name: 'Ananya Rao',
    email: 'ananya.rao@eva-demo.test',
    club: 'Literary Society',
    clubId: 'CLB004',
    role: 'Coordinator'
  },
  {
    id: 'COO005',
    name: 'Reyansh Gupta',
    email: 'reyansh.gupta@eva-demo.test',
    club: 'Entrepreneurship Cell',
    clubId: 'CLB005',
    role: 'Coordinator'
  },
  {
    id: 'COO006',
    name: 'Myra Kapoor',
    email: 'myra.kapoor@eva-demo.test',
    club: 'Fine Arts Club',
    clubId: 'CLB006',
    role: 'Coordinator'
  }
]);

/**
 * In-memory brute-force protection for demo unlock attempts
 * Maximum 5 failed attempts per IP address within a 15-minute sliding window
 */
const rateLimitStore = new Map();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Extract client IP from Express request safely
 */
export function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded && typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || '127.0.0.1';
}

/**
 * Check if the client IP has exceeded the failed attempts threshold
 */
export function checkDemoRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record) {
    return { allowed: true, remaining: MAX_FAILED_ATTEMPTS };
  }

  // Window expired: clear record
  if (now > record.resetTime) {
    rateLimitStore.delete(ip);
    return { allowed: true, remaining: MAX_FAILED_ATTEMPTS };
  }

  if (record.count >= MAX_FAILED_ATTEMPTS) {
    const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
    return {
      allowed: false,
      retryAfterSec,
      remaining: 0
    };
  }

  return {
    allowed: true,
    remaining: MAX_FAILED_ATTEMPTS - record.count
  };
}

/**
 * Record a failed unlock attempt
 */
export function recordFailedDemoAttempt(ip) {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + LOCKOUT_WINDOW_MS });
  } else {
    record.count += 1;
  }
}

/**
 * Clear failed attempts for an IP upon successful unlock
 */
export function resetDemoRateLimit(ip) {
  rateLimitStore.delete(ip);
}

/**
 * Constant-time safe password verification
 * Prevents timing attacks when comparing submitted password against server secret
 */
export function verifyDemoPassword(submittedPassword) {
  const configuredPassword = env.EVA_COORDINATOR_DEMO_ACCESS_PASSWORD;

  // If environment variable is missing or empty, demo access is strictly disabled
  if (!configuredPassword || typeof configuredPassword !== 'string' || configuredPassword.trim().length === 0) {
    return { ok: false, disabled: true };
  }

  if (typeof submittedPassword !== 'string') {
    return { ok: false, disabled: false };
  }

  const submittedBuf = Buffer.from(submittedPassword, 'utf-8');
  const targetBuf = Buffer.from(configuredPassword, 'utf-8');

  // Prevent length leak while executing constant-time buffer comparison
  if (submittedBuf.length !== targetBuf.length) {
    // Perform dummy comparison against itself to equalize timing
    crypto.timingSafeEqual(submittedBuf, submittedBuf);
    return { ok: false, disabled: false };
  }

  const isMatch = crypto.timingSafeEqual(submittedBuf, targetBuf);
  return { ok: isMatch, disabled: false };
}

/**
 * Generate a short-lived cryptographic authorization token (valid for 15 minutes)
 */
export function generateDemoAccessToken() {
  return jwt.sign(
    {
      scope: 'COORDINATOR_DEMO_ACCESS',
      purpose: 'owner_demo_unlock'
    },
    env.JWT_SECRET,
    { expiresIn: '15m' }
  );
}

/**
 * Verify authorization token for demo coordinator operations
 */
export function verifyDemoAccessToken(token) {
  if (!token || typeof token !== 'string') {
    return { valid: false, reason: 'Authorization token required.' };
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (decoded.scope !== 'COORDINATOR_DEMO_ACCESS') {
      return { valid: false, reason: 'Invalid token scope.' };
    }
    return { valid: true, decoded };
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return { valid: false, reason: 'Demo coordinator authorization has expired. Please unlock again.' };
    }
    return { valid: false, reason: 'Invalid demo coordinator authorization token.' };
  }
}

/**
 * Check if a given user ID or email belongs to the predefined demo coordinator set
 */
export function isDemoCoordinatorAccount(userId = '', email = '') {
  const uid = String(userId).trim().toUpperCase();
  const mail = String(email).trim().toLowerCase();

  return PREDEFINED_DEMO_COORDINATOR_IDS.includes(uid) || mail.endsWith('@eva-demo.test');
}
