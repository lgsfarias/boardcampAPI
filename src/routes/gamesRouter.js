import { Router } from 'express';

import Games from '../controllers/gamesController.js';

const router = Router();

router.get('/games', Games.getGames);

export default router;
