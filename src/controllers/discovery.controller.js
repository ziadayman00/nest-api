const discoveryService = require('../services/discovery.service');

const send = (res, statusCode, data) => res.status(statusCode).json({ status: 'success', data });
const listStyles = async (req, res) => send(res, 200, { styles: await discoveryService.listStyles() });
const createStyle = async (req, res) => send(res, 201, { style: await discoveryService.createStyle(req.body) });
const updateStyle = async (req, res) => send(res, 200, { style: await discoveryService.updateStyle(req.params.id, req.body) });
const listCollections = async (req, res) => send(res, 200, { collections: await discoveryService.listCollections() });
const getCollection = async (req, res) => send(res, 200, { collection: await discoveryService.getCollection(req.params.slug) });
const createCollection = async (req, res) => send(res, 201, { collection: await discoveryService.createCollection(req.body) });
const addProductToCollection = async (req, res) => send(res, 201, { collectionProduct: await discoveryService.addProductToCollection(req.params.id, req.body) });
const addStyleToProduct = async (req, res) => send(res, 201, { productStyle: await discoveryService.addStyleToProduct(req.params.id, req.body.styleId) });
const addRecommendation = async (req, res) => send(res, 201, { recommendation: await discoveryService.addRecommendation(req.params.id, req.body) });
const getRecommendations = async (req, res) => send(res, 200, { recommendations: await discoveryService.getRecommendations(req.params.slug, req.query.type) });

module.exports = { listStyles, createStyle, updateStyle, listCollections, getCollection, createCollection, addProductToCollection, addStyleToProduct, addRecommendation, getRecommendations };
