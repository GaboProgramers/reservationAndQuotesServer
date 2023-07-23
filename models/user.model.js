const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const User = db.define('users', {
  id: {
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    type: DataTypes.UUID,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  passwordChangeAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  profileImageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('user', 'creator'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('unverified', 'verified'),
    allowNull: false,
    defaultValue: 'unverified',
  },
});

module.exports = User;
