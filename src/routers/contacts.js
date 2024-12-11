// routers/contacts.js

const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contacts');
const validateBody = require('../middlewares/validateBody');
const isValidId = require('../middlewares/isValidId');
const authenticate = require('../middlewares/authenticate');
const {
  contactSchema,
  contactUpdateSchema,
} = require('../validation/contactsSchemas');

// Маршрут для отримання всіх контактів
router.get('/', authenticate, contactsController.getAllContacts);

// Маршрут для отримання контакту за ID
router.get(
  '/:contactId',
  authenticate,
  isValidId,
  contactsController.getContactById,
);

// Маршрут для створення нового контакту з валідацією body
router.post(
  '/',
  authenticate,
  validateBody(contactSchema),
  contactsController.createContact,
);

// Маршрут для оновлення контакту з валідацією ID і body
router.patch(
  '/:contactId',
  authenticate,
  isValidId,
  validateBody(contactUpdateSchema),
  contactsController.updateContact,
);

// Маршрут для видалення контакту з валідацією ID
router.delete(
  '/:contactId',
  authenticate,
  isValidId,
  contactsController.deleteContact,
);

module.exports = router;
