// src/services/auth.js

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const createHttpError = require('http-errors');
const User = require('../db/models/User');
const Session = require('../db/models/Session');
const validationSchemas = require('../validation/authSchemas');

// Функція для реєстрації нового користувача
const register = async ({ name, email, password }) => {
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

// Функція для генерації токенів за допомогою crypto
const generateTokens = () => {
  const generateToken = (length = 64) =>
    crypto.randomBytes(length).toString('hex');

  const accessToken = generateToken();
  const refreshToken = generateToken();

  return { accessToken, refreshToken };
};

// Функція для збереження сесії користувача в базі даних
const saveSession = async (userId, accessToken, refreshToken) => {
  await Session.findOneAndDelete({ userId });

  const session = new Session({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + 15 * 60 * 1000, // 15 хвилин
    refreshTokenValidUntil: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 днів
  });
  await session.save();
};

// Функція для отримання даних користувача за його ID
const getUserById = async (userId) => {
  return await User.findById(userId);
};

// Нова функція для пошуку користувача за email
const findUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

const saveResetToken = async (userId, resetToken) => {
  await User.findByIdAndUpdate(userId, {
    resetToken,
    resetTokenValidUntil: Date.now() + 15 * 60 * 1000, // Термін дії токена - 15 хвилин
  });
};

module.exports = {
  register,
  login,
  generateTokens,
  saveSession,
  getUserById,
  findUserByEmail, // Додано нову функцію до експорту
  saveResetToken,
};
