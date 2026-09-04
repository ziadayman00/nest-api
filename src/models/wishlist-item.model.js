const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('WishlistItem', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  userId: { type: DataTypes.UUID, allowNull: false },
  productId: { type: DataTypes.UUID, allowNull: false },
}, {
  tableName: 'wishlist_items',
  timestamps: true,
});
