// src/services/contacts.js

const Contact = require('../db/models/Contact');

// Сервіс для отримання всіх контактів з пагінацією, сортуванням та фільтрацією
const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  filter = {}, // Додано параметр для фільтрації
}) => {
  const skip = (page - 1) * perPage; // Визначаємо, з якого елементу почати
  const totalItems = await Contact.countDocuments(filter); // Загальна кількість контактів з урахуванням фільтра

  // Динамічне сортування: сортуємо за заданим полем і порядком
  const sortObject = {};
  sortObject[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Отримуємо контакти з пагінацією, сортуванням та фільтрацією
  const contacts = await Contact.find(filter)
    .skip(skip) // Пропускаємо перші елементи для пагінації
    .limit(perPage) // Ліміт на кількість елементів на сторінці
    .sort(sortObject); // Сортуємо за заданими параметрами

  return { contacts, totalItems };
};

// Сервіс для отримання контакту за ID
const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

// Сервіс для створення нового контакту
const createContact = async (contactData) => {
  const newContact = new Contact(contactData);
  await newContact.save();
  return newContact;
};

// Сервіс для видалення контакту
const deleteContact = async (contactId) => {
  const contact = await Contact.findById(contactId);

  if (!contact) {
    throw new Error('Contact not found');
  }

  await Contact.deleteOne({ _id: contactId });
};

// Сервіс для оновлення існуючого контакту
const updateContact = async (contactId, contactData) => {
  const contact = await Contact.findById(contactId);

  if (!contact) {
    throw new Error('Contact not found');
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
