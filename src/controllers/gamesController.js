import SqlString from 'sqlstring';
import connection from '../config/database.js';
import queryAux from '../utils/queryAux.js';

export default class Games {
    static getGames = async (req, res) => {
        const { offset, limit, order } = queryAux(res.locals.query);

        const filters = [];

        if (res.locals.query.name) {
            filters.push(
                `games.name ILIKE ${SqlString.escape(
                    `${res.locals.query.name}%`
                )}`
            );
        }

        const where =
            filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

        try {
            const query = `SELECT games.*, 
            categories.name AS "categoryName",
            COUNT (rentals.*) AS "rentalsCount"
            FROM games
            LEFT JOIN categories ON games."categoryId" = categories.id
            LEFT JOIN rentals ON games.id = rentals."gameId"
            ${where}
            GROUP BY games.id, categories.name`;

            const games = await connection.query(
                `${query}
                ${order}
                ${offset}
                ${limit}`
            );

            return res.status(200).json(games.rows);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };

    static createGame = async (req, res) => {
        const { name, image, stockTotal, categoryId, pricePerDay } =
            res.locals.game;

        try {
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
