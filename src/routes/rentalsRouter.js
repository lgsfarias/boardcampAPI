import { Router } from 'express';

import Rentals from '../controllers/rentalsController.js';
import RentalsMiddleware from '../middlewares/rentalsMiddleware.js';

const router = Router();

router.get('/rentals', RentalsMiddleware.checkQueryString, Rentals.getRentals);
router.post(
    '/rentals',
    RentalsMiddleware.bodyValidation,
    RentalsMiddleware.checkIfGameAndCustomerExists,
    Rentals.createRental
);
router.post('/rentals/:id/return', Rentals.returnRental);
router.delete('/rentals/:id', Rentals.deleteRental);
router.get(
    '/rentals/metrics',
    RentalsMiddleware.checkMetricsQueryString,
    Rentals.getMetrics
);

export default router;
