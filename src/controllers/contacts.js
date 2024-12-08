// src/controllers/contacts.js

const createHttpError = require('http-errors');
const contactsService = require('../services/contacts'); // Використання сервісів у контролері

// Функція для створення нового контакту
const createContact = async (req, res, next) => {
  try {
    const newContact = await contactsService.createContact({
      ...req.body,
      userId: req.user._id, // userId з об'єкта req.user
    });

    res.status(201).json({
      status: 201,
      message: 'Contact created successfully',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

// Функція для отримання всіх контактів поточного користувача
const getAllContacts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1; // Поточна сторінка
    const perPage = parseInt(req.query.perPage, 10) || 10; // Кількість елементів на сторінці

    const { contacts, totalItems } = await contactsService.getAllContacts({
      userId: req.user._id, // Передаємо userId до сервісів
      page,
      perPage,
    });

    const totalPages = Math.ceil(totalItems / perPage); // Загальна кількість сторінок

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts, // Дані контактів
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1, // Перевірка наявності попередньої сторінки
        hasNextPage: page < totalPages, // Перевірка наявності наступної сторінки
      },
    });
  } catch (error) {
    next(error);
  }
};

// Функція для отримання контакту за ID
const getContactById = async (req, res, next) => {
  try {
    const contact = await contactsService.getContactById(
      req.params.contactId,
      req.user._id,
    ); // Передаємо userId до сервісів

    if (!contact) {
      return next(createHttpError(404, 'Contact not found or not authorized'));
    }

    res.json({
      status: 200,
      message: 'Contact retrieved successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// Функція для оновлення контакту
const updateContact = async (req, res, next) => {
  try {
    const updatedContact = await contactsService.updateContact(
      req.params.contactId,
      req.body,
      req.user._id,
    ); // Передаємо userId до сервісів

    if (!updatedContact) {
      return next(createHttpError(404, 'Contact not found or not authorized'));
    }

    res.json({
      status: 200,
      message: 'Contact updated successfully',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

// Функція для видалення контакту
const deleteContact = async (req, res, next) => {
  try {
    await contactsService.deleteContact(req.params.contactId, req.user._id); // Передаємо userId до сервісів

    res.status(204).end(); // Відповідь зі статусом 204 та порожнім тілом
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
