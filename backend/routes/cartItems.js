import express from 'express';
import { CartItem } from '../models/CartItem.js';
import { Product } from '../models/Product.js';
import { DeliveryOption } from '../models/DeliveryOption.js';
import { Offer } from '../models/Offer.js';
import { Store } from '../models/Store.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const expand = req.query.expand;
  const items = await CartItem.findAll();

  if (expand !== 'product') {
    return res.json(items);
  }

  const enriched = await Promise.all(items.map(async (item) => {
    const offer = await Offer.findByPk(item.offerId);
    if (!offer) {
      return { ...item.toJSON(), offer: null, store: null, product: null };
    }

    const product = await Product.findByPk(offer.productId);
    const store = await Store.findByPk(offer.storeId);

    return {
      ...item.toJSON(),
      offer,
      store,
      product
    };
  }));

  res.json(enriched);
});

router.post('/', async (req, res) => {
  const { offerId, productId, storeId, quantity } = req.body;

  if (typeof quantity !== 'number' || quantity < 1 || quantity > 10) {
    return res.status(400).json({ error: 'Quantity must be a number between 1 and 10' });
  }

  let resolvedOffer = null;

  if (offerId) {
    resolvedOffer = await Offer.findByPk(offerId);
  } else if (productId) {
    if (storeId) {
      resolvedOffer = await Offer.findOne({
        where: { productId, storeId, inStock: true },
        order: [['priceCents', 'ASC']]
      });
    } else {
      resolvedOffer = await Offer.findOne({
        where: { productId, inStock: true },
        order: [['priceCents', 'ASC']]
      });
    }
  }

  if (!resolvedOffer) {
    return res.status(400).json({ error: 'Offer not found (or out of stock)' });
  }

  let cartItem = await CartItem.findOne({ where: { offerId: resolvedOffer.id } });

  if (cartItem) {
    cartItem.quantity = Math.min(10, cartItem.quantity + quantity);
    await cartItem.save();
  } else {
    cartItem = await CartItem.create({
      offerId: resolvedOffer.id,
      quantity,
      deliveryOptionId: "1"
    });
  }

  res.status(201).json(cartItem);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { quantity, deliveryOptionId } = req.body;

  const cartItem = await CartItem.findByPk(id);
  if (!cartItem) return res.status(404).json({ error: 'Cart item not found' });

  if (quantity !== undefined) {
    if (typeof quantity !== 'number' || quantity < 1 || quantity > 10) {
      return res.status(400).json({ error: 'Quantity must be a number between 1 and 10' });
    }
    cartItem.quantity = quantity;
  }

  if (deliveryOptionId !== undefined) {
    const deliveryOption = await DeliveryOption.findByPk(deliveryOptionId);
    if (!deliveryOption) return res.status(400).json({ error: 'Invalid delivery option' });
    cartItem.deliveryOptionId = deliveryOptionId;
  }

  await cartItem.save();
  res.json(cartItem);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const cartItem = await CartItem.findByPk(id);
  if (!cartItem) return res.status(404).json({ error: 'Cart item not found' });

  await cartItem.destroy();
  res.status(204).send();
});

export default router;
