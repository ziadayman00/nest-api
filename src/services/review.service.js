const { fn, col } = require('sequelize');
const { ProductReview, Product, User, Order, OrderItem } = require('../models');
const AppError = require('../utils/app-error');
const getPagination = require('../utils/pagination');
const notificationService = require('./notification.service');

const reviewerInclude = [{ model: User, as: 'reviewer', attributes: ['id', 'fullName'] }];

const createReview = async (userId, productId, data) => {
  const product = await Product.findOne({ where: { id: productId, isActive: true } });
  if (!product) throw new AppError('Product not found', 404);

  const deliveredOrderItem = await OrderItem.findOne({
    where: { productId },
    include: [{ model: Order, as: 'order', where: { userId, status: 'delivered' }, required: true }],
  });
  if (!deliveredOrderItem) throw new AppError('You can review a product only after it has been delivered', 403);
  if (await ProductReview.findOne({ where: { userId, productId } })) throw new AppError('You have already reviewed this product', 409);

  try {
    const review = await ProductReview.create({ userId, productId, ...data });
    await notificationService.notifyAdmins({ type: 'new_review', title: 'New review awaiting moderation', message: 'A new review was submitted for ' + product.name + '.', entityType: 'product_review', entityId: review.id, metadata: { productId: product.id } });
    return review;
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') throw new AppError('You have already reviewed this product', 409);
    throw error;
  }
};

const listProductReviews = async (slug, query) => {
  const product = await Product.findOne({ where: { slug, isActive: true }, attributes: ['id', 'name', 'slug'] });
  if (!product) throw new AppError('Product not found', 404);
  const { page, limit, offset } = getPagination(query);
  const where = { productId: product.id, status: 'approved' };
  const { count, rows } = await ProductReview.findAndCountAll({ where, include: reviewerInclude, limit, offset, order: [['createdAt', 'DESC']] });
  const summary = await ProductReview.findOne({
    where,
    attributes: [[fn('COUNT', col('id')), 'count'], [fn('AVG', col('rating')), 'averageRating']],
    raw: true,
  });
  return {
    product,
    reviews: rows,
    summary: { count: Number(summary.count), averageRating: Number(summary.averageRating || 0) },
    pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
  };
};

const listAdminReviews = async (query) => {
  const { page, limit, offset } = getPagination(query);
  const where = query.status ? { status: query.status } : {};
  const { count, rows } = await ProductReview.findAndCountAll({
    where,
    include: [
      { model: User, as: 'reviewer', attributes: ['id', 'fullName', 'email'] },
      { model: Product, as: 'product', attributes: ['id', 'name', 'slug'] },
      { model: User, as: 'moderator', attributes: ['id', 'fullName'] },
    ],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });
  return { reviews: rows, pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) } };
};

const moderateReview = async (reviewId, adminId, data) => {
  const review = await ProductReview.findByPk(reviewId);
  if (!review) throw new AppError('Review not found', 404);
  await review.update({ status: data.status, moderationNote: data.moderationNote || null, moderatedBy: adminId, moderatedAt: new Date() });
  await notificationService.createForUser(review.userId, { type: 'review_moderated', title: 'Review status updated', message: 'Your product review was ' + data.status + '.', entityType: 'product_review', entityId: review.id, metadata: { status: data.status } });
  return review;
};

module.exports = { createReview, listProductReviews, listAdminReviews, moderateReview };
