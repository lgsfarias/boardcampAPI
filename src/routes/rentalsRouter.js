import { Router } from 'express';

import Rentals from '../controllers/rentalsController.js';

const router = Router();

router.get('/rentals', Rentals.getRentals);
router.post('/rentals', Rentals.createRental);
router.post('/rentals/:id/return', Rentals.returnRental);

export default router;
