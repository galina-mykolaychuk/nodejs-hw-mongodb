// src/services/auth.js

const bcrypt = require('bcrypt');
const createHttpError = require('http-errors');
const jwt = require('jsonwebtoken');
const User = require('../db/models/User');
const Session = require('../db/models/Session');
const validationSchemas = require('../validation/authSchemas');

// Функція для реєстрації нового користувача
const register = async ({ name, email, password }) => {
  // Використовуємо registerSchema
  const { error } = validationSchemas.registerSchema.validate({
    name,
    email,
    password,
  });
  if (error) {
    throw createHttpError(400, error.message);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return newUser;
};

// Функція для логіну користувача
const login = async ({ email, password }) => {
  // Використовуємо loginSchema
  const { error } = validationSchemas.loginSchema.validate({ email, password });
  if (error) {
    throw createHttpError(400, error.message);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid email or password');
  }

  return user;
};

// Функція для генерації токенів доступу і оновлення токенів
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  });

  return { accessToken, refreshToken };
};

// Функція для збереження сесії користувача в базі даних
const saveSession = async (userId, accessToken, refreshToken) => {
  await Session.findOneAndDelete({ userId });

  const session = new Session({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + 15 * 60 * 1000,
    refreshTokenValidUntil: Date.now() + 30 * 24 * 60 * 60 * 1000,
  });
  await session.save();
};

// Функція для отримання даних користувача за його ID
const getUserById = async (userId) => {
  return await User.findById(userId);
};

module.exports = {
  register,
  login,
  generateTokens,
  saveSession,
  getUserById,
};
