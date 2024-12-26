// src/middlewares/validateBody.js

const Joi = require('joi');
const createHttpError = require('http-errors');

// Middleware для валідації тіла запиту
const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(createHttpError(400, error.details[0].message));
    }
    next();
  };
};

module.exports = validateBody;
