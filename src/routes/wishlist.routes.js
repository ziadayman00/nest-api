const express = require('express');
const controller = require('../controllers/wishlist.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { productIdValidator } = require('../validators/wishlist.validator');

const router = express.Router();

router.use(authenticate, authorize('customer', 'admin'));
router.get('/', controller.getWishlist);
router.post('/products/:productId', productIdValidator, controller.addProduct);
router.delete('/products/:productId', productIdValidator, controller.removeProduct);

module.exports = router;
