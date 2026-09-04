const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('DeliveryZone', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  name: { type: DataTypes.STRING(120), allowNull: false },
  city: { type: DataTypes.STRING(100), allowNull: false, unique: true, set(value) { this.setDataValue('city', value.trim().toLowerCase()); } },
  shippingFee: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  freeShippingThreshold: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  estimatedDeliveryMinDays: { type: DataTypes.INTEGER, allowNull: false },
  estimatedDeliveryMaxDays: { type: DataTypes.INTEGER, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, { tableName: 'delivery_zones', timestamps: true });
