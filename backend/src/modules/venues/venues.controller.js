import { query } from '../../config/db.js';

export const VenuesController = {
  /**
   * Venue Directory and Filtering (FR-06)
   */
  async getAllVenues(req, res, next) {
    try {
      const { capacity, facility, building, status } = req.query;

      let sql = 'SELECT * FROM venues WHERE 1=1';
      const params = [];

      if (status) {
        sql += ' AND status = ?';
        params.push(status);
      }

      if (building) {
        sql += ' AND building LIKE ?';
        params.push(`%${building}%`);
      }

      if (capacity) {
        sql += ' AND capacity >= ?';
        params.push(parseInt(capacity, 10));
      }

      sql += ' ORDER BY capacity ASC';

      let venues = query.all(sql, params);

      // Parse facilities JSON for each venue and filter by facility if requested
      venues = venues.map(v => ({
        ...v,
        facilities: v.facilities ? JSON.parse(v.facilities) : []
      }));

      if (facility) {
        const facLower = facility.toLowerCase().trim();
        venues = venues.filter(v => v.facilities.some(f => f.toLowerCase().includes(facLower)));
      }

      return res.json({
        success: true,
        count: venues.length,
        venues
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get single venue with its schedule
   */
  async getVenueById(req, res, next) {
    try {
      const { id } = req.params;
      const venue = query.get('SELECT * FROM venues WHERE venue_id = ?', [id]);

      if (!venue) {
        return res.status(404).json({ success: false, message: 'Venue not found.' });
      }

      const facilities = venue.facilities ? JSON.parse(venue.facilities) : [];

      // Fetch confirmed future bookings
      const bookings = query.all(`
        SELECT b.*, e.title as event_title, c.name as club_name
        FROM bookings b
        JOIN events e ON b.event_id = e.event_id
        JOIN clubs c ON e.club_id = c.club_id
        WHERE b.venue_id = ? AND b.status = 'CONFIRMED'
        ORDER BY b.booking_date ASC, b.start_time ASC
      `, [id]);

      return res.json({
        success: true,
        venue: {
          ...venue,
          facilities
        },
        bookings
      });
    } catch (err) {
      next(err);
    }
  }
};
