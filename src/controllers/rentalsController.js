import connection from '../config/database.js';

export default class Rentals {
    static getRentals = async (req, res) => {
        const { customerId, gameId } = req.query;

        try {
            const query = `SELECT rentals.*, games.name AS "gameName", games."categoryId", customers.name AS "customerName", categories.name AS "categoryName"
            FROM rentals
            JOIN games ON rentals."gameId" = games.id
            JOIN categories ON games."categoryId" = categories.id
            JOIN customers ON rentals."customerId" = customers.id`;

            let rentals = null;
            console.log(rentals);
            if (customerId && gameId) {
                rentals = await connection.query(
                    `${query} WHERE rentals."customerId" = $1 AND rentals."gameId" = $2`,
                    [customerId, gameId]
                );
            } else if (customerId) {
                rentals = await connection.query(
                    `${query} WHERE rentals."customerId" = $1`,
                    [customerId]
                );
            } else if (gameId) {
                rentals = await connection.query(
                    `${query} WHERE rentals."gameId" = $1`,
                    [gameId]
                );
            } else {
                rentals = await connection.query(query);
            }

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
        const { customerId, gameId, daysRented } = req.body;
        if (daysRented < 1) {
            return res.status(400).send('Days rented must be greater than 0');
        }

        try {
            const game = await connection.query(
                'SELECT * FROM games WHERE id = $1',
                [gameId]
            );
            if (game.rows.length === 0) {
                return res.status(400).send('Game not found');
            }
            const originalPrice = game.rows[0].pricePerDay * daysRented;

            const customer = await connection.query(
                'SELECT * FROM customers WHERE id = $1',
                [customerId]
            );
            if (customer.rows.length === 0) {
                return res.status(400).send('Customer not found');
            }

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
}