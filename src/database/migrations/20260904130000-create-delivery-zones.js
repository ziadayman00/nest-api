'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('delivery_zones', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4, allowNull: false },
      name: { type: Sequelize.STRING(120), allowNull: false },
      city: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      shippingFee: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      freeShippingThreshold: { type: Sequelize.DECIMAL(12, 2), allowNull: true },
      estimatedDeliveryMinDays: { type: Sequelize.INTEGER, allowNull: false },
      estimatedDeliveryMaxDays: { type: Sequelize.INTEGER, allowNull: false },
      isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addConstraint('delivery_zones', { fields: ['shippingFee'], type: 'check', where: { shippingFee: { [Sequelize.Op.gte]: 0 } }, name: 'delivery_zones_shipping_fee_non_negative' });
    await queryInterface.addConstraint('delivery_zones', { fields: ['estimatedDeliveryMinDays'], type: 'check', where: { estimatedDeliveryMinDays: { [Sequelize.Op.gte]: 1 } }, name: 'delivery_zones_min_days_positive' });
    await queryInterface.addConstraint('delivery_zones', { fields: ['estimatedDeliveryMaxDays'], type: 'check', where: { estimatedDeliveryMaxDays: { [Sequelize.Op.gte]: 1 } }, name: 'delivery_zones_max_days_positive' });

    await queryInterface.addColumn('orders', 'deliveryZoneId', { type: Sequelize.UUID, allowNull: true, references: { model: 'delivery_zones', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' });
    await queryInterface.addColumn('orders', 'deliveryZoneName', { type: Sequelize.STRING(120), allowNull: true });
    await queryInterface.addColumn('orders', 'estimatedDeliveryMinDays', { type: Sequelize.INTEGER, allowNull: true });
    await queryInterface.addColumn('orders', 'estimatedDeliveryMaxDays', { type: Sequelize.INTEGER, allowNull: true });
    await queryInterface.addIndex('delivery_zones', ['isActive', 'city']);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('orders', 'estimatedDeliveryMaxDays');
    await queryInterface.removeColumn('orders', 'estimatedDeliveryMinDays');
    await queryInterface.removeColumn('orders', 'deliveryZoneName');
    await queryInterface.removeColumn('orders', 'deliveryZoneId');
    await queryInterface.dropTable('delivery_zones');
  },
};
