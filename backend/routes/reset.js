import express from 'express';
import { sequelize } from '../models/index.js';
import { Product } from '../models/Product.js';
import { DeliveryOption } from '../models/DeliveryOption.js';
import { CartItem } from '../models/CartItem.js';
import { Order } from '../models/Order.js';
import { defaultProducts } from '../defaultData/defaultProducts.js';
import { defaultDeliveryOptions } from '../defaultData/defaultDeliveryOptions.js';
import { defaultCart } from '../defaultData/defaultCart.js';
import { defaultOrders } from '../defaultData/defaultOrders.js';
import { Favorite } from '../models/Favorite.js';
import { defaultFavorites } from '../defaultData/defaultFavorites.js';
import { Store } from '../models/Store.js';
import { Offer } from '../models/Offer.js';
import { defaultStores } from '../defaultData/defaultStores.js';
import { defaultOffers } from '../defaultData/defaultOffers.js';


const router = express.Router();

router.post('/', async (req, res) => {
  await sequelize.sync({ force: true });

  const timestamp = Date.now();

  const productsWithTimestamps = defaultProducts.map((product, index) => ({
    ...product,
    createdAt: new Date(timestamp + index),
    updatedAt: new Date(timestamp + index)
  }));

  const deliveryOptionsWithTimestamps = defaultDeliveryOptions.map((option, index) => ({
    ...option,
    createdAt: new Date(timestamp + index),
    updatedAt: new Date(timestamp + index)
  }));

  const cartItemsWithTimestamps = defaultCart.map((item, index) => ({
    ...item,
    createdAt: new Date(timestamp + index),
    updatedAt: new Date(timestamp + index)
  }));

  const ordersWithTimestamps = defaultOrders.map((order, index) => ({
    ...order,
    createdAt: new Date(timestamp + index),
    updatedAt: new Date(timestamp + index)
  }));

  const favoritesWithTimestamps = defaultFavorites.map((fav, index) => ({
    ...fav,
    createdAt: new Date(timestamp + index),
    updatedAt: new Date(timestamp + index)
  }));

  const storesWithTimestamps = defaultStores.map((store, index) => ({
    ...store,
    createdAt: new Date(timestamp + index),
    updatedAt: new Date(timestamp + index)
  }));

  const offersWithTimestamps = defaultOffers.map((offer, index) => ({
    ...offer,
    createdAt: new Date(timestamp + index),
    updatedAt: new Date(timestamp + index)
  }));



  await Product.bulkCreate(productsWithTimestamps);
  await Store.bulkCreate(storesWithTimestamps);
  await Offer.bulkCreate(offersWithTimestamps);

  await DeliveryOption.bulkCreate(deliveryOptionsWithTimestamps);
  await CartItem.bulkCreate(cartItemsWithTimestamps);
  await Order.bulkCreate(ordersWithTimestamps);
  await Favorite.bulkCreate(favoritesWithTimestamps);


  res.status(204).send();
});

export default router;
