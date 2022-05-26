import { Router } from 'express';

import Rentals from '../controllers/rentalsController.js';

const router = Router();

router.get('/rentals', Rentals.getRentals);

export default router;
