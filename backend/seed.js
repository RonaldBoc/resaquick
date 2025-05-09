const sequelize = require('./config/database');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Restaurant = require('./models/Restauran');
const Product = require('./models/Product');
const ProductOption = require('./models/ProductOption');
const Customer = require('./models/Customer');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion DB OK');

    // Nettoyage complet
    await OrderItem.destroy({ where: {} });
    await Order.destroy({ where: {} });
    await ProductOption.destroy({ where: {} });
    await Product.destroy({ where: {} });
    await Restaurant.destroy({ where: {} });
    await Customer.destroy({ where: {} });
    await User.destroy({ where: {} });

    // Hash mot de passe
    const hashedUserPassword = await bcrypt.hash('resto123', 10);
    const hashedCustomerPassword = await bcrypt.hash('client123', 10);

    // Création users
    const users = await User.bulkCreate([
      { name: 'Alphonse Collet-Lambert', email: 'resto1@resaquick.com', password: hashedUserPassword, role: 'restaurateur' },
      { name: 'Grégoire Monnier', email: 'resto2@resaquick.com', password: hashedUserPassword, role: 'restaurateur' },
      { name: 'Alphonse Grenier', email: 'resto3@resaquick.com', password: hashedUserPassword, role: 'restaurateur' }
    ]);

    // Création restaurants un par un pour les réutiliser
    const restaurant1 = await Restaurant.create({ name: 'Le Ti Punch', description: 'Cuisine créole maison', address: '1 rue des îles', phone: '0596123456', user_id: users[0].id });
    const restaurant2 = await Restaurant.create({ name: 'Chez Doudou', description: 'Cuisine antillaise rapide', address: '2 rue mangue', phone: '0596123457', user_id: users[1].id });
    const restaurant3 = await Restaurant.create({ name: 'Snack Peyi', description: 'Bokit, agoulous et plus', address: '3 rue coco', phone: '0596123458', user_id: users[2].id });

    // Produits
    const product1 = await Product.create({ name: 'Poulet boucané', description: 'Servi avec riz', price: 12.5, restaurant_id: restaurant1.id });
    const product2 = await Product.create({ name: 'Colombo de cabri', description: 'Épicé', price: 13.5, restaurant_id: restaurant2.id });
    const product3 = await Product.create({ name: 'Bokit jambon fromage', description: 'Pain frit garni', price: 8.0, restaurant_id: restaurant3.id });

    // Options
    await ProductOption.bulkCreate([
      { name: 'Extra fromage', extra_price: 1.5, product_id: product1.id },
      { name: 'Sans oignons', extra_price: 0, product_id: product2.id },
      { name: 'Sauce piquante', extra_price: 0.8, product_id: product3.id }
    ]);

    // Clients
    const customers = await Customer.bulkCreate([
      { first_name: 'Léa', last_name: 'Martin', email: 'lea@resaquick.com', phone: '0696123456', password: hashedCustomerPassword, has_account: true },
      { first_name: 'Lucas', last_name: 'Benoit', email: 'lucas@resaquick.com', phone: '0696123457', password: hashedCustomerPassword, has_account: true },
      { first_name: 'Chloé', last_name: 'Durand', email: 'chloe@resaquick.com', phone: '0696123458', password: hashedCustomerPassword, has_account: true }
    ]);

    // Commandes + OrderItems
    const orders = await Promise.all(customers.map((customer, i) =>
      Order.create({
        customer_id: customer.id,
        restaurant_id: [restaurant1, restaurant2, restaurant3][i].id,
        type: 'à emporter',
        status: 'en attente',
        scheduled_time: new Date(),
        total_price: 29.5,
        notes: 'Sans sauce'
      })
    ));

    await OrderItem.bulkCreate([
      {
        order_id: orders[0].id,
        product_id: product1.id,
        quantity: 2,
        unit_price: 12.5,
        total_price: 25,
        selected_options: [{ name: 'Extra fromage', extra_price: 1 }]
      },
      {
        order_id: orders[0].id,
        product_id: product2.id,
        quantity: 1,
        unit_price: 4.5,
        total_price: 4.5,
        selected_options: []
      },
      {
        order_id: orders[1].id,
        product_id: product2.id,
        quantity: 2,
        unit_price: 13.5,
        total_price: 27,
        selected_options: []
      },
      {
        order_id: orders[2].id,
        product_id: product3.id,
        quantity: 2,
        unit_price: 8.0,
        total_price: 16,
        selected_options: [{ name: 'Sauce piquante', extra_price: 0.8 }]
      }
  ]);

  const adminPassword = await bcrypt.hash('admin123', 10);

await User.create({
  name: 'Super Admin',
  email: 'admin@resaquick.com',
  password: adminPassword,
  role: 'admin'
});


    

    console.log('✅ Données seedées avec succès');
    process.exit();
  } catch (err) {
    console.error('❌ Erreur seed :', err);
    process.exit(1);
  }
}

seed();
