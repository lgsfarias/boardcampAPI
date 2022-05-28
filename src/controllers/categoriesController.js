import SqlString from 'sqlstring';
import connection from '../config/database.js';

export default class Categories {
    static getCategories = async (req, res) => {
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

        try {
            const query = 'SELECT * FROM categories';
            const categories = await connection.query(
                `${query}
                ${orderBy}
                ${offset}
                ${limit}`
            );

            return res.status(200).json(categories.rows);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };

    static createCategory = async (req, res) => {
        const { name } = res.locals.category;
        try {
            await connection.query(
                'INSERT INTO categories (name) VALUES ($1)',
                [name]
            );
            return res.sendStatus(201);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };
}
