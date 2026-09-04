'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('styles', {
      id: { type: Sequelize.UUID, allowNull: false, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      name: { type: Sequelize.STRING(120), allowNull: false, unique: true },
      slug: { type: Sequelize.STRING(140), allowNull: false, unique: true },
      description: Sequelize.TEXT,
      imageUrl: Sequelize.TEXT,
      isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('product_styles', {
      productId: { type: Sequelize.UUID, allowNull: false, references: { model: 'products', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      styleId: { type: Sequelize.UUID, allowNull: false, references: { model: 'styles', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addConstraint('product_styles', { fields: ['productId', 'styleId'], type: 'unique', name: 'product_styles_product_style_unique' });

    await queryInterface.createTable('collections', {
      id: { type: Sequelize.UUID, allowNull: false, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      name: { type: Sequelize.STRING(160), allowNull: false },
      slug: { type: Sequelize.STRING(180), allowNull: false, unique: true },
      description: Sequelize.TEXT,
      heroImageUrl: Sequelize.TEXT,
      roomType: Sequelize.STRING(80),
      isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('collection_products', {
      collectionId: { type: Sequelize.UUID, allowNull: false, references: { model: 'collections', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      productId: { type: Sequelize.UUID, allowNull: false, references: { model: 'products', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      sortOrder: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addConstraint('collection_products', { fields: ['collectionId', 'productId'], type: 'unique', name: 'collection_products_collection_product_unique' });

    await queryInterface.createTable('product_recommendations', {
      id: { type: Sequelize.UUID, allowNull: false, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      productId: { type: Sequelize.UUID, allowNull: false, references: { model: 'products', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      recommendedProductId: { type: Sequelize.UUID, allowNull: false, references: { model: 'products', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      type: { type: Sequelize.ENUM('complete_the_look', 'similar', 'frequently_bought_together'), allowNull: false, defaultValue: 'complete_the_look' },
      sortOrder: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addConstraint('product_recommendations', { fields: ['productId', 'recommendedProductId'], type: 'unique', name: 'product_recommendations_product_unique' });
    await queryInterface.addIndex('product_recommendations', ['productId', 'type', 'sortOrder']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('product_recommendations');
    await queryInterface.dropTable('collection_products');
    await queryInterface.dropTable('collections');
    await queryInterface.dropTable('product_styles');
    await queryInterface.dropTable('styles');
  },
};
