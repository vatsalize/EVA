import { Router } from 'express';
import { VenuesController } from './venues.controller.js';

const router = Router();

router.get('/', VenuesController.getAllVenues);
router.get('/:id', VenuesController.getVenueById);

export default router;
