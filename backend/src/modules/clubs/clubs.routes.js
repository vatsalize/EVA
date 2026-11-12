import { Router } from 'express';
import { ClubsController } from './clubs.controller.js';

const router = Router();

router.get('/', ClubsController.getAllClubs);
router.get('/:id', ClubsController.getClubById);

export default router;
