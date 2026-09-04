const { body, param } = require('express-validator');
const { validateRequest } = require('./auth.validator');

const createDesignRequestValidator = [
  body('fullName').trim().isLength({ min: 2, max: 120 }),
  body('phone').trim().isLength({ min: 6, max: 40 }),
  body('email').trim().isEmail().normalizeEmail(),
  body('propertyType').trim().isLength({ min: 2, max: 80 }),
  body('roomCount').isInt({ min: 1, max: 100 }),
  body('areaSquareMeters').optional().isFloat({ min: 1 }),
  body('budget').optional().isFloat({ min: 0 }),
  body('preferredStyle').optional().trim().isLength({ max: 120 }),
  body('notes').optional().trim().isLength({ max: 10000 }),
  validateRequest,
];
const statusValidator = [param('id').isUUID(), body('status').isIn(['pending', 'contacted', 'in_progress', 'completed', 'cancelled']), validateRequest];
const noteValidator = [param('id').isUUID(), body('body').trim().isLength({ min: 1, max: 5000 }), validateRequest];
module.exports = { createDesignRequestValidator, statusValidator, noteValidator };
