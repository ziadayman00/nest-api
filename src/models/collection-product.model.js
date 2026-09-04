const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('CollectionProduct', {
  collectionId: { type: DataTypes.UUID, allowNull: false },
  productId: { type: DataTypes.UUID, allowNull: false },
  sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, { tableName: 'collection_products', timestamps: true });
