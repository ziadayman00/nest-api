const express = require('express');
const catalogController = require('../controllers/catalog.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { categoryValidator, categoryUpdateValidator, productValidator, productUpdateValidator, variantValidator, variantUpdateValidator, uuidParamValidator, productListValidator } = require('../validators/catalog.validator');

const upload = require('../config/upload');

const router = express.Router();

router.get('/categories', catalogController.listCategories);
router.get('/products', productListValidator, catalogController.listProducts);
router.get('/products/:slug', catalogController.getProduct);

router.post('/categories', authenticate, authorize('admin'), categoryValidator, catalogController.createCategory);
router.patch('/categories/:id', authenticate, authorize('admin'), uuidParamValidator, categoryUpdateValidator, catalogController.updateCategory);
router.delete('/categories/:id', authenticate, authorize('admin'), uuidParamValidator, catalogController.deactivateCategory);
router.post('/products', authenticate, authorize('admin'), productValidator, catalogController.createProduct);
router.patch('/products/:id', authenticate, authorize('admin'), uuidParamValidator, productUpdateValidator, catalogController.updateProduct);
router.delete('/products/:id', authenticate, authorize('admin'), uuidParamValidator, catalogController.deactivateProduct);
router.post('/products/:id/variants', authenticate, authorize('admin'), uuidParamValidator, variantValidator, catalogController.addVariant);
router.patch('/products/:id/variants/:variantId', authenticate, authorize('admin'), uuidParamValidator, variantUpdateValidator, catalogController.updateVariant);
router.delete('/products/:id/variants/:variantId', authenticate, authorize('admin'), uuidParamValidator, catalogController.deactivateVariant);
router.post('/products/:id/images', authenticate, authorize('admin'), uuidParamValidator, (req, res, next) => {
  if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
    return upload.single('file')(req, res, next);
  }
  next();
}, catalogController.addImage);

module.exports = router;
