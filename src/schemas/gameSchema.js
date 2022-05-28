import joi from 'joi';

const gameSchema = joi.object({
    name: joi.string().required(),
    image: joi.string().required(),
    stockTotal: joi.number().integer().min(1).required(),
    categoryId: joi.number().integer().required(),
    pricePerDay: joi.number().integer().min(1).required(),
});

const querySchema = joi.object({
    offset: joi.number().integer().min(0),
    limit: joi.number().integer().min(1),
    order: joi
        .string()
        .valid(
            'id',
            'name',
            'stockTotal',
            'categoryId',
            'pricePerday',
            'categoryName',
            'rentalsCount'
        ),
    desc: joi.boolean(),
});

export { gameSchema, querySchema };
