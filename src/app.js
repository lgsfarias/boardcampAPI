import express, { json } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import init from './routes/index.js';

const app = express();
app.use(json());
app.use(cors());
app.use(morgan('dev'));
init(app);

app.get('/', (req, res) => {
    res.send('BoardCamp API');
});

export default app;
