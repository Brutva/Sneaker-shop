import express from 'express';
import { Op } from 'sequelize';
import { Product } from '../models/Product.js';
import { Offer } from '../models/Offer.js';
import { Store } from '../models/Store.js';

const router = express.Router();

function normalizeImageUrl(req, image) {
  if (!image || typeof image !== 'string') return image;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  let imgPath = image.replace(/\\/g, "/");

  if (imgPath.includes('src/public/images/')) {
    const filename = imgPath.split('/').pop();
    imgPath = `images/products/${filename}`;
  }

  if (imgPath.startsWith('/')) imgPath = imgPath.slice(1);
  return `${baseUrl}/${imgPath}`;
}

function normalizeProductImages(req, productPlain) {
  productPlain.image = normalizeImageUrl(req, productPlain.image);

  const raw = [
    productPlain.image,
    productPlain.image2,
    productPlain.image3,
    productPlain.image4
  ].filter(Boolean);

  const imgs = raw.length ? raw : [productPlain.image];
  while (imgs.length < 4) imgs.push(imgs[imgs.length - 1]);

  productPlain.images = imgs.slice(0, 4).map(img => normalizeImageUrl(req, img));
  return productPlain;
}

function parseExpand(expand) {
  if (!expand) return new Set();
  if (expand === 'all') return new Set(['images', 'offers', 'stores']);
  return new Set(String(expand).split(',').map(s => s.trim()).filter(Boolean));
}

function deliveryLabel(offer) {
  const min = offer.deliveryMinDays;
  const max = offer.deliveryMaxDays;
  if (Number.isFinite(min) && Number.isFinite(max)) return `${min}-${max} days`;
  if (Number.isFinite(min) && !Number.isFinite(max)) return `${min}+ days`;
  return null;
}

async function attachOffers(req, productsPlain, expandSet) {
  if (!expandSet.has('offers') && !expandSet.has('stores')) return productsPlain;

  const productIds = productsPlain.map(p => p.id);
  if (productIds.length === 0) return productsPlain;

  const offers = await Offer.findAll({ where: { productId: { [Op.in]: productIds } } });
  const offersPlain = offers.map(o => o.get({ plain: true }));

  const storeIds = [...new Set(offersPlain.map(o => o.storeId))];
  const stores = storeIds.length
    ? await Store.findAll({ where: { id: { [Op.in]: storeIds } } })
    : [];

  const storeById = new Map(stores.map(s => {
    const d = s.get({ plain: true });
    d.logo = normalizeImageUrl(req, d.logo);
    return [d.id, d];
  }));

  const offersByProductId = new Map();
  for (const o of offersPlain) {
    if (!offersByProductId.has(o.productId)) offersByProductId.set(o.productId, []);

    const offerDto = { ...o, delivery: deliveryLabel(o) };

    if (expandSet.has('stores')) {
      offerDto.store = storeById.get(o.storeId) || null;
    }

    offersByProductId.get(o.productId).push(offerDto);
  }

  return productsPlain.map(p => {
    const list = offersByProductId.get(p.id) || [];
    if (list.length > 0) p.offers = list.length;
    p.offersList = list;
    return p;
  });
}

router.get('/', async (req, res) => {
  const search = req.query.search ?? req.query.q;

  const brandQuery = req.query.brand ?? req.query.brands;

  const limit = Number.isFinite(Number(req.query.limit)) ? Math.max(0, Number(req.query.limit)) : null;
  const offset = Number.isFinite(Number(req.query.offset)) ? Math.max(0, Number(req.query.offset)) : 0;

  const expandSet = parseExpand(req.query.expand);

  let products = await Product.findAll();

  if (brandQuery) {
    const raw = Array.isArray(brandQuery)
      ? brandQuery
      : String(brandQuery).split(',');

    const brands = raw.map(s => String(s).trim()).filter(Boolean);

    if (brands.length) {
      const setLower = new Set(brands.map(b => b.toLowerCase()));
      products = products.filter(p => {
        const b = String(p.brand || '').trim().toLowerCase();
        return setLower.has(b);
      });
    }
  }

  if (search) {
    const lowerCaseSearch = String(search).toLowerCase();
    products = products.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(lowerCaseSearch);
      const brandMatch = product.brand ? product.brand.toLowerCase().includes(lowerCaseSearch) : false;
      const keywordsMatch = Array.isArray(product.keywords)
        ? product.keywords.some(keyword => String(keyword).toLowerCase().includes(lowerCaseSearch))
        : false;

      return nameMatch || brandMatch || keywordsMatch;
    });
  }

  if (limit !== null) {
    products = products.slice(offset, offset + limit);
  }

  let normalizedProducts = products.map((product) => {
    const data = product.get({ plain: true });
    return normalizeProductImages(req, data);
  });

  if (expandSet.has('offers') || expandSet.has('stores')) {
    normalizedProducts = await attachOffers(req, normalizedProducts, expandSet);
  }

  if (!expandSet.has('images') && !expandSet.has('all')) {
    normalizedProducts = normalizedProducts.map(p => {
      const rest = { ...p };
      delete rest.images;
      return rest;
    });
  }

  res.json(normalizedProducts);
});

router.get('/:id', async (req, res) => {
  const expandSet = parseExpand(req.query.expand);
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  let data = normalizeProductImages(req, product.get({ plain: true }));

  if (expandSet.has('offers') || expandSet.has('stores')) {
    const enrichedList = await attachOffers(req, [data], expandSet);
    data = enrichedList[0];
  }

  res.json(data);
});

export default router;
