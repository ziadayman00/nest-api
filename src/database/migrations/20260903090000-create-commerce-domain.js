'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('categories', {
      id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
      name: { type: Sequelize.STRING(120), allowNull: false, unique: true },
      slug: { type: Sequelize.STRING(140), allowNull: false, unique: true },
      description: { type: Sequelize.TEXT },
      isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('products', {
      id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
      categoryId: { type: Sequelize.UUID, allowNull: false, references: { model: 'categories', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE' },
      name: { type: Sequelize.STRING(180), allowNull: false },
      slug: { type: Sequelize.STRING(200), allowNull: false, unique: true },
      description: { type: Sequelize.TEXT, allowNull: false },
      material: { type: Sequelize.STRING(120) },
      dimensions: { type: Sequelize.JSONB },
      price: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      stockQuantity: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('products', ['categoryId', 'isActive']);

    await queryInterface.createTable('product_variants', {
      id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
      productId: { type: Sequelize.UUID, allowNull: false, references: { model: 'products', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      name: { type: Sequelize.STRING(120), allowNull: false },
      color: { type: Sequelize.STRING(80) },
      sku: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      price: { type: Sequelize.DECIMAL(12, 2) },
      stockQuantity: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('product_variants', ['productId', 'isActive']);

    await queryInterface.createTable('product_images', {
      id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
      productId: { type: Sequelize.UUID, allowNull: false, references: { model: 'products', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      url: { type: Sequelize.TEXT, allowNull: false },
      altText: { type: Sequelize.STRING(180) },
      sortOrder: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('carts', {
      id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
      userId: { type: Sequelize.UUID, allowNull: false, unique: true, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('cart_items', {
      id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
      cartId: { type: Sequelize.UUID, allowNull: false, references: { model: 'carts', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      productId: { type: Sequelize.UUID, allowNull: false, references: { model: 'products', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      variantId: { type: Sequelize.UUID, references: { model: 'product_variants', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('cart_items', ['cartId', 'productId', 'variantId'], { unique: true });

    await queryInterface.createTable('orders', {
      id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
      userId: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE' },
      orderNumber: { type: Sequelize.STRING(40), allowNull: false, unique: true },
      status: { type: Sequelize.ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'), allowNull: false, defaultValue: 'pending' },
      paymentMethod: { type: Sequelize.ENUM('cash_on_delivery'), allowNull: false, defaultValue: 'cash_on_delivery' },
      paymentStatus: { type: Sequelize.ENUM('pending', 'paid', 'failed', 'refunded'), allowNull: false, defaultValue: 'pending' },
      subtotal: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      shippingFee: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      totalAmount: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      shippingAddress: { type: Sequelize.JSONB, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('orders', ['userId', 'createdAt']);
    await queryInterface.addIndex('orders', ['status', 'createdAt']);

    await queryInterface.createTable('order_items', {
      id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
      orderId: { type: Sequelize.UUID, allowNull: false, references: { model: 'orders', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      productId: { type: Sequelize.UUID, references: { model: 'products', key: 'id' }, onDelete: 'SET NULL', onUpdate: 'CASCADE' },
      variantId: { type: Sequelize.UUID, references: { model: 'product_variants', key: 'id' }, onDelete: 'SET NULL', onUpdate: 'CASCADE' },
      productName: { type: Sequelize.STRING(180), allowNull: false },
      variantName: { type: Sequelize.STRING(120) },
      sku: { type: Sequelize.STRING(100) },
      unitPrice: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      lineTotal: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('design_requests', {
      id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
      userId: { type: Sequelize.UUID, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL', onUpdate: 'CASCADE' },
      fullName: { type: Sequelize.STRING(120), allowNull: false },
      phone: { type: Sequelize.STRING(40), allowNull: false },
      email: { type: Sequelize.STRING(254), allowNull: false },
      propertyType: { type: Sequelize.STRING(80), allowNull: false },
      roomCount: { type: Sequelize.INTEGER, allowNull: false },
      areaSquareMeters: { type: Sequelize.DECIMAL(10, 2) },
      preferredStyle: { type: Sequelize.STRING(120) },
      budget: { type: Sequelize.DECIMAL(12, 2) },
      notes: { type: Sequelize.TEXT },
      status: { type: Sequelize.ENUM('pending', 'contacted', 'in_progress', 'completed', 'cancelled'), allowNull: false, defaultValue: 'pending' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('design_requests', ['status', 'createdAt']);

    await queryInterface.createTable('design_request_images', {
      id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
      designRequestId: { type: Sequelize.UUID, allowNull: false, references: { model: 'design_requests', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      url: { type: Sequelize.TEXT, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('design_request_notes', {
      id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
      designRequestId: { type: Sequelize.UUID, allowNull: false, references: { model: 'design_requests', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      adminId: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE' },
      body: { type: Sequelize.TEXT, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('design_request_notes');
    await queryInterface.dropTable('design_request_images');
    await queryInterface.dropTable('design_requests');
    await queryInterface.dropTable('order_items');
    await queryInterface.dropTable('orders');
    await queryInterface.dropTable('cart_items');
    await queryInterface.dropTable('carts');
    await queryInterface.dropTable('product_images');
    await queryInterface.dropTable('product_variants');
    await queryInterface.dropTable('products');
    await queryInterface.dropTable('categories');
  },
};
