import { query } from '../../config/db.js';

export const AnalyticsController = {
  /**
   * Coordinator Summary Overview KPI Cards (FR-15)
   */
  async getOverview(req, res, next) {
    try {
      const clubId = req.user.club_id;
      const { category } = req.query;

      let eventFilter = 'WHERE club_id = ?';
      const params = [clubId];
      if (category) {
        eventFilter += ' AND category = ?';
        params.push(category);
      }

      // Event counts
      const eventStats = query.get(`
        SELECT 
          COUNT(*) as total_events,
          SUM(CASE WHEN status = 'PUBLISHED' THEN 1 ELSE 0 END) as published_events,
          SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed_events,
          SUM(CASE WHEN status = 'DRAFT' THEN 1 ELSE 0 END) as draft_events,
          SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelled_events
        FROM events ${eventFilter}
      `, params);

      // Registration, Footfall & Feedback stats for this club
      const metricStats = query.get(`
        SELECT 
          COUNT(DISTINCT r.registration_id) as total_registrations,
          COUNT(DISTINCT chk.checkin_id) as actual_footfall,
          ROUND(AVG(f.overall_rating), 2) as average_rating,
          COUNT(DISTINCT f.feedback_id) as total_feedback
        FROM events e
        LEFT JOIN registrations r ON e.event_id = r.event_id AND r.status = 'CONFIRMED'
        LEFT JOIN checkins chk ON r.registration_id = chk.registration_id AND chk.scan_status = 'ACCEPTED'
        LEFT JOIN feedback f ON e.event_id = f.event_id
        ${eventFilter}
      `, params);

      const totalRegs = metricStats?.total_registrations || 0;
      const totalFootfall = metricStats?.actual_footfall || 0;
      const turnoutRate = totalRegs > 0 ? Math.round((totalFootfall / totalRegs) * 100) : 0;

      return res.json({
        success: true,
        kpi: {
          totalEvents: eventStats?.total_events || 0,
          completedEvents: eventStats?.completed_events || 0,
          publishedEvents: eventStats?.published_events || 0,
          draftEvents: eventStats?.draft_events || 0,
          totalRegistrations: totalRegs,
          actualFootfall: totalFootfall,
          turnoutRate,
          averageRating: metricStats?.average_rating || 0,
          totalFeedback: metricStats?.total_feedback || 0
        }
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Event-wise Performance & Footfall Comparison (FR-15)
   */
  async getEventComparison(req, res, next) {
    try {
      const clubId = req.user.club_id;

      const events = query.all(`
        SELECT 
          e.event_id,
          e.title,
          e.category,
          e.event_date,
          e.registration_capacity,
          e.expected_participants,
          e.status,
          v.name as venue_name,
          COUNT(DISTINCT r.registration_id) as registrations,
          COUNT(DISTINCT chk.checkin_id) as actual_footfall,
          ROUND(AVG(f.overall_rating), 1) as avg_rating,
          COUNT(DISTINCT f.feedback_id) as feedback_count
        FROM events e
        LEFT JOIN venues v ON e.venue_id = v.venue_id
        LEFT JOIN registrations r ON e.event_id = r.event_id AND r.status = 'CONFIRMED'
        LEFT JOIN checkins chk ON r.registration_id = chk.registration_id AND chk.scan_status = 'ACCEPTED'
        LEFT JOIN feedback f ON e.event_id = f.event_id
        WHERE e.club_id = ?
        GROUP BY e.event_id
        ORDER BY e.event_date DESC
      `, [clubId]);

      const formatted = events.map(e => ({
        ...e,
        turnout_rate: e.registrations > 0 ? Math.round((e.actual_footfall / e.registrations) * 100) : 0,
        capacity_utilization: e.registration_capacity > 0 ? Math.round((e.registrations / e.registration_capacity) * 100) : 0
      }));

      return res.json({
        success: true,
        events: formatted
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Venue Utilization Metrics (FR-15)
   */
  async getVenueUtilization(req, res, next) {
    try {
      const clubId = req.user.club_id;

      const venues = query.all(`
        SELECT 
          v.venue_id,
          v.name as venue_name,
          v.building,
          v.capacity,
          COUNT(DISTINCT b.booking_id) as bookings_count,
          SUM(e.expected_participants) as total_expected,
          COUNT(DISTINCT chk.checkin_id) as total_footfall
        FROM venues v
        JOIN bookings b ON v.venue_id = b.venue_id AND b.status = 'CONFIRMED'
        JOIN events e ON b.event_id = e.event_id AND e.club_id = ?
        LEFT JOIN registrations r ON e.event_id = r.event_id AND r.status = 'CONFIRMED'
        LEFT JOIN checkins chk ON r.registration_id = chk.registration_id AND chk.scan_status = 'ACCEPTED'
        GROUP BY v.venue_id
        ORDER BY bookings_count DESC
      `, [clubId]);

      return res.json({
        success: true,
        venues
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Rating Breakdown and Feedback Distribution (FR-15)
   */
  async getFeedbackAnalytics(req, res, next) {
    try {
      const clubId = req.user.club_id;

      const distribution = query.all(`
        SELECT 
          f.overall_rating as star,
          COUNT(f.feedback_id) as count
        FROM feedback f
        JOIN events e ON f.event_id = e.event_id
        WHERE e.club_id = ?
        GROUP BY f.overall_rating
        ORDER BY f.overall_rating ASC
      `, [clubId]);

      const averages = query.get(`
        SELECT 
          ROUND(AVG(f.overall_rating), 2) as overall,
          ROUND(AVG(f.organization_rating), 2) as organization,
          ROUND(AVG(f.venue_rating), 2) as venue,
          COUNT(f.feedback_id) as total_feedback
        FROM feedback f
        JOIN events e ON f.event_id = e.event_id
        WHERE e.club_id = ?
      `, [clubId]);

      return res.json({
        success: true,
        distribution,
        averages: {
          overall: averages?.overall || 0,
          organization: averages?.organization || 0,
          venue: averages?.venue || 0,
          total: averages?.total_feedback || 0
        }
      });
    } catch (err) {
      next(err);
    }
  }
};
