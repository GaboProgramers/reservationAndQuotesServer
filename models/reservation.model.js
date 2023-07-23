const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const Reservation = db.define('reservations', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  establishmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  datetime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'complete', 'removed'),
    allowNull: false,
    defaultValue: 'pending',
  },
});

module.exports = Reservation;
