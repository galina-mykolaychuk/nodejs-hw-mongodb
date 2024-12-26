// server.js

const express = require('express');
const cors = require('cors');
const pino = require('pino');
const pinoHttp = require('pino-http');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const contactsRouter = require('./routers/contacts');
const authRouter = require('./routers/auth');
const swaggerMiddleware = require('./middlewares/swaggerDocs');
const swaggerDocument = require('../docs/swagger.json');
const initMongoConnection = require('./db/initMongoConnection');
const errorHandler = require('./middlewares/errorHandler');
const notFoundHandler = require('./middlewares/notFoundHandler');

async function setupServer() {
  await initMongoConnection();

  const app = express();
  app.use(cors());
  const logger = pino();
  app.use(pinoHttp({ logger }));
  app.use(express.json());
  app.use(cookieParser()); // Використання cookie-parser

  // Маршрути для контактів
  app.use('/contacts', contactsRouter);

  // Маршрути для аутентифікації
  app.use('/auth', authRouter);

  // Middleware для Swagger
  swaggerMiddleware(app, '/api-docs', swaggerDocument);

  // Middleware для неіснуючих маршрутів
  app.use(notFoundHandler);

  // Middleware для обробки помилок
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = setupServer;
