import { Router } from 'express';
import { UsersController } from './users.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.get('/profile', authenticate, UsersController.getProfile);
router.put('/profile', authenticate, UsersController.updateProfile);

export default router;
