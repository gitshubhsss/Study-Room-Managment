const Joi = require('joi');
const signUpShcema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().required(),
    seats: Joi.number().required(),
    fees: Joi.number().required(),
});
module.exports = signUpShcema;