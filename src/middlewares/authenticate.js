// src/middlewares/authenticate.js

const createHttpError = require('http-errors');
const Session = require('../db/models/Session');
const User = require('../db/models/User');

// Middleware для автентифікації користувачів
const authenticate = async (req, res, next) => {
  try {
    console.log('--- Middleware authenticate ---');
    console.log('Request Headers:', req.headers);

    // Отримуємо заголовок Authorization
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      console.log('Authorization header is missing');
      return next(createHttpError(401, 'Authorization header is missing'));
    }

    // Перевіряємо формат заголовка (повинен починатися з Bearer)
    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      console.log('Authorization header format is incorrect');
      return next(
        createHttpError(
          401,
          'Authorization header must be in the format Bearer <token>',
        ),
      );
    }

    console.log('Extracted Token:', token);

    // Шукаємо сесію в базі даних за токеном
    const session = await Session.findOne({ accessToken: token });
    if (!session) {
      console.log('Session not found for token:', token);
      return next(createHttpError(401, 'Session not found'));
    }

    console.log('Session Found:', session);

    // Перевіряємо, чи не прострочений токен
    const isAccessTokenExpired =
      new Date() > new Date(session.accessTokenValidUntil);
    if (isAccessTokenExpired) {
      console.log('Access token expired for session:', session);
      return next(createHttpError(401, 'Access token expired'));
    }

    // Шукаємо користувача в базі даних за session.userId
    const user = await User.findById(session.userId);
    if (!user) {
      console.log('User not found for session:', session);
      return next(createHttpError(401, 'User not found'));
    }

    console.log('User Found:', user);

    // Додаємо користувача до об'єкта запиту
    req.user = user;
    console.log('User added to request:', req.user);

    next();
  } catch (err) {
    console.error('Error in authenticate middleware:', err); // Логування помилки
    next(createHttpError(500, 'Internal server error'));
  }
};

module.exports = authenticate;
