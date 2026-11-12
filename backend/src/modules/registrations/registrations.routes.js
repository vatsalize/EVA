import { Router } from 'express';
import { RegistrationsController } from './registrations.controller.js';
import { authenticate, requireRole } from '../../middleware/auth.js';

const router = Router();

// Student routes
router.post('/events/:id/register', authenticate, requireRole('STUDENT'), RegistrationsController.registerForEvent);
router.get('/my-registrations', authenticate, requireRole('STUDENT'), RegistrationsController.getMyRegistrations);
router.delete('/:id', authenticate, requireRole('STUDENT'), RegistrationsController.cancelRegistration);

// Shared / QR preview
router.get('/:id/qr', authenticate, RegistrationsController.getQRCode);

// Coordinator routes
router.get('/events/:id', authenticate, requireRole('COORDINATOR'), RegistrationsController.getEventRegistrations);

export default router;
