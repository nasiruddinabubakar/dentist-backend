'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('invoice_items', 'serviceName', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Service name at time of invoice creation (snapshot)'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('invoice_items', 'serviceName');
  }
};

