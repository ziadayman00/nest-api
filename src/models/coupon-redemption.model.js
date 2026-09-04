const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('CouponRedemption', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  couponId: { type: DataTypes.UUID, allowNull: false },
  userId: { type: DataTypes.UUID, allowNull: false },
  orderId: { type: DataTypes.UUID, allowNull: false },
}, { tableName: 'coupon_redemptions', timestamps: true });
