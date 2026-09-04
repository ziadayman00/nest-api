const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('ProductRecommendation', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  productId: { type: DataTypes.UUID, allowNull: false },
  recommendedProductId: { type: DataTypes.UUID, allowNull: false },
  type: { type: DataTypes.ENUM('complete_the_look', 'similar', 'frequently_bought_together'), allowNull: false },
  sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, { tableName: 'product_recommendations', timestamps: true });
