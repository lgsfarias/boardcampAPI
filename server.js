import chalk from 'chalk';
import dotenv from 'dotenv';

import app from './src/app.js';

dotenv.config();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(
        chalk.bold.green(`Server is running on : http://localhost:${PORT}`)
    );
});
