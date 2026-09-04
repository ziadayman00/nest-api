const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('Coupon', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  code: { type: DataTypes.STRING(64), allowNull: false, unique: true, set(value) { this.setDataValue('code', value.trim().toUpperCase()); } },
  type: { type: DataTypes.ENUM('percentage', 'fixed'), allowNull: false },
  value: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  minimumOrderAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  maximumDiscountAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  startsAt: { type: DataTypes.DATE, allowNull: true },
  endsAt: { type: DataTypes.DATE, allowNull: true },
  usageLimit: { type: DataTypes.INTEGER, allowNull: true },
  usageCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  perUserLimit: { type: DataTypes.INTEGER, allowNull: true },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, { tableName: 'coupons', timestamps: true });
