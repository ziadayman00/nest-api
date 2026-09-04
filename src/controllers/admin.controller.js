const service = require('../services/admin.service');
const listCustomers = async (req, res) => res.status(200).json({ status: 'success', data: await service.listCustomers(req.query) });
const getCustomer = async (req, res) => res.status(200).json({ status: 'success', data: { customer: await service.getCustomer(req.params.id) } });
module.exports = { listCustomers, getCustomer };
