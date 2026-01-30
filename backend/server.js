import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import { sequelize } from './models/index.js';

import productRoutes from './routes/products.js';
import storesRoutes from './routes/stores.js';
import deliveryOptionRoutes from './routes/deliveryOptions.js';
import cartItemRoutes from './routes/cartItems.js';
import orderRoutes from './routes/orders.js';
import resetRoutes from './routes/reset.js';
import paymentSummaryRoutes from './routes/paymentSummary.js';
import favoritesRoutes from './routes/favorites.js';

import { Product } from './models/Product.js';
import { Store } from './models/Store.js';
import { Offer } from './models/Offer.js';
import { DeliveryOption } from './models/DeliveryOption.js';
import { CartItem } from './models/CartItem.js';
import { Order } from './models/Order.js';
import { Favorite } from './models/Favorite.js';

import { defaultProducts } from './defaultData/defaultProducts.js';
import { defaultStores } from './defaultData/defaultStores.js';
import { defaultOffers } from './defaultData/defaultOffers.js';
import { defaultDeliveryOptions } from './defaultData/defaultDeliveryOptions.js';
import { defaultCart } from './defaultData/defaultCart.js';
import { defaultOrders } from './defaultData/defaultOrders.js';
import { defaultFavorites } from './defaultData/defaultFavorites.js';

const app = express();

app.set('trust proxy', 1); 

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = {
  origin: (origin, cb) => cb(null, true),
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.use('/api/products', productRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/delivery-options', deliveryOptionRoutes);
app.use('/api/cart-items', cartItemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reset', resetRoutes);
app.use('/api/payment-summary', paymentSummaryRoutes);
app.use('/api/favorites', favoritesRoutes);

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('index.html not found');
  }
});

/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

async function syncOrResetDb() {
  const isSqlite = sequelize.getDialect() === 'sqlite';

  try {
    if (isSqlite) {
      const [tables] = await sequelize.query(
        "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%_backup';"
      );

      for (const t of tables) {
        await sequelize.query(`DROP TABLE IF EXISTS \`${t.name}\`;`);
      }

      await sequelize.sync({ force: true });
      return;
    }

    await sequelize.sync({ alter: true });
  } catch (err) {
    console.error('DB sync failed. Recreating database...', err);
    await sequelize.sync({ force: true });
  }
}

await syncOrResetDb();

function addTimestamps(items) {
  const timestamp = Date.now();
  return items.map((item, index) => ({
    ...item,
    createdAt: new Date(timestamp + index),
    updatedAt: new Date(timestamp + index)
  }));
}

if (await Product.count() === 0) {
  await Product.bulkCreate(addTimestamps(defaultProducts));
}

if (await Store.count() === 0) {
  await Store.bulkCreate(addTimestamps(defaultStores));
}

if (await Offer.count() === 0) {
  await Offer.bulkCreate(addTimestamps(defaultOffers));
}

if (await DeliveryOption.count() === 0) {
  await DeliveryOption.bulkCreate(addTimestamps(defaultDeliveryOptions));
}

if (await CartItem.count() === 0) {
  await CartItem.bulkCreate(addTimestamps(defaultCart));
}

if (await Order.count() === 0) {
  await Order.bulkCreate(addTimestamps(defaultOrders));
}

if (await Favorite.count() === 0) {
  await Favorite.bulkCreate(addTimestamps(defaultFavorites));
}

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});