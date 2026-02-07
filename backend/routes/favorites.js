import express from 'express';
import { Op } from 'sequelize';
import { Favorite } from '../models/Favorite.js';
import { Product } from '../models/Product.js';

const router = express.Router();

function normalizeImageUrl(req, image) {
  if (!image || typeof image !== "string") return image;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;

  let imgPath = image.replace(/\\/g, "/");

  if (imgPath.includes("src/public/images/")) {
    const filename = imgPath.split("/").pop();
    imgPath = `images/products/${filename}`;
  }

  if (!imgPath.startsWith("/")) imgPath = "/" + imgPath;
  return imgPath;
}


router.get('/', async (req, res) => {
  const expand = req.query.expand;
  const favorites = await Favorite.findAll();

  if (expand === 'product') {
    const ids = favorites.map(f => f.productId);
    if (ids.length === 0) return res.json([]);

    const products = await Product.findAll({
      where: { id: { [Op.in]: ids } }
    });

    const productById = new Map(products.map(p => {
      const data = p.get({ plain: true });
      data.image = normalizeImageUrl(req, data.image);
      return [data.id, data];
    }));

    return res.json(favorites.map(f => {
      const fav = f.get({ plain: true });
      return { ...fav, product: productById.get(fav.productId) || null };
    }));
  }

  res.json(favorites);
});

router.post('/', async (req, res) => {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ error: 'productId is required' });

  const product = await Product.findByPk(productId);
  if (!product) return res.status(400).json({ error: 'Product not found' });

  const existing = await Favorite.findOne({ where: { productId } });
  if (existing) return res.status(200).json(existing);

  const favorite = await Favorite.create({ productId });
  res.status(201).json(favorite);
});

router.delete('/:productId', async (req, res) => {
  const { productId } = req.params;
  const favorite = await Favorite.findOne({ where: { productId } });
  if (!favorite) return res.status(404).json({ error: 'Favorite not found' });

  await favorite.destroy();
  res.status(204).send();
});

router.delete('/', async (req, res) => {
  await Favorite.destroy({ where: {} });
  res.status(204).send();
});

export default router;
