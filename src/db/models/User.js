// db/models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /.+@.+\..+/ },
    password: { type: String, required: true },
    resetToken: { type: String }, // Поле для збереження токена для скидання пароля
    resetTokenValidUntil: { type: Date }, // Термін дії токена
  },
  {
    timestamps: true, // автоматично додає createdAt та updatedAt
    toJSON: {
      transform(doc, ret) {
        delete ret.__v; // Видалення поля __v
        delete ret.password; // Забезпечення безпеки, щоб пароль не передавався
        return ret;
      },
    },
  },
);

module.exports = mongoose.model('User', userSchema);
