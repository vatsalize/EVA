import { Router } from 'express';
import { FeedbackController } from './feedback.controller.js';
import { authenticate, requireRole, verifyClubCoordinatorOwnership } from '../../middleware/auth.js';

const router = Router();

// Student feedback actions
router.post('/events/:id', authenticate, requireRole('STUDENT'), FeedbackController.submitFeedback);
router.get('/my-feedback', authenticate, requireRole('STUDENT'), FeedbackController.getMyFeedback);

// Coordinator feedback view
router.get('/events/:id', authenticate, requireRole('COORDINATOR'), verifyClubCoordinatorOwnership, FeedbackController.getEventFeedback);

export default router;
