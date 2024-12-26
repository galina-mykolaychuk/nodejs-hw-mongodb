// index.js

const setupServer = require('./server');
const initMongoConnection = require('./db/initMongoConnection');

(async () => {
  await initMongoConnection(); // Підключення до MongoDB
  setupServer(); // Запуск сервера
})();
