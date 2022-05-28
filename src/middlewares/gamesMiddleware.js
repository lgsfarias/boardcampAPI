import connection from '../config/database.js';
import { gameSchema, querySchema } from '../schemas/gameSchema.js';

export default class GamesMiddleware {
    static bodyValidation = async (req, res, next) => {
        const { value, error } = gameSchema.validate(req.body, {
            abortEarly: false,
        });

        if (error) {
            return res.status(400).json({
                message: 'Validation failed',
                error: error.details.map((err) => err.message),
            });
        }

        res.locals.game = value;

        next();
    };

    static checkIfGameExists = async (req, res, next) => {
        const { name, categoryId } = res.locals.game;

        try {
            const categoryExists = await connection.query(
                'SELECT * FROM categories WHERE id = $1',
                [categoryId]
            );
            if (categoryExists.rows.length === 0) {
                return res.status(400).send('Category not found');
            }

            const gameExists = await connection.query(
                'SELECT * FROM games WHERE name = $1',
                [name]
            );
            if (gameExists.rows.length > 0) {
                return res.status(409).send('Game already exists');
            }

            next();
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };

    static checkQueryString = async (req, res, next) => {
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
