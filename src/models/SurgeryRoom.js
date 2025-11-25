const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SurgeryRoom = sequelize.define('SurgeryRoom', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  clinicId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Clinics',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  roomNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Number of people the room can accommodate'
  },
  equipment: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'List of equipment available in the room'
  },
  status: {
    type: DataTypes.ENUM('available', 'occupied', 'maintenance'),
    allowNull: false,
    defaultValue: 'available'
  }
}, {
  tableName: 'surgery_rooms'
});

module.exports = SurgeryRoom;

