const { body, param } = require('express-validator');
const { validateRequest } = require('./auth.validator');

const styleValidator = [
  body('name').trim().isLength({ min: 2, max: 120 }),
  body('description').optional().trim().isLength({ max: 5000 }),
  body('imageUrl').optional().isURL(),
  validateRequest,
];

const styleUpdateValidator = [
  body('name').optional().trim().isLength({ min: 2, max: 120 }),
  body('description').optional().trim().isLength({ max: 5000 }),
  body('imageUrl').optional().isURL(),
  validateRequest,
];

const collectionValidator = [
  body('name').trim().isLength({ min: 2, max: 160 }),
  body('description').optional().trim().isLength({ max: 5000 }),
  body('heroImageUrl').optional().isURL(),
  body('roomType').optional().trim().isLength({ max: 80 }),
  validateRequest,
];

const collectionProductValidator = [
  param('id').isUUID(),
  body('productId').isUUID(),
  body('sortOrder').optional().isInt({ min: 0 }),
  validateRequest,
];

const productStyleValidator = [
  param('id').isUUID(),
  body('styleId').isUUID(),
  validateRequest,
];

const recommendationValidator = [
  param('id').isUUID(),
  body('recommendedProductId').isUUID(),
  body('type').isIn(['complete_the_look', 'similar', 'frequently_bought_together']),
  body('sortOrder').optional().isInt({ min: 0 }),
  validateRequest,
];

module.exports = { styleValidator, styleUpdateValidator, collectionValidator, collectionProductValidator, productStyleValidator, recommendationValidator };
