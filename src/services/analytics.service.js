const { Op, fn, col } = require('sequelize');
const sequelize = require('../config/db');
const { Order, OrderItem, User } = require('../models');
const AppError = require('../utils/app-error');

const toNumber = (value) => Number(value || 0);
const getDateRange = (query) => {
  const to = query.to ? new Date(query.to) : new Date();
  const from = query.from ? new Date(query.from) : new Date(to.getTime() - (29 * 24 * 60 * 60 * 1000));
  if (from > to) throw new AppError('from must be earlier than or equal to to', 400);
  return { from, to };
};

const getOverview = async (query) => {
  const { from, to } = getDateRange(query);
  const dateWhere = { createdAt: { [Op.between]: [from, to] } };
  const deliveredWhere = { ...dateWhere, status: 'delivered' };
  const [sales, ordersByStatus, customers, topProducts, couponImpact, revenueByDay] = await Promise.all([
    Order.findOne({ where: deliveredWhere, attributes: [[fn('COUNT', col('id')), 'orderCount'], [fn('COALESCE', fn('SUM', col('totalAmount')), 0), 'revenue'], [fn('COALESCE', fn('AVG', col('totalAmount')), 0), 'averageOrderValue']], raw: true }),
    Order.findAll({ where: dateWhere, attributes: ['status', [fn('COUNT', col('id')), 'count']], group: ['status'], raw: true }),
    User.count({ where: { role: 'customer', createdAt: { [Op.between]: [from, to] } } }),
    OrderItem.findAll({ attributes: ['productId', 'productName', [fn('SUM', col('quantity')), 'quantitySold'], [fn('SUM', col('lineTotal')), 'revenue']], include: [{ model: Order, as: 'order', attributes: [], where: deliveredWhere, required: true }], group: ['OrderItem.productId', 'OrderItem.productName'], order: [[fn('SUM', col('quantity')), 'DESC']], limit: 5, raw: true }),
    Order.findOne({ where: { ...deliveredWhere, couponId: { [Op.ne]: null } }, attributes: [[fn('COUNT', col('id')), 'ordersWithCoupon'], [fn('COALESCE', fn('SUM', col('discountAmount')), 0), 'discountGiven']], raw: true }),
    sequelize.query("SELECT DATE_TRUNC('day', \"createdAt\")::date AS day, COUNT(*)::int AS \"orderCount\", COALESCE(SUM(\"totalAmount\"), 0)::numeric AS revenue FROM orders WHERE status = 'delivered' AND \"createdAt\" BETWEEN :from AND :to GROUP BY 1 ORDER BY 1 ASC", { replacements: { from, to }, type: sequelize.QueryTypes.SELECT }),
  ]);
  return {
    period: { from, to },
    summary: { deliveredOrderCount: toNumber(sales.orderCount), deliveredRevenue: toNumber(sales.revenue), averageOrderValue: toNumber(sales.averageOrderValue), newCustomerCount: customers },
    ordersByStatus: ordersByStatus.map((item) => ({ status: item.status, count: toNumber(item.count) })),
    topProducts: topProducts.map((item) => ({ ...item, quantitySold: toNumber(item.quantitySold), revenue: toNumber(item.revenue) })),
    couponImpact: { ordersWithCoupon: toNumber(couponImpact.ordersWithCoupon), discountGiven: toNumber(couponImpact.discountGiven) },
    revenueByDay: revenueByDay.map((item) => ({ ...item, orderCount: toNumber(item.orderCount), revenue: toNumber(item.revenue) })),
  };
};

module.exports = { getOverview };
