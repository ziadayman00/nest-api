const { WishlistItem, Product, ProductImage, Category } = require('../models');
const AppError = require('../utils/app-error');

const productInclude = [
  { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
  { model: ProductImage, as: 'images', separate: true, limit: 1, order: [['sortOrder', 'ASC']] },
];

const getWishlist = (userId) => WishlistItem.findAll({
  where: { userId },
  include: [{ model: Product, as: 'product', required: true, include: productInclude }],
  order: [['createdAt', 'DESC']],
});

const addProduct = async (userId, productId) => {
  const product = await Product.findOne({ where: { id: productId, isActive: true } });
  if (!product) throw new AppError('Product not found', 404);

  const existingItem = await WishlistItem.findOne({ where: { userId, productId } });
  if (existingItem) throw new AppError('Product is already in your wishlist', 409);

  try {
    return await WishlistItem.create({ userId, productId });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new AppError('Product is already in your wishlist', 409);
    }
    throw error;
  }
};

const removeProduct = async (userId, productId) => {
  const item = await WishlistItem.findOne({ where: { userId, productId } });
  if (!item) throw new AppError('Product is not in your wishlist', 404);
  await item.destroy();
};

module.exports = { getWishlist, addProduct, removeProduct };
