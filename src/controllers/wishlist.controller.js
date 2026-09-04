const wishlistService = require('../services/wishlist.service');

const getWishlist = async (req, res) => {
  const wishlistItems = await wishlistService.getWishlist(req.user.id);
  const items = wishlistItems.map((item) => {
    const productData = item.product ? (item.product.toJSON ? item.product.toJSON() : item.product) : {};
    return {
      ...productData,
      id: productData.id || item.productId,
      productId: item.productId || productData.id,
      wishlistItemId: item.id,
      product: productData,
    };
  });

  return res.status(200).json({
    status: 'success',
    data: { items },
  });
};

const addProduct = async (req, res) => res.status(201).json({
  status: 'success',
  data: { item: await wishlistService.addProduct(req.user.id, req.params.productId) },
});

const removeProduct = async (req, res) => {
  await wishlistService.removeProduct(req.user.id, req.params.productId);
  return res.status(204).send();
};

module.exports = { getWishlist, addProduct, removeProduct };
