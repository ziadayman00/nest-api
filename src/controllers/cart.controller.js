const cartService = require('../services/cart.service');
const getCart = async (req, res) => res.status(200).json({ status: 'success', data: { cart: await cartService.getCart(req.user.id) } });
const addItem = async (req, res) => res.status(200).json({ status: 'success', data: { cart: await cartService.addItem(req.user.id, req.body) } });
const updateItem = async (req, res) => res.status(200).json({ status: 'success', data: { cart: await cartService.updateItem(req.user.id, req.params.id, req.body.quantity) } });
const removeItem = async (req, res) => { await cartService.removeItem(req.user.id, req.params.id); return res.status(204).send(); };
module.exports = { getCart, addItem, updateItem, removeItem };
