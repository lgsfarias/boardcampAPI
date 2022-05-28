import SqlString from 'sqlstring';
import connection from '../config/database.js';

export default class Customers {
    static getCustomers = async (req, res) => {
        const offset = res.locals.query.offset
            ? `OFFSET ${SqlString.escape(res.locals.query.offset)}`
            : '';

        const limit = res.locals.query.limit
            ? `LIMIT ${SqlString.escape(res.locals.query.limit)}`
            : '';

        const orderBy = res.locals.query.order
            ? `ORDER BY "${SqlString.escape(res.locals.query.order).slice(
                  1,
                  -1
              )}" ${res.locals.query.desc === 'true' ? 'DESC' : 'ASC'}`
            : '';

        const filters = [];

        if (res.locals.query.cpf) {
            filters.push(
                `cpf ILIKE ${SqlString.escape(`${res.locals.query.cpf}%`)}`
            );
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
        const { name, phone, cpf, birthday } = res.locals.customer;

        try {
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
        const { name, phone, cpf, birthday } = res.locals.customer;

        try {
            await connection.query(
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
