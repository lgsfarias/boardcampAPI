import { Router } from 'express';

import Customers from '../controllers/customersController.js';

const router = Router();

router.get('/customers', Customers.getCustomers);
router.get('/customers/:id', Customers.getCustomer);
router.post('/customers', Customers.createCustomer);

export default router;
