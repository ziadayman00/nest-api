'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_reviews', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4, allowNull: false },
      userId: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      productId: { type: Sequelize.UUID, allowNull: false, references: { model: 'products', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      rating: { type: Sequelize.SMALLINT, allowNull: false },
      title: { type: Sequelize.STRING(160), allowNull: true },
      body: { type: Sequelize.TEXT, allowNull: false },
      status: { type: Sequelize.ENUM('pending', 'approved', 'rejected'), allowNull: false, defaultValue: 'pending' },
      moderationNote: { type: Sequelize.TEXT, allowNull: true },
      moderatedBy: { type: Sequelize.UUID, allowNull: true, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      moderatedAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.addConstraint('product_reviews', {
      fields: ['rating'], type: 'check', where: { rating: { [Sequelize.Op.between]: [1, 5] } }, name: 'product_reviews_rating_range',
    });
    await queryInterface.addConstraint('product_reviews', {
      fields: ['userId', 'productId'], type: 'unique', name: 'product_reviews_user_product_unique',
    });
    await queryInterface.addIndex('product_reviews', ['productId', 'status', 'createdAt']);
    await queryInterface.addIndex('product_reviews', ['status', 'createdAt']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('product_reviews');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_product_reviews_status";');
  },
};
