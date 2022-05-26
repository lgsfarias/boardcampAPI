import categories from './categoriesRouter.js';

const init = (app) => {
    app.use(categories);
};

export default init;
