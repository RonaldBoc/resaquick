// backend/routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const authCustomer = require('../middleware/authCustomer');
const Customer = require('../models/Customer');

// Récupérer le profil complet du client (version enrichie)
router.get('/me', authCustomer, async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.customer.id, {
      attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'default_address', 'preferred_language']
    });

    if (!customer) {
      return res.status(404).json({ error: 'Client introuvable' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Erreur GET /me customerRoutes :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Mise à jour du profil client
router.put('/me', authCustomer, async (req, res) => {
  try {
    const { first_name, last_name, phone, default_address, preferred_language } = req.body;

    const customer = await Customer.findByPk(req.customer.id);
    if (!customer) {
      return res.status(404).json({ error: 'Client introuvable' });
    }

    await customer.update({ first_name, last_name, phone, default_address, preferred_language });

    res.json({ message: 'Profil mis à jour avec succès.' });
  } catch (error) {
    console.error('Erreur PUT /me :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const Restaurant = require('../models/Restauran');

// Passer une commande
router.post('/orders', authCustomer, async (req, res) => {
  try {
    const { restaurant_id, type, scheduled_time, notes, items } = req.body;

    if (!restaurant_id || !type || !items || items.length === 0) {
      return res.status(400).json({ error: 'Données de commande incomplètes.' });
    }

    // Vérifie que le restaurant existe
    const restaurant = await Restaurant.findByPk(restaurant_id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant non trouvé.' });
    }

    // Calcul total
    let total_price = 0;

    const orderItems = await Promise.all(items.map(async (item) => {
      const product = await Product.findByPk(item.product_id);
      if (!product) throw new Error(`Produit ID ${item.product_id} introuvable`);

      const quantity = item.quantity || 1;
      const options = item.selected_options || [];

      const extra_total = options.reduce((sum, opt) => sum + (opt.extra_price || 0), 0);
      const unit_price = product.price + extra_total;
      const total_item = unit_price * quantity;

      total_price += total_item;

      return {
        product_id: product.id,
        quantity,
        unit_price,
        total_price: total_item,
        selected_options: options
      };
    }));

    // Crée la commande
    const order = await Order.create({
      customer_id: req.customer.id,
      restaurant_id,
      type,
      status: 'en attente',
      scheduled_time,
      total_price,
      notes
    });

    // Crée les OrderItems associés
    for (const item of orderItems) {
      await OrderItem.create({
        ...item,
        order_id: order.id
      });
    }

    res.status(201).json({ message: 'Commande enregistrée', order_id: order.id });
  } catch (error) {
    console.error('Erreur POST /orders :', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


module.exports = router;
