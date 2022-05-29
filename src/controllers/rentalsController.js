import moment from 'moment';
import SqlString from 'sqlstring';
import connection from '../config/database.js';
import queryAux from '../utils/queryAux.js';

export default class Rentals {
    static getRentals = async (req, res) => {
        const { customerId, gameId, status, startDate } = res.locals.query;
        const { offset, limit, orderBy } = queryAux(res.locals.query);

        const filters = [];

        if (customerId) {
            filters.push(
                `rentals."customerId" = ${SqlString.escape(customerId)}`
            );
        }

        if (gameId) {
            filters.push(`rentals."gameId" = ${SqlString.escape(gameId)}`);
        }

        if (status) {
            if (status === 'open') {
                filters.push(`rentals."returnDate" IS NULL`);
            }
            if (status === 'closed') {
                filters.push(`rentals."returnDate" IS NOT NULL`);
            }
        }

        if (startDate) {
            filters.push(
                `rentals."rentDate" >= ${SqlString.escape(startDate)}`
            );
        }

        const where =
            filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

        try {
            const query = `SELECT rentals.*, games.name AS "gameName", games."categoryId", customers.name AS "customerName", categories.name AS "categoryName"
            FROM rentals
            JOIN games ON rentals."gameId" = games.id
            JOIN categories ON games."categoryId" = categories.id
            JOIN customers ON rentals."customerId" = customers.id`;

            const rentals = await connection.query(
                `${query} 
                ${where} 
                ${orderBy} 
                ${offset} 
                ${limit}`
            );

            const rows = rentals.rows.map(
                ({
                    id,
                    customerId,
                    gameId,
                    rentDate,
                    daysRented,
                    returnDate,
                    originalPrice,
                    delayFee,
                    customerName,
                    gameName,
                    categoryId,
                    categoryName,
                }) => ({
                    id,
                    customerId,
                    gameId,
                    rentDate,
                    daysRented,
                    returnDate,
                    originalPrice,
                    delayFee,
                    customer: {
                        id: customerId,
                        name: customerName,
                    },
                    game: {
                        id: gameId,
                        name: gameName,
                        categoryId,
                        categoryName,
                    },
                })
            );
            res.status(200).json(rows);
        } catch (err) {
            res.status(500).json({
                message: 'Error retrieving rentals',
            });
        }
    };

    static createRental = async (req, res) => {
        const { customerId, gameId, daysRented, originalPrice } =
            res.locals.rental;

        try {
            await connection.query(
                `INSERT INTO rentals 
                ("customerId", 
                "gameId", 
                "rentDate", 
                "daysRented", 
                "returnDate", 
                "originalPrice", 
                "delayFee") 
                VALUES ($1, $2, $3, $4, null, $5, null)`,
                [customerId, gameId, new Date(), daysRented, originalPrice]
            );

            res.sendStatus(201);
        } catch (err) {
            res.status(500).json({
                message: 'Error creating rental',
            });
        }
    };

    static returnRental = async (req, res) => {
        const rentalId = parseInt(req.params.id);

        try {
            const rental = await connection.query(
                'SELECT * FROM rentals WHERE id = $1',
                [rentalId]
            );
            if (rental.rows.length === 0) {
                return res.status(400).send('Rental not found');
            }
            if (rental.rows[0].returnDate) {
                return res.status(400).send('Game already returned');
            }

            const { rentDate, originalPrice, daysRented } = rental.rows[0];
            const pricePerDay = originalPrice / daysRented;
            const returnDate = new Date();
            const returnDateMoment = moment(returnDate);
            const rentDateMoment = moment(rentDate);
            const dateSuposedToBeReturned = rentDateMoment.add(
                daysRented,
                'days'
            );
            const daysDelayed = returnDateMoment.diff(
                dateSuposedToBeReturned,
                'days'
            );
            const delayFee = daysDelayed > 0 ? daysDelayed * pricePerDay : 0;

            await connection.query(
                `UPDATE rentals 
                SET "returnDate" = $1, 
                "delayFee" = $2 
                WHERE id = $3`,
                [returnDate, delayFee, rentalId]
            );

            res.sendStatus(200);
        } catch (err) {
            res.status(500).json({
                message: 'Error returning game',
            });
        }
    };

    static deleteRental = async (req, res) => {
        const rentalId = parseInt(req.params.id);

        try {
            const rental = await connection.query(
                'SELECT * FROM rentals WHERE id = $1',
                [rentalId]
            );
            if (rental.rows.length === 0) {
                return res.status(400).send('Rental not found');
            }
            if (rental.rows[0].returnDate) {
                return res.status(400).send('Game already returned');
            }

            await connection.query(`DELETE FROM rentals WHERE id = $1`, [
                rentalId,
            ]);

            res.sendStatus(200);
        } catch (err) {
            res.status(500).json({
                message: 'Error deleting rental',
            });
        }
    };

    static getMetrics = async (req, res) => {
        const { startDate, endDate } = res.locals.metricsQuery;

        const filters = [];

        if (startDate) {
            filters.push(
                `rentals."rentDate" >= ${SqlString.escape(startDate)}`
            );
        }

        if (endDate) {
            filters.push(`rentals."rentDate" <= ${SqlString.escape(endDate)}`);
        }

        const where =
            filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

        try {
            const query = `SELECT
            COUNT(rentals.id) AS "totalRentals",
            SUM(rentals."originalPrice") AS "totalRevenue",
            SUM(rentals."delayFee") AS "totalDelayFee"
            FROM rentals`;

            const metrics = await connection.query(
                `${query} 
                ${where}`
            );

            const rows = metrics.rows.map(
                ({ totalRentals, totalRevenue, totalDelayFee }) => ({
                    revenue: 1 * totalRevenue + 1 * totalDelayFee,
                    rentals: 1 * totalRentals,
                    average:
                        totalRentals > 0
                            ? (1 * totalRevenue + 1 * totalDelayFee) /
                              totalRentals
                            : 0,
                })
            );

            res.status(200).json(rows[0]);
        } catch (err) {
            res.status(500).json({
                message: 'Error retrieving metrics',
            });
        }
    };
}
