'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('surgery_rooms', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      clinicId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'clinics',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      roomNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      capacity: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Number of people the room can accommodate'
      },
      equipment: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'List of equipment available in the room'
      },
      status: {
        type: Sequelize.ENUM('available', 'occupied', 'maintenance'),
        allowNull: false,
        defaultValue: 'available'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('surgery_rooms', ['clinicId'], {
      name: 'surgery_rooms_clinicId_index'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('surgery_rooms');
  }
};

