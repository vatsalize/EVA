import jwt from 'jsonwebtoken';
import { query } from '../../config/db.js';
import { env } from '../../config/env.js';
import { verifyPassword, hashPassword } from '../../utils/security.js';

export const AuthController = {
  /**
   * Student Self-Registration (FR-01)
   */
  async studentSignup(req, res, next) {
    try {
      const {
        fullName,
        email,
        studentId,
        department,
        yearOfStudy,
        password,
        confirmPassword
      } = req.body;

      // 1. Mandatory fields check
      if (!fullName || !email || !studentId || !department || !yearOfStudy || !password) {
        return res.status(400).json({
          success: false,
          message: 'All registration fields are mandatory.'
        });
      }

      // 2. Validate email format & domain
      const emailLower = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailLower)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address.'
        });
      }

      // Check institute domain if enforced
      if (!env.ALLOW_DEMO_EMAILS && !emailLower.endsWith(env.INSTITUTE_DOMAIN)) {
        return res.status(400).json({
          success: false,
          message: `Only official institute emails (@${env.INSTITUTE_DOMAIN}) are permitted.`
        });
      }

      // 3. Password match & length
      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Password and confirm password do not match.'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long.'
        });
      }

      // 4. Duplicate checks
      const existingEmail = query.get('SELECT user_id FROM users WHERE email = ?', [emailLower]);
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email address already exists.'
        });
      }

      const existingId = query.get('SELECT user_id FROM users WHERE user_id = ?', [studentId.trim()]);
      if (existingId) {
        return res.status(409).json({
          success: false,
          message: 'An account with this Student ID already exists.'
        });
      }

      // 5. Hash password and insert
      const passwordHash = hashPassword(password);
      const isVerified = 1; // Instant verification for dev/demo

      query.run(`
        INSERT INTO users (
          user_id, full_name, email, password_hash, role, club_id,
          department, year_of_study, is_active, is_verified, must_change_password
        ) VALUES (?, ?, ?, ?, 'STUDENT', NULL, ?, ?, 1, ?, 0)
      `, [
        studentId.trim(),
        fullName.trim(),
        emailLower,
        passwordHash,
        department.trim(),
        parseInt(yearOfStudy, 10),
        isVerified
      ]);

      // 6. Generate JWT token
      const token = jwt.sign(
        { userId: studentId.trim(), role: 'STUDENT', email: emailLower },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN }
      );

      const createdUser = query.get(`
        SELECT user_id, full_name, email, role, department, year_of_study, is_verified
        FROM users WHERE user_id = ?
      `, [studentId.trim()]);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully! Welcome to EVA.',
        token,
        user: {
          userId: createdUser.user_id,
          fullName: createdUser.full_name,
          email: createdUser.email,
          role: createdUser.role,
          department: createdUser.department,
          yearOfStudy: createdUser.year_of_study,
          isVerified: Boolean(createdUser.is_verified)
        }
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Student Login (FR-02)
   */
  async studentLogin(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required.'
        });
      }

      const emailLower = email.trim().toLowerCase();
      const user = query.get("SELECT * FROM users WHERE (email = ? OR user_id = ?) AND role = 'STUDENT'", [emailLower, email.trim()]);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email/ID or password.'
        });
      }

      if (!verifyPassword(password, user.password_hash)) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email/ID or password.'
        });
      }

      if (!user.is_active) {
        return res.status(403).json({
          success: false,
          message: 'Your account has been deactivated. Please contact administration.'
        });
      }

      const token = jwt.sign(
        { userId: user.user_id, role: user.role, email: user.email },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN }
      );

      return res.json({
        success: true,
        message: 'Login successful.',
        token,
        user: {
          userId: user.user_id,
          fullName: user.full_name,
          email: user.email,
          role: user.role,
          department: user.department,
          yearOfStudy: user.year_of_study,
          isVerified: Boolean(user.is_verified)
        }
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Coordinator Login (FR-02)
   * Login using Coordinator ID (e.g. COO001) or Email
   */
  async coordinatorLogin(req, res, next) {
    try {
      const { coordinatorId, password } = req.body;

      if (!coordinatorId || !password) {
        return res.status(400).json({
          success: false,
          message: 'Coordinator ID and password are required.'
        });
      }

      const coordInput = coordinatorId.trim();
      const user = query.get(`
        SELECT u.*, c.name as club_name, c.category as club_category
        FROM users u
        LEFT JOIN clubs c ON u.club_id = c.club_id
        WHERE (u.user_id = ? OR LOWER(u.email) = LOWER(?)) AND u.role = 'COORDINATOR'
      `, [coordInput, coordInput]);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid Coordinator ID or password.'
        });
      }

      if (!verifyPassword(password, user.password_hash)) {
        return res.status(401).json({
          success: false,
          message: 'Invalid Coordinator ID or password.'
        });
      }

      if (!user.is_active) {
        return res.status(403).json({
          success: false,
          message: 'Coordinator account is inactive.'
        });
      }

      const token = jwt.sign(
        { userId: user.user_id, role: user.role, clubId: user.club_id },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN }
      );

      return res.json({
        success: true,
        message: 'Coordinator authenticated successfully.',
        token,
        user: {
          userId: user.user_id,
          fullName: user.full_name,
          email: user.email,
          role: user.role,
          clubId: user.club_id,
          clubName: user.club_name,
          clubCategory: user.club_category,
          mustChangePassword: Boolean(user.must_change_password)
        }
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Change Password
   */
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.user_id;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required.'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long.'
        });
      }

      const user = query.get('SELECT password_hash FROM users WHERE user_id = ?', [userId]);
      if (!verifyPassword(currentPassword, user.password_hash)) {
        return res.status(400).json({
          success: false,
          message: 'Incorrect current password.'
        });
      }

      const newHash = hashPassword(newPassword);
      query.run(`
        UPDATE users 
        SET password_hash = ?, must_change_password = 0, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `, [newHash, userId]);

      return res.json({
        success: true,
        message: 'Password changed successfully.'
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get Current Authenticated User (FR-03)
   */
  async getMe(req, res, next) {
    try {
      const user = query.get(`
        SELECT u.user_id, u.full_name, u.email, u.role, u.club_id, u.department,
               u.year_of_study, u.is_active, u.is_verified, u.must_change_password,
               c.name as club_name, c.category as club_category
        FROM users u
        LEFT JOIN clubs c ON u.club_id = c.club_id
        WHERE u.user_id = ?
      `, [req.user.user_id]);

      return res.json({
        success: true,
        user: {
          userId: user.user_id,
          fullName: user.full_name,
          email: user.email,
          role: user.role,
          clubId: user.club_id,
          clubName: user.club_name,
          clubCategory: user.club_category,
          department: user.department,
          yearOfStudy: user.year_of_study,
          isVerified: Boolean(user.is_verified),
          mustChangePassword: Boolean(user.must_change_password)
        }
      });
    } catch (err) {
      next(err);
    }
  }
};
