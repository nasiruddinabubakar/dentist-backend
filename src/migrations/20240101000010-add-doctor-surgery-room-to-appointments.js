'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('appointments', 'doctorId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'doctors',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('appointments', 'surgeryRoomId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'surgery_rooms',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addIndex('appointments', ['doctorId'], {
      name: 'appointments_doctorId_index'
    });

    await queryInterface.addIndex('appointments', ['surgeryRoomId'], {
      name: 'appointments_surgeryRoomId_index'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('appointments', 'appointments_surgeryRoomId_index');
    await queryInterface.removeIndex('appointments', 'appointments_doctorId_index');
    await queryInterface.removeColumn('appointments', 'surgeryRoomId');
    await queryInterface.removeColumn('appointments', 'doctorId');
  }
};

