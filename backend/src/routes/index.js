import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import usersRoutes from '../modules/users/users.routes.js';
import clubsRoutes from '../modules/clubs/clubs.routes.js';
import venuesRoutes from '../modules/venues/venues.routes.js';
import eventsRoutes from '../modules/events/events.routes.js';
import bookingsRoutes from '../modules/bookings/bookings.routes.js';
import registrationsRoutes from '../modules/registrations/registrations.routes.js';
import checkinsRoutes from '../modules/checkins/checkins.routes.js';
import feedbackRoutes from '../modules/feedback/feedback.routes.js';
import analyticsRoutes from '../modules/analytics/analytics.routes.js';

const router = Router();

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'EVA Platform API Engine'
  });
});

// Mount modules
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/clubs', clubsRoutes);
router.use('/venues', venuesRoutes);
router.use('/events', eventsRoutes);
router.use('/bookings', bookingsRoutes);
router.use('/registrations', registrationsRoutes);
router.use('/checkins', checkinsRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
