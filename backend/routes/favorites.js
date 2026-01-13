import express from 'express';
import { Favorite } from '../models/Favorite.js';
import { Product } from '../models/Product.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const expand = req.query.expand;
  let favorites = await Favorite.findAll();

  if (expand === 'product') {
    favorites = await Promise.all(favorites.map(async (fav) => {
      const product = await Product.findByPk(fav.productId);
      return {
        ...fav.toJSON(),
        product
      };
    }));
  }

  res.json(favorites);
});

router.post('/', async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ error: 'productId is required' });
  }

  const product = await Product.findByPk(productId);
  if (!product) {
    return res.status(400).json({ error: 'Product not found' });
  }

  const existing = await Favorite.findOne({ where: { productId } });
  if (existing) {
    return res.status(200).json(existing);
  }

  const favorite = await Favorite.create({ productId });
  res.status(201).json(favorite);
});

router.delete('/:productId', async (req, res) => {
  const { productId } = req.params;

  const favorite = await Favorite.findOne({ where: { productId } });
  if (!favorite) {
    return res.status(404).json({ error: 'Favorite not found' });
  }

  await favorite.destroy();
  res.status(204).send();
});

router.delete('/', async (req, res) => {
  await Favorite.destroy({ where: {} });
  res.status(204).send();
});

export default router;
