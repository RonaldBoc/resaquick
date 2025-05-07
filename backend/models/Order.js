// backend/models/Order.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['sur place', 'à emporter', 'livraison']]
    }
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'en attente', // ou 'confirmée', 'livrée', 'annulée'
  },
  scheduled_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  total_price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Order;
