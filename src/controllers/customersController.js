import SqlString from 'sqlstring';
import connection from '../config/database.js';

export default class Customers {
    static getCustomers = async (req, res) => {
        const offset = req.query.offset
            ? `OFFSET ${SqlString.escape(req.query.offset)}`
            : '';

        const limit = req.query.limit
            ? `LIMIT ${SqlString.escape(req.query.limit)}`
            : '';

        const orderBy = req.query.order
            ? `ORDER BY "${SqlString.escape(req.query.order).slice(1, -1)}" ${
                  req.query.desc === 'true' ? 'DESC' : 'ASC'
              }`
            : '';

        const filters = [];

        if (req.query.cpf) {
            filters.push(`cpf ILIKE ${SqlString.escape(`${req.query.cpf}%`)}`);
        }

        const where =
            filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

        try {
            const query = `SELECT customers.*, 
            COUNT (rentals.*) AS "rentalsCount"
            FROM customers
            LEFT JOIN rentals ON customers.id = rentals."customerId"
            ${where}
            GROUP BY customers.id`;

            const customers = await connection.query(
                `${query}
                ${orderBy}
                ${offset}
                ${limit}`
            );

            return res.status(200).json(customers.rows);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };

    static getCustomer = async (req, res) => {
        const { id } = req.params;
        try {
            const customer = await connection.query(
                `SELECT * FROM customers 
                WHERE id = $1`,
                [id]
            );

            if (customer.rows.length === 0) {
                return res.status(404).send('Customer not found');
            }

            return res.status(200).json(customer.rows[0]);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };

    static createCustomer = async (req, res) => {
        const { name, phone, cpf, birthday } = req.body;

        //TODO: melhorar as validaçoes
        if (typeof cpf !== 'string' || cpf.length !== 11) {
            return res
                .status(400)
                .send('CPF must be a string with 11 characters');
        }
        if (typeof name !== 'string' || name.length === 0) {
            return res.status(400).send('Name must be a string');
        }
        if (
            typeof phone !== 'string' ||
            phone.length < 10 ||
            phone.length > 11
        ) {
            return res
                .status(400)
                .send('Phone must be a string with 10 or 11 characters');
        }
        const dateRegex = new RegExp(/^\d{4}-\d{2}-\d{2}$/);
        if (typeof birthday !== 'string' || !dateRegex.test(birthday)) {
            return res
                .status(400)
                .send('Birthday must be a string with format YYYY-MM-DD');
        }
        try {
            const cpfExists = await connection.query(
                `SELECT * FROM customers
                WHERE cpf = $1`,
                [cpf]
            );
            if (cpfExists.rows.length > 0) {
                return res.status(409).send('CPF already exists');
            }

            const customer = await connection.query(
                `INSERT INTO customers (name,phone,cpf,birthday) 
                VALUES ($1,$2,$3,$4)`,
                [name, phone, cpf, birthday]
            );
            return res.status(201).json(customer.rows[0]);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };

    static updateCustomer = async (req, res) => {
        const { id } = req.params;
        const { name, phone, cpf, birthday } = req.body;

        //TODO: melhorar as validaçoes
        if (typeof cpf !== 'string' || cpf.length !== 11) {
            return res
                .status(400)
                .send('CPF must be a string with 11 characters');
        }
        if (typeof name !== 'string' || name.length === 0) {
            return res.status(400).send('Name must be a string');
        }
        if (
            typeof phone !== 'string' ||
            phone.length < 10 ||
            phone.length > 11
        ) {
            return res
                .status(400)
                .send('Phone must be a string with 10 or 11 characters');
        }

        //FIXME: verificar formatos aceitos
        // const dateRegex = new RegExp(/^\d{4}-\d{2}-\d{2}$/);
        // if (typeof birthday !== 'string' || !dateRegex.test(birthday)) {
        //     return res
        //         .status(400)
        //         .send('Birthday must be a string with format YYYY-MM-DD');
        // }

        try {
            const cpfExists = await connection.query(
                `SELECT * FROM customers
                WHERE cpf = $1 AND id != $2`,
                [cpf, id]
            );
            if (cpfExists.rows.length > 0) {
                return res.status(409).send('CPF already exists');
            }

            const customer = await connection.query(
                `UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4
                WHERE id = $5`,
                [name, phone, cpf, birthday, id]
            );
            return res.sendStatus(200);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };
}
