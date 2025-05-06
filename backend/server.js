// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const restaurantRoutes = require('./routes/restaurantRoutes');
app.use('/api/restaurants', restaurantRoutes);


app.get('/', (req, res) => {
  res.send('Resaquick backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const sequelize = require('./config/database');


sequelize.authenticate()
  .then(() => console.log('🔌 Connexion à PostgreSQL réussie !'))
  .catch(err => console.error('❌ Erreur de connexion à PostgreSQL :', err));



const Restaurant = require('./models/Restauran');

sequelize.sync({ alter: true }) // crée ou met à jour les tables si besoin
  .then(() => console.log('✅ Tables synchronisées'))
  .catch(err => console.error('❌ Erreur de synchronisation des tables :', err));
