// routes/contacts.js

const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contactsController');

// Маршрут для отримання всіх контактів
router.get('/', contactsController.getAllContacts);

// Маршрут для отримання контакту за ID
router.get('/:contactId', contactsController.getContactById);

module.exports = router;
