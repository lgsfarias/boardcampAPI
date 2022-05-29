import joi from 'joi';

const rentalSchema = joi.object({
    customerId: joi.number().integer().required(),
    gameId: joi.number().integer().required(),
    daysRented: joi.number().integer().min(1).required(),
});

const querySchema = joi.object({
    customerId: joi.number().integer(),
    gameId: joi.number().integer(),
    status: joi.string().valid('open', 'closed'),
    startDate: joi.date().iso(),
    offset: joi.number().integer().min(0),
    limit: joi.number().integer().min(1),
    order: joi
        .string()
        .valid(
            'id',
            'customerId',
            'gameId',
            'rentDate',
            'returnDate',
            'daysRented',
            'originalPrice'
        ),
    desc: joi.boolean(),
});

const metricsQuerySchema = joi.object({
    startDate: joi.date().iso(),
    endDate: joi.date().iso(),
});

export { rentalSchema, querySchema, metricsQuerySchema };
