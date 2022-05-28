import { Router } from 'express';

import Games from '../controllers/gamesController.js';
import GamesMiddleware from '../middlewares/gamesMiddleware.js';

const router = Router();

router.get('/games', GamesMiddleware.checkQueryString, Games.getGames);
router.post(
    '/games',
    GamesMiddleware.bodyValidation,
    GamesMiddleware.checkIfGameExists,
    Games.createGame
);

export default router;
