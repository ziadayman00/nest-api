const { body, param, query } = require('express-validator');
const { validateRequest } = require('./auth.validator');

const categoryValidator = [
  body('name').trim().isLength({ min: 2, max: 120 }),
  body('description').optional().trim().isLength({ max: 5000 }),
  validateRequest,
];

const categoryUpdateValidator = [
  body('name').optional().trim().isLength({ min: 2, max: 120 }),
  body('description').optional().trim().isLength({ max: 5000 }),
  body('isActive').optional().isBoolean(),
  validateRequest,
];

const productValidator = [
  body('categoryId').isUUID(),
  body('name').trim().isLength({ min: 2, max: 180 }),
  body('description').trim().isLength({ min: 1, max: 10000 }),
  body('price').isFloat({ min: 0 }),
  body('stockQuantity').optional().isInt({ min: 0 }),
  body('material').optional().trim().isLength({ max: 120 }),
  body('dimensions').optional().isObject(),
  validateRequest,
];

const productUpdateValidator = [
  body('categoryId').optional().isUUID(),
  body('name').optional().trim().isLength({ min: 2, max: 180 }),
  body('description').optional().trim().isLength({ min: 1, max: 10000 }),
  body('price').optional().isFloat({ min: 0 }),
  body('stockQuantity').optional().isInt({ min: 0 }),
  body('material').optional().trim().isLength({ max: 120 }),
  body('dimensions').optional().isObject(),
  body('isActive').optional().isBoolean(),
  validateRequest,
];

const variantValidator = [
  body('name').trim().isLength({ min: 1, max: 120 }),
  body('sku').trim().isLength({ min: 1, max: 100 }),
  body('price').optional().isFloat({ min: 0 }),
  body('stockQuantity').isInt({ min: 0 }),
  validateRequest,
];

const variantUpdateValidator = [
  body('name').optional().trim().isLength({ min: 1, max: 120 }),
  body('sku').optional().trim().isLength({ min: 1, max: 100 }),
  body('price').optional().isFloat({ min: 0 }),
  body('stockQuantity').optional().isInt({ min: 0 }),
  body('color').optional().trim().isLength({ max: 80 }),
  body('isActive').optional().isBoolean(),
  validateRequest,
];

const uuidParamValidator = [param('id').isUUID(), validateRequest];
const productListValidator = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().isUUID(),
  query('categorySlug').optional().trim().isLength({ min: 1, max: 140 }),
  query('styles').optional().trim().isLength({ min: 1, max: 500 }),
  query('search').optional().trim().isLength({ min: 2, max: 100 }),
  query('material').optional().trim().isLength({ min: 1, max: 120 }),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('inStock').optional().isBoolean(),
  query('sort').optional().isIn(['newest', 'price_asc', 'price_desc', 'name', 'name_asc', 'name_desc']),
  validateRequest,
];

module.exports = { categoryValidator, categoryUpdateValidator, productValidator, productUpdateValidator, variantValidator, variantUpdateValidator, uuidParamValidator, productListValidator };
