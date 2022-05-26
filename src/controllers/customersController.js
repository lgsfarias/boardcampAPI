import conection from '../config/database.js';

export default class Customers {
    static getCustomers = async (req, res) => {
        const { cpf } = req.query;
        try {
            const customers = await conection.query(
                `SELECT * FROM customers 
                WHERE cpf LIKE $1`,
                [cpf ? `${cpf}%` : '']
            );
            return res.status(200).json(customers.rows);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };
}
