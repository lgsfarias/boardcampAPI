import { Router } from 'express';

import Categories from '../controllers/categoriesController.js';
import CategoriesMiddlewares from '../middlewares/categoriesMiddlewares.js';

const router = Router();

router.get(
    '/categories',
    CategoriesMiddlewares.checkQueryString,
    Categories.getCategories
);
router.post(
    '/categories',
    CategoriesMiddlewares.bodyValidation,
    CategoriesMiddlewares.checkIfCategoryExists,
    Categories.createCategory
);

export default router;
