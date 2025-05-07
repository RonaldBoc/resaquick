# ResaQuick 🍽️

**ResaQuick** est une plateforme de commande et réservation en ligne pour restaurants. Elle permet aux clients de consulter le menu, réserver une table, commander en ligne, et payer via une interface intuitive.

## 🚀 Fonctionnalités

- Création de restaurants
- Gestion des menus (plats, catégories, etc.)
- Système de commande en ligne
- Paiement intégré (à venir)
- Authentification via middleware sécurisé
- Interface client (en cours)
- Interface admin (à venir)

## 🧑‍💻 Tech Stack

- **Frontend** : Vite + [Ton framework JS préféré ici]
- **Backend** : Node.js + Express
- **Base de données** : Sequelize + PostgreSQL (ou autre)

## 🛠️ Installation locale

```bash
git clone https://github.com/ton-utilisateur/resaquick.git
cd resaquick
npm install
npm run dev # ou npm start si Express

Lancer le frontend:
cd frontend
npm install
npm run dev

Structure projet:
/backend
  ├── models/
  ├── routes/
  ├── middleware/
  └── server.js
/frontend
  └── src/
