import { query } from '../../config/db.js';

export const UsersController = {
  /**
   * Get User Profile (FR-03)
   */
  async getProfile(req, res, next) {
    try {
      const userId = req.user.user_id;
      const user = query.get(`
        SELECT u.user_id, u.full_name, u.email, u.role, u.club_id, u.department,
               u.year_of_study, u.is_active, u.is_verified, u.created_at,
               c.name as club_name, c.category as club_category, c.description as club_description
        FROM users u
        LEFT JOIN clubs c ON u.club_id = c.club_id
        WHERE u.user_id = ?
      `, [userId]);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      let extra = {};
      if (user.role === 'STUDENT') {
        const regStats = query.get(`
          SELECT COUNT(*) as total_registrations
          FROM registrations WHERE student_id = ? AND status = 'CONFIRMED'
        `, [userId]);

        const checkinStats = query.get(`
          SELECT COUNT(*) as total_checkins
          FROM checkins WHERE student_id = ? AND scan_status = 'ACCEPTED'
        `, [userId]);

        const feedbackStats = query.get(`
          SELECT COUNT(*) as total_feedback
          FROM feedback WHERE student_id = ?
        `, [userId]);

        extra = {
          totalRegistrations: regStats?.total_registrations || 0,
          totalAttended: checkinStats?.total_checkins || 0,
          totalFeedback: feedbackStats?.total_feedback || 0
        };
      } else if (user.role === 'COORDINATOR') {
        const eventStats = query.get(`
          SELECT 
            COUNT(*) as total_events,
            SUM(CASE WHEN status = 'PUBLISHED' THEN 1 ELSE 0 END) as published_events,
            SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed_events
          FROM events WHERE club_id = ?
        `, [user.club_id]);

        extra = {
          totalEvents: eventStats?.total_events || 0,
          publishedEvents: eventStats?.published_events || 0,
          completedEvents: eventStats?.completed_events || 0
        };
      }

      return res.json({
        success: true,
        profile: {
          ...user,
          ...extra
        }
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Update Profile Details (FR-03)
   */
  async updateProfile(req, res, next) {
    try {
      const userId = req.user.user_id;
      const { fullName, department, yearOfStudy } = req.body;

      if (!fullName) {
        return res.status(400).json({ success: false, message: 'Full name is required.' });
      }

      if (req.user.role === 'STUDENT') {
        query.run(`
          UPDATE users
          SET full_name = ?, department = ?, year_of_study = ?, updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ?
        `, [fullName.trim(), department?.trim() || null, yearOfStudy ? parseInt(yearOfStudy, 10) : null, userId]);
      } else {
        query.run(`
          UPDATE users
          SET full_name = ?, updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ?
        `, [fullName.trim(), userId]);
      }

      const updated = query.get(`
        SELECT user_id, full_name, email, role, department, year_of_study
        FROM users WHERE user_id = ?
      `, [userId]);

      return res.json({
        success: true,
        message: 'Profile updated successfully.',
        user: updated
      });
    } catch (err) {
      next(err);
    }
  }
};
