import { Router } from 'express';

import Categories from '../controllers/categoriesController.js';

const router = Router();

router.get('/categories', Categories.getCategories);
router.post('/categories', Categories.createCategory);

export default router;
