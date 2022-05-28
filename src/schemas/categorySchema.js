import joi from 'joi';

const categorySchema = joi.object({
    name: joi.string().required(),
});

const querySchema = joi.object({
    offset: joi.number().integer().min(0),
    limit: joi.number().integer().min(1),
    order: joi.string().regex(/^[a-zA-Z0-9_]+$/),
    desc: joi.boolean(),
});

export { categorySchema, querySchema };
