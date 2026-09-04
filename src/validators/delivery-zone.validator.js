const { body, param } = require('express-validator');
const { validateRequest } = require('./auth.validator');

const fields = [
  body('name').trim().isLength({ min: 2, max: 120 }),
  body('city').trim().isLength({ min: 2, max: 100 }),
  body('shippingFee').isFloat({ min: 0 }),
  body('freeShippingThreshold').optional({ nullable: true }).isFloat({ min: 0 }),
  body('estimatedDeliveryMinDays').isInt({ min: 1, max: 365 }),
  body('estimatedDeliveryMaxDays').isInt({ min: 1, max: 365 }),
];
const createDeliveryZoneValidator = [...fields, validateRequest];
const updateDeliveryZoneValidator = [
  param('id').isUUID(),
  body('name').optional().trim().isLength({ min: 2, max: 120 }),
  body('city').optional().trim().isLength({ min: 2, max: 100 }),
  body('shippingFee').optional().isFloat({ min: 0 }),
  body('freeShippingThreshold').optional({ nullable: true }).isFloat({ min: 0 }),
  body('estimatedDeliveryMinDays').optional().isInt({ min: 1, max: 365 }),
  body('estimatedDeliveryMaxDays').optional().isInt({ min: 1, max: 365 }),
  body('isActive').optional().isBoolean(),
  validateRequest,
];
const zoneIdValidator = [param('id').isUUID(), validateRequest];

module.exports = { createDeliveryZoneValidator, updateDeliveryZoneValidator, zoneIdValidator };
