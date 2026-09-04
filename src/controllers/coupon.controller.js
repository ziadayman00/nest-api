const couponService = require('../services/coupon.service');

const createCoupon = async (req, res) => res.status(201).json({ status: 'success', data: { coupon: await couponService.createCoupon(req.body) } });
const listCoupons = async (req, res) => res.status(200).json({ status: 'success', data: await couponService.listCoupons(req.query) });
const updateCoupon = async (req, res) => res.status(200).json({ status: 'success', data: { coupon: await couponService.updateCoupon(req.params.id, req.body) } });
const deactivateCoupon = async (req, res) => { await couponService.deactivateCoupon(req.params.id); return res.status(204).send(); };

module.exports = { createCoupon, listCoupons, updateCoupon, deactivateCoupon };
