// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Vérifie que le token est présent
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Non autorisé. Token manquant.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contient userId, role
    next();
  } catch (error) {
    console.error('Erreur auth JWT :', error);
    return res.status(403).json({ error: 'Token invalide.' });
  }
};

module.exports = authenticate;
