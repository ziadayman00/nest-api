const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('Order', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  userId: { type: DataTypes.UUID, allowNull: false },
  orderNumber: { type: DataTypes.STRING(40), allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'), allowNull: false },
  paymentMethod: { type: DataTypes.ENUM('cash_on_delivery'), allowNull: false },
  paymentStatus: { type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'), allowNull: false },
  subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  shippingFee: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  totalAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  couponId: { type: DataTypes.UUID, allowNull: true },
  couponCode: { type: DataTypes.STRING(64), allowNull: true },
  discountAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  deliveryZoneId: { type: DataTypes.UUID, allowNull: true },
  deliveryZoneName: { type: DataTypes.STRING(120), allowNull: true },
  estimatedDeliveryMinDays: { type: DataTypes.INTEGER, allowNull: true },
  estimatedDeliveryMaxDays: { type: DataTypes.INTEGER, allowNull: true },
  shippingAddress: { type: DataTypes.JSONB, allowNull: false },
}, { tableName: 'orders', timestamps: true });
