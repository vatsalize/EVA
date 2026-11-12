import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

// Student routes
router.post('/student/signup', AuthController.studentSignup);
router.post('/student/login', AuthController.studentLogin);

// Coordinator routes
router.post('/coordinator/login', AuthController.coordinatorLogin);

// Protected routes
router.get('/me', authenticate, AuthController.getMe);
router.post('/change-password', authenticate, AuthController.changePassword);

export default router;
