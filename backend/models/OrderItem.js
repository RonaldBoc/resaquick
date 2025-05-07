// backend/models/OrderItem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  unit_price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  total_price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  selected_options: {
    type: DataTypes.JSONB, // ex: [{ name: "extra fromage", extra_price: 1 }]
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = OrderItem;
