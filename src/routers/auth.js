// src/routers/auth.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const validateBody = require('../middlewares/validateBody');
const validationSchemas = require('../validation/authSchemas');

// Валідація при реєстрації
router.post(
  '/register',
  validateBody(validationSchemas.registerSchema), // Валідація тіла запиту
  authController.registerUser, // Контролер для реєстрації користувача
);

// Валідація при логіні
router.post(
  '/login',
  validateBody(validationSchemas.loginSchema), // Валідація тіла запиту
  authController.loginUser, // Контролер для логіну користувача
);

// Оновлення сесії за допомогою рефреш токена
router.post(
  '/refresh',
  authController.refreshSession, // Контролер для оновлення сесії
);

// Логаут користувача
router.post(
  '/logout',
  authController.logoutUser, // Контролер для логауту користувача
);

module.exports = router;
