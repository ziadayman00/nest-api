const bcrypt = require('bcrypt');

const User = require('../models/user.model');
const AppError = require('../utils/app-error');
const { createAccessToken } = require('../utils/jwt');

const toPublicUser = (user) => {
  const userData = user.toJSON();
  delete userData.passwordHash;
  return userData;
};

const register = async ({ fullName, email, password }) => {
  const existingUser = await User.findOne({
    where: { email },
    attributes: ['id'],
  });

  if (existingUser) {
    throw new AppError('Email is already registered', 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    fullName,
    email,
    passwordHash,
  });

  return toPublicUser(user);
};

const login = async ({ email, password }) => {
  const user = await User.unscoped().findOne({ where: { email } });

  if (!user || !user.isActive || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AppError('Invalid email or password', 401);
  }

  return {
    user: toPublicUser(user),
    accessToken: createAccessToken(user),
  };
};

module.exports = {
  register,
  login,
};
