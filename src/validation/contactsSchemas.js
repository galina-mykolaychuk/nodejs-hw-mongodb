// src/validation/contactsSchemas.js

const Joi = require('joi');

// Схема для створення контакту
const contactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().optional().allow(null),
  createdAt: Joi.date().default(() => new Date().toISOString()),
  updatedAt: Joi.date().default(() => new Date().toISOString()),
});

// Схема для оновлення контакту
const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().email().optional().allow(null),
  updatedAt: Joi.date().default(() => new Date().toISOString()),
}).min(1);

module.exports.contactSchema = contactSchema;
module.exports.contactUpdateSchema = contactUpdateSchema;
