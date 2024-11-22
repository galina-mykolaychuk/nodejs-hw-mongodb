// src/controllers/contacts.js

const Contact = require('../db/models/Contact');

// Отримати всі контакти з підтримкою пагінації, сортування та фільтрації
const getAllContacts = async (req, res) => {
  try {
    const {
      page = 1,
      perPage = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      isFavourite,
      contactType,
    } = req.query;

    // Фільтр для пошуку контактів
    const filter = {};

    // Фільтрація за isFavourite (якщо передано в запиті)
    if (isFavourite !== undefined) {
      filter.isFavourite = isFavourite === 'true'; // Перетворення на булеве значення
    }

    // Фільтрація за contactType (якщо передано в запиті)
    if (contactType) {
      filter.contactType = contactType;
    }

    // Загальна кількість контактів, що відповідають фільтрам
    const totalItems = await Contact.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / perPage); // Розрахунок загальної кількості сторінок
    const hasPreviousPage = page > 1; // Чи є попередня сторінка
    const hasNextPage = page < totalPages; // Чи є наступна сторінка

    // Отримання контактів з фільтром, пагінацією та сортуванням
    const contacts = await Contact.find(filter)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 }) // Сортування за полем sortBy (за замовчуванням - name)
      .skip((page - 1) * perPage) // Пропуск необхідної кількості елементів для пагінації
      .limit(parseInt(perPage, 10)); // Обмеження кількості елементів на сторінці

    // Відправка відповіді з результатами
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts,
        page: parseInt(page, 10),
        perPage: parseInt(perPage, 10),
        totalItems,
        totalPages,
        hasPreviousPage,
        hasNextPage,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Отримати контакт за ID
const getContactById = async (req, res) => {
  const { contactId } = req.params;
  try {
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully found contact!',
      data: contact,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Створити новий контакт
const createContact = async (req, res) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;
  try {
    const contact = new Contact({
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
    });
    await contact.save();
    res.status(201).json({
      status: 201,
      message: 'Successfully created contact!',
      data: contact,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Оновити контакт
const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { name, phoneNumber, email, isFavourite, contactType },
      { new: true },
    );
    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully updated contact!',
      data: updatedContact,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Видалити контакт
const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  try {
    const contact = await Contact.findByIdAndDelete(contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully deleted contact!',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
