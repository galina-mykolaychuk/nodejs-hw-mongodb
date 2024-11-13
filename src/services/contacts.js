// src/services/contacts.js

const Contact = require('../db/models/Contact');

const getAllContacts = async () => {
  return await Contact.find({});
};

const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

const createContact = async (contactData) => {
  const newContact = new Contact(contactData);
  await newContact.save();
  return newContact;
};

// Видалення контакту
const deleteContact = async (contactId) => {
  const contact = await Contact.findById(contactId);

  if (!contact) {
    throw new Error('Contact not found');
  }

  await Contact.deleteOne({ _id: contactId }); // Використовуємо deleteOne замість remove()
};

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
