import conection from '../config/database.js';

export default class Games {
    static getGames = async (req, res) => {
        const { name } = req.query;
        try {
            const games = await conection.query(
                `SELECT games.*,
                categories.name AS "categoryName" 
                    FROM games 
                    JOIN categories ON games."categoryId" = categories.id
                    WHERE games.name ~* $1`,
                [name ? name : '']
            );
            return res.status(200).json(games.rows);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };
}
