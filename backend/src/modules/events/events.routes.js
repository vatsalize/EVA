import { Router } from 'express';
import { EventsController } from './events.controller.js';
import { authenticate, requireRole, verifyClubCoordinatorOwnership } from '../../middleware/auth.js';

const router = Router();

// Public / Student discovery
router.get('/', EventsController.getPublishedEvents);
router.get('/my-events', authenticate, requireRole('COORDINATOR'), verifyClubCoordinatorOwnership, EventsController.getMyEvents);
router.get('/:id', (req, res, next) => {
  // Optional auth middleware so students can get personalized registration status
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticate(req, res, next);
  }
  next();
}, EventsController.getEventById);

// Coordinator actions
router.post('/', authenticate, requireRole('COORDINATOR'), verifyClubCoordinatorOwnership, EventsController.createEvent);
router.put('/:id', authenticate, requireRole('COORDINATOR'), verifyClubCoordinatorOwnership, EventsController.updateEvent);
router.patch('/:id/status', authenticate, requireRole('COORDINATOR'), verifyClubCoordinatorOwnership, EventsController.updateStatus);

export default router;
