// src/middlewares/swaggerDocs.js

const swaggerUi = require('swagger-ui-express');

module.exports = function swaggerMiddleware(app, route, swaggerDoc) {
  app.use(route, swaggerUi.serve, swaggerUi.setup(swaggerDoc));
};
