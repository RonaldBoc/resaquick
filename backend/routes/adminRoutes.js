// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');
const User = require('../models/User');
const Payment = require('../models/Payment');

// Liste des restaurateurs
router.get('/users', authenticate, isAdmin, async (req, res) => {
  try {
    const restaurateurs = await User.findAll({
      where: { role: 'restaurateur' },
      attributes: ['id', 'name', 'email', 'createdAt', 'is_active']
    });

    res.json(restaurateurs);
  } catch (error) {
    console.error('Erreur récupération restaurateurs :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Désactiver un restaurateur
router.put('/users/:id/deactivate', authenticate, isAdmin, async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user || user.role !== 'restaurateur') {
        return res.status(404).json({ error: 'Restaurateur introuvable' });
      }
  
      user.is_active = false;
      await user.save();
  
      res.json({ message: 'Compte désactivé avec succès' });
    } catch (error) {
      console.error('Erreur désactivation :', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
});
  
// Réactiver un restaurateur
router.put('/users/:id/activate', authenticate, isAdmin, async (req, res) => {
try {
    const user = await User.findByPk(req.params.id);
    if (!user || user.role !== 'restaurateur') {
    return res.status(404).json({ error: 'Restaurateur introuvable' });
    }

    user.is_active = true;
    await user.save();

    res.json({ message: 'Compte réactivé avec succès' });
} catch (error) {
    console.error('Erreur activation :', error);
    res.status(500).json({ error: 'Erreur serveur' });
}
});
  

// Ajouter un paiement fictif pour un restaurateur
router.post('/users/:id/payments', authenticate, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const { amount, status } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Montant requis.' });
    }

    const user = await User.findByPk(userId);
    if (!user || user.role !== 'restaurateur') {
      return res.status(404).json({ error: 'Restaurateur introuvable.' });
    }

    const payment = await Payment.create({
      user_id: userId,
      amount,
      status: status || 'paid',
      date: new Date()
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error('Erreur création paiement :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Lister tous les paiements enregistrés
router.get('/payments', authenticate, isAdmin, async (req, res) => {
    try {
      const payments = await Payment.findAll({
        include: {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        order: [['date', 'DESC']]
      });
  
      res.json(payments);
    } catch (error) {
      console.error('Erreur récupération paiements :', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
});


// Revenu total de la plateforme (optionnel : filtre par date)
router.get('/stats/revenue', authenticate, isAdmin, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
  
      const where = {};
      if (startDate && endDate) {
        where.date = {
          [require('sequelize').Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }
  
      const total = await Payment.sum('amount', { where });
  
      res.json({ total_revenue: total || 0 });
    } catch (error) {
      console.error('Erreur stats/revenue :', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Revenus par restaurateur
router.get('/stats/restaurateurs', authenticate, isAdmin, async (req, res) => {
    try {
      const { Op } = require('sequelize');
  
      const payments = await Payment.findAll({
        attributes: [
          'user_id',
          [require('sequelize').fn('SUM', require('sequelize').col('amount')), 'total']
        ],
        include: {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        group: ['user_id', 'User.id'],
        order: [[require('sequelize').fn('SUM', require('sequelize').col('amount')), 'DESC']]
      });
  
      res.json(payments);
    } catch (error) {
      console.error('Erreur stats/restaurateurs :', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
});
  

module.exports = router;
