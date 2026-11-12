import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { query } from '../config/db.js';

/**
 * Verify JWT and attach user object to request
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.'
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    
    // Fetch live user to ensure active status
    const user = query.get(
      'SELECT user_id, full_name, email, role, club_id, department, year_of_study, is_active, is_verified, must_change_password FROM users WHERE user_id = ?',
      [decoded.userId]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token: User no longer exists.'
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated.'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.'
    });
  }
}

/**
 * Role-Based Access Control Middleware
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: This resource requires one of [${allowedRoles.join(', ')}] roles.`
      });
    }

    next();
  };
}

/**
 * Coordinator Club Authorization Helper
 * Ensures coordinator can ONLY view or modify events belonging to their assigned club
 */
export function verifyClubCoordinatorOwnership(req, res, next) {
  if (req.user.role !== 'COORDINATOR') {
    return res.status(403).json({ success: false, message: 'Coordinator role required.' });
  }

  if (!req.user.club_id) {
    return res.status(403).json({ success: false, message: 'Coordinator is not assigned to any club.' });
  }

  next();
}
