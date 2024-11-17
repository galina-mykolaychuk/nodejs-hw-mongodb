// routers/contacts.js

const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contacts');
const validateBody = require('../middlewares/validateBody');
const isValidId = require('../middlewares/isValidId');
const {
  contactSchema,
  contactUpdateSchema,
} = require('../validation/contactsSchemas');

// Маршрут для отримання всіх контактів
router.get('/', contactsController.getAllContacts);

// Маршрут для отримання контакту за ID
router.get('/:contactId', isValidId, contactsController.getContactById);

// Маршрут для створення контакту з валідацією body
router.post('/', validateBody(contactSchema), contactsController.createContact);

// Маршрут для оновлення контакту з валідацією ID і body
router.patch(
  '/:contactId',
  isValidId,
  validateBody(contactUpdateSchema),
  contactsController.updateContact,
);

// Маршрут для видалення контакту з валідацією ID
router.delete('/:contactId', isValidId, contactsController.deleteContact);

module.exports = router;
