'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('products', ['isActive', 'price'], { name: 'products_active_price_index' });
    await queryInterface.addIndex('products', ['isActive', 'createdAt'], { name: 'products_active_created_at_index' });
    await queryInterface.addIndex('products', ['isActive', 'stockQuantity'], { name: 'products_active_stock_index' });
    await queryInterface.addIndex('product_styles', ['styleId', 'productId'], { name: 'product_styles_style_product_index' });
  },
  async down(queryInterface) {
    await queryInterface.removeIndex('product_styles', 'product_styles_style_product_index');
    await queryInterface.removeIndex('products', 'products_active_stock_index');
    await queryInterface.removeIndex('products', 'products_active_created_at_index');
    await queryInterface.removeIndex('products', 'products_active_price_index');
  },
};
