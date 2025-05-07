// backend/models/ProductOption.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductOption = sequelize.define('ProductOption', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  extra_price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  }
}, {
  timestamps: true
});

module.exports = ProductOption;
