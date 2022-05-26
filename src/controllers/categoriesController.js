import conection from '../config/database.js';

export default class Categories {
    static getCategories = async (req, res) => {
        try {
            const categories = await conection.query(
                'SELECT * FROM categories'
            );
            return res.status(200).json(categories.rows);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };

    static createCategory = async (req, res) => {
        const { name } = req.body;
        try {
            const category = await conection.query(
                'INSERT INTO categories (name) VALUES ($1)',
                [name]
            );
            return res.sendStatus(201);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };
}
