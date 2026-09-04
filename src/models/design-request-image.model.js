const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('DesignRequestImage', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  designRequestId: { type: DataTypes.UUID, allowNull: false },
  url: { type: DataTypes.TEXT, allowNull: false },
}, { tableName: 'design_request_images', timestamps: true });
