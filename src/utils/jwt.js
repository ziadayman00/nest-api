const jwt = require('jsonwebtoken');

const createAccessToken = (user) => jwt.sign(
  { sub: user.id, role: user.role },
  process.env.JWT_ACCESS_SECRET,
  { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' },
);

module.exports = { createAccessToken };
