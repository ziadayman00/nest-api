const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('DesignRequestNote', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  designRequestId: { type: DataTypes.UUID, allowNull: false },
  adminId: { type: DataTypes.UUID, allowNull: false },
  body: { type: DataTypes.TEXT, allowNull: false },
}, { tableName: 'design_request_notes', timestamps: true });
