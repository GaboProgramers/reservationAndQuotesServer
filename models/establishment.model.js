const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const Establishment = db.define('establishments', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  localName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  inChargeName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  openingHours: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'disabled', 'removed'),
    allowNull: false,
    defaultValue: 'active',
  },
});

module.exports = Establishment;
