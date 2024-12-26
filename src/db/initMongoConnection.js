// db/initMongoConnection.js

require('dotenv').config();
const mongoose = require('mongoose');

const initMongoConnection = async () => {
  try {
    const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } =
      process.env;

    const connectionString = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

    console.log(
      'Attempting to connect to MongoDB with connection string: ',
      connectionString,
    ); // Логування рядка підключення

    await mongoose.connect(connectionString);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    console.error(error); // Логуємо деталі помилки
  }
};

// Експорт функції
module.exports = initMongoConnection;
