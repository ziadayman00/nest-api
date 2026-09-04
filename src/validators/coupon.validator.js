const { body, param, query } = require('express-validator');
const { validateRequest } = require('./auth.validator');

const couponFields = [
  body('code').trim().isLength({ min: 3, max: 64 }).matches(/^[A-Za-z0-9_-]+$/).withMessage('Coupon code may contain only letters, numbers, hyphens, and underscores'),
  body('type').isIn(['percentage', 'fixed']),
  body('value').isFloat({ gt: 0 }),
  body('minimumOrderAmount').optional().isFloat({ min: 0 }),
  body('maximumDiscountAmount').optional({ nullable: true }).isFloat({ gt: 0 }),
  body('startsAt').optional({ nullable: true }).isISO8601(),
  body('endsAt').optional({ nullable: true }).isISO8601(),
  body('usageLimit').optional({ nullable: true }).isInt({ min: 1 }),
  body('perUserLimit').optional({ nullable: true }).isInt({ min: 1 }),
];

const createCouponValidator = [...couponFields, validateRequest];
const updateCouponValidator = [
  param('id').isUUID(),
  body('code').optional().trim().isLength({ min: 3, max: 64 }).matches(/^[A-Za-z0-9_-]+$/),
  body('type').optional().isIn(['percentage', 'fixed']),
  body('value').optional().isFloat({ gt: 0 }),
  body('minimumOrderAmount').optional().isFloat({ min: 0 }),
  body('maximumDiscountAmount').optional({ nullable: true }).isFloat({ gt: 0 }),
  body('startsAt').optional({ nullable: true }).isISO8601(),
  body('endsAt').optional({ nullable: true }).isISO8601(),
  body('usageLimit').optional({ nullable: true }).isInt({ min: 1 }),
  body('perUserLimit').optional({ nullable: true }).isInt({ min: 1 }),
  body('isActive').optional().isBoolean(),
  validateRequest,
];
const couponIdValidator = [param('id').isUUID(), validateRequest];
const listCouponValidator = [query('page').optional().isInt({ min: 1 }), query('limit').optional().isInt({ min: 1, max: 100 }), validateRequest];

module.exports = { createCouponValidator, updateCouponValidator, couponIdValidator, listCouponValidator };
