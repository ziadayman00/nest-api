const { Cart, CartItem, Product, ProductVariant } = require('../models');
const AppError = require('../utils/app-error');

const cartInclude = [{ model: CartItem, as: 'items', include: [{ model: Product, as: 'product' }, { model: ProductVariant, as: 'variant' }] }];
const getCart = async (userId) => {
  let cart = await Cart.findOne({ where: { userId }, include: cartInclude });
  if (!cart) cart = await Cart.create({ userId });
  if (!cart.items) cart = await Cart.findByPk(cart.id, { include: cartInclude });
  return cart;
};
const addItem = async (userId, { productId, variantId = null, quantity }) => {
  const product = await Product.findByPk(productId);
  if (!product || !product.isActive) throw new AppError('Product not found', 404);
  let variant = null;
  if (variantId) {
    variant = await ProductVariant.findOne({ where: { id: variantId, productId, isActive: true } });
    if (!variant) throw new AppError('Product variant not found', 404);
  }
  const stock = variant ? variant.stockQuantity : product.stockQuantity;
  const cart = await getCart(userId);
  const item = await CartItem.findOne({ where: { cartId: cart.id, productId, variantId } });
  const desiredQuantity = (item?.quantity || 0) + quantity;
  if (desiredQuantity > stock) throw new AppError('Requested quantity exceeds available stock', 409);
  if (item) await item.update({ quantity: desiredQuantity });
  else await CartItem.create({ cartId: cart.id, productId, variantId, quantity });
  return getCart(userId);
};
const updateItem = async (userId, itemId, quantity) => {
  const cart = await getCart(userId);
  const item = await CartItem.findOne({ where: { id: itemId, cartId: cart.id }, include: [{ model: Product, as: 'product' }, { model: ProductVariant, as: 'variant' }] });
  if (!item) throw new AppError('Cart item not found', 404);
  const stock = item.variant ? item.variant.stockQuantity : item.product.stockQuantity;
  if (quantity > stock) throw new AppError('Requested quantity exceeds available stock', 409);
  await item.update({ quantity });
  return getCart(userId);
};
const removeItem = async (userId, itemId) => {
  const cart = await getCart(userId);
  const item = await CartItem.findOne({ where: { id: itemId, cartId: cart.id } });
  if (!item) throw new AppError('Cart item not found', 404);
  await item.destroy();
};
module.exports = { getCart, addItem, updateItem, removeItem };
