const User = require('./user.model');
const Category = require('./category.model');
const Product = require('./product.model');
const ProductVariant = require('./product-variant.model');
const ProductImage = require('./product-image.model');
const Cart = require('./cart.model');
const CartItem = require('./cart-item.model');
const Order = require('./order.model');
const OrderItem = require('./order-item.model');
const DesignRequest = require('./design-request.model');
const DesignRequestImage = require('./design-request-image.model');
const DesignRequestNote = require('./design-request-note.model');
const Style = require('./style.model');
const ProductStyle = require('./product-style.model');
const Collection = require('./collection.model');
const CollectionProduct = require('./collection-product.model');
const ProductRecommendation = require('./product-recommendation.model');
const WishlistItem = require('./wishlist-item.model');
const ProductReview = require('./product-review.model');
const Coupon = require('./coupon.model');
const CouponRedemption = require('./coupon-redemption.model');
const DeliveryZone = require('./delivery-zone.model');
const Notification = require('./notification.model');

Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Product.hasMany(ProductVariant, { foreignKey: 'productId', as: 'variants' });
ProductVariant.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
User.hasOne(Cart, { foreignKey: 'userId', as: 'cart' });
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
CartItem.belongsTo(ProductVariant, { foreignKey: 'variantId', as: 'variant' });
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
OrderItem.belongsTo(ProductVariant, { foreignKey: 'variantId', as: 'variant' });
User.hasMany(DesignRequest, { foreignKey: 'userId', as: 'designRequests' });
DesignRequest.belongsTo(User, { foreignKey: 'userId', as: 'user' });
DesignRequest.hasMany(DesignRequestImage, { foreignKey: 'designRequestId', as: 'images' });
DesignRequestImage.belongsTo(DesignRequest, { foreignKey: 'designRequestId', as: 'designRequest' });
DesignRequest.hasMany(DesignRequestNote, { foreignKey: 'designRequestId', as: 'internalNotes' });
DesignRequestNote.belongsTo(DesignRequest, { foreignKey: 'designRequestId', as: 'designRequest' });
DesignRequestNote.belongsTo(User, { foreignKey: 'adminId', as: 'admin' });
Product.belongsToMany(Style, { through: ProductStyle, foreignKey: 'productId', otherKey: 'styleId', as: 'styles' });
Style.belongsToMany(Product, { through: ProductStyle, foreignKey: 'styleId', otherKey: 'productId', as: 'products' });
Collection.belongsToMany(Product, { through: CollectionProduct, foreignKey: 'collectionId', otherKey: 'productId', as: 'products' });
Product.belongsToMany(Collection, { through: CollectionProduct, foreignKey: 'productId', otherKey: 'collectionId', as: 'collections' });
Product.hasMany(ProductRecommendation, { foreignKey: 'productId', as: 'recommendations' });
ProductRecommendation.belongsTo(Product, { foreignKey: 'recommendedProductId', as: 'recommendedProduct' });
User.hasMany(WishlistItem, { foreignKey: 'userId', as: 'wishlistItems' });
WishlistItem.belongsTo(User, { foreignKey: 'userId', as: 'user' });
WishlistItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
User.hasMany(ProductReview, { foreignKey: 'userId', as: 'reviews' });
ProductReview.belongsTo(User, { foreignKey: 'userId', as: 'reviewer' });
Product.hasMany(ProductReview, { foreignKey: 'productId', as: 'reviews' });
ProductReview.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
ProductReview.belongsTo(User, { foreignKey: 'moderatedBy', as: 'moderator' });
Coupon.hasMany(CouponRedemption, { foreignKey: 'couponId', as: 'redemptions' });
CouponRedemption.belongsTo(Coupon, { foreignKey: 'couponId', as: 'coupon' });
CouponRedemption.belongsTo(User, { foreignKey: 'userId', as: 'customer' });
CouponRedemption.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
Order.belongsTo(Coupon, { foreignKey: 'couponId', as: 'coupon' });
DeliveryZone.hasMany(Order, { foreignKey: 'deliveryZoneId', as: 'orders' });
Order.belongsTo(DeliveryZone, { foreignKey: 'deliveryZoneId', as: 'deliveryZone' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  User, Category, Product, ProductVariant, ProductImage, Cart, CartItem, Order, OrderItem,
  DesignRequest, DesignRequestImage, DesignRequestNote,
  Style, ProductStyle, Collection, CollectionProduct, ProductRecommendation,
  WishlistItem,
  ProductReview,
  Coupon, CouponRedemption,
  DeliveryZone,
  Notification,
};
