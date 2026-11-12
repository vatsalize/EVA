import app from './src/server.js';
import http from 'node:http';

async function runTestSuite() {
  console.log('====================================================');
  console.log('Starting EVA Backend Automated API Test Suite');
  console.log('====================================================');

  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/api`;

  let coordinatorToken = '';
  let studentToken = '';
  let createdEventId = '';
  let studentRegistrationId = '';
  let generatedQRToken = '';

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

  function assert(title, condition, detail = '') {
    if (condition) {
      console.log(`  [PASS] ${title}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${title} - ${detail}`);
      failed++;
    }
  }

  try {
    // 1. Health
    const health = await api('/health');
    assert('Health Check', health.status === 200 && health.data.status === 'healthy');

    // 2. Coordinator Login (COO001 / EVA-Demo@2026)
    const coordLogin = await api('/auth/coordinator/login', {
      method: 'POST',
      body: JSON.stringify({ coordinatorId: 'COO001', password: 'EVA-Demo@2026' })
    });
    assert('Coordinator Login (COO001)', coordLogin.status === 200 && coordLogin.data.token, coordLogin.data.message);
    coordinatorToken = coordLogin.data.token;

    // 3. Student Login (STU001 / Student@2026)
    const stuLogin = await api('/auth/student/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'ishita.singh@student.eva-demo.test', password: 'Student@2026' })
    });
    assert('Student Login (STU001)', stuLogin.status === 200 && stuLogin.data.token, stuLogin.data.message);
    studentToken = stuLogin.data.token;

    // 4. Student Self-Signup (New Student)
    const testRoll = `STU-TEST-${Date.now().toString().slice(-4)}`;
    const signup = await api('/auth/student/signup', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 'Test Automation Student',
        email: `student.${Date.now()}@thapar.edu`,
        studentId: testRoll,
        department: 'Computer Engineering',
        yearOfStudy: 2,
        password: 'Password@123',
        confirmPassword: 'Password@123'
      })
    });
    assert('Student Self-Signup', signup.status === 201 && signup.data.user?.userId === testRoll, signup.data.message);
    const newStudentToken = signup.data.token;

    // 5. Public Event Discovery
    const publicEvents = await api('/events');
    assert('Public Event Discovery', publicEvents.status === 200 && publicEvents.data.events.length > 0);

    // 6. Venue Directory & Filtering
    const venues = await api('/venues?capacity=100');
    assert('Venue Directory & Capacity Filter', venues.status === 200 && venues.data.venues.length > 0);

    // 7. Venue Availability & Conflict Check
    const avail = await api('/bookings/availability', {
      method: 'POST',
      token: coordinatorToken,
      body: JSON.stringify({
        eventDate: '2026-11-20',
        startTime: '10:00',
        endTime: '14:00',
        expectedParticipants: 150,
        requiredFacilities: ['projector', 'wifi']
      })
    });
    assert('Availability & Conflict Check', avail.status === 200 && Array.isArray(avail.data.available));

    // 8. AI Venue Recommendations
    const recs = await api('/bookings/recommendations', {
      method: 'POST',
      token: coordinatorToken,
      body: JSON.stringify({
        eventDate: '2026-11-23',
        startTime: '10:00',
        endTime: '15:00',
        expectedParticipants: 80,
        requiredFacilities: ['projector', 'wifi'],
        eventCategory: 'Technical'
      })
    });
    assert('AI Smart Venue Recommendations', recs.status === 200 && recs.data.recommendations.length > 0 && recs.data.recommendations[0].score > 0);

    // 9. Coordinator Creates Event
    const createEvt = await api('/events', {
      method: 'POST',
      token: coordinatorToken,
      body: JSON.stringify({
        title: 'Thapar HackSprint Live 2026',
        description: 'Automated test hackathon for Software Engineering.',
        category: 'Technical',
        eventDate: '2026-11-23',
        startTime: '10:00',
        endTime: '15:00',
        expectedParticipants: 70,
        registrationCapacity: 80,
        requiredFacilities: ['projector', 'wifi'],
        status: 'DRAFT'
      })
    });
    assert('Coordinator Creates Event', createEvt.status === 201 && createEvt.data.event?.event_id, createEvt.data.message);
    createdEventId = createEvt.data.event?.event_id;

    // 10. Confirm Booking for Created Event
    const booking = await api('/bookings', {
      method: 'POST',
      token: coordinatorToken,
      body: JSON.stringify({
        eventId: createdEventId,
        venueId: 'VEN004', // Seminar Hall, Cap 80
        bookingDate: '2026-11-23',
        startTime: '10:00',
        endTime: '15:00'
      })
    });
    assert('Confirm Venue Booking', booking.status === 201 && booking.data.booking?.status === 'CONFIRMED', booking.data.message);

    // 11. Overlapping Booking Conflict Prevention Test
    const conflictBooking = await api('/bookings', {
      method: 'POST',
      token: coordinatorToken,
      body: JSON.stringify({
        eventId: 'EVT002', // Different event
        venueId: 'VEN004', // Same venue
        bookingDate: '2026-11-23',
        startTime: '11:00', // Overlaps!
        endTime: '14:00'
      })
    });
    assert('Prevent Overlapping Confirmed Booking', conflictBooking.status === 409, 'Conflict properly rejected');

    // 12. Publish Event
    const publish = await api(`/events/${createdEventId}/status`, {
      method: 'PATCH',
      token: coordinatorToken,
      body: JSON.stringify({ status: 'PUBLISHED' })
    });
    assert('Publish Event', publish.status === 200);

    // 13. Student Registers for Published Event
    const register = await api(`/registrations/events/${createdEventId}/register`, {
      method: 'POST',
      token: newStudentToken
    });
    assert('Student Event Registration', register.status === 201 && register.data.registration?.qrToken, register.data.message);
    studentRegistrationId = register.data.registration?.registrationId;
    generatedQRToken = register.data.registration?.qrToken;

    // 14. Prevent Duplicate Student Registration
    const dupReg = await api(`/registrations/events/${createdEventId}/register`, {
      method: 'POST',
      token: newStudentToken
    });
    assert('Prevent Duplicate Registration', dupReg.status === 409, 'Duplicate registration blocked');

    // 15. Student QR Code Retrieval
    const qrData = await api(`/registrations/${studentRegistrationId}/qr`, {
      token: newStudentToken
    });
    assert('QR Code Generation & Retrieval', qrData.status === 200 && qrData.data.qrDataUrl?.startsWith('data:image/png'));

    // 16. Coordinator Scans QR Code at Entrance
    const scan = await api('/checkins/scan', {
      method: 'POST',
      token: coordinatorToken,
      body: JSON.stringify({
        qrToken: generatedQRToken,
        eventId: createdEventId,
        scannerId: 'ENTRANCE-SCANNER-01'
      })
    });
    assert('QR Code Check-in Verification', scan.status === 200 && scan.data.checkin?.checkinId, scan.data.message);

    // 17. Duplicate QR Check-in Rejection
    const dupScan = await api('/checkins/scan', {
      method: 'POST',
      token: coordinatorToken,
      body: JSON.stringify({
        qrToken: generatedQRToken,
        eventId: createdEventId
      })
    });
    assert('Duplicate QR Check-in Rejection', dupScan.status === 400 && dupScan.data.message.includes('Duplicate Check-in Rejected'));

    // 18. Footfall Dashboard Query
    const footfall = await api(`/checkins/events/${createdEventId}/footfall`, {
      token: coordinatorToken
    });
    assert('Event Footfall Tracking (100% Turnout)', footfall.status === 200 && footfall.data.metrics.actualFootfall === 1 && footfall.data.metrics.turnoutRate === 100);

    // 19. Coordinator Marks Event Completed
    const complete = await api(`/events/${createdEventId}/status`, {
      method: 'PATCH',
      token: coordinatorToken,
      body: JSON.stringify({ status: 'COMPLETED' })
    });
    assert('Mark Event Completed', complete.status === 200);

    // 20. Attended Student Submits Feedback
    const feedback = await api(`/feedback/events/${createdEventId}`, {
      method: 'POST',
      token: newStudentToken,
      body: JSON.stringify({
        overallRating: 5,
        organizationRating: 5,
        venueRating: 4,
        comments: 'Outstanding workshop, venue air conditioning was very comfortable!'
      })
    });
    assert('Attended Student Submits Feedback', feedback.status === 201 && feedback.data.feedback?.feedbackId, feedback.data.message);

    // 21. Prevent Duplicate Feedback
    const dupFeedback = await api(`/feedback/events/${createdEventId}`, {
      method: 'POST',
      token: newStudentToken,
      body: JSON.stringify({
        overallRating: 4,
        comments: 'Second feedback attempt'
      })
    });
    assert('Prevent Duplicate Feedback', dupFeedback.status === 400, 'Duplicate feedback blocked');

    // 22. Coordinator Analytics Overview
    const analytics = await api('/analytics/overview', {
      token: coordinatorToken
    });
    assert('Coordinator Analytics Dashboard', analytics.status === 200 && analytics.data.kpi.totalEvents > 0 && analytics.data.kpi.actualFootfall > 0);

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    server.close();
  }

  console.log('====================================================');
  console.log(`Backend API Test Results: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite();
