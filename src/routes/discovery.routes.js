const express = require('express');
const controller = require('../controllers/discovery.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { param } = require('express-validator');
const { validateRequest } = require('../validators/auth.validator');
const { styleValidator, styleUpdateValidator, collectionValidator, collectionProductValidator, productStyleValidator, recommendationValidator } = require('../validators/discovery.validator');

const router = express.Router();

router.get('/styles', controller.listStyles);
router.get('/collections', controller.listCollections);
router.get('/collections/:slug', controller.getCollection);
router.get('/products/:slug/recommendations', controller.getRecommendations);

router.post('/admin/styles', authenticate, authorize('admin'), styleValidator, controller.createStyle);
router.patch('/admin/styles/:id', authenticate, authorize('admin'), param('id').isUUID(), styleUpdateValidator, controller.updateStyle);
router.post('/admin/collections', authenticate, authorize('admin'), collectionValidator, controller.createCollection);
router.post('/admin/collections/:id/products', authenticate, authorize('admin'), collectionProductValidator, controller.addProductToCollection);
router.post('/admin/products/:id/styles', authenticate, authorize('admin'), productStyleValidator, controller.addStyleToProduct);
router.post('/admin/products/:id/recommendations', authenticate, authorize('admin'), recommendationValidator, controller.addRecommendation);

module.exports = router;
