import conection from '../config/database.js';

export default class Games {
    static getGames = async (req, res) => {
        try {
            const games = await conection.query(
                `SELECT games.*,
                categories.name AS "categoryName" 
                    FROM games 
                    JOIN categories ON games."categoryId" = categories.id`
            );
            return res.status(200).json(games.rows);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };
}
