import categories from './categoriesRouter.js';
import games from './gamesRouter.js';
import customers from './customersRouter.js';
import rentals from './rentalsRouter.js';

const init = (app) => {
    app.use(categories);
    app.use(games);
    app.use(customers);
    app.use(rentals);
};

export default init;
