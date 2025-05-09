const { Customer, User, Restauran } = require('../models');

// Voir tous les clients
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Voir tous les restaurateurs (utilisateurs avec un restaurant associé)
exports.getAllRestaurateurs = async (req, res) => {
  try {
    const restaurateurs = await User.findAll({
      include: {
        model: Restauran,
        as: 'restaurant'
      },
      order: [['createdAt', 'DESC']]
    });
    res.json(restaurateurs);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
