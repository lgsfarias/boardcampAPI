import SqlString from 'sqlstring';
import connection from '../config/database.js';
import queryAux from '../utils/queryAux.js';

export default class Categories {
    static getCategories = async (req, res) => {
        const { offset, limit, order } = queryAux(res.locals.query);

        try {
            const query = 'SELECT * FROM categories';
            const categories = await connection.query(
                `${query}
                ${order}
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
