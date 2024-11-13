// src/middlewares/notFoundHandler.js

const createError = require('http-errors');

module.exports = (req, res, next) => {
  next(createError(404, 'Route not found'));
};
