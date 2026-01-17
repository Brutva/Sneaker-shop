import express from 'express';
import { Op } from 'sequelize';
import { Store } from '../models/Store.js';
import { Offer } from '../models/Offer.js';
import { Product } from '../models/Product.js';

const router = express.Router();

function normalizeImageUrl(req, image) {
  if (!image || typeof image !== 'string') return image;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  let imgPath = image.replace(/\\/g, '/');

  if (imgPath.includes('src/public/images/')) {
    const filename = imgPath.split('/').pop();
    imgPath = `images/${filename}`;
  }

  if (imgPath.startsWith('/')) imgPath = imgPath.slice(1);
  return `${baseUrl}/${imgPath}`;
}

function parseExpand(expand) {
  if (!expand) return new Set();
  if (expand === 'all') return new Set(['stats', 'products']);
  return new Set(String(expand).split(',').map(s => s.trim()).filter(Boolean));
}

async function getStoreStats() {
  const offers = await Offer.findAll({ attributes: ['storeId', 'productId'] });

  const offersCountByStoreId = new Map();
  const productsByStoreId = new Map();

  for (const o of offers) {
    const { storeId, productId } = o.get({ plain: true });

    offersCountByStoreId.set(storeId, (offersCountByStoreId.get(storeId) || 0) + 1);

    if (!productsByStoreId.has(storeId)) productsByStoreId.set(storeId, new Set());
    productsByStoreId.get(storeId).add(productId);
  }

  return { offersCountByStoreId, productsByStoreId };
}

router.get('/', async (req, res) => {
  const search = req.query.search;
  const expandSet = parseExpand(req.query.expand);

  let stores = await Store.findAll();

  if (search) {
    const lower = String(search).toLowerCase();
    stores = stores.filter(s => {
      const data = s.get({ plain: true });
      return data.name.toLowerCase().includes(lower) || data.slug.toLowerCase().includes(lower);
    });
  }

  const storePlain = stores.map(s => {
    const data = s.get({ plain: true });
    data.logo = normalizeImageUrl(req, data.logo);
    return data;
  });

  let stats = null;
  if (expandSet.has('stats') || expandSet.has('products')) {
    stats = await getStoreStats();
  }

  const withStats = storePlain.map(s => {
    const offersCount = stats?.offersCountByStoreId.get(s.id) || 0;
    const productsCount = stats?.productsByStoreId.get(s.id)?.size || 0;
    return { ...s, offersCount, productsCount };
  });

  if (expandSet.has('products')) {
    const offers = await Offer.findAll();
    const storeToProductIds = new Map();

    for (const o of offers) {
      const { storeId, productId } = o.get({ plain: true });
      if (!storeToProductIds.has(storeId)) storeToProductIds.set(storeId, new Set());
      storeToProductIds.get(storeId).add(productId);
    }

    const allProductIds = [...new Set(offers.map(o => o.productId))];
    const products = allProductIds.length
      ? await Product.findAll({ where: { id: { [Op.in]: allProductIds } } })
      : [];

    const productById = new Map(
      products.map(p => {
        const d = p.get({ plain: true });
        d.image = normalizeImageUrl(req, d.image);
        const imgs = Array.isArray(d.images) && d.images.length ? d.images : [d.image, d.image, d.image, d.image];
        d.images = imgs.map(img => normalizeImageUrl(req, img)).slice(0, 4);
        return [d.id, d];
      })
    );

    return res.json(
      withStats.map(s => {
        const ids = storeToProductIds.get(s.id) ? [...storeToProductIds.get(s.id)] : [];
        const preview = ids.map(id => productById.get(id)).filter(Boolean);
        return { ...s, products: preview };
      })
    );
  }

  res.json(withStats);
});

router.get('/:id', async (req, res) => {
  const expandSet = parseExpand(req.query.expand);
  const store = await Store.findByPk(req.params.id);
  if (!store) return res.status(404).json({ error: 'Store not found' });

  const data = store.get({ plain: true });
  data.logo = normalizeImageUrl(req, data.logo);

  const stats = await getStoreStats();
  data.offersCount = stats.offersCountByStoreId.get(data.id) || 0;
  data.productsCount = stats.productsByStoreId.get(data.id)?.size || 0;

  if (expandSet.has('products') || expandSet.has('all')) {
    const offers = await Offer.findAll({ where: { storeId: data.id } });
    const productIds = [...new Set(offers.map(o => o.productId))];

    const products = productIds.length
      ? await Product.findAll({ where: { id: { [Op.in]: productIds } } })
      : [];

    data.products = products.map(p => {
      const d = p.get({ plain: true });
      d.image = normalizeImageUrl(req, d.image);
      const imgs = Array.isArray(d.images) && d.images.length ? d.images : [d.image, d.image, d.image, d.image];
      d.images = imgs.map(img => normalizeImageUrl(req, img)).slice(0, 4);
      return d;
    });
  }

  res.json(data);
});

export default router;
