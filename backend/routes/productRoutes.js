// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authenticate = require('../middleware/authMiddleware');

const Restaurant = require('../models/Restauran');

router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description, price, image_url, is_available } = req.body;

    // Trouver le restaurant lié à l'utilisateur connecté
    const restaurant = await Restaurant.findOne({ where: { user_id: req.user.userId } });

    if (!restaurant) {
      return res.status(403).json({ error: "Aucun restaurant associé à cet utilisateur." });
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      image_url,
      is_available,
      restaurant_id: restaurant.id
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Erreur création produit :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


// Modifier un produit
router.put('/:id', authenticate, async (req, res) => {
    try {
      const { name, description, price, image_url, is_available } = req.body;
      const product = await Product.findByPk(req.params.id);
  
      if (!product) {
        return res.status(404).json({ error: 'Produit non trouvé' });
      }
  
      await product.update({
        name,
        description,
        price,
        image_url,
        is_available
      });
  
      res.json(product);
    } catch (error) {
      console.error('Erreur modification produit :', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

// Supprimer un produit
router.delete('/:id', authenticate, async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
  
      if (!product) {
        return res.status(404).json({ error: 'Produit non trouvé' });
      }
  
      await product.destroy();
      res.json({ message: 'Produit supprimé' });
    } catch (error) {
      console.error('Erreur suppression produit :', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });
  

module.exports = router;
