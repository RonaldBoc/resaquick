// backend/routes/productOptionRoutes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const ProductOption = require('../models/ProductOption');
const Product = require('../models/Product');
const Restaurant = require('../models/Restauran');

// Ajouter une option à un produit
router.post('/:productId/options', authenticate, async (req, res) => {
  try {
    const { name, extra_price } = req.body;
    const { productId } = req.params;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    // Vérifie que le produit appartient bien au restaurateur connecté
    const restaurant = await Restaurant.findByPk(product.restaurant_id);
    if (!restaurant || restaurant.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Accès interdit à ce produit.' });
    }

    const option = await ProductOption.create({
      name,
      extra_price,
      product_id: productId
    });

    res.status(201).json(option);
  } catch (error) {
    console.error('Erreur création option :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Lister les options d’un produit
router.get('/:productId/options', async (req, res) => {
    try {
      const { productId } = req.params;
  
      const options = await ProductOption.findAll({
        where: { product_id: productId }
      });
  
      res.json(options);
    } catch (error) {
      console.error('Erreur récupération options :', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.put('/options/:optionId', authenticate, async (req, res) => {
    try {
      const { optionId } = req.params;
      const { name, extra_price } = req.body;
  
      const option = await ProductOption.findByPk(optionId, {
        include: [{ model: Product }]
      });
  
      if (!option) {
        return res.status(404).json({ error: 'Option non trouvée' });
      }
  
      const product = await Product.findByPk(option.product_id);
      const restaurant = await Restaurant.findByPk(product.restaurant_id);
  
      if (!restaurant || restaurant.user_id !== req.user.userId) {
        return res.status(403).json({ error: 'Non autorisé à modifier cette option.' });
      }
  
      await option.update({ name, extra_price });
      res.json(option);
    } catch (error) {
      console.error('Erreur modification option :', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.delete('/options/:optionId', authenticate, async (req, res) => {
    try {
      const { optionId } = req.params;
  
      const option = await ProductOption.findByPk(optionId);
      if (!option) {
        return res.status(404).json({ error: 'Option non trouvée' });
      }
  
      const product = await Product.findByPk(option.product_id);
      const restaurant = await Restaurant.findByPk(product.restaurant_id);
  
      if (!restaurant || restaurant.user_id !== req.user.userId) {
        return res.status(403).json({ error: 'Non autorisé à supprimer cette option.' });
      }
  
      await option.destroy();
      res.json({ message: 'Option supprimée avec succès.' });
    } catch (error) {
      console.error('Erreur suppression option :', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
});  
module.exports = router;
