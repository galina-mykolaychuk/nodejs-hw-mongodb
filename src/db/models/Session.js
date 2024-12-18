// db/models/Session.js

const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    accessTokenValidUntil: { type: Date, required: true },
    refreshTokenValidUntil: { type: Date, required: true },
  },
  {
    timestamps: true, // автоматично додає createdAt та updatedAt
    toJSON: {
      transform(doc, ret) {
        delete ret.__v; // Видалення поля __v
        return ret;
      },
    },
  },
);

module.exports = mongoose.model('Session', sessionSchema);
