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


// backend/routes/restaurantRoutes.js

// ... route GET déjà existante

router.post('/', async (req, res) => {
    try {
      const { name, description, logo_url, cover_url, address, phone } = req.body;
  
      if (!name || !address) {
        return res.status(400).json({ error: 'Le nom et l’adresse sont obligatoires.' });
      }
  
      const newRestaurant = await Restaurant.create({
        name,
        description,
        logo_url,
        cover_url,
        address,
        phone,
      });
  
      res.status(201).json(newRestaurant);
    } catch (error) {
      console.error('Erreur lors de la création du restaurant :', error);
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
  
module.exports = router;
