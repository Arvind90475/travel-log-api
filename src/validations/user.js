const Joi = require("joi");

const user = Joi.object({
  email: Joi.string()
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  password: Joi.string().min(6).max(30).required(),
  role: Joi.string(),
});

module.exports = {
  user,
};
