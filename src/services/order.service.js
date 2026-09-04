const { randomUUID } = require('crypto');
const sequelize = require('../config/db');
const { Cart, CartItem, Product, ProductVariant, Order, OrderItem, Coupon, CouponRedemption, DeliveryZone } = require('../models');
const AppError = require('../utils/app-error');
const getPagination = require('../utils/pagination');
const { normalizeCode } = require('./coupon.service');
const notificationService = require('./notification.service');

const orderInclude = [{ model: OrderItem, as: 'items' }, { model: Coupon, as: 'coupon', attributes: ['id', 'code', 'type', 'value'] }, { model: DeliveryZone, as: 'deliveryZone', attributes: ['id', 'name', 'city'] }];
const roundMoney = (amount) => Number(Number(amount).toFixed(2));
const normalizeCity = (city) => city.trim().toLowerCase();

const resolveDeliveryZone = async ({ city, subtotal, transaction }) => {
  const zone = await DeliveryZone.findOne({ where: { city: normalizeCity(city), isActive: true }, transaction, lock: transaction.LOCK.UPDATE });
  if (!zone) throw new AppError('Delivery is unavailable for this city', 400);
  const threshold = zone.freeShippingThreshold === null ? null : Number(zone.freeShippingThreshold);
  const shippingFee = threshold !== null && subtotal >= threshold ? 0 : Number(zone.shippingFee);
  return { zone, shippingFee };
};

const resolveCoupon = async ({ userId, couponCode, subtotal, transaction }) => {
  if (!couponCode) return { coupon: null, discountAmount: 0 };
  const coupon = await Coupon.findOne({ where: { code: normalizeCode(couponCode), isActive: true }, transaction, lock: transaction.LOCK.UPDATE });
  if (!coupon) throw new AppError('Coupon is invalid or inactive', 400);
  const now = new Date();
  if ((coupon.startsAt && coupon.startsAt > now) || (coupon.endsAt && coupon.endsAt <= now)) throw new AppError('Coupon is not currently valid', 400);
  if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) throw new AppError('Coupon usage limit has been reached', 409);
  if (subtotal < Number(coupon.minimumOrderAmount)) throw new AppError('Coupon requires a higher minimum order value', 400);
  if (coupon.perUserLimit !== null) {
    const redemptions = await CouponRedemption.count({ where: { couponId: coupon.id, userId }, transaction });
    if (redemptions >= coupon.perUserLimit) throw new AppError('You have reached the usage limit for this coupon', 409);
  }
  let discountAmount = coupon.type === 'percentage' ? subtotal * (Number(coupon.value) / 100) : Number(coupon.value);
  if (coupon.maximumDiscountAmount !== null) discountAmount = Math.min(discountAmount, Number(coupon.maximumDiscountAmount));
  return { coupon, discountAmount: Math.min(roundMoney(discountAmount), subtotal) };
};
const createOrderNumber = () => `NEST-${Date.now()}-${randomUUID().slice(0, 6).toUpperCase()}`;

