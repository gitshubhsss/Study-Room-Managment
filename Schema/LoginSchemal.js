const Joi = require("joi");

const LoginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
}).required();

module.exports = LoginSchema;