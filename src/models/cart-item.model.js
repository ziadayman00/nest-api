const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('CartItem', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  cartId: { type: DataTypes.UUID, allowNull: false },
  productId: { type: DataTypes.UUID, allowNull: false },
  variantId: DataTypes.UUID,
  quantity: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'cart_items', timestamps: true });
