import connection from '../config/database.js';
import { categorySchema, querySchema } from '../schemas/categorySchema.js';

export default class CategoriesMiddleware {
    static bodyValidation = (req, res, next) => {
        const { value, error } = categorySchema.validate(req.body, {
            abortEarly: false,
        });

        if (error) {
            return res.status(400).json({
                message: 'Validation failed',
                error: error.details.map((err) => err.message),
            });
        }

        res.locals.category = value;

        next();
    };

    static checkIfCategoryExists = async (req, res, next) => {
        const { name } = res.locals.category;

        try {
            const category = await connection.query(
                'SELECT * FROM categories WHERE name = $1',
                [name]
            );

            if (category.rows.length > 0) {
                return res.status(409).send('Category already exists');
            }

            next();
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };

    static checkQueryString = (req, res, next) => {
        const { value, error } = querySchema.validate(req.query, {
            abortEarly: false,
        });

        if (error) {
            return res.status(400).json({
                message: 'Validation failed',
                error: error.details.map((err) => err.message),
            });
        }

        res.locals.query = value;

        next();
    };
}