const checkout = async (userId, shippingAddress, couponCode) => sequelize.transaction(async (transaction) => {
  const cart = await Cart.findOne({ where: { userId }, transaction, lock: transaction.LOCK.UPDATE });
  if (!cart) throw new AppError('Cart is empty', 400);
  const cartItems = await CartItem.findAll({ where: { cartId: cart.id }, transaction, lock: transaction.LOCK.UPDATE });
  if (!cartItems.length) throw new AppError('Cart is empty', 400);
  const snapshots = [];
  for (const item of cartItems) {
    const product = await Product.findByPk(item.productId, { transaction, lock: transaction.LOCK.UPDATE });
    if (!product || !product.isActive) throw new AppError('A product in the cart is unavailable', 409);
    const variant = item.variantId ? await ProductVariant.findByPk(item.variantId, { transaction, lock: transaction.LOCK.UPDATE }) : null;
    if (item.variantId && (!variant || !variant.isActive)) throw new AppError('A product variant in the cart is unavailable', 409);
    const stockOwner = variant || product;
    if (stockOwner.stockQuantity < item.quantity) throw new AppError('Insufficient stock for a cart item', 409);
    const unitPrice = Number(variant?.price ?? product.price);
    snapshots.push({ product, variant, item, unitPrice, lineTotal: unitPrice * item.quantity });
  }
  const subtotal = snapshots.reduce((sum, item) => sum + item.lineTotal, 0);
  const { coupon, discountAmount } = await resolveCoupon({ userId, couponCode, subtotal, transaction });
  const { zone, shippingFee } = await resolveDeliveryZone({ city: shippingAddress.city, subtotal, transaction });
  const totalAmount = roundMoney(subtotal - discountAmount + shippingFee);
  const order = await Order.create({ userId, orderNumber: createOrderNumber(), status: 'pending', paymentMethod: 'cash_on_delivery', paymentStatus: 'pending', subtotal, shippingFee, discountAmount, totalAmount, couponId: coupon?.id || null, couponCode: coupon?.code || null, deliveryZoneId: zone.id, deliveryZoneName: zone.name, estimatedDeliveryMinDays: zone.estimatedDeliveryMinDays, estimatedDeliveryMaxDays: zone.estimatedDeliveryMaxDays, shippingAddress }, { transaction });
  if (coupon) {
    await coupon.increment('usageCount', { by: 1, transaction });
    await CouponRedemption.create({ couponId: coupon.id, userId, orderId: order.id }, { transaction });
  }
  await OrderItem.bulkCreate(snapshots.map(({ product, variant, item, unitPrice, lineTotal }) => ({ orderId: order.id, productId: product.id, variantId: variant?.id || null, productName: product.name, variantName: variant?.name || null, sku: variant?.sku || null, unitPrice, quantity: item.quantity, lineTotal })), { transaction });
  await notificationService.notifyAdmins({ type: 'new_order', title: 'New order received', message: 'Order ' + order.orderNumber + ' has been placed.', entityType: 'order', entityId: order.id, metadata: { orderNumber: order.orderNumber } }, { transaction });
  for (const { product, variant, item } of snapshots) {
    const stockOwner = variant || product;
    const remainingStock = stockOwner.stockQuantity - item.quantity;
    await stockOwner.decrement('stockQuantity', { by: item.quantity, transaction });
    if (stockOwner.stockQuantity > 5 && remainingStock <= 5) {
      await notificationService.notifyAdmins({ type: 'low_stock', title: 'Low stock alert', message: product.name + ' has ' + remainingStock + ' item(s) remaining.', entityType: 'product', entityId: product.id, metadata: { productId: product.id, variantId: variant?.id || null, remainingStock } }, { transaction });
    }
  }
  await CartItem.destroy({ where: { cartId: cart.id }, transaction });
  return Order.findByPk(order.id, { include: orderInclude, transaction });
});
const listMyOrders = async (userId, query) => {
  const { page, limit, offset } = getPagination(query);
  const { count, rows } = await Order.findAndCountAll({ where: { userId }, include: orderInclude, order: [['createdAt', 'DESC']], limit, offset, distinct: true });
  return { orders: rows, pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) } };
};
const getMyOrder = async (userId, id) => {
  const order = await Order.findOne({ where: { id, userId }, include: orderInclude });
  if (!order) throw new AppError('Order not found', 404);
  return order;
};
const listOrders = async (query) => {
  const { page, limit, offset } = getPagination(query);
  const where = query.status ? { status: query.status } : {};
  const { count, rows } = await Order.findAndCountAll({ where, include: orderInclude, order: [['createdAt', 'DESC']], limit, offset, distinct: true });
  return { orders: rows, pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) } };
};
const updateStatus = async (id, status) => sequelize.transaction(async (transaction) => {
  const order = await Order.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
  if (!order) throw new AppError('Order not found', 404);
  const statusChanged = order.status !== status;
  if (status === 'cancelled' && order.status !== 'cancelled' && order.couponId) {
    const coupon = await Coupon.findByPk(order.couponId, { transaction, lock: transaction.LOCK.UPDATE });
    const redemptions = await CouponRedemption.destroy({ where: { couponId: order.couponId, orderId: order.id }, transaction });
    if (coupon && redemptions) await coupon.update({ usageCount: Math.max(0, coupon.usageCount - redemptions) }, { transaction });
  }
  await order.update({ status }, { transaction });
  if (statusChanged) {
    await notificationService.createForUser(order.userId, { type: 'order_status_changed', title: 'Order status updated', message: 'Your order ' + order.orderNumber + ' is now ' + status.replaceAll('_', ' ') + '.', entityType: 'order', entityId: order.id, metadata: { orderNumber: order.orderNumber, status } }, { transaction });
  }
  return Order.findByPk(id, { include: orderInclude, transaction });
});
module.exports = { checkout, listMyOrders, getMyOrder, listOrders, updateStatus };
