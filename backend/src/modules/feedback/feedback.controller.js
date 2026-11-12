import { query } from '../../config/db.js';

export const FeedbackController = {
  /**
   * Submit Post-Event Feedback (FR-14)
   */
  async submitFeedback(req, res, next) {
    try {
      const studentId = req.user.user_id;
      const { id: eventId } = req.params;
      const { overallRating, organizationRating, venueRating, comments } = req.body;

      if (!overallRating) {
        return res.status(400).json({ success: false, message: 'Overall rating (1-5) is required.' });
      }

      const overall = parseInt(overallRating, 10);
      const org = organizationRating ? parseInt(organizationRating, 10) : overall;
      const ven = venueRating ? parseInt(venueRating, 10) : overall;

      if ([overall, org, ven].some(r => isNaN(r) || r < 1 || r > 5)) {
        return res.status(400).json({ success: false, message: 'Ratings must be between 1 and 5.' });
      }

      const feedback = query.transaction(() => {
        // 1. Verify event is marked COMPLETED
        const event = query.get('SELECT * FROM events WHERE event_id = ?', [eventId]);
        if (!event) {
          throw new Error('Event not found.');
        }

        if (event.status !== 'COMPLETED') {
          throw new Error('Feedback can only be submitted for completed events.');
        }

        // 2. Verify student had confirmed registration
        const registration = query.get(
          "SELECT * FROM registrations WHERE event_id = ? AND student_id = ? AND status = 'CONFIRMED'",
          [eventId, studentId]
        );
        if (!registration) {
          throw new Error('You are not registered for this event.');
        }

        // 3. Verify student actually attended (Footfall check-in verification)
        const checkin = query.get(
          "SELECT * FROM checkins WHERE registration_id = ? AND scan_status = 'ACCEPTED'",
          [registration.registration_id]
        );
        if (!checkin) {
          throw new Error('Attendance check failed: Only students who checked in at the venue can submit feedback.');
        }

        // 4. Prevent duplicate feedback
        const existing = query.get(
          'SELECT * FROM feedback WHERE event_id = ? AND student_id = ?',
          [eventId, studentId]
        );
        if (existing) {
          throw new Error('You have already submitted feedback for this event.');
        }

        const feedbackId = `FDB-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
        const now = new Date().toISOString();

        query.run(`
          INSERT INTO feedback (
            feedback_id, event_id, student_id, overall_rating, organization_rating,
            venue_rating, comments, submitted_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          feedbackId,
          eventId,
          studentId,
          overall,
          org,
          ven,
          comments?.trim() || '',
          now
        ]);

        return {
          feedbackId,
          eventId,
          studentId,
          overallRating: overall,
          organizationRating: org,
          venueRating: ven,
          comments,
          submittedAt: now
        };
      });

      return res.status(201).json({
        success: true,
        message: 'Thank you! Your feedback has been recorded.',
        feedback
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
  },

  /**
   * Get Student Feedback History (FR-14)
   */
  async getMyFeedback(req, res, next) {
    try {
      const studentId = req.user.user_id;

      const feedbackList = query.all(`
        SELECT f.*, e.title as event_title, e.category as event_category, e.event_date,
               c.name as club_name, v.name as venue_name
        FROM feedback f
        JOIN events e ON f.event_id = e.event_id
        JOIN clubs c ON e.club_id = c.club_id
        LEFT JOIN venues v ON e.venue_id = v.venue_id
        WHERE f.student_id = ?
        ORDER BY f.submitted_at DESC
      `, [studentId]);

      return res.json({
        success: true,
        count: feedbackList.length,
        feedback: feedbackList
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get Coordinator Event Feedback Summary & List (FR-14, FR-15)
   */
  async getEventFeedback(req, res, next) {
    try {
      const { id: eventId } = req.params;

      const event = query.get('SELECT * FROM events WHERE event_id = ?', [eventId]);
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found.' });
      }

      if (req.user.role === 'COORDINATOR' && event.club_id !== req.user.club_id) {
        return res.status(403).json({ success: false, message: 'Unauthorized.' });
      }

      const reviews = query.all(`
        SELECT f.*, u.full_name as student_name, u.department, u.year_of_study
        FROM feedback f
        JOIN users u ON f.student_id = u.user_id
        WHERE f.event_id = ?
        ORDER BY f.submitted_at DESC
      `, [eventId]);

      const averages = query.get(`
        SELECT 
          COUNT(*) as total_reviews,
          ROUND(AVG(overall_rating), 1) as avg_overall,
          ROUND(AVG(organization_rating), 1) as avg_org,
          ROUND(AVG(venue_rating), 1) as avg_venue
        FROM feedback
        WHERE event_id = ?
      `, [eventId]);

      return res.json({
        success: true,
        eventTitle: event.title,
        stats: {
          totalReviews: averages?.total_reviews || 0,
          avgOverall: averages?.avg_overall || 0,
          avgOrganization: averages?.avg_org || 0,
          avgVenue: averages?.avg_venue || 0
        },
        reviews
      });
    } catch (err) {
      next(err);
    }
  }
};
