// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const sequelize = require('./config/database');

const restaurantRoutes = require('./routes/restaurantRoutes');
app.use('/api/restaurants', restaurantRoutes);

const Product = require('./models/Product');
const Restaurant = require('./models/Restauran');
const User = require('./models/User');


// Lien 1:N : un restaurant a plusieurs produits
Restaurant.hasMany(Product, { foreignKey: 'restaurant_id' });
Product.belongsTo(Restaurant, { foreignKey: 'restaurant_id' });

User.hasOne(Restaurant, { foreignKey: 'user_id' });
Restaurant.belongsTo(User, { foreignKey: 'user_id' });



const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);


const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);


app.get('/', (req, res) => {
  res.send('Resaquick backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




sequelize.authenticate()
  .then(() => console.log('🔌 Connexion à PostgreSQL réussie !'))
  .catch(err => console.error('❌ Erreur de connexion à PostgreSQL :', err));


sequelize.sync({ alter: true }) // crée ou met à jour les tables si besoin
    .then(() => console.log('✅ Tables synchronisées'))
    .catch(err => console.error('❌ Erreur de synchronisation des tables :', err));
