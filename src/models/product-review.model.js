const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('ProductReview', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  userId: { type: DataTypes.UUID, allowNull: false },
  productId: { type: DataTypes.UUID, allowNull: false },
  rating: { type: DataTypes.SMALLINT, allowNull: false, validate: { min: 1, max: 5 } },
  title: { type: DataTypes.STRING(160), allowNull: true },
  body: { type: DataTypes.TEXT, allowNull: false, validate: { len: [20, 5000] } },
  status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), allowNull: false, defaultValue: 'pending' },
  moderationNote: { type: DataTypes.TEXT, allowNull: true },
  moderatedBy: { type: DataTypes.UUID, allowNull: true },
  moderatedAt: { type: DataTypes.DATE, allowNull: true },
  images: { type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [], allowNull: true },
}, { tableName: 'product_reviews', timestamps: true });
