// src/routers/auth.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const validateBody = require('../middlewares/validateBody');
const validationSchemas = require('../validation/authSchemas');

// Валідація при реєстрації
router.post(
  '/register',
  validateBody(validationSchemas.registerSchema),
  authController.registerUser,
);

// Валідація при логіні
router.post(
  '/login',
  validateBody(validationSchemas.loginSchema),
  authController.loginUser,
);

// Оновлення сесії за допомогою рефреш токена
router.post('/refresh', authController.refreshSession);

// Логаут користувача
router.post('/logout', authController.logoutUser);

// Надсилання email для скидання пароля
router.post(
  '/send-reset-email',
  validateBody(validationSchemas.emailSchema), // Валідація email
  authController.sendResetEmail, // Контролер для скидання пароля
);

module.exports = router;
