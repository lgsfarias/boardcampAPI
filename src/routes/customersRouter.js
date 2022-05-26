import { Router } from 'express';

import Customers from '../controllers/customersController.js';

const router = Router();

router.get('/customers', Customers.getCustomers);

export default router;
