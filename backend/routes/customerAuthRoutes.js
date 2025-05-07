const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const router = express.Router();
require('dotenv').config();

// Inscription client
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, phone, password } = req.body;

    if (!first_name || !last_name || !email || !phone || !password) {
      return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }

    const existing = await Customer.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email déjà utilisé.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const customer = await Customer.create({
      first_name,
      last_name,
      email,
      phone,
      password: hashed,
      has_account: true
    });

    const token = jwt.sign({ customerId: customer.id }, process.env.JWT_SECRET, { expiresIn: '6h' });

    res.status(201).json({
      token,
      customer: {
        id: customer.id,
        first_name: customer.first_name,
        email: customer.email
      }
    });
  } catch (error) {
    console.error('Erreur inscription client :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Connexion client
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ where: { email } });
    if (!customer) {
      return res.status(401).json({ error: 'Email ou mot de passe invalide.' });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email ou mot de passe invalide.' });
    }

    const token = jwt.sign({ customerId: customer.id }, process.env.JWT_SECRET, { expiresIn: '6h' });

    await customer.update({ last_login: new Date() });

    res.json({
      token,
      customer: {
        id: customer.id,
        first_name: customer.first_name,
        email: customer.email
      }
    });
  } catch (error) {
    console.error('Erreur login client :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

const authCustomer = require('../middleware/authCustomer');

// Récupérer les infos du client connecté
router.get('/me', authCustomer, async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.customer.id, {
      attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
    });

    if (!customer) {
      return res.status(404).json({ error: 'Client introuvable' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Erreur /me client :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
