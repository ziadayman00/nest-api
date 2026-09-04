const express = require("express");
const authRouter = require('./auth.routes');
const catalogRouter = require('./catalog.routes');
const cartRouter = require('./cart.routes');
const orderRouter = require('./order.routes');
const designRequestRouter = require('./design-request.routes');
const adminRouter = require('./admin.routes');
const discoveryRouter = require('./discovery.routes');
const wishlistRouter = require('./wishlist.routes');
const reviewRouter = require('./review.routes');
const couponRouter = require('./coupon.routes');
const deliveryZoneRouter = require('./delivery-zone.routes');
const notificationRouter = require('./notification.routes');

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      message: "NEST api v1 is running",
    },
  });
});

router.use('/auth', authRouter);
router.use('/', catalogRouter);
router.use('/cart', cartRouter);
router.use('/wishlist', wishlistRouter);
router.use('/notifications', notificationRouter);
router.use('/', reviewRouter);
router.use('/', couponRouter);
router.use('/', deliveryZoneRouter);
router.use('/orders', orderRouter);
router.use('/design-requests', designRequestRouter);
router.use('/admin', adminRouter);
router.use('/', discoveryRouter);

module.exports = router;
