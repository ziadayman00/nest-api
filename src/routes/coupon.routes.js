const express = require('express');
const controller = require('../controllers/coupon.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { createCouponValidator, updateCouponValidator, couponIdValidator, listCouponValidator } = require('../validators/coupon.validator');

const router = express.Router();

router.use('/admin/coupons', authenticate, authorize('admin'));
router.post('/admin/coupons', createCouponValidator, controller.createCoupon);
router.get('/admin/coupons', listCouponValidator, controller.listCoupons);
router.patch('/admin/coupons/:id', updateCouponValidator, controller.updateCoupon);
router.delete('/admin/coupons/:id', couponIdValidator, controller.deactivateCoupon);

module.exports = router;
