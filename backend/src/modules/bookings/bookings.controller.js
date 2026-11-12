import { BookingsService } from './bookings.service.js';
import { query } from '../../config/db.js';

export const BookingsController = {
  /**
   * Check Venue Availability (FR-07)
   */
  async checkAvailability(req, res, next) {
    try {
      const { eventDate, startTime, endTime, expectedParticipants, requiredFacilities, excludeEventId } = req.body;

      if (!eventDate || !startTime || !endTime) {
        return res.status(400).json({
          success: false,
          message: 'Event date, start time, and end time are required.'
        });
      }

      if (startTime >= endTime) {
        return res.status(400).json({
          success: false,
          message: 'End time must be after start time.'
        });
      }

      const result = BookingsService.checkAvailability({
        eventDate,
        startTime,
        endTime,
        expectedParticipants: expectedParticipants ? parseInt(expectedParticipants, 10) : 0,
        requiredFacilities: requiredFacilities || [],
        excludeEventId
      });

      return res.json({
        success: true,
        ...result
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get AI-Assisted Smart Venue Recommendations (FR-08)
   */
  async getRecommendations(req, res, next) {
    try {
      const {
        eventDate,
        startTime,
        endTime,
        expectedParticipants,
        requiredFacilities,
        eventCategory,
        excludeEventId
      } = req.body;

      if (!eventDate || !startTime || !endTime || !expectedParticipants) {
        return res.status(400).json({
          success: false,
          message: 'Date, start time, end time, and expected participants are required.'
        });
      }

      const recommendations = BookingsService.getRecommendations({
        eventDate,
        startTime,
        endTime,
        expectedParticipants: parseInt(expectedParticipants, 10),
        requiredFacilities: requiredFacilities || [],
        eventCategory: eventCategory || 'General',
        excludeEventId
      });

      return res.json({
        success: true,
        count: recommendations.length,
        recommendations
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Confirm Venue Booking (FR-09)
   */
  async confirmBooking(req, res, next) {
    try {
      const { eventId, venueId, bookingDate, startTime, endTime } = req.body;

      if (!eventId || !venueId || !bookingDate || !startTime || !endTime) {
        return res.status(400).json({
          success: false,
          message: 'Event ID, venue ID, date, start time, and end time are required.'
        });
      }

      const booking = BookingsService.confirmBooking({
        eventId,
        venueId,
        bookingDate,
        startTime,
        endTime,
        userId: req.user.user_id,
        userClubId: req.user.club_id
      });

      return res.status(201).json({
        success: true,
        message: 'Venue booking confirmed successfully!',
        booking
      });
    } catch (err) {
      return res.status(409).json({
        success: false,
        message: err.message
      });
    }
  },

  /**
   * Get Coordinator's Club Bookings
   */
  async getMyBookings(req, res, next) {
    try {
      const clubId = req.user.club_id;
      const bookings = query.all(`
        SELECT b.*, e.title as event_title, e.category as event_category,
               v.name as venue_name, v.building as venue_building, v.capacity as venue_capacity
        FROM bookings b
        JOIN events e ON b.event_id = e.event_id
        JOIN venues v ON b.venue_id = v.venue_id
        WHERE e.club_id = ?
        ORDER BY b.booking_date DESC, b.start_time DESC
      `, [clubId]);

      return res.json({
        success: true,
        bookings
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Cancel / Release Booking
   */
  async cancelBooking(req, res, next) {
    try {
      const { id } = req.params;
      const booking = query.get(`
        SELECT b.*, e.club_id
        FROM bookings b
        JOIN events e ON b.event_id = e.event_id
        WHERE b.booking_id = ?
      `, [id]);

      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found.' });
      }

      if (booking.club_id !== req.user.club_id) {
        return res.status(403).json({ success: false, message: 'Unauthorized: Booking belongs to another club.' });
      }

      query.transaction(() => {
        query.run("UPDATE bookings SET status = 'CANCELLED', updated_at = CURRENT_TIMESTAMP WHERE booking_id = ?", [id]);
        query.run('UPDATE events SET venue_id = NULL WHERE event_id = ?', [booking.event_id]);
      });

      return res.json({
        success: true,
        message: 'Booking cancelled and venue released.'
      });
    } catch (err) {
      next(err);
    }
  }
};
