// src/routers/auth.js

const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

// Реєстрація нового користувача
router.post('/register', authController.registerUser);

// Логін користувача
router.post('/login', authController.loginUser);

// Оновлення сесії за допомогою рефреш токена
router.post('/refresh', authController.refreshSession);

// Логаут користувача
router.post('/logout', authController.logoutUser);

module.exports = router;
