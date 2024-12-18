// src/middlewares/errorHandler.js

module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    status,
    message: 'Something went wrong',
    data: err.message || 'Internal Server Error',
  });
};
