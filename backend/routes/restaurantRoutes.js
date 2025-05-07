// backend/routes/restaurantRoutes.js
const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restauran');

router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll();
    res.json(restaurants);
  } catch (error) {
    console.error('Erreur lors de la récupération des restaurants :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


const authenticate = require('../middleware/authMiddleware');

router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description, logo_url, cover_url, address, phone } = req.body;

    const userId = req.user.userId; // injecté par le token JWT

    const newRestaurant = await Restaurant.create({
      name,
      description,
      logo_url,
      cover_url,
      address,
      phone,
      user_id: userId // 👈 c’est ça qui manquait
    });

    res.status(201).json(newRestaurant);
  } catch (error) {
    console.error('Erreur lors de la création du restaurant :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


router.get('/me', authenticate, async (req, res) => {
    try {
      const restaurant = await Restaurant.findOne({
        where: { user_id: req.user.userId }
      });
  
      if (!restaurant) {
        return res.status(404).json({ error: 'Aucun restaurant trouvé pour cet utilisateur.' });
      }
  
      res.json(restaurant);
    } catch (error) {
      console.error('Erreur GET /me :', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });


// backend/routes/restaurantRoutes.js

router.get('/:id', async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id);
      if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant non trouvé' });
      }
      res.json(restaurant);
    } catch (error) {
      console.error('Erreur GET /:id :', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });
  

router.put('/:id', async (req, res) => {
  try {
    const { name, description, logo_url, cover_url, address, phone, is_active } = req.body;
    const restaurant = await Restaurant.findByPk(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant non trouvé' });
    }

    await restaurant.update({
      name,
      description,
      logo_url,
      cover_url,
      address,
      phone,
      is_active
    });

    res.json(restaurant);
  } catch (error) {
    console.error('Erreur PUT /:id :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.delete('/:id', async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id);
      if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant non trouvé' });
      }
  
      // Option 1 : suppression réelle
      // await restaurant.destroy();
  
      // Option 2 : désactivation (soft delete recommandé)
      await restaurant.update({ is_active: false });
  
      res.json({ message: 'Restaurant désactivé' });
    } catch (error) {
      console.error('Erreur DELETE /:id :', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });


// backend/routes/restaurantRoutes.js

const Product = require('../models/Product'); // ajoute cette ligne si ce n’est pas déjà fait

// ...

// GET /api/restaurants/:id/products
router.get('/:id/products', async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const products = await Product.findAll({
      where: { restaurant_id: restaurantId },
    });

    res.json(products);
  } catch (error) {
    console.error('Erreur récupération produits restaurant :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
