import joi from 'joi';

const categorySchema = joi.object({
    name: joi.string().required(),
});

const querySchema = joi.object({
    offset: joi.number().integer().min(0),
    limit: joi.number().integer().min(1),
    order: joi.string().valid('id', 'name'),
    desc: joi.boolean(),
});

export { categorySchema, querySchema };
