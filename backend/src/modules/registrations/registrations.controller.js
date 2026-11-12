import { query } from '../../config/db.js';
import { generateQRToken } from '../../utils/security.js';
import QRCode from 'qrcode';

export const RegistrationsController = {
  /**
   * Register for an Event (FR-11, FR-12)
   */
  async registerForEvent(req, res, next) {
    try {
      const studentId = req.user.user_id;
      const { id: eventId } = req.params;

      const registration = query.transaction(() => {
        // 1. Fetch event and verify published status
        const event = query.get('SELECT * FROM events WHERE event_id = ?', [eventId]);
        if (!event) {
          throw new Error('Event not found.');
        }

        if (event.status !== 'PUBLISHED') {
          throw new Error(`Cannot register: Event is currently ${event.status.toLowerCase()}.`);
        }

        // 2. Check registration deadline
        const today = new Date().toISOString().slice(0, 10);
        if (event.registration_deadline && today > event.registration_deadline) {
          throw new Error('Registration deadline for this event has passed.');
        }

        // 3. Prevent duplicate registration
        const existing = query.get(
          'SELECT * FROM registrations WHERE event_id = ? AND student_id = ?',
          [eventId, studentId]
        );

        if (existing) {
          if (existing.status === 'CONFIRMED') {
            throw new Error('You are already registered for this event.');
          } else {
            // Reactivate previously cancelled registration with fresh QR token
            const qrToken = generateQRToken(eventId, studentId);
            query.run(`
              UPDATE registrations
              SET status = 'CONFIRMED', qr_token = ?, registered_at = CURRENT_TIMESTAMP
              WHERE registration_id = ?
            `, [qrToken, existing.registration_id]);

            return {
              registrationId: existing.registration_id,
              eventId,
              studentId,
              qrToken,
              status: 'CONFIRMED'
            };
          }
        }

        // 4. Capacity limit validation (Transaction-Safe)
        const currentCountRow = query.get(
          "SELECT COUNT(*) as count FROM registrations WHERE event_id = ? AND status = 'CONFIRMED'",
          [eventId]
        );
        const currentCount = currentCountRow?.count || 0;

        if (currentCount >= event.registration_capacity) {
          throw new Error(`Registration is full. Capacity of ${event.registration_capacity} has been reached.`);
        }

        // 5. Generate unique QR Token and insert
        const registrationId = `REG-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
        const qrToken = generateQRToken(eventId, studentId);

        query.run(`
          INSERT INTO registrations (
            registration_id, event_id, student_id, qr_token, registered_at, status
          ) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, 'CONFIRMED')
        `, [registrationId, eventId, studentId, qrToken]);

        return {
          registrationId,
          eventId,
          studentId,
          qrToken,
          status: 'CONFIRMED'
        };
      });

      return res.status(201).json({
        success: true,
        message: 'Registration successful! Your digital QR pass is ready.',
        registration
      });
    } catch (err) {
      return res.status(409).json({
        success: false,
        message: err.message
      });
    }
  },

  /**
   * Get Student's Registered Events (FR-11, FR-12)
   */
  async getMyRegistrations(req, res, next) {
    try {
      const studentId = req.user.user_id;

      const registrations = query.all(`
        SELECT r.*, e.title as event_title, e.category as event_category,
               e.event_date, e.start_time, e.end_time, e.status as event_status,
               c.name as club_name,
               v.name as venue_name, v.building as venue_building,
               chk.checkin_id, chk.scanned_at, chk.scan_status,
               f.feedback_id, f.overall_rating
        FROM registrations r
        JOIN events e ON r.event_id = e.event_id
        JOIN clubs c ON e.club_id = c.club_id
        LEFT JOIN venues v ON e.venue_id = v.venue_id
        LEFT JOIN checkins chk ON r.registration_id = chk.registration_id AND chk.scan_status = 'ACCEPTED'
        LEFT JOIN feedback f ON r.event_id = f.event_id AND r.student_id = f.student_id
        WHERE r.student_id = ? AND r.status = 'CONFIRMED'
        ORDER BY e.event_date DESC, e.start_time DESC
      `, [studentId]);

      return res.json({
        success: true,
        count: registrations.length,
        registrations: registrations.map(r => ({
          ...r,
          hasCheckedIn: Boolean(r.checkin_id),
          hasSubmittedFeedback: Boolean(r.feedback_id)
        }))
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get QR Code DataURL for a Registration (FR-12)
   */
  async getQRCode(req, res, next) {
    try {
      const { id } = req.params;
      const reg = query.get('SELECT * FROM registrations WHERE registration_id = ?', [id]);

      if (!reg) {
        return res.status(404).json({ success: false, message: 'Registration not found.' });
      }

      // Ensure student can only view their own QR or coordinator of that event's club can view
      if (req.user.role === 'STUDENT' && reg.student_id !== req.user.user_id) {
        return res.status(403).json({ success: false, message: 'Access denied.' });
      }

      // Generate base64 Data URL for the QR token
      const qrDataUrl = await QRCode.toDataURL(reg.qr_token, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f1f38',
          light: '#ffffff'
        }
      });

      return res.json({
        success: true,
        qrToken: reg.qr_token,
        qrDataUrl
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Coordinator: Get all registrations for an event (FR-11)
   */
  async getEventRegistrations(req, res, next) {
    try {
      const { id: eventId } = req.params;

      const event = query.get('SELECT * FROM events WHERE event_id = ?', [eventId]);
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found.' });
      }

      // Restrict to assigned club coordinator
      if (req.user.role === 'COORDINATOR' && event.club_id !== req.user.club_id) {
        return res.status(403).json({ success: false, message: 'Unauthorized.' });
      }

      const registrations = query.all(`
        SELECT r.registration_id, r.event_id, r.student_id, r.qr_token, r.registered_at, r.status,
               u.full_name as student_name, u.email as student_email, u.department, u.year_of_study,
               chk.checkin_id, chk.scanned_at, chk.scan_status
        FROM registrations r
        JOIN users u ON r.student_id = u.user_id
        LEFT JOIN checkins chk ON r.registration_id = chk.registration_id AND chk.scan_status = 'ACCEPTED'
        WHERE r.event_id = ? AND r.status = 'CONFIRMED'
        ORDER BY r.registered_at ASC
      `, [eventId]);

      return res.json({
        success: true,
        count: registrations.length,
        registrations: registrations.map(r => ({
          ...r,
          isCheckedIn: Boolean(r.checkin_id)
        }))
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Cancel Registration
   */
  async cancelRegistration(req, res, next) {
    try {
      const { id } = req.params;
      const studentId = req.user.user_id;

      const reg = query.get('SELECT * FROM registrations WHERE registration_id = ? AND student_id = ?', [id, studentId]);
      if (!reg) {
        return res.status(404).json({ success: false, message: 'Registration not found.' });
      }

      // Check if already checked in
      const checkin = query.get('SELECT * FROM checkins WHERE registration_id = ?', [id]);
      if (checkin) {
        return res.status(400).json({ success: false, message: 'Cannot cancel: Attendance has already been recorded.' });
      }

      query.run("UPDATE registrations SET status = 'CANCELLED' WHERE registration_id = ?", [id]);

      return res.json({
        success: true,
        message: 'Registration cancelled.'
      });
    } catch (err) {
      next(err);
    }
  }
};
