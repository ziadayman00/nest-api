const catalogService = require('../services/catalog.service');

const send = (res, statusCode, data) => res.status(statusCode).json({ status: 'success', data });

const listCategories = async (req, res) => send(res, 200, { categories: await catalogService.listCategories() });
const listProducts = async (req, res) => send(res, 200, await catalogService.listProducts(req.query));
const getProduct = async (req, res) => send(res, 200, { product: await catalogService.getProduct(req.params.slug) });
const createCategory = async (req, res) => send(res, 201, { category: await catalogService.createCategory(req.body) });
const updateCategory = async (req, res) => send(res, 200, { category: await catalogService.updateCategory(req.params.id, req.body) });
const deactivateCategory = async (req, res) => { await catalogService.deactivateCategory(req.params.id); return res.status(204).send(); };
const createProduct = async (req, res) => send(res, 201, { product: await catalogService.createProduct(req.body) });
const updateProduct = async (req, res) => send(res, 200, { product: await catalogService.updateProduct(req.params.id, req.body) });
const deactivateProduct = async (req, res) => { await catalogService.deactivateProduct(req.params.id); return res.status(204).send(); };
const addVariant = async (req, res) => send(res, 201, { variant: await catalogService.addVariant(req.params.id, req.body) });
const updateVariant = async (req, res) => send(res, 200, { variant: await catalogService.updateVariant(req.params.id, req.params.variantId, req.body) });
const deactivateVariant = async (req, res) => { await catalogService.deactivateVariant(req.params.id, req.params.variantId); return res.status(204).send(); };
const addImage = async (req, res) => {
  const url = req.file ? req.file.path : req.body.url;
  const altText = req.body.altText || (req.file ? req.file.originalname : '');
  const sortOrder = Number(req.body.sortOrder || 0);
  send(res, 201, { image: await catalogService.addImage(req.params.id, { url, altText, sortOrder }) });
};

module.exports = { listCategories, listProducts, getProduct, createCategory, updateCategory, deactivateCategory, createProduct, updateProduct, deactivateProduct, addVariant, updateVariant, deactivateVariant, addImage };
