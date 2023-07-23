const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const establishmentImgs = db.define('establishmentlImg', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  imgUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  establishmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

module.exports = establishmentImgs;
