// src/controllers/auth.js

const authService = require('../services/auth');
const createHttpError = require('http-errors');
const Session = require('../db/models/Session');
const jwt = require('jsonwebtoken');

// Реєстрація нового користувача
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw createHttpError(
        400,
        'All fields (name, email, password) are required.',
      );
    }

    const newUser = await authService.register({ name, email, password });

    res.status(201).json({
      status: 'success',
      message: 'Successfully registered a user!',
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Логін користувача
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createHttpError(400, 'Email and password are required.');
    }

    const user = await authService.login({ email, password });
    const { accessToken, refreshToken } = authService.generateTokens(user._id);

    await Session.findOneAndDelete({ userId: user._id });

    const session = new Session({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil: Date.now() + 15 * 60 * 1000,
      refreshTokenValidUntil: Date.now() + 30 * 24 * 60 * 60 * 1000,
    });
    await session.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 'success',
      message: 'Successfully logged in a user!',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Оновлення сесії за допомогою рефреш токена
const refreshSession = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token is missing or invalid.');
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const userId = decoded.userId;

    const user = await authService.getUserById(userId);
    if (!user) {
      throw createHttpError(404, 'User not found.');
    }

    const { accessToken, refreshToken: newRefreshToken } =
      authService.generateTokens(user._id);

    await Session.findOneAndDelete({ userId: user._id });

    const session = new Session({
      userId: user._id,
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil: Date.now() + 15 * 60 * 1000,
      refreshTokenValidUntil: Date.now() + 30 * 24 * 60 * 60 * 1000,
    });
    await session.save();

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 'success',
      message: 'Successfully refreshed a session!',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Логаут користувача
const logoutUser = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    // Перевірка наявності refresh токена
    if (!refreshToken) {
      throw createHttpError(401, 'No refresh token provided.');
    }

    // Видалення сесії за refresh токеном
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const sessionId = decoded.userId;

    await Session.findOneAndDelete({ userId: sessionId });

    // Видалення refresh токена з cookies
    res.clearCookie('refreshToken', { httpOnly: true });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
};
