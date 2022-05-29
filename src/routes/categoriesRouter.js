import { Router } from 'express';

import Categories from '../controllers/categoriesController.js';
import CategoriesMiddleware from '../middlewares/categoriesMiddleware.js';

const router = Router();

router.get(
    '/categories',
    CategoriesMiddleware.checkQueryString,
    Categories.getCategories
);
router.post(
    '/categories',
    CategoriesMiddleware.bodyValidation,
    CategoriesMiddleware.checkIfCategoryExists,
    Categories.createCategory
);

export default router;
