import categories from './categoriesRouter.js';
import games from './gamesRouter.js';
import customers from './customersRouter.js';

const init = (app) => {
    app.use(categories);
    app.use(games);
    app.use(customers);
};

export default init;
