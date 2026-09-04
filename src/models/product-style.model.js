const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('ProductStyle', {
  productId: { type: DataTypes.UUID, allowNull: false },
  styleId: { type: DataTypes.UUID, allowNull: false },
}, { tableName: 'product_styles', timestamps: true });
