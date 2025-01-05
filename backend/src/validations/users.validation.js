const Joi = require("joi");
const { passwordCheck, emailCheck } = require("./custom.validation");

const register = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().custom(emailCheck).required(),
    password: Joi.string().min(8).custom(passwordCheck).required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().custom(emailCheck).required(),
    password: Joi.string().custom(passwordCheck).required(),
  }),
};

module.exports = {
  login,
  register,
};
