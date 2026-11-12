import { query } from '../../config/db.js';

export const ClubsController = {
  /**
   * List all clubs
   */
  async getAllClubs(req, res, next) {
    try {
      const clubs = query.all(`
        SELECT c.*, u.user_id as coordinator_id, u.full_name as coordinator_name, u.email as coordinator_email
        FROM clubs c
        LEFT JOIN users u ON c.club_id = u.club_id AND u.role = 'COORDINATOR'
        ORDER BY c.name ASC
      `);

      return res.json({
        success: true,
        clubs
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get single club by ID with active events
   */
  async getClubById(req, res, next) {
    try {
      const { id } = req.params;
      const club = query.get(`
        SELECT c.*, u.user_id as coordinator_id, u.full_name as coordinator_name, u.email as coordinator_email
        FROM clubs c
        LEFT JOIN users u ON c.club_id = u.club_id AND u.role = 'COORDINATOR'
        WHERE c.club_id = ?
      `, [id]);

      if (!club) {
        return res.status(404).json({ success: false, message: 'Club not found.' });
      }

      const events = query.all(`
        SELECT e.*, v.name as venue_name, v.building as venue_building
        FROM events e
        LEFT JOIN venues v ON e.venue_id = v.venue_id
        WHERE e.club_id = ? AND e.status != 'CANCELLED'
        ORDER BY e.event_date ASC
      `, [id]);

      return res.json({
        success: true,
        club,
        events
      });
    } catch (err) {
      next(err);
    }
  }
};
