// src/controllers/contacts.js

const createHttpError = require('http-errors');
const contactsService = require('../services/contacts');

// Функція для створення нового контакту
const createContact = async (req, res, next) => {
  try {
    const photoUrl = req.file ? req.file.cloudinaryUrl : null; // Отримуємо URL фото

    const newContact = await contactsService.createContact({
      ...req.body,
      userId: req.user._id,
      photo: photoUrl, // Додаємо фото до даних контакту
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

// Функція для отримання всіх контактів поточного користувача
const getAllContacts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.perPage, 10) || 10;

    const { contacts, totalItems } = await contactsService.getAllContacts({
      userId: req.user._id,
      page,
      perPage,
    });

    const totalPages = Math.ceil(totalItems / perPage);

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts,
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
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
    );

    if (!contact) {
      return next(createHttpError(404, 'Contact not found'));
    }

    res.json({
      status: 200,
      message: 'Successfully found contact!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// Функція для оновлення контакту
const updateContact = async (req, res, next) => {
  try {
    const photoUrl = req.file ? req.file.cloudinaryUrl : undefined; // Отримуємо URL фото

    const updatedContact = await contactsService.updateContact(
      req.params.contactId,
      {
        ...req.body,
        ...(photoUrl && { photo: photoUrl }),
      },
      req.user._id,
    );

    if (!updatedContact) {
      return next(createHttpError(404, 'Contact not found'));
    }

    res.json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

// Функція для видалення контакту
const deleteContact = async (req, res, next) => {
  try {
    await contactsService.deleteContact(req.params.contactId, req.user._id);

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
