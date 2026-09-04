const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('DesignRequest', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  userId: DataTypes.UUID,
  fullName: { type: DataTypes.STRING(120), allowNull: false },
  phone: { type: DataTypes.STRING(40), allowNull: false },
  email: { type: DataTypes.STRING(254), allowNull: false },
  propertyType: { type: DataTypes.STRING(80), allowNull: false },
  roomCount: { type: DataTypes.INTEGER, allowNull: false },
  areaSquareMeters: DataTypes.DECIMAL(10, 2),
  preferredStyle: DataTypes.STRING(120),
  budget: DataTypes.DECIMAL(12, 2),
  notes: DataTypes.TEXT,
  status: { type: DataTypes.ENUM('pending', 'contacted', 'in_progress', 'completed', 'cancelled'), allowNull: false, defaultValue: 'pending' },
}, { tableName: 'design_requests', timestamps: true });
