// routers/contacts.js

const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contacts');

// Маршрут для отримання всіх контактів
router.get('/', contactsController.getAllContacts);

// Маршрут для отримання контакту за ID
router.get('/:contactId', contactsController.getContactById);

// Маршрут для створення контакту
router.post('/', contactsController.createContact);

// Маршрут для оновлення контакту
router.patch('/:contactId', contactsController.updateContact);

// Додано маршрут для видалення контакту
router.delete('/:contactId', contactsController.deleteContact);

module.exports = router;
