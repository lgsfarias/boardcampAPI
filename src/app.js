import express, { json } from 'express';
import cors from 'cors';
import conection from './config/database.js';

const app = express();
app.use(json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

export default app;
