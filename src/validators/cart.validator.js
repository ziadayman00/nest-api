const { body, param } = require('express-validator');
const { validateRequest } = require('./auth.validator');

const addItemValidator = [
  body('productId').isUUID(),
  body('variantId').optional({ nullable: true }).isUUID(),
  body('quantity').isInt({ min: 1, max: 99 }),
  validateRequest,
];
const updateItemValidator = [body('quantity').isInt({ min: 1, max: 99 }), validateRequest];
const idValidator = [param('id').isUUID(), validateRequest];
const checkoutValidator = [
  body('shippingAddress').isObject(),
  body('shippingAddress.fullName').trim().isLength({ min: 2, max: 120 }),
  body('shippingAddress.phone').trim().isLength({ min: 6, max: 40 }),
  body('shippingAddress.addressLine1').trim().isLength({ min: 3, max: 200 }),
  body('shippingAddress.city').trim().isLength({ min: 2, max: 100 }),
  body('couponCode').optional().trim().isLength({ min: 3, max: 64 }).matches(/^[A-Za-z0-9_-]+$/),
  validateRequest,
];
module.exports = { addItemValidator, updateItemValidator, idValidator, checkoutValidator };
