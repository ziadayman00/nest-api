const reviewService = require('../services/review.service');

const createReview = async (req, res) => {
  const images = (req.files || []).map((f) => f.path);
  const review = await reviewService.createReview(req.user.id, req.params.productId, { ...req.body, images });
  res.status(201).json({ status: 'success', data: { review } });
};

const listProductReviews = async (req, res) => res.status(200).json({ status: 'success', data: await reviewService.listProductReviews(req.params.slug, req.query) });
const listAdminReviews = async (req, res) => res.status(200).json({ status: 'success', data: await reviewService.listAdminReviews(req.query) });
const moderateReview = async (req, res) => res.status(200).json({
  status: 'success',
  data: { review: await reviewService.moderateReview(req.params.id, req.user.id, req.body) },
});

module.exports = { createReview, listProductReviews, listAdminReviews, moderateReview };
