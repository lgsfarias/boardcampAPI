import connection from '../config/database.js';

export default class Games {
    static getGames = async (req, res) => {
        const offset = req.query.offset || 0;
        const limit = req.query.limit || 10000;
        const name = req.query.name || '';

        try {
            const games = await connection.query(
                `SELECT games.*,
                categories.name AS "categoryName" 
                    FROM games 
                    JOIN categories ON games."categoryId" = categories.id
                    WHERE games.name LIKE $1
                    OFFSET $2 LIMIT $3`,
                [`%${name}%`, offset, limit]
            );
            return res.status(200).json(games.rows);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };

    static createGame = async (req, res) => {
        const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
        if (!name || !(stockTotal > 0) || !(pricePerDay > 0)) {
            //TODO: melhorar as validaçoes
            return res
                .status(400)
                .send('Name, stockTotal and pricePerDay are required');
        }
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

            await connection.query(
                'INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)',
                [name, image, stockTotal, categoryId, pricePerDay]
            );
            return res.sendStatus(201);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };
}
