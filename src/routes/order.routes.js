const express = require('express');
const controller = require('../controllers/order.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { checkoutValidator, idValidator } = require('../validators/cart.validator');
const { body } = require('express-validator');
const { validateRequest } = require('../validators/auth.validator');

const router = express.Router();
router.use(authenticate);
router.post('/checkout', checkoutValidator, controller.checkout);
router.get('/me', controller.listMyOrders);
router.get('/me/:id', idValidator, controller.getMyOrder);
router.get('/', authorize('admin'), controller.listOrders);
router.patch('/:id/status', authorize('admin'), idValidator, body('status').isIn(['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled']), validateRequest, controller.updateStatus);
module.exports = router;
