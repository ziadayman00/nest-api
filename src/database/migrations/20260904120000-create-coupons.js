'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('coupons', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4, allowNull: false },
      code: { type: Sequelize.STRING(64), allowNull: false, unique: true },
      type: { type: Sequelize.ENUM('percentage', 'fixed'), allowNull: false },
      value: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      minimumOrderAmount: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      maximumDiscountAmount: { type: Sequelize.DECIMAL(12, 2), allowNull: true },
      startsAt: { type: Sequelize.DATE, allowNull: true },
      endsAt: { type: Sequelize.DATE, allowNull: true },
      usageLimit: { type: Sequelize.INTEGER, allowNull: true },
      usageCount: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      perUserLimit: { type: Sequelize.INTEGER, allowNull: true },
      isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addConstraint('coupons', { fields: ['value'], type: 'check', where: { value: { [Sequelize.Op.gt]: 0 } }, name: 'coupons_value_positive' });
    await queryInterface.addConstraint('coupons', { fields: ['minimumOrderAmount'], type: 'check', where: { minimumOrderAmount: { [Sequelize.Op.gte]: 0 } }, name: 'coupons_minimum_order_non_negative' });
    await queryInterface.addConstraint('coupons', { fields: ['usageCount'], type: 'check', where: { usageCount: { [Sequelize.Op.gte]: 0 } }, name: 'coupons_usage_count_non_negative' });
    await queryInterface.addIndex('coupons', ['isActive', 'startsAt', 'endsAt']);

    await queryInterface.addColumn('orders', 'couponId', { type: Sequelize.UUID, allowNull: true, references: { model: 'coupons', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' });
    await queryInterface.addColumn('orders', 'couponCode', { type: Sequelize.STRING(64), allowNull: true });
    await queryInterface.addColumn('orders', 'discountAmount', { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 });

    await queryInterface.createTable('coupon_redemptions', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4, allowNull: false },
      couponId: { type: Sequelize.UUID, allowNull: false, references: { model: 'coupons', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      userId: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      orderId: { type: Sequelize.UUID, allowNull: false, references: { model: 'orders', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addConstraint('coupon_redemptions', { fields: ['couponId', 'orderId'], type: 'unique', name: 'coupon_redemptions_coupon_order_unique' });
    await queryInterface.addIndex('coupon_redemptions', ['couponId', 'userId']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('coupon_redemptions');
    await queryInterface.removeColumn('orders', 'discountAmount');
    await queryInterface.removeColumn('orders', 'couponCode');
    await queryInterface.removeColumn('orders', 'couponId');
    await queryInterface.dropTable('coupons');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_coupons_type";');
  },
};
