// backend/middleware/isAdmin.js
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      return next();
    } else {
      return res.status(403).json({ error: 'Accès réservé à l’administrateur.' });
    }
  };
  
  module.exports = isAdmin;
  