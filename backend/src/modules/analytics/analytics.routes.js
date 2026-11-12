import { Router } from 'express';
import { AnalyticsController } from './analytics.controller.js';
import { authenticate, requireRole, verifyClubCoordinatorOwnership } from '../../middleware/auth.js';

const router = Router();

// All analytics routes require authenticated Club Coordinator
router.use(authenticate, requireRole('COORDINATOR'), verifyClubCoordinatorOwnership);

router.get('/overview', AnalyticsController.getOverview);
router.get('/events', AnalyticsController.getEventComparison);
router.get('/venues', AnalyticsController.getVenueUtilization);
router.get('/feedback', AnalyticsController.getFeedbackAnalytics);

export default router;
