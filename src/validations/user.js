const Joi = require("joi");

const userSchema = Joi.object({
  email: Joi.string()
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  password: Joi.string().trim().min(6).max(30).required(),
  role: Joi.string(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
});

function validateUserBody(req, res, next) {
  const { error } = userSchema.validate(req.body);
  if (error) {
    res.status(422);
    throw new Error(`validation error ${error}`);
  }
  next();
}

function validateForgotPasswordBody(req, res, next) {
  const { error } = forgotPasswordSchema.validate(req.body);
  if (error) {
    res.status(422);
    throw new Error(`validation error ${error}`);
  }
  next();
}

module.exports = { validateUserBody, validateForgotPasswordBody };
