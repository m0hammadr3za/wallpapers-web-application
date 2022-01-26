const Joi = require("joi");

const passwordRegEx =
    /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,18})/;

const userSchema = Joi.object({
    username: Joi.string().trim().alphanum().min(3).max(96).required(),
    email: Joi.string()
        .trim()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    password: Joi.string().pattern(passwordRegEx).required(),
});

const userPasswordSchema = Joi.string().pattern(passwordRegEx).required();

module.exports = {
    userSchema,
    userPasswordSchema,
};
