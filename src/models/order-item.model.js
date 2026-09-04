const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('OrderItem', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  orderId: { type: DataTypes.UUID, allowNull: false },
  productId: DataTypes.UUID,
  variantId: DataTypes.UUID,
  productName: { type: DataTypes.STRING(180), allowNull: false },
  variantName: DataTypes.STRING(120),
  sku: DataTypes.STRING(100),
  unitPrice: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  lineTotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
}, { tableName: 'order_items', timestamps: true });
