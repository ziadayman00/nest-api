const { Style, Product, ProductImage, ProductStyle, Collection, CollectionProduct, ProductRecommendation } = require('../models');
const AppError = require('../utils/app-error');
const toSlug = require('../utils/slug');

const productCardInclude = [{ model: ProductImage, as: 'images', separate: true, limit: 1, order: [['sortOrder', 'ASC']] }];

const createStyle = async (data) => {
  const slug = toSlug(data.name);
  if (await Style.findOne({ where: { slug } })) throw new AppError('Style already exists', 409);
  return Style.create({ ...data, slug });
};
const listStyles = () => Style.findAll({ where: { isActive: true }, order: [['name', 'ASC']] });
const updateStyle = async (id, data) => {
  const style = await Style.findByPk(id);
  if (!style) throw new AppError('Style not found', 404);
  if (data.name) data.slug = toSlug(data.name);
  await style.update(data);
  return style;
};

const createCollection = async (data) => {
  const slug = toSlug(data.name);
  if (await Collection.findOne({ where: { slug } })) throw new AppError('Collection already exists', 409);
  return Collection.create({ ...data, slug });
};
const listCollections = () => Collection.findAll({ where: { isActive: true }, order: [['createdAt', 'DESC']] });
const getCollection = async (slug) => {
  const collection = await Collection.findOne({ where: { slug, isActive: true }, include: [{ model: Product, as: 'products', where: { isActive: true }, required: false, through: { attributes: ['sortOrder'] }, include: productCardInclude }] });
  if (!collection) throw new AppError('Collection not found', 404);
  return collection;
};
const addProductToCollection = async (collectionId, data) => {
  const collection = await Collection.findByPk(collectionId);
  if (!collection) throw new AppError('Collection not found', 404);
  const product = await Product.findByPk(data.productId);
  if (!product) throw new AppError('Product not found', 404);
  if (await CollectionProduct.findOne({ where: { collectionId, productId: data.productId } })) throw new AppError('Product is already in this collection', 409);
  return CollectionProduct.create({ collectionId, ...data });
};
const addStyleToProduct = async (productId, styleId) => {
  if (!await Product.findByPk(productId)) throw new AppError('Product not found', 404);
  if (!await Style.findByPk(styleId)) throw new AppError('Style not found', 404);
  if (await ProductStyle.findOne({ where: { productId, styleId } })) throw new AppError('Style is already assigned to this product', 409);
  return ProductStyle.create({ productId, styleId });
};
const addRecommendation = async (productId, data) => {
  if (productId === data.recommendedProductId) throw new AppError('A product cannot recommend itself', 400);
  if (!await Product.findByPk(productId) || !await Product.findByPk(data.recommendedProductId)) throw new AppError('Product not found', 404);
  if (await ProductRecommendation.findOne({ where: { productId, recommendedProductId: data.recommendedProductId } })) throw new AppError('Recommendation already exists', 409);
  return ProductRecommendation.create({ productId, ...data });
};
const getRecommendations = async (slug, type) => {
  const product = await Product.findOne({ where: { slug, isActive: true } });
  if (!product) throw new AppError('Product not found', 404);
  const where = { productId: product.id };
  if (type) where.type = type;
  const recommendations = await ProductRecommendation.findAll({ where, order: [['sortOrder', 'ASC']], include: [{ model: Product, as: 'recommendedProduct', where: { isActive: true }, include: productCardInclude }] });
  return recommendations;
};

module.exports = { createStyle, listStyles, updateStyle, createCollection, listCollections, getCollection, addProductToCollection, addStyleToProduct, addRecommendation, getRecommendations };
