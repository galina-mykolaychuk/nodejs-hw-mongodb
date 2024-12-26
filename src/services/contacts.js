// src/services/contacts.js

const Contact = require('../db/models/Contact');
const createHttpError = require('http-errors');

// Сервіс для отримання всіх контактів з пагінацією, сортуванням та фільтрацією
const getAllContacts = async ({
  userId,
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  filter = {},
}) => {
  const skip = (page - 1) * perPage; // Визначаємо, з якого елементу почати
  const totalItems = await Contact.countDocuments({ ...filter, userId }); // Загальна кількість контактів з урахуванням фільтра

  // Динамічне сортування: сортуємо за заданим полем і порядком
  const sortObject = {};
  sortObject[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Отримуємо контакти з пагінацією, сортуванням та фільтрацією
  const contacts = await Contact.find({ ...filter, userId }) // Фільтрація за userId
    .skip(skip) // Пропускаємо перші елементи для пагінації
    .limit(perPage) // Ліміт на кількість елементів на сторінці
    .sort(sortObject); // Сортуємо за заданими параметрами

  return { contacts, totalItems };
};

// Сервіс для отримання контакту за ID
const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId }); // Перевірка чи контакт належить користувачу
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  return contact;
};

// Сервіс для створення нового контакту
const createContact = async (contactData) => {
  const newContact = new Contact(contactData);
  await newContact.save();
  return newContact;
};

// Сервіс для видалення контакту
const deleteContact = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId }); // Перевірка чи контакт належить користувачу

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  await Contact.deleteOne({ _id: contactId });
};

// Сервіс для оновлення існуючого контакту
const updateContact = async (contactId, contactData, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId }); // Перевірка чи контакт належить користувачу

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  Object.assign(contact, contactData);
  await contact.save();

  return contact;
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
