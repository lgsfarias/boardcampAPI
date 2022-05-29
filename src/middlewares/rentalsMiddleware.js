import connection from '../config/database.js';
import {
    rentalSchema,
    querySchema,
    metricsQuerySchema,
} from '../schemas/rentalSchema.js';

export default class RentalsMiddleware {
    static bodyValidation = (req, res, next) => {
        const { value, error } = rentalSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: error.message,
            });
        }

        res.locals.rental = value;

        next();
    };

    static checkIfGameAndCustomerExists = async (req, res, next) => {
        const { gameId, customerId, daysRented } = res.locals.rental;

        try {
            const game = await connection.query(
                'SELECT * FROM games WHERE id = $1',
                [gameId]
            );
            if (game.rows.length === 0) {
                return res.status(400).send('Game not found');
            }

            const customer = await connection.query(
                'SELECT * FROM customers WHERE id = $1',
                [customerId]
            );
            if (customer.rows.length === 0) {
                return res.status(400).send('Customer not found');
            }

            const originalPrice = game.rows[0].pricePerDay * daysRented;

            res.locals.rental = {
                ...res.locals.rental,
                originalPrice,
            };

            next();
        } catch (err) {
            res.status(500).json({
                message: 'Error retrieving rentals',
            });
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

    static checkMetricsQueryString = (req, res, next) => {
        const { value, error } = metricsQuerySchema.validate(req.query, {
            abortEarly: false,
        });

        if (error) {
            return res.status(400).json({
                message: 'Validation failed',
                error: error.details.map((err) => err.message),
            });
        }

        res.locals.metricsQuery = value;

        next();
    };
}
