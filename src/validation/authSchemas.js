// src/validation/authSchemas.js

const Joi = require('joi');

// Схема для реєстрації
const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Схема для логіну
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports.registerSchema = registerSchema;
module.exports.loginSchema = loginSchema;
