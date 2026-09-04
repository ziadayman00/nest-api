const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const AppError = require('../utils/app-error');

const authenticate = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AppError('Authentication is required', 401));
  }

  try {
    const payload = jwt.verify(authorization.slice(7), process.env.JWT_ACCESS_SECRET);
    const user = await User.findByPk(payload.sub);

    if (!user || !user.isActive) {
      return next(new AppError('Authentication is required', 401));
    }

    req.user = user;
    return next();
  } catch {
    return next(new AppError('Authentication is required', 401));
  }
};

module.exports = authenticate;
