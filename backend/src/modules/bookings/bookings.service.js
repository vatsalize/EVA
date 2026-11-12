import { query } from '../../config/db.js';

export const BookingsService = {
  /**
   * Deterministic Availability & Conflict Checking (FR-07)
   */
  checkAvailability({ eventDate, startTime, endTime, expectedParticipants = 0, requiredFacilities = [], excludeEventId = null }) {
    const venues = query.all("SELECT * FROM venues WHERE status = 'ACTIVE'");
    
    // Retrieve all confirmed bookings on that date
    let bookingSql = `
      SELECT b.*, e.title as event_title, c.name as club_name
      FROM bookings b
      JOIN events e ON b.event_id = e.event_id
      JOIN clubs c ON e.club_id = c.club_id
      WHERE b.booking_date = ? AND b.status = 'CONFIRMED'
    `;
    const params = [eventDate];
    if (excludeEventId) {
      bookingSql += ' AND b.event_id != ?';
      params.push(excludeEventId);
    }

    const dayBookings = query.all(bookingSql, params);

    const available = [];
    const unavailable = [];

    const reqFacSet = new Set(
      Array.isArray(requiredFacilities) 
        ? requiredFacilities.map(f => f.trim().toLowerCase()) 
        : []
    );

    for (const v of venues) {
      const vFacilities = v.facilities ? JSON.parse(v.facilities) : [];
      const vFacSet = new Set(vFacilities.map(f => f.trim().toLowerCase()));

      const issues = [];

      // 1. Capacity check
      if (expectedParticipants > 0 && v.capacity < expectedParticipants) {
        issues.push(`Capacity insufficient (${v.capacity} seats < ${expectedParticipants} needed).`);
      }

      // 2. Facilities check
      for (const reqFac of reqFacSet) {
        if (!vFacSet.has(reqFac)) {
          issues.push(`Missing required facility: ${reqFac.replace('_', ' ')}.`);
        }
      }

      // 3. Operating hours check
      if (startTime < v.operating_start || endTime > v.operating_end) {
        issues.push(`Requested slot (${startTime}-${endTime}) outside operating hours (${v.operating_start}-${v.operating_end}).`);
      }

      // 4. Overlap check: A.start < B.end AND B.start < A.end
      const conflictingBookings = dayBookings.filter(b => 
        b.venue_id === v.venue_id &&
        startTime < b.end_time &&
        b.start_time < endTime
      );

      if (conflictingBookings.length > 0) {
        const conflictDetails = conflictingBookings.map(cb => `Booked by ${cb.club_name} (${cb.start_time}-${cb.end_time})`).join(', ');
        issues.push(`Scheduling conflict: ${conflictDetails}.`);
      }

      const venueItem = {
        venueId: v.venue_id,
        name: v.name,
        building: v.building,
        capacity: v.capacity,
        facilities: vFacilities,
        operatingStart: v.operating_start,
        operatingEnd: v.operating_end,
        status: v.status
      };

      if (issues.length === 0) {
        available.push(venueItem);
      } else {
        unavailable.push({
          ...venueItem,
          reasons: issues
        });
      }
    }

    return { available, unavailable };
  },

  /**
   * Explainable AI Smart Venue Recommendation Engine (FR-08)
   */
  getRecommendations({ eventDate, startTime, endTime, expectedParticipants, requiredFacilities = [], eventCategory = 'General', excludeEventId = null }) {
    // Step A: Deterministic Filtering First
    const { available } = this.checkAvailability({
      eventDate,
      startTime,
      endTime,
      expectedParticipants,
      requiredFacilities,
      excludeEventId
    });

    if (available.length === 0) {
      return [];
    }

    // Step B: Query historical usage data for category affinity
    const historicalRows = query.all('SELECT * FROM historical_venue_usage');
    const histByVenue = {};
    for (const h of historicalRows) {
      if (!histByVenue[h.venue_id]) {
        histByVenue[h.venue_id] = [];
      }
      histByVenue[h.venue_id].push(h);
    }

    const reqFacSet = new Set((requiredFacilities || []).map(f => f.trim().toLowerCase()));

    // Step C: Scoring & Explainability
    const recommendations = available.map(v => {
      const reasons = [];

      // 1. Capacity Fit & Efficiency (0 - 35)
      const ratio = expectedParticipants / Math.max(1, v.capacity);
      let capacityScore = 20;
      if (ratio >= 0.55 && ratio <= 0.85) {
        capacityScore = 35;
        reasons.push(`Optimal capacity fit (${Math.round(ratio * 100)}% utilization for ${expectedParticipants} participants).`);
      } else if (ratio < 0.55) {
        capacityScore = Math.max(10, Math.round(35 * (ratio / 0.55)));
        reasons.push(`Generous capacity (${v.capacity} seats available for ${expectedParticipants} expected attendees).`);
      } else {
        capacityScore = Math.max(15, Math.round(35 - (ratio - 0.85) * 60));
        reasons.push(`Near maximum capacity (${Math.round(ratio * 100)}% full).`);
      }

      // 2. Facility Match & Bonus Amenities (0 - 25)
      let facilityScore = 18;
      const vFacSet = new Set(v.facilities.map(f => f.trim().toLowerCase()));
      const bonusAmenities = [];
      for (const amenity of ['air_conditioning', 'sound_system', 'stage', 'wifi', 'microphone']) {
        if (!reqFacSet.has(amenity) && vFacSet.has(amenity)) {
          bonusAmenities.push(amenity);
        }
      }
      facilityScore += Math.min(7, bonusAmenities.length * 2);
      if (bonusAmenities.length > 0) {
        reasons.push(`Matches all technical requirements plus extra amenities: ${bonusAmenities.slice(0, 3).map(a => a.replace('_', ' ')).join(', ')}.`);
      } else {
        reasons.push('Meets 100% of required technical and event facilities.');
      }

      // 3. Category Historical Affinity (0 - 25)
      const venueHistory = histByVenue[v.venueId] || [];
      const catHistory = venueHistory.filter(h => h.event_category?.toLowerCase() === eventCategory?.toLowerCase());

      let categoryScore = 15;
      if (catHistory.length > 0) {
        const avgFootfall = Math.round(catHistory.reduce((s, c) => s + c.actual_footfall, 0) / catHistory.length);
        const avgUtil = catHistory.reduce((s, c) => s + (c.actual_footfall / c.venue_capacity), 0) / catHistory.length;
        categoryScore = Math.min(25, Math.round(15 + avgUtil * 10));
        reasons.push(`High historical success for ${eventCategory} events (avg ${avgFootfall} actual attendees across ${catHistory.length} previous events).`);
      } else if (venueHistory.length > 0) {
        categoryScore = 16;
        reasons.push(`Proven campus event venue (${venueHistory.length} prior successful bookings).`);
      } else {
        categoryScore = 12;
        reasons.push('Standard campus venue profile.');
      }

      // 4. Overall Reliability & Operating Balance (0 - 15)
      let reliabilityScore = 10;
      if (venueHistory.length > 0) {
        const avgOverallUtil = venueHistory.reduce((s, c) => s + (c.actual_footfall / c.venue_capacity), 0) / venueHistory.length;
        reliabilityScore = Math.min(15, Math.round(8 + avgOverallUtil * 7));
      }

      const totalScore = Math.min(100, capacityScore + facilityScore + categoryScore + reliabilityScore);

      return {
        ...v,
        score: totalScore,
        subscores: {
          capacityFit: capacityScore,
          facilityMatch: facilityScore,
          categoryAffinity: categoryScore,
          reliability: reliabilityScore
        },
        reasons,
        recommendationSummary: `Recommended (${totalScore}/100 Match): ${reasons.join(' ')}`
      };
    });

    // Rank highest score first
    return recommendations.sort((a, b) => b.score - a.score);
  },

  /**
   * Atomic Transaction Booking Confirmation (FR-09)
   */
  confirmBooking({ eventId, venueId, bookingDate, startTime, endTime, userId, userClubId }) {
    return query.transaction(() => {
      // 1. Verify Event existence and Coordinator ownership
      const event = query.get('SELECT * FROM events WHERE event_id = ?', [eventId]);
      if (!event) {
        throw new Error('Event not found.');
      }

      if (event.club_id !== userClubId) {
        throw new Error('Unauthorized: You can only book venues for your assigned club events.');
      }

      // 2. Verify Venue existence and active status
      const venue = query.get("SELECT * FROM venues WHERE venue_id = ? AND status = 'ACTIVE'", [venueId]);
      if (!venue) {
        throw new Error('Selected venue is not active or does not exist.');
      }

      // 3. Recheck atomic conflict at database level
      const conflict = query.get(`
        SELECT booking_id, event_id, start_time, end_time
        FROM bookings
        WHERE venue_id = ?
          AND booking_date = ?
          AND status = 'CONFIRMED'
          AND event_id != ?
          AND NOT (end_time <= ? OR start_time >= ?)
      `, [venueId, bookingDate, eventId, startTime, endTime]);

      if (conflict) {
        throw new Error(`Booking conflict detected: Venue ${venue.name} is already booked from ${conflict.start_time} to ${conflict.end_time}.`);
      }

      // 4. Cancel/Release any prior booking for this event
      query.run('DELETE FROM bookings WHERE event_id = ?', [eventId]);

      // 5. Generate Booking ID and Insert
      const bookingId = `BKG-${Date.now().toString(36).toUpperCase()}`;
      query.run(`
        INSERT INTO bookings (
          booking_id, event_id, venue_id, booking_date, start_time, end_time, status, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, 'CONFIRMED', ?)
      `, [bookingId, eventId, venueId, bookingDate, startTime, endTime, userId]);

      // 6. Update Event with confirmed venue
      query.run(`
        UPDATE events
        SET venue_id = ?, updated_at = CURRENT_TIMESTAMP
        WHERE event_id = ?
      `, [venueId, eventId]);

      return {
        bookingId,
        eventId,
        venueId,
        venueName: venue.name,
        bookingDate,
        startTime,
        endTime,
        status: 'CONFIRMED'
      };
    });
  }
};
