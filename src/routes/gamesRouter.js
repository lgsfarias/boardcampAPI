import { Router } from 'express';

import Games from '../controllers/gamesController.js';

const router = Router();

router.get('/games', Games.getGames);
router.post('/games', Games.createGame);

export default router;
