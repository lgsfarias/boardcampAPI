import connection from '../config/database.js';
import { customerSchema, querySchema } from '../schemas/customerSchema.js';

export default class CustomerMiddleware {
    static bodyValidation = (req, res, next) => {
        const { value, error } = customerSchema.validate(req.body, {
            abortEarly: false,
        });

        if (error) {
            return res.status(400).json({
                message: 'Validation failed',
                error: error.details.map((err) => err.message),
            });
        }

        res.locals.customer = value;

        next();
    };

    static checkIfCustomerExists = async (req, res, next) => {
        const { cpf } = res.locals.customer;

        try {
            const cpfExists = await connection.query(
                `SELECT * FROM customers
            WHERE cpf = $1`,
                [cpf]
            );
            if (cpfExists.rows.length > 0) {
                return res.status(409).send('CPF already exists');
            }

            next();
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };

    static checkIfCpfExists = async (req, res, next) => {
        const { id } = req.params;
        const { cpf } = res.locals.customer;

        try {
            const cpfExists = await connection.query(
                `SELECT * FROM customers
                WHERE cpf = $1 AND id != $2`,
                [cpf, id]
            );
            if (cpfExists.rows.length > 0) {
                return res.status(409).send('CPF already exists');
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
