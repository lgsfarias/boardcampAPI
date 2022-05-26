import categories from './categoriesRouter.js';
import games from './gamesRouter.js';

const init = (app) => {
    app.use(categories);
    app.use(games);
};

export default init;
