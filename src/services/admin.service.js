const { User, Order, OrderItem, DesignRequest } = require('../models');
const AppError = require('../utils/app-error');
const getPagination = require('../utils/pagination');

const listCustomers = async (query) => {
  const { page, limit, offset } = getPagination(query);
  const { count, rows } = await User.findAndCountAll({
    where: { role: 'customer' }, attributes: { exclude: ['passwordHash'] }, order: [['createdAt', 'DESC']], limit, offset,
  });
  return { customers: rows, pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) } };
};
const getCustomer = async (id) => {
  const customer = await User.findOne({ where: { id, role: 'customer' }, attributes: { exclude: ['passwordHash'] }, include: [{ model: Order, as: 'orders', include: [{ model: OrderItem, as: 'items' }], order: [['createdAt', 'DESC']] }, { model: DesignRequest, as: 'designRequests', order: [['createdAt', 'DESC']] }] });
  if (!customer) throw new AppError('Customer not found', 404);
  return customer;
};
module.exports = { listCustomers, getCustomer };
