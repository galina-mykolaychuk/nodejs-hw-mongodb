// src/validation/contactsSchemas.js

const Joi = require('joi');

// Схема для створення контакту
const contactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(), // Ім'я
  phoneNumber: Joi.string().min(3).max(20).required(), // Телефонний номер
  email: Joi.string().email().optional().allow(null), // Email необов’язковий
  isFavourite: Joi.boolean().optional(), // Чи є улюбленим
  contactType: Joi.string().valid('home', 'work', 'personal').required(), // Тип контакту
  createdAt: Joi.date().default(() => new Date().toISOString()), // Дата створення
  updatedAt: Joi.date().default(() => new Date().toISOString()), // Дата оновлення
});

// Схема для оновлення контакту
const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().email().optional().allow(null), // Email необов’язковий
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('home', 'work', 'personal'),
  updatedAt: Joi.date().default(() => new Date().toISOString()), // Автоматично оновлюється
}).min(1); // Вимагає хоча б одне поле для оновлення

module.exports = {
  contactSchema,
  contactUpdateSchema,
};
