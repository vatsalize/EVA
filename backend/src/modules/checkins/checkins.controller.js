import { query } from '../../config/db.js';

export const CheckinsController = {
  /**
   * Scan and Validate QR Code for Footfall Check-in (FR-13)
   */
  async scanQRCode(req, res, next) {
    try {
      const { qrToken, eventId, scannerId = 'SCANNER-PORTAL-01' } = req.body;
      const coordinatorClubId = req.user.club_id;

      if (!qrToken) {
        return res.status(400).json({
          success: false,
          message: 'QR token is required.'
        });
      }

      // Execute transaction-safe scan validation
      const result = query.transaction(() => {
        // 1. Find registration by QR token
        const registration = query.get(`
          SELECT r.*, e.title as event_title, e.club_id, e.status as event_status,
                 u.full_name as student_name, u.email as student_email, u.department, u.year_of_study
          FROM registrations r
          JOIN events e ON r.event_id = e.event_id
          JOIN users u ON r.student_id = u.user_id
          WHERE r.qr_token = ?
        `, [qrToken.trim()]);

        if (!registration) {
          throw new Error('Invalid QR Code: No registration record found.');
        }

        // 2. Event verification
        if (eventId && registration.event_id !== eventId) {
          throw new Error(`Invalid Event: This QR code is for "${registration.event_title}", not the selected event.`);
        }

        // 3. Coordinator authorization
        if (registration.club_id !== coordinatorClubId) {
          throw new Error('Unauthorized: This event does not belong to your assigned club.');
        }

        if (registration.status !== 'CONFIRMED') {
          throw new Error(`Registration is ${registration.status.toLowerCase()} and cannot be checked in.`);
        }

        if (registration.event_status === 'CANCELLED') {
          throw new Error('Cannot check in: This event has been cancelled.');
        }

        // 4. Duplicate check-in prevention (FR-13 & SRS Section 4.2)
        const priorCheckin = query.get('SELECT * FROM checkins WHERE registration_id = ?', [registration.registration_id]);
        if (priorCheckin) {
          const formattedTime = new Date(priorCheckin.scanned_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          throw new Error(`Duplicate Check-in Rejected! Student ${registration.student_name} was already checked in at ${formattedTime}.`);
        }

        // 5. Create CheckIn record
        const checkinId = `CHK-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
        const now = new Date().toISOString();

        query.run(`
          INSERT INTO checkins (
            checkin_id, registration_id, event_id, student_id, scanned_at, scan_status, scanner_id
          ) VALUES (?, ?, ?, ?, ?, 'ACCEPTED', ?)
        `, [
          checkinId,
          registration.registration_id,
          registration.event_id,
          registration.student_id,
          now,
          scannerId
        ]);

        return {
          checkinId,
          scannedAt: now,
          student: {
            studentId: registration.student_id,
            fullName: registration.student_name,
            email: registration.student_email,
            department: registration.department,
            yearOfStudy: registration.year_of_study
          },
          event: {
            eventId: registration.event_id,
            title: registration.event_title
          }
        };
      });

      return res.status(200).json({
        success: true,
        message: `Check-in Verified! Welcome, ${result.student.fullName}.`,
        checkin: result
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
  },

  /**
   * Event Footfall Dashboard Data (FR-13, FR-15)
   */
  async getEventFootfall(req, res, next) {
    try {
      const { id: eventId } = req.params;

      const event = query.get(`
        SELECT e.*, c.name as club_name, v.name as venue_name, v.capacity as venue_capacity
        FROM events e
        JOIN clubs c ON e.club_id = c.club_id
        LEFT JOIN venues v ON e.venue_id = v.venue_id
        WHERE e.event_id = ?
      `, [eventId]);

      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found.' });
      }

      if (req.user.role === 'COORDINATOR' && event.club_id !== req.user.club_id) {
        return res.status(403).json({ success: false, message: 'Unauthorized.' });
      }

      const totalRegistrations = query.get(
        "SELECT COUNT(*) as count FROM registrations WHERE event_id = ? AND status = 'CONFIRMED'",
        [eventId]
      )?.count || 0;

      const checkedInStudents = query.all(`
        SELECT chk.checkin_id, chk.scanned_at, chk.scanner_id,
               u.user_id as student_id, u.full_name as student_name, u.email as student_email,
               u.department, u.year_of_study,
               r.registered_at
        FROM checkins chk
        JOIN registrations r ON chk.registration_id = r.registration_id
        JOIN users u ON chk.student_id = u.user_id
        WHERE chk.event_id = ? AND chk.scan_status = 'ACCEPTED'
        ORDER BY chk.scanned_at DESC
      `, [eventId]);

      const actualFootfall = checkedInStudents.length;
      const turnoutRate = totalRegistrations > 0 
        ? Math.round((actualFootfall / totalRegistrations) * 100) 
        : 0;

      return res.json({
        success: true,
        event: {
          eventId: event.event_id,
          title: event.title,
          category: event.category,
          eventDate: event.event_date,
          startTime: event.start_time,
          endTime: event.end_time,
          venueName: event.venue_name,
          venueCapacity: event.venue_capacity,
          registrationCapacity: event.registration_capacity,
          expectedParticipants: event.expected_participants,
          status: event.status
        },
        metrics: {
          totalRegistrations,
          actualFootfall,
          turnoutRate
        },
        attendees: checkedInStudents
      });
    } catch (err) {
      next(err);
    }
  }
};
