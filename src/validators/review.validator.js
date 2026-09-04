const { body, param, query } = require('express-validator');
const { validateRequest } = require('./auth.validator');

const createReviewValidator = [
  param('productId').isUUID().withMessage('Product id must be a valid UUID'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').optional().trim().isLength({ min: 3, max: 160 }),
  body('body').trim().isLength({ min: 20, max: 5000 }).withMessage('Review must be between 20 and 5000 characters'),
  validateRequest,
];

const productReviewValidator = [
  param('slug').trim().isLength({ min: 1, max: 180 }),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  validateRequest,
];

const moderateReviewValidator = [
  param('id').isUUID().withMessage('Review id must be a valid UUID'),
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
  body('moderationNote').optional().trim().isLength({ max: 2000 }),
  validateRequest,
];

const adminReviewValidator = [
  query('status').optional().isIn(['pending', 'approved', 'rejected']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  validateRequest,
];

module.exports = { createReviewValidator, productReviewValidator, moderateReviewValidator, adminReviewValidator };
