import joi from 'joi';

const customerSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().min(10).max(11).required(),
    cpf: joi.string().length(11).required(),
    birthday: joi.date().iso().required(),
});

const querySchema = joi.object({
    offset: joi.number().integer().min(0),
    limit: joi.number().integer().min(1),
    order: joi
        .string()
        .valid('id', 'name', 'phone', 'cpf', 'birthday', 'rentalsCount'),
    desc: joi.boolean(),
});

export { customerSchema, querySchema };
