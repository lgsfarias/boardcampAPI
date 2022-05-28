import SqlString from 'sqlstring';
import connection from '../config/database.js';

export default class Games {
    static getGames = async (req, res) => {
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
                ${orderBy}
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
