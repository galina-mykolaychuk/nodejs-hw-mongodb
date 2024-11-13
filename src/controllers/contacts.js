// src/controllers/contacts.js

const createError = require('http-errors');
const contactsService = require('../services/contacts');
const ctrlWrapper = require('../utils/ctrlWrapper');

// Контролер для отримання всіх контактів
const getAllContacts = ctrlWrapper(async (req, res) => {
  const contacts = await contactsService.getAllContacts();

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
});

// Контролер для отримання контакту за ID
const getContactById = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactsService.getContactById(contactId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
});

// Контролер для створення контакту
const createContact = ctrlWrapper(async (req, res) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  // Перевірка на обов'язкові поля
  if (!name || !phoneNumber || !contactType) {
    throw createError(
      400,
      'Missing required fields: name, phoneNumber, and contactType',
    );
  }

  // Викликаємо сервіс для створення нового контакту
  const newContact = await contactsService.createContact({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
});

// Контролер для оновлення контакту
const updateContact = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  // Пошук контакту по ID
  const contact = await contactsService.getContactById(contactId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  // Оновлення тільки тих полів, які були передані
  if (name) contact.name = name;
  if (phoneNumber) contact.phoneNumber = phoneNumber;
  if (email) contact.email = email;
  if (isFavourite !== undefined) contact.isFavourite = isFavourite;
  if (contactType) contact.contactType = contactType;

  // Збереження змін
  await contact.save();

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
});

// Контролер для видалення контакту
const deleteContact = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;

  // Пошук контакту за ID
  const contact = await contactsService.getContactById(contactId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  // Видалення контакту
  await contactsService.deleteContact(contactId);

  res.status(204).send(); // Відповідь без тіла, статус 204
});

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact, // Додано deleteContact
};
