import app from './backend/src/server.js';
import http from 'node:http';

async function runAcceptanceTest() {
  console.log('================================================================');
  console.log('EVA PLATFORM — 21-STEP MASTER ACCEPTANCE TEST SUITE');
  console.log('Testing the complete end-to-end workflow against database');
  console.log('================================================================\n');

  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/api`;

  let studentToken = '';
  let coordinatorToken = '';
  let createdEventId = '';
  let bookedVenueId = '';
  let studentRegistrationId = '';
  let studentQRToken = '';

  let passed = 0;
  let failed = 0;

  async function api(path, options = {}) {
    const res = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
        ...options.headers
      }
    });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, data };
  }

  function step(stepNum, name, condition, details = '') {
    if (condition) {
      console.log(`[PASS] Step ${stepNum.toString().padStart(2, '0')}: ${name}`);
      if (details) console.log(`        └─ ${details}`);
      passed++;
    } else {
      console.error(`[FAIL] Step ${stepNum.toString().padStart(2, '0')}: ${name}`);
      if (details) console.error(`        └─ Error: ${details}`);
      failed++;
    }
  }

  try {
    const timestamp = Date.now().toString().slice(-4);
    const testStudentRoll = `102403${timestamp}`;
    const testStudentEmail = `vatsal.${timestamp}@thapar.edu`;

    // 1. A student creates an account
    const signupRes = await api('/auth/student/signup', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 'Vatsal Kumar Singh',
        email: testStudentEmail,
        studentId: testStudentRoll,
        department: 'Computer Engineering',
        yearOfStudy: 3,
        password: 'Password@2026',
        confirmPassword: 'Password@2026'
      })
    });
    step(1, 'Student Self-Signup', signupRes.status === 201 && signupRes.data.user?.userId === testStudentRoll, `Created Student ID: ${testStudentRoll}`);

    // 2. The student verifies the account and logs in
    const loginRes = await api('/auth/student/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testStudentEmail,
        password: 'Password@2026'
      })
    });
    step(2, 'Student Login & JWT Verification', loginRes.status === 200 && Boolean(loginRes.data.token), `Token issued for ${loginRes.data.user?.fullName}`);
    studentToken = loginRes.data.token;

    // 3. A predefined Club Coordinator logs in
    const coordLogin = await api('/auth/coordinator/login', {
      method: 'POST',
      body: JSON.stringify({
        coordinatorId: 'COO001',
        password: 'EVA-Demo@2026'
      })
    });
    step(3, 'Predefined Coordinator Login (COO001)', coordLogin.status === 200 && Boolean(coordLogin.data.token), `Authenticated for ${coordLogin.data.user?.clubName} (${coordLogin.data.user?.clubId})`);
    coordinatorToken = coordLogin.data.token;

    // 4. The coordinator creates an event
    const createRes = await api('/events', {
      method: 'POST',
      token: coordinatorToken,
      body: JSON.stringify({
        title: `Thapar Quantum Hackathon ${timestamp}`,
        description: 'Flagship university-wide competitive programming and robotics challenge.',
        category: 'Technical',
        eventDate: '2026-11-29',
        startTime: '09:00',
        endTime: '17:00',
        expectedParticipants: 110,
        registrationCapacity: 120,
        requiredFacilities: ['projector', 'wifi', 'sound_system'],
        registrationDeadline: '2026-11-28',
        status: 'DRAFT'
      })
    });
    createdEventId = createRes.data.event?.event_id;
    step(4, 'Coordinator Creates Draft Event', createRes.status === 201 && Boolean(createdEventId), `Created Event ID: ${createdEventId}`);

    // 5. The coordinator searches for suitable venues
    const venuesRes = await api('/venues?capacity=100');
    step(5, 'Search Suitable Venues (Capacity >= 100)', venuesRes.status === 200 && venuesRes.data.venues?.length > 0, `Found ${venuesRes.data.count} candidates`);

    // 6. EVA checks capacity, facilities and availability
    const availRes = await api('/bookings/availability', {
      method: 'POST',
      token: coordinatorToken,
      body: JSON.stringify({
        eventDate: '2026-11-29',
        startTime: '09:00',
        endTime: '17:00',
        expectedParticipants: 110,
        requiredFacilities: ['projector', 'wifi', 'sound_system']
      })
    });
    step(6, 'Check Availability, Capacity & Facilities', availRes.status === 200 && Array.isArray(availRes.data.available), `${availRes.data.available?.length} available, ${availRes.data.unavailable?.length} excluded`);

    // 7. EVA detects booking conflicts
    // First let's check a venue that is already booked on 2026-11-20 (VEN001)
    const conflictCheck = await api('/bookings/availability', {
      method: 'POST',
      token: coordinatorToken,
      body: JSON.stringify({
        eventDate: '2026-11-20',
        startTime: '10:00',
        endTime: '15:00',
        expectedParticipants: 50
      })
    });
    const conflictFound = conflictCheck.data.unavailable?.some(v => v.venueId === 'VEN001' && v.reasons?.some(r => r.includes('conflict')));
    step(7, 'Booking Conflict Detection', conflictCheck.status === 200 && conflictFound, 'Overlapping booking on VEN001 correctly flagged as conflict');

    // 8. EVA generates explainable venue recommendations
    const recsRes = await api('/bookings/recommendations', {
      method: 'POST',
      token: coordinatorToken,
      body: JSON.stringify({
        eventDate: '2026-11-29',
        startTime: '09:00',
        endTime: '17:00',
        expectedParticipants: 110,
        requiredFacilities: ['projector', 'wifi', 'sound_system'],
        eventCategory: 'Technical'
      })
    });
    const topRec = recsRes.data.recommendations?.[0];
    bookedVenueId = topRec?.venueId;
    step(8, 'AI Smart Venue Recommendations & Reasons', recsRes.status === 200 && topRec && topRec.score > 0, `Top Match: ${topRec?.name} (Score: ${topRec?.score}/100) — Reasons: ${topRec?.reasons?.[0]}`);

    // 9. The coordinator confirms a booking
    const bookRes = await api('/bookings', {
      method: 'POST',
      token: coordinatorToken,
      body: JSON.stringify({
        eventId: createdEventId,
        venueId: bookedVenueId,
        bookingDate: '2026-11-29',
        startTime: '09:00',
        endTime: '17:00'
      })
    });
    step(9, 'Coordinator Confirms Booking', bookRes.status === 201 && bookRes.data.booking?.status === 'CONFIRMED', `Reserved ${topRec?.name} for ${createdEventId}`);

    // 10. The coordinator publishes the event
    const pubRes = await api(`/events/${createdEventId}/status`, {
      method: 'PATCH',
      token: coordinatorToken,
      body: JSON.stringify({ status: 'PUBLISHED' })
    });
    step(10, 'Publish Event to Students', pubRes.status === 200, `Status transitioned to PUBLISHED`);

    // 11. The student discovers the event
    const searchRes = await api(`/events?search=Quantum`);
    const foundEvent = searchRes.data.events?.find(e => e.event_id === createdEventId);
    step(11, 'Student Discovers Event in Explore Feed', searchRes.status === 200 && Boolean(foundEvent), `Found: "${foundEvent?.title}" (${foundEvent?.remaining_capacity} seats open)`);

    // 12. The student registers
    const regRes = await api(`/registrations/events/${createdEventId}/register`, {
      method: 'POST',
      token: studentToken
    });
    studentRegistrationId = regRes.data.registration?.registrationId;
    studentQRToken = regRes.data.registration?.qrToken;
    step(12, 'Student Registers (Atomic Capacity Lock)', regRes.status === 201 && Boolean(studentRegistrationId), `Registration ID: ${studentRegistrationId}`);

    // 13. EVA generates a unique QR code
    step(13, 'Generate Non-Guessable QR Token', Boolean(studentQRToken && studentQRToken.startsWith('EVA-')), `Issued Token: ${studentQRToken}`);

    // 14. The student accesses the QR code
    const qrRes = await api(`/registrations/${studentRegistrationId}/qr`, {
      token: studentToken
    });
    step(14, 'Student Accesses QR Code Digital Ticket', qrRes.status === 200 && qrRes.data.qrDataUrl?.startsWith('data:image/png'), 'High-resolution PNG DataURL rendered');

    // 15. The coordinator scans it at the event entrance
    const scanRes = await api('/checkins/scan', {
      method: 'POST',
      token: coordinatorToken,
      body: JSON.stringify({
        qrToken: studentQRToken,
        eventId: createdEventId,
        scannerId: 'MAIN-GATE-01'
      })
    });
    step(15, 'Coordinator Scans QR at Event Entrance', scanRes.status === 200 && Boolean(scanRes.data.checkin?.checkinId), `Verified Attendee: ${scanRes.data.checkin?.student?.fullName}`);

    // 16. EVA validates the QR code and records check-in
    // Also verify duplicate scan rejection
    const dupScanRes = await api('/checkins/scan', {
      method: 'POST',
      token: coordinatorToken,
      body: JSON.stringify({
        qrToken: studentQRToken,
        eventId: createdEventId
      })
    });
    step(16, 'Validate QR & Prevent Duplicate Check-in', dupScanRes.status === 400 && dupScanRes.data.message?.includes('Duplicate Check-in Rejected'), 'Duplicate check-in attempt strictly rejected');

    // 17. Actual footfall is updated
    const footfallRes = await api(`/checkins/events/${createdEventId}/footfall`, {
      token: coordinatorToken
    });
    const metrics = footfallRes.data.metrics;
    step(17, 'Actual Footfall Count & Turnout Rate Updated', footfallRes.status === 200 && metrics?.actualFootfall === 1 && metrics?.turnoutRate === 100, `Footfall: ${metrics?.actualFootfall}, Turnout: ${metrics?.turnoutRate}%`);

    // 18. The coordinator marks the event completed
    const compRes = await api(`/events/${createdEventId}/status`, {
      method: 'PATCH',
      token: coordinatorToken,
      body: JSON.stringify({ status: 'COMPLETED' })
    });
    step(18, 'Coordinator Marks Event Completed', compRes.status === 200, 'Status transitioned to COMPLETED');

    // 19. The attending student submits feedback
    const feedRes = await api(`/feedback/events/${createdEventId}`, {
      method: 'POST',
      token: studentToken,
      body: JSON.stringify({
        overallRating: 5,
        organizationRating: 5,
        venueRating: 5,
        comments: 'Phenomenal hackathon! Facilities, network speed, and venue setup were perfect.'
      })
    });
    step(19, 'Attending Student Submits Structured Feedback', feedRes.status === 201 && Boolean(feedRes.data.feedback?.feedbackId), `Review ID: ${feedRes.data.feedback?.feedbackId}`);

    // 20. The coordinator views feedback and analytics
    const viewFeedRes = await api(`/feedback/events/${createdEventId}`, {
      token: coordinatorToken
    });
    step(20, 'Coordinator Reviews Event Feedback', viewFeedRes.status === 200 && viewFeedRes.data.stats?.avgOverall === 5, `Average Rating: ${viewFeedRes.data.stats?.avgOverall} / 5 (${viewFeedRes.data.stats?.totalReviews} review)`);

    // 21. The analytics dashboard correctly reflects registrations, actual footfall, feedback and venue utilization
    const analyticsRes = await api('/analytics/overview', {
      token: coordinatorToken
    });
    const kpi = analyticsRes.data.kpi;
    step(21, 'Analytics Dashboard Reflects Complete Lifecycle', analyticsRes.status === 200 && kpi.totalRegistrations > 0 && kpi.actualFootfall > 0 && kpi.completedEvents > 0, `Events: ${kpi.totalEvents}, Regs: ${kpi.totalRegistrations}, Footfall: ${kpi.actualFootfall}, Turnout: ${kpi.turnoutRate}%`);

  } catch (err) {
    console.error('Master Test Suite Error:', err);
    failed++;
  } finally {
    server.close();
  }

  console.log('\n================================================================');
  console.log(`MASTER ACCEPTANCE SUMMARY: ${passed} / 21 STEPS PASSED (${failed} FAILED)`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runAcceptanceTest();
