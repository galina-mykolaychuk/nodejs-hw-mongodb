// services/contacts.js

const Contact = require('../db/models/Contact');

const getAllContacts = async () => {
  return await Contact.find({});
};

const getContactById = async (contactId) => {
  return await Contact.findById(contactId); // Пошук контакту за ID
};

module.exports = { getAllContacts, getContactById };
