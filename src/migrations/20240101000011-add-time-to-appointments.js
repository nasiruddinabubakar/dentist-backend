'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('appointments', 'time', {
      type: Sequelize.TIME,
      allowNull: true,
      comment: 'Appointment time (HH:MM:SS format)'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('appointments', 'time');
  }
};

