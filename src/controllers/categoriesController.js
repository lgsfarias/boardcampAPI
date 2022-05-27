import connection from '../config/database.js';

export default class Categories {
    static getCategories = async (req, res) => {
        const offset = req.query.offset || 0;
        const limit = req.query.limit || 10000;
        //FIXME: encontrar uma forma mais elegante pro limit
        try {
            const query = 'SELECT * FROM categories';
            const categories = await connection.query(
                `${query} OFFSET $1 LIMIT $2`,
                [offset, limit]
            );

            return res.status(200).json(categories.rows);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };

    static createCategory = async (req, res) => {
        const { name } = req.body;
        if (!name) {
            return res.status(400).send('Name is required');
        }
        try {
            const alrearyExists = await connection.query(
                'SELECT * FROM categories WHERE name = $1',
                [name]
            );
            if (alrearyExists.rows.length > 0) {
                return res.status(409).send('Category already exists');
            }

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
