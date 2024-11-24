// src/services/auth.js

const bcrypt = require('bcrypt');
const Joi = require('joi');
const User = require('../db/models/User');
const createHttpError = require('http-errors');
const jwt = require('jsonwebtoken');
const Session = require('../db/models/Session');

// Схема валідації даних для реєстрації користувача за допомогою Joi
const userValidationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Схема валідації даних для логіну користувача за допомогою Joi
const loginValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Функція для реєстрації нового користувача
const register = async ({ name, email, password }) => {
  // Перевірка правильності введених даних за допомогою Joi
  const { error } = userValidationSchema.validate({ name, email, password });
  if (error) {
    throw createHttpError(400, error.message);
  }

  // Перевірка, чи існує користувач з таким email в базі даних
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  // Хешування пароля перед збереженням у базу даних
  const hashedPassword = await bcrypt.hash(password, 10);

  // Створення нового користувача в базі даних
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return newUser;
};

// Функція для логіну користувача
const login = async ({ email, password }) => {
  // Перевірка правильності введених даних для логіну за допомогою Joi
  const { error } = loginValidationSchema.validate({ email, password });
  if (error) {
    throw createHttpError(400, error.message);
  }

  // Перевірка, чи існує користувач з таким email в базі даних
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  // Перевірка правильності пароля, порівнюючи введений пароль з хешованим у базі даних
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid email or password');
  }

  return user;
};

// Функція для генерації токенів доступу і оновлення токенів
const generateTokens = (userId) => {
  // Генерація токена доступу з використанням секретного ключа та часу дії токена (15 хвилин)
  const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '15m', // Термін дії access токена — 15 хвилин
  });

  // Генерація refresh токена з використанням секретного ключа та часу дії токена (30 днів)
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '30d', // Термін дії refresh токена — 30 днів
  });

  return { accessToken, refreshToken };
};

// Функція для збереження сесії користувача в базі даних
const saveSession = async (userId, accessToken, refreshToken) => {
  // Видаляємо старі сесії для цього користувача
  await Session.findOneAndDelete({ userId });

  // Створюємо нову сесію
  const session = new Session({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + 15 * 60 * 1000, // Час дії access токена — 15 хвилин
    refreshTokenValidUntil: Date.now() + 30 * 24 * 60 * 60 * 1000, // Час дії refresh токена — 30 днів
  });
  await session.save(); // Зберігаємо сесію в базі даних
};

// Функція для отримання даних користувача за його ID
const getUserById = async (userId) => {
  return await User.findById(userId); // Повертаємо користувача, знайденого за ID
};

module.exports = {
  register,
  login,
  generateTokens,
  saveSession,
  getUserById,
};
