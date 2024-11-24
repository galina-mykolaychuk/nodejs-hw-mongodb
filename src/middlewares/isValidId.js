// src/middlewares/isValidId.js

const mongoose = require('mongoose');

const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  next();
};

module.exports = isValidId;
