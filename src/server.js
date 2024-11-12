// server.js

const express = require('express');
const cors = require('cors');
const pino = require('pino');
const pinoHttp = require('pino-http');
const contactsRouter = require('./routes/contacts'); // Імпортуємо роут для контактів
const initMongoConnection = require('./db/initMongoConnection'); // Імпорт підключення до MongoDB

// Функція для налаштування сервера
async function setupServer() {
  await initMongoConnection(); // Підключення до MongoDB

  const app = express(); // Створюємо сервер

  // Налаштовуємо CORS
  app.use(cors());

  // Налаштовуємо логер pino
  const logger = pino();
  app.use(pinoHttp({ logger }));

  // Використовуємо JSON парсер для обробки запитів
  app.use(express.json());

  // Додаємо маршрут для контактів
  app.use('/contacts', contactsRouter);

  // Маршрут для обробки неіснуючих роутів
  app.use((req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  // Встановлюємо порт, використовуючи змінну PORT або значення за замовчуванням
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = setupServer;
