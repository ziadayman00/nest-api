const { body, validationResult } = require("express-validator");

const registerValidator = [
  body("fullName")
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage("Full name must be between 2 and 120 characters"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Email must be valid")
    .normalizeEmail(),
  body("password")
    .isString()
    .isLength({ min: 8, max: 72 })
    .withMessage("Password must be between 8 and 72 characters"),
];

const loginValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Email must be valid")
    .normalizeEmail(),
  body("password")
    .isString()
    .notEmpty()
    .withMessage("Password is required"),
];

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const error = new Error("Validation failed");

  error.statusCode = 400;
  error.data = {
    errors: errors.array().map((item) => ({
      field: item.path,
      message: item.msg,
    })),
  };

  return next(error);
};

module.exports = {
  registerValidator,
  loginValidator,
  validateRequest,
};
