// db/models/Contact.js

const mongoose = require('mongoose');

// Оновлення схеми для додавання поля userId
const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    // Додаємо поле для userId
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    photo: {
      type: String, // URL до фото
      default: null,
    },
  },
  {
    timestamps: true, // автоматично додає поля createdAt та updatedAt
    toJSON: {
      transform(doc, ret) {
        delete ret.__v; // Видалення поля __v
        return ret;
      },
    },
  },
);

module.exports = mongoose.model('Contact', contactSchema);
