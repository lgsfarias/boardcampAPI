import express, { json } from 'express';
import cors from 'cors';

import init from './routes/index.js';

const app = express();
app.use(json());
app.use(cors());
init(app);

app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

export default app;
