const { param } = require('express-validator');
const { validateRequest } = require('./auth.validator');

const productIdValidator = [
  param('productId').isUUID().withMessage('Product id must be a valid UUID'),
  validateRequest,
];

module.exports = { productIdValidator };
