// src/utils/generateSecrets.js

const crypto = require('crypto');

// Генерація випадкового секрету для access токену
const accessSecret = crypto.randomBytes(64).toString('hex');

// Генерація випадкового секрету для refresh токену
const refreshSecret = crypto.randomBytes(64).toString('hex');

console.log('JWT_ACCESS_SECRET:', accessSecret);
console.log('JWT_REFRESH_SECRET:', refreshSecret);
