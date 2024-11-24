// src/controllers/contacts.js

const createHttpError = require('http-errors');
const Contact = require('../db/models/Contact');

// Функція для створення нового контакту
const createContact = async (req, res, next) => {
  try {
    // Додаємо userId поточного користувача до нового контакту
    const newContact = new Contact({
      ...req.body,
      userId: req.user._id, // userId з об'єкта req.user
    });

    // Зберігаємо контакт у базі даних
    await newContact.save();

    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

// Функція для отримання всіх контактів поточного користувача
const getAllContacts = async (req, res, next) => {
  try {
    // Шукаємо контакти тільки для поточного користувача
    const contacts = await Contact.find({ userId: req.user._id });
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

// Функція для отримання контакту за ID
const getContactById = async (req, res, next) => {
  try {
    // Шукаємо контакт за ID і перевіряємо, чи належить він поточному користувачу
    const contact = await Contact.findOne({
      _id: req.params.contactId,
      userId: req.user._id,
    });

    if (!contact) {
      return next(createHttpError(404, 'Contact not found or not authorized'));
    }

    res.json(contact);
  } catch (error) {
    next(error);
  }
};

// Функція для оновлення контакту
const updateContact = async (req, res, next) => {
  try {
    // Оновлюємо тільки ті контакти, які належать поточному користувачу
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: req.params.contactId, userId: req.user._id }, // Перевірка userId
      req.body,
      { new: true },
    );

    if (!updatedContact) {
      return next(createHttpError(404, 'Contact not found or not authorized'));
    }

    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
};

// Функція для видалення контакту
const deleteContact = async (req, res, next) => {
  try {
    // Видаляємо контакт, якщо він належить поточному користувачу
    const deletedContact = await Contact.findOneAndDelete({
      _id: req.params.contactId,
      userId: req.user._id,
    });

    if (!deletedContact) {
      return next(createHttpError(404, 'Contact not found or not authorized'));
    }

    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
};
