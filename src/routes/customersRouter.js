import { Router } from 'express';

import Customers from '../controllers/customersController.js';
import CustomersMiddleware from '../middlewares/customersMiddleware.js';

const router = Router();

router.get(
    '/customers',
    CustomersMiddleware.checkQueryString,
    Customers.getCustomers
);
router.get('/customers/:id', Customers.getCustomer);
router.post(
    '/customers',
    CustomersMiddleware.bodyValidation,
    CustomersMiddleware.checkIfCustomerExists,
    Customers.createCustomer
);
router.put(
    '/customers/:id',
    CustomersMiddleware.bodyValidation,
    CustomersMiddleware.checkIfCpfExists,
    Customers.updateCustomer
);

export default router;
