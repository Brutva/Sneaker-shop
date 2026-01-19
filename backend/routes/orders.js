import express from 'express';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Store } from '../models/Store.js';
import { Offer } from '../models/Offer.js';
import { DeliveryOption } from '../models/DeliveryOption.js';
import { CartItem } from '../models/CartItem.js';

const router = express.Router();

async function enrichOrderProducts(orderProducts) {
  const enriched = await Promise.all(orderProducts.map(async (line) => {
    let productDetails = null;
    let storeDetails = null;
    let offerDetails = null;

    if (line.offerId) {
      offerDetails = await Offer.findByPk(line.offerId);
      if (offerDetails) {
        productDetails = await Product.findByPk(offerDetails.productId);
        storeDetails = await Store.findByPk(offerDetails.storeId);
      } else if (line.productId) {
        productDetails = await Product.findByPk(line.productId);
        if (line.storeId) storeDetails = await Store.findByPk(line.storeId);
      }
    } else if (line.productId) {
      productDetails = await Product.findByPk(line.productId);
      if (line.storeId) storeDetails = await Store.findByPk(line.storeId);
    }

    return {
      ...line,
      product: productDetails,
      store: storeDetails,
      offer: offerDetails
    };
  }));

  return enriched;
}

router.get('/', async (req, res) => {
  const expand = req.query.expand;
  let orders = await Order.unscoped().findAll({ order: [['orderTimeMs', 'DESC']] });

  if (expand === 'products') {
    orders = await Promise.all(orders.map(async (order) => {
      const products = await enrichOrderProducts(order.products || []);
      return {
        ...order.toJSON(),
        products
      };
    }));
  }

  res.json(orders);
});

router.post('/', async (req, res) => {
  const cartItems = await CartItem.findAll();

  if (cartItems.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  let totalCostCents = 0;

  const products = await Promise.all(cartItems.map(async (item) => {
    const offer = await Offer.findByPk(item.offerId);
    if (!offer) {
      throw new Error(`Offer not found: ${item.offerId}`);
    }

    const deliveryOption = await DeliveryOption.findByPk(item.deliveryOptionId);
    if (!deliveryOption) {
      throw new Error(`Invalid delivery option: ${item.deliveryOptionId}`);
    }

    const productCost = offer.priceCents * item.quantity;
    const shippingCost = deliveryOption.priceCents;

    totalCostCents += productCost + shippingCost;

    const estimatedDeliveryTimeMs =
      Date.now() + deliveryOption.deliveryDays * 24 * 60 * 60 * 1000;

    return {
      offerId: offer.id,
      productId: offer.productId,
      storeId: offer.storeId,
      priceCents: offer.priceCents, 
      quantity: item.quantity,
      deliveryOptionId: item.deliveryOptionId,
      estimatedDeliveryTimeMs
    };
  }));

  totalCostCents = Math.round(totalCostCents * 1.1);

  const order = await Order.create({
    orderTimeMs: Date.now(),
    totalCostCents,
    products
  });

  await CartItem.destroy({ where: {} });

  res.status(201).json(order);
});

router.get('/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const expand = req.query.expand;

  let order = await Order.findByPk(orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (expand === 'products') {
    const products = await enrichOrderProducts(order.products || []);
    order = {
      ...order.toJSON(),
      products
    };
  }

  res.json(order);
});

export default router;
