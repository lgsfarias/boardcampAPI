import connection from '../config/database.js';

export default class Rentals {
    static getRentals = async (req, res) => {
        try {
            const rentals = await connection.query(
                `SELECT rentals.*, games.name AS "gameName", games."categoryId", customers.name AS "customerName", categories.name AS "categoryName"
                FROM rentals
                JOIN games ON rentals."gameId" = games.id
                JOIN categories ON games."categoryId" = categories.id
                JOIN customers ON rentals."customerId" = customers.id
                `
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
}
