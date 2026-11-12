import { Router } from 'express';
import { BookingsController } from './bookings.controller.js';
import { authenticate, requireRole, verifyClubCoordinatorOwnership } from '../../middleware/auth.js';

const router = Router();

// Availability and Recommendations can be checked during event planning
router.post('/availability', authenticate, BookingsController.checkAvailability);
router.post('/recommendations', authenticate, BookingsController.getRecommendations);

// Coordinator only actions
router.post('/', authenticate, requireRole('COORDINATOR'), verifyClubCoordinatorOwnership, BookingsController.confirmBooking);
router.get('/my-bookings', authenticate, requireRole('COORDINATOR'), verifyClubCoordinatorOwnership, BookingsController.getMyBookings);
router.delete('/:id', authenticate, requireRole('COORDINATOR'), verifyClubCoordinatorOwnership, BookingsController.cancelBooking);

export default router;
