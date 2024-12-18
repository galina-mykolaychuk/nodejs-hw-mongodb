// src/controllers/auth.js

const crypto = require('crypto');
const createHttpError = require('http-errors');
const nodemailer = require('nodemailer');
const Session = require('../db/models/Session');
const authService = require('../services/auth'); // Використання сервісів у контролері
const validateBody = require('../middlewares/validateBody');
const validationSchemas = require('../validation/authSchemas');

// Генерація токену через crypto
const generateToken = (length = 64) =>
  crypto.randomBytes(length).toString('hex');

// Транспортер для надсилання листів
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Реєстрація нового користувача
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const newUser = await authService.register({ name, email, password });

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
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

    const user = await authService.login({ email, password });

    const { accessToken, refreshToken } = authService.generateTokens(); // Використання сервісів для генерації токенів

    await authService.saveSession(user._id, accessToken, refreshToken); // Використання сервісів для збереження сесії

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 200,
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

    const session = await Session.findOne({ refreshToken });

    if (!session || session.refreshTokenValidUntil < Date.now()) {
      throw createHttpError(401, 'Refresh token is expired or invalid.');
    }

    const accessToken = generateToken();
    const newRefreshToken = generateToken();

    await authService.saveSession(session.userId, accessToken, newRefreshToken); // Використання сервісів для збереження сесії

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 200,
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

    if (!refreshToken) {
      throw createHttpError(401, 'No refresh token provided.');
    }

    await Session.findOneAndDelete({ refreshToken });

    res.clearCookie('refreshToken', { httpOnly: true });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Надсилання email для скидання пароля
const sendResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await authService.findUserByEmail(email); // Знайти користувача за email

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const resetToken = generateToken(32);

    await authService.saveResetToken(user._id, resetToken); // Зберегти токен для скидання пароля

    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Password Reset',
      html: `<p>Click the link below to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been sent.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// Middleware для валідації
const validateRegisterBody = validateBody(validationSchemas.registerSchema);
const validateLoginBody = validateBody(validationSchemas.loginSchema);

module.exports = {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
  sendResetEmail,
  validateRegisterBody,
  validateLoginBody,
};
