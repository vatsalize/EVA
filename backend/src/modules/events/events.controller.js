import { query } from '../../config/db.js';

export const EventsController = {
  /**
   * Student Event Discovery (FR-10)
   * Browse, search, and filter published events
   */
  async getPublishedEvents(req, res, next) {
    try {
      const { search, category, clubId, venueId, date } = req.query;

      let sql = `
        SELECT e.*, c.name as club_name, c.category as club_category,
               v.name as venue_name, v.building as venue_building, v.capacity as venue_capacity,
               (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.event_id AND r.status = 'CONFIRMED') as registered_count
        FROM events e
        JOIN clubs c ON e.club_id = c.club_id
        LEFT JOIN venues v ON e.venue_id = v.venue_id
        WHERE e.status = 'PUBLISHED'
      `;
      const params = [];

      if (search) {
        sql += ' AND (e.title LIKE ? OR c.name LIKE ? OR e.description LIKE ?)';
        const s = `%${search.trim()}%`;
        params.push(s, s, s);
      }

      if (category) {
        sql += ' AND e.category = ?';
        params.push(category);
      }

      if (clubId) {
        sql += ' AND e.club_id = ?';
        params.push(clubId);
      }

      if (venueId) {
        sql += ' AND e.venue_id = ?';
        params.push(venueId);
      }

      if (date) {
        sql += ' AND e.event_date = ?';
        params.push(date);
      }

      sql += ' ORDER BY e.event_date ASC, e.start_time ASC';

      const events = query.all(sql, params).map(e => ({
        ...e,
        required_facilities: e.required_facilities ? JSON.parse(e.required_facilities) : [],
        remaining_capacity: Math.max(0, e.registration_capacity - e.registered_count),
        is_full: e.registered_count >= e.registration_capacity
      }));

      return res.json({
        success: true,
        count: events.length,
        events
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get Coordinator's Managed Events (FR-05)
   */
  async getMyEvents(req, res, next) {
    try {
      const clubId = req.user.club_id;
      const { status } = req.query;

      let sql = `
        SELECT e.*, c.name as club_name,
               v.name as venue_name, v.building as venue_building, v.capacity as venue_capacity,
               b.booking_id, b.status as booking_status,
               (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.event_id AND r.status = 'CONFIRMED') as registered_count,
               (SELECT COUNT(*) FROM checkins chk WHERE chk.event_id = e.event_id AND chk.scan_status = 'ACCEPTED') as actual_footfall,
               (SELECT ROUND(AVG(f.overall_rating), 1) FROM feedback f WHERE f.event_id = e.event_id) as average_rating
        FROM events e
        JOIN clubs c ON e.club_id = c.club_id
        LEFT JOIN venues v ON e.venue_id = v.venue_id
        LEFT JOIN bookings b ON e.event_id = b.event_id AND b.status = 'CONFIRMED'
        WHERE e.club_id = ?
      `;
      const params = [clubId];

      if (status) {
        sql += ' AND e.status = ?';
        params.push(status);
      }

      sql += ' ORDER BY e.event_date DESC, e.start_time DESC';

      const events = query.all(sql, params).map(e => ({
        ...e,
        required_facilities: e.required_facilities ? JSON.parse(e.required_facilities) : [],
        turnout_rate: e.registered_count > 0 ? Math.round((e.actual_footfall / e.registered_count) * 100) : 0
      }));

      return res.json({
        success: true,
        count: events.length,
        events
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get Event Details by ID (FR-04, FR-10)
   */
  async getEventById(req, res, next) {
    try {
      const { id } = req.params;
      const event = query.get(`
        SELECT e.*, c.name as club_name, c.category as club_category,
               v.name as venue_name, v.building as venue_building, v.capacity as venue_capacity,
               b.booking_id, b.booking_date, b.start_time as booking_start, b.end_time as booking_end,
               u.full_name as coordinator_name, u.email as coordinator_email,
               (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.event_id AND r.status = 'CONFIRMED') as registered_count,
               (SELECT COUNT(*) FROM checkins chk WHERE chk.event_id = e.event_id AND chk.scan_status = 'ACCEPTED') as actual_footfall,
               (SELECT ROUND(AVG(f.overall_rating), 1) FROM feedback f WHERE f.event_id = e.event_id) as average_rating
        FROM events e
        JOIN clubs c ON e.club_id = c.club_id
        LEFT JOIN users u ON e.coordinator_id = u.user_id
        LEFT JOIN venues v ON e.venue_id = v.venue_id
        LEFT JOIN bookings b ON e.event_id = b.event_id AND b.status = 'CONFIRMED'
        WHERE e.event_id = ?
      `, [id]);

      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found.' });
      }

      // If user is a student, check if they are already registered
      let userRegistration = null;
      let userCheckin = null;
      let userFeedback = null;

      if (req.user && req.user.role === 'STUDENT') {
        userRegistration = query.get(`
          SELECT * FROM registrations WHERE event_id = ? AND student_id = ? AND status = 'CONFIRMED'
        `, [id, req.user.user_id]);

        if (userRegistration) {
          userCheckin = query.get("SELECT * FROM checkins WHERE registration_id = ? AND scan_status = 'ACCEPTED'", [userRegistration.registration_id]);
          userFeedback = query.get('SELECT * FROM feedback WHERE event_id = ? AND student_id = ?', [id, req.user.user_id]);
        }
      }

      return res.json({
        success: true,
        event: {
          ...event,
          required_facilities: event.required_facilities ? JSON.parse(event.required_facilities) : [],
          remaining_capacity: Math.max(0, event.registration_capacity - event.registered_count),
          is_full: event.registered_count >= event.registration_capacity
        },
        userState: req.user?.role === 'STUDENT' ? {
          isRegistered: Boolean(userRegistration),
          registration: userRegistration,
          hasCheckedIn: Boolean(userCheckin),
          checkin: userCheckin,
          hasSubmittedFeedback: Boolean(userFeedback),
          feedback: userFeedback
        } : undefined
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Create New Event (FR-04)
   */
  async createEvent(req, res, next) {
    try {
      const coordinatorId = req.user.user_id;
      const clubId = req.user.club_id;

      const {
        title,
        description,
        category,
        eventDate,
        startTime,
        endTime,
        expectedParticipants,
        registrationCapacity,
        requiredFacilities = [],
        registrationDeadline,
        status = 'DRAFT'
      } = req.body;

      if (!title || !category || !eventDate || !startTime || !endTime || !expectedParticipants) {
        return res.status(400).json({
          success: false,
          message: 'Title, category, date, start/end time, and expected footfall are required.'
        });
      }

      if (startTime >= endTime) {
        return res.status(400).json({
          success: false,
          message: 'End time must be after start time.'
        });
      }

      const expected = parseInt(expectedParticipants, 10);
      const cap = registrationCapacity ? parseInt(registrationCapacity, 10) : expected;

      const eventId = `EVT-${Date.now().toString(36).toUpperCase()}`;
      const facilitiesJson = JSON.stringify(Array.isArray(requiredFacilities) ? requiredFacilities : []);
      const deadline = registrationDeadline || eventDate;

      query.run(`
        INSERT INTO events (
          event_id, title, description, club_id, coordinator_id, category,
          event_date, start_time, end_time, venue_id, registration_capacity,
          expected_participants, required_facilities, registration_deadline, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, ?, ?, ?)
      `, [
        eventId,
        title.trim(),
        description?.trim() || '',
        clubId,
        coordinatorId,
        category,
        eventDate,
        startTime,
        endTime,
        cap,
        expected,
        facilitiesJson,
        deadline,
        status
      ]);

      const created = query.get('SELECT * FROM events WHERE event_id = ?', [eventId]);

      return res.status(201).json({
        success: true,
        message: 'Event created successfully.',
        event: {
          ...created,
          required_facilities: JSON.parse(created.required_facilities)
        }
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Update Event (FR-05)
   */
  async updateEvent(req, res, next) {
    try {
      const { id } = req.params;
      const clubId = req.user.club_id;

      const existing = query.get('SELECT * FROM events WHERE event_id = ?', [id]);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Event not found.' });
      }

      if (existing.club_id !== clubId) {
        return res.status(403).json({ success: false, message: 'Unauthorized: You can only edit events for your assigned club.' });
      }

      if (existing.status === 'COMPLETED' || existing.status === 'CANCELLED') {
        return res.status(400).json({
          success: false,
          message: `Cannot edit an event that is already marked ${existing.status}.`
        });
      }

      const {
        title,
        description,
        category,
        eventDate,
        startTime,
        endTime,
        expectedParticipants,
        registrationCapacity,
        requiredFacilities,
        registrationDeadline,
        status
      } = req.body;

      const expected = expectedParticipants ? parseInt(expectedParticipants, 10) : existing.expected_participants;
      const cap = registrationCapacity ? parseInt(registrationCapacity, 10) : existing.registration_capacity;
      const facilitiesJson = requiredFacilities ? JSON.stringify(requiredFacilities) : existing.required_facilities;

      // If date or time changed and venue is booked, revalidate availability!
      if (existing.venue_id && (eventDate !== existing.event_date || startTime !== existing.start_time || endTime !== existing.end_time)) {
        const conflict = query.get(`
          SELECT booking_id FROM bookings
          WHERE venue_id = ? AND booking_date = ? AND status = 'CONFIRMED' AND event_id != ?
            AND NOT (end_time <= ? OR start_time >= ?)
        `, [existing.venue_id, eventDate || existing.event_date, id, startTime || existing.start_time, endTime || existing.end_time]);

        if (conflict) {
          return res.status(409).json({
            success: false,
            message: 'Changing event timing conflicts with another confirmed booking on this venue. Please reselect a venue.'
          });
        }

        // Update the booking schedule as well
        query.run(`
          UPDATE bookings
          SET booking_date = ?, start_time = ?, end_time = ?, updated_at = CURRENT_TIMESTAMP
          WHERE event_id = ?
        `, [eventDate || existing.event_date, startTime || existing.start_time, endTime || existing.end_time, id]);
      }

      query.run(`
        UPDATE events
        SET title = COALESCE(?, title),
            description = COALESCE(?, description),
            category = COALESCE(?, category),
            event_date = COALESCE(?, event_date),
            start_time = COALESCE(?, start_time),
            end_time = COALESCE(?, end_time),
            expected_participants = ?,
            registration_capacity = ?,
            required_facilities = ?,
            registration_deadline = COALESCE(?, registration_deadline),
            status = COALESCE(?, status),
            updated_at = CURRENT_TIMESTAMP
        WHERE event_id = ?
      `, [
        title?.trim(),
        description?.trim(),
        category,
        eventDate,
        startTime,
        endTime,
        expected,
        cap,
        facilitiesJson,
        registrationDeadline,
        status,
        id
      ]);

      const updated = query.get('SELECT * FROM events WHERE event_id = ?', [id]);

      return res.json({
        success: true,
        message: 'Event updated successfully.',
        event: {
          ...updated,
          required_facilities: JSON.parse(updated.required_facilities)
        }
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Update Event Status (Publish, Mark Completed, Cancel) (FR-05)
   */
  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const clubId = req.user.club_id;

      if (!['DRAFT', 'PUBLISHED', 'COMPLETED', 'CANCELLED'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status value.' });
      }

      const event = query.get('SELECT * FROM events WHERE event_id = ?', [id]);
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found.' });
      }

      if (event.club_id !== clubId) {
        return res.status(403).json({ success: false, message: 'Unauthorized: Event belongs to another club.' });
      }

      if (status === 'PUBLISHED' && !event.venue_id) {
        return res.status(400).json({
          success: false,
          message: 'Cannot publish event before a campus venue has been confirmed and booked.'
        });
      }

      query.transaction(() => {
        query.run('UPDATE events SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE event_id = ?', [status, id]);

        if (status === 'CANCELLED') {
          // Release associated confirmed booking so venue becomes available immediately
          query.run("UPDATE bookings SET status = 'CANCELLED', updated_at = CURRENT_TIMESTAMP WHERE event_id = ?", [id]);
        }
      });

      return res.json({
        success: true,
        message: `Event status updated to ${status}.`
      });
    } catch (err) {
      next(err);
    }
  }
};
