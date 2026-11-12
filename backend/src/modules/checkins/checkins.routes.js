import { Router } from 'express';
import { CheckinsController } from './checkins.controller.js';
import { authenticate, requireRole, verifyClubCoordinatorOwnership } from '../../middleware/auth.js';

const router = Router();

// Coordinator QR scanner action
router.post('/scan', authenticate, requireRole('COORDINATOR'), verifyClubCoordinatorOwnership, CheckinsController.scanQRCode);

// Event footfall dashboard
router.get('/events/:id/footfall', authenticate, requireRole('COORDINATOR'), verifyClubCoordinatorOwnership, CheckinsController.getEventFootfall);

export default router;
