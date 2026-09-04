const { Coupon } = require('../models');
const AppError = require('../utils/app-error');
const getPagination = require('../utils/pagination');

const normalizeCode = (code) => code.trim().toUpperCase();
const validateDates = (data) => {
  if (data.startsAt && data.endsAt && new Date(data.startsAt) >= new Date(data.endsAt)) throw new AppError('Coupon end date must be after its start date', 400);
};
const createCoupon = async (data) => {
  validateDates(data);
  const code = normalizeCode(data.code);
  if (data.type === 'percentage' && Number(data.value) > 100) throw new AppError('Percentage coupon value cannot exceed 100', 400);
  if (await Coupon.findOne({ where: { code } })) throw new AppError('Coupon code already exists', 409);
  return Coupon.create({ ...data, code });
};
const listCoupons = async (query) => {
  const { page, limit, offset } = getPagination(query);
  const { count, rows } = await Coupon.findAndCountAll({ limit, offset, order: [['createdAt', 'DESC']] });
  return { coupons: rows, pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) } };
};
const updateCoupon = async (id, data) => {
  const coupon = await Coupon.findByPk(id);
  if (!coupon) throw new AppError('Coupon not found', 404);
  const next = { ...data };
  if (next.code) {
    next.code = normalizeCode(next.code);
    const duplicate = await Coupon.findOne({ where: { code: next.code } });
    if (duplicate && duplicate.id !== coupon.id) throw new AppError('Coupon code already exists', 409);
  }
  const type = next.type || coupon.type;
  const value = Number(next.value ?? coupon.value);
  if (type === 'percentage' && value > 100) throw new AppError('Percentage coupon value cannot exceed 100', 400);
  validateDates({ startsAt: next.startsAt ?? coupon.startsAt, endsAt: next.endsAt ?? coupon.endsAt });
  await coupon.update(next);
  return coupon;
};
const deactivateCoupon = async (id) => {
  const coupon = await Coupon.findByPk(id);
  if (!coupon) throw new AppError('Coupon not found', 404);
  await coupon.update({ isActive: false });
};

module.exports = { createCoupon, listCoupons, updateCoupon, deactivateCoupon, normalizeCode };
