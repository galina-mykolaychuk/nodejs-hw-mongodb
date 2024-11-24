// src/middlewares/authenticate.js

const createHttpError = require('http-errors');
const { SessionsCollection } = require('../db/models/Session');
const { UserCollection } = require('../db/models/User');

const authenticate = async (req, res, next) => {
  try {
    // Логування початку запиту
    console.log('--- Middleware authenticate ---');
    console.log('Request Headers:', req.headers);

    // Отримуємо access токен з заголовка Authorization
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      console.log('Authorization header is missing');
      return next(createHttpError(401, 'Please provide authorization header'));
    }

    // Перевірка формату заголовка
    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      console.log('Authorization header format is incorrect');
      return next(createHttpError(401, 'Auth header should be of type Bearer'));
    }

    console.log('Extracted Token:', token);

    // Перевіряємо токен у базі даних (шукаємо сесію)
    const session = await SessionsCollection.findOne({ accessToken: token });
    if (!session) {
      console.log('Session not found for token:', token);
      return next(createHttpError(401, 'Session not found'));
    }

    console.log('Session Found:', session);

    // Перевірка, чи не прострочений токен
    const isAccessTokenExpired =
      new Date() > new Date(session.accessTokenValidUntil);
    if (isAccessTokenExpired) {
      console.log('Access token expired for session:', session);
      return next(createHttpError(401, 'Access token expired'));
    }

    // Отримуємо інформацію про користувача за допомогою session.userId
    const user = await UserCollection.findById(session.userId);
    if (!user) {
      console.log('User not found for session:', session);
      return next(createHttpError(401, 'User not found'));
    }

    console.log('User Found:', user);

    // Додаємо користувача до об'єкта запиту
    req.user = user;
    console.log('User added to request:', req.user);

    // Продовжуємо обробку запиту
    next();
  } catch (err) {
    console.error('Error in authenticate middleware:', err); // Логування помилки
    next(createHttpError(500, 'Internal server error'));
  }
};

module.exports = authenticate;
