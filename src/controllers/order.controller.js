const orderService = require('../services/order.service');

const send = (res, data, status = 200) => res.status(status).json({ status: 'success', data });
const checkout = async (req, res) => send(res, { order: await orderService.checkout(req.user.id, req.body.shippingAddress, req.body.couponCode) }, 201);
const listMyOrders = async (req, res) => send(res, await orderService.listMyOrders(req.user.id, req.query));
const getMyOrder = async (req, res) => send(res, { order: await orderService.getMyOrder(req.user.id, req.params.id) });
const listOrders = async (req, res) => send(res, await orderService.listOrders(req.query));
const updateStatus = async (req, res) => send(res, { order: await orderService.updateStatus(req.params.id, req.body.status) });

module.exports = { checkout, listMyOrders, getMyOrder, listOrders, updateStatus };
