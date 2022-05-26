import conection from '../config/database.js';

export default class Customers {
    static getCustomers = async (req, res) => {
        const { cpf } = req.query;
        try {
            const customers = await conection.query(
                `SELECT * FROM customers 
                WHERE cpf ~* $1`,
                [cpf ? `^${cpf}` : '']
            );
            return res.status(200).json(customers.rows);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };

    static getCustomer = async (req, res) => {
        const { id } = req.params;
        try {
            const customer = await conection.query(
                `SELECT * FROM customers 
                WHERE id = $1`,
                [id]
            );

            if (customer.rows.length === 0) {
                return res.status(404).send('Customer not found');
            }

            return res.status(200).json(customer.rows[0]);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };
}
