// backend/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Vérifie que tout est fourni
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
    }

    // Vérifie si un utilisateur existe déjà
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email déjà utilisé.' });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création du user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // On ne renvoie pas le mot de passe dans la réponse
    const { password: _, ...userSafe } = user.toJSON();

    res.status(201).json(userSafe);
  } catch (error) {
    console.error('Erreur register :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

const jwt = require('jsonwebtoken');
require('dotenv').config();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifie champs
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }

    // Compare le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }

    // Génère un token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '6h' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Erreur login :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


module.exports = router;
