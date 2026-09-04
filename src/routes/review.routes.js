const express = require('express');
const controller = require('../controllers/review.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { createReviewValidator, productReviewValidator, moderateReviewValidator, adminReviewValidator } = require('../validators/review.validator');
const uploadReview = require('../config/upload-review');

const router = express.Router();

router.get('/products/:slug/reviews', productReviewValidator, controller.listProductReviews);
router.post('/products/:productId/reviews', authenticate, authorize('customer'), uploadReview.array('images', 3), createReviewValidator, controller.createReview);
router.get('/admin/reviews', authenticate, authorize('admin'), adminReviewValidator, controller.listAdminReviews);
router.patch('/admin/reviews/:id/status', authenticate, authorize('admin'), moderateReviewValidator, controller.moderateReview);

module.exports = router;
