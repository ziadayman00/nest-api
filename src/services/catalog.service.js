const { Op } = require('sequelize');
const { Category, Product, ProductVariant, ProductImage, Style } = require('../models');
const AppError = require('../utils/app-error');
const toSlug = require('../utils/slug');
const getPagination = require('../utils/pagination');

const createCategory = async ({ name, description }) => {
  const slug = toSlug(name);
  const exists = await Category.findOne({ where: { [Op.or]: [{ name }, { slug }] } });
  if (exists) throw new AppError('Category already exists', 409);
  return Category.create({ name, slug, description });
};

const listCategories = () => Category.findAll({ where: { isActive: true }, order: [['name', 'ASC']] });

const getCategory = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) throw new AppError('Category not found', 404);
  return category;
};

const updateCategory = async (id, data) => {
  const category = await getCategory(id);
  if (data.name && data.name !== category.name) data.slug = toSlug(data.name);
  await category.update(data);
  return category;
};

const deactivateCategory = async (id) => {
  const category = await getCategory(id);
  if (await Product.count({ where: { categoryId: id, isActive: true } })) throw new AppError('Cannot deactivate a category with active products', 409);
  await category.update({ isActive: false });
};

const createProduct = async (data) => {
  const category = await Category.findByPk(data.categoryId);
  if (!category || !category.isActive) throw new AppError('Category not found', 404);
  const slug = toSlug(data.name);
  if (await Product.findOne({ where: { slug } })) throw new AppError('Product name already exists', 409);
  return Product.create({ ...data, slug });
};

const listProducts = async (query) => {
  const { page, limit, offset } = getPagination(query);
  const where = { isActive: true };
  if (query.category) where.categoryId = query.category;
  if (query.minPrice && query.maxPrice && Number(query.minPrice) > Number(query.maxPrice)) throw new AppError('Minimum price cannot exceed maximum price', 400);
  if (query.search) where[Op.or] = [
    { name: { [Op.iLike]: '%' + query.search + '%' } },
    { material: { [Op.iLike]: '%' + query.search + '%' } },
    { description: { [Op.iLike]: '%' + query.search + '%' } },
  ];
  if (query.material) where.material = { [Op.iLike]: '%' + query.material + '%' };
  if (query.minPrice || query.maxPrice) where.price = {
    ...(query.minPrice && { [Op.gte]: query.minPrice }),
    ...(query.maxPrice && { [Op.lte]: query.maxPrice }),
  };
  if (query.inStock === 'true') where.stockQuantity = { [Op.gt]: 0 };
  const styleSlugs = query.styles ? [...new Set(query.styles.split(',').map((slug) => slug.trim().toLowerCase()).filter(Boolean))] : [];
  const allowedSorts = { newest: ['createdAt', 'DESC'], price_asc: ['price', 'ASC'], price_desc: ['price', 'DESC'], name: ['name', 'ASC'], name_asc: ['name', 'ASC'], name_desc: ['name', 'DESC'] };
  const categoryInclude = { model: Category, as: 'category', attributes: ['id', 'name', 'slug'], ...(query.categorySlug && { where: { slug: query.categorySlug }, required: true }) };
  const styleInclude = { model: Style, as: 'styles', attributes: ['id', 'name', 'slug'], through: { attributes: [] }, ...(styleSlugs.length && { where: { slug: { [Op.in]: styleSlugs }, isActive: true }, required: true }) };
  const { count, rows } = await Product.findAndCountAll({
    where, limit, offset, distinct: true, order: [allowedSorts[query.sort] || allowedSorts.newest],
    include: [categoryInclude, styleInclude, { model: ProductImage, as: 'images', separate: true, limit: 1, order: [['sortOrder', 'ASC']] }],
  });
  return { products: rows, pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) } };
};

const getProduct = async (slug) => {
  const product = await Product.findOne({
    where: { slug, isActive: true },
    include: [{ model: Category, as: 'category' }, { model: ProductVariant, as: 'variants', where: { isActive: true }, required: false }, { model: ProductImage, as: 'images', order: [['sortOrder', 'ASC']] }],
  });
  if (!product) throw new AppError('Product not found', 404);
  return product;
};

const getProductForAdmin = async (id) => {
  const product = await Product.findByPk(id, { include: [{ model: ProductVariant, as: 'variants' }, { model: ProductImage, as: 'images' }] });
  if (!product) throw new AppError('Product not found', 404);
  return product;
};

const updateProduct = async (id, data) => {
  const product = await getProductForAdmin(id);
  if (data.categoryId) {
    const category = await Category.findByPk(data.categoryId);
    if (!category) throw new AppError('Category not found', 404);
  }
  if (data.name && data.name !== product.name) data.slug = toSlug(data.name);
  await product.update(data);
  return product;
};

const deactivateProduct = async (id) => {
  const product = await getProductForAdmin(id);
  await product.update({ isActive: false });
};

const addVariant = async (productId, data) => {
  await getProductForAdmin(productId);
  if (await ProductVariant.findOne({ where: { sku: data.sku } })) throw new AppError('SKU already exists', 409);
  return ProductVariant.create({ productId, ...data });
};

const updateVariant = async (productId, variantId, data) => {
  const variant = await ProductVariant.findOne({ where: { id: variantId, productId } });
  if (!variant) throw new AppError('Product variant not found', 404);
  if (data.sku && data.sku !== variant.sku && await ProductVariant.findOne({ where: { sku: data.sku } })) throw new AppError('SKU already exists', 409);
  await variant.update(data);
  return variant;
};

const deactivateVariant = async (productId, variantId) => {
  const variant = await ProductVariant.findOne({ where: { id: variantId, productId } });
  if (!variant) throw new AppError('Product variant not found', 404);
  await variant.update({ isActive: false });
};

const addImage = async (productId, data) => {
  await getProductForAdmin(productId);
  return ProductImage.create({ productId, ...data });
};

module.exports = { createCategory, listCategories, updateCategory, deactivateCategory, createProduct, listProducts, getProduct, updateProduct, deactivateProduct, addVariant, updateVariant, deactivateVariant, addImage };
