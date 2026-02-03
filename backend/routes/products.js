import express from 'express';
import { Op } from 'sequelize';
import { Product } from '../models/Product.js';
import { Offer } from '../models/Offer.js';
import { Store } from '../models/Store.js';

const router = express.Router();

function parseExpand(expand) {
  if (!expand) return new Set();
  if (expand === 'all') return new Set(['images', 'offers', 'stores']);
  return new Set(String(expand).split(',').map(s => s.trim()).filter(Boolean));
}

function parseCsvParam(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.flatMap(v => String(v).split(',')).map(s => s.trim()).filter(Boolean);
  }
  return String(value).split(',').map(s => s.trim()).filter(Boolean);
}

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

function deliveryLabel(offer) {
  const min = offer.deliveryMinDays;
  const max = offer.deliveryMaxDays;
  if (Number.isFinite(min) && Number.isFinite(max)) return `${min}-${max} days`;
  if (Number.isFinite(min) && !Number.isFinite(max)) return `${min}+ days`;
  return null;
}

async function attachOfferStats(productsPlain) {
  const productIds = productsPlain.map(p => p.id);
  if (!productIds.length) return productsPlain;

  const offers = await Offer.findAll({
    where: { productId: { [Op.in]: productIds } },
    attributes: ['productId', 'priceCents'],
  });

  const stats = new Map();
  for (const o of offers) {
    const pid = o.productId;
    const price = o.priceCents;

    const s = stats.get(pid) || { count: 0, min: Infinity };
    s.count += 1;
    if (Number.isFinite(price)) s.min = Math.min(s.min, price);
    stats.set(pid, s);
  }

  return productsPlain.map(p => {
    const s = stats.get(p.id);
    if (!s) {
      p.offers = 0;
      return p;
    }

    p.offers = s.count;
    if (Number.isFinite(s.min)) {
      p.priceCents = s.min;
    }
    return p;
  });
}

async function attachOffers(req, productsPlain, expandSet) {
  if (!expandSet.has('offers') && !expandSet.has('stores')) return productsPlain;

  const productIds = productsPlain.map(p => p.id);
  if (!productIds.length) return productsPlain;

  const offers = await Offer.findAll({
    where: { productId: { [Op.in]: productIds } }
  });

  const offersPlain = offers.map(o => o.get({ plain: true }));

  let storeById = new Map();
  if (expandSet.has('stores')) {
    const storeIds = [...new Set(offersPlain.map(o => o.storeId))].filter(Boolean);
    const stores = storeIds.length
      ? await Store.findAll({ where: { id: { [Op.in]: storeIds } } })
      : [];

    storeById = new Map(stores.map(s => {
      const d = s.get({ plain: true });
      d.logo = normalizeImageUrl(req, d.logo);
      return [d.id, d];
    }));
  }

  const offersByProductId = new Map();
  for (const o of offersPlain) {
    if (!offersByProductId.has(o.productId)) offersByProductId.set(o.productId, []);

    const dto = {
      ...o,
      delivery: deliveryLabel(o),
    };

    if (expandSet.has('stores')) {
      dto.store = storeById.get(o.storeId) || null;
    }

    offersByProductId.get(o.productId).push(dto);
  }

  return productsPlain.map(p => {
    const list = offersByProductId.get(p.id) || [];
    p.offersList = list;

    p.offers = list.length;
    if (list.length) {
      const minPrice = Math.min(...list.map(x => x.priceCents).filter(Number.isFinite));
      if (Number.isFinite(minPrice)) p.priceCents = minPrice;
    }

    return p;
  });
}

function sortProducts(list, sort) {
  if (!sort || sort === 'default') return list;

  const copy = [...list];

  if (sort === 'name_asc') copy.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
  if (sort === 'name_desc') copy.sort((a, b) => String(b.name || '').localeCompare(String(a.name || '')));

  if (sort === 'price_asc') copy.sort((a, b) => (a.priceCents ?? Infinity) - (b.priceCents ?? Infinity));
  if (sort === 'price_desc') copy.sort((a, b) => (b.priceCents ?? -Infinity) - (a.priceCents ?? -Infinity));

  if (sort === 'offers_desc') copy.sort((a, b) => (b.offers ?? 0) - (a.offers ?? 0));

  if (sort === 'rating_desc') {
    copy.sort((a, b) => {
      const ra = a.rating?.stars ?? 0;
      const rb = b.rating?.stars ?? 0;
      return rb - ra;
    });
  }

  return copy;
}

router.get('/', async (req, res) => {
  try {
    const search = (req.query.search ?? req.query.q ?? '').toString().trim();
    const brandQuery = req.query.brand ?? req.query.brands;
    const typeQuery = req.query.type ?? req.query.types;
    const sort = (req.query.sort ?? 'default').toString().trim();

    const limit = Number.isFinite(Number(req.query.limit)) ? Math.max(0, Number(req.query.limit)) : null;
    const offset = Number.isFinite(Number(req.query.offset)) ? Math.max(0, Number(req.query.offset)) : 0;

    const expandSet = parseExpand(req.query.expand);

    let products = await Product.findAll();

    const brands = parseCsvParam(brandQuery);
    if (brands.length) {
      const setLower = new Set(brands.map(b => b.toLowerCase()));
      products = products.filter(p => setLower.has(String(p.brand || '').toLowerCase()));
    }

    const types = parseCsvParam(typeQuery);
    if (types.length) {
      const setLower = new Set(types.map(t => t.toLowerCase()));
      products = products.filter(p => setLower.has(String(p.type || '').toLowerCase()));
    }

    if (search) {
      const lower = search.toLowerCase();
      products = products.filter(p => {
        const name = String(p.name || '').toLowerCase();
        const brand = String(p.brand || '').toLowerCase();
        const keywords = Array.isArray(p.keywords) ? p.keywords : [];
        const keywordsMatch = keywords.some(k => String(k).toLowerCase().includes(lower));
        return name.includes(lower) || brand.includes(lower) || keywordsMatch;
      });
    }

    if (limit !== null) {
      products = products.slice(offset, offset + limit);
    }

    let normalizedProducts = products.map((product) => {
      const data = product.get({ plain: true });
      return normalizeProductImages(req, data);
    });

    normalizedProducts = await attachOfferStats(normalizedProducts);

    if (expandSet.has('offers') || expandSet.has('stores')) {
      normalizedProducts = await attachOffers(req, normalizedProducts, expandSet);
    }

    normalizedProducts = sortProducts(normalizedProducts, sort);

    if (!expandSet.has('images')) {
      normalizedProducts = normalizedProducts.map(p => {
        const rest = { ...p };
        delete rest.images;
        return rest;
      });
    }

    res.json(normalizedProducts);
  } catch (err) {
    console.error('GET /products error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const expandSet = parseExpand(req.query.expand);
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let data = normalizeProductImages(req, product.get({ plain: true }));

    [data] = await attachOfferStats([data]);

    if (expandSet.has('offers') || expandSet.has('stores')) {
      const enriched = await attachOffers(req, [data], expandSet);
      data = enriched[0];
    }

    if (!expandSet.has('images')) {
      const rest = { ...data };
      delete rest.images;
      data = rest;
    }

    res.json(data);
  } catch (err) {
    console.error('GET /products/:id error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
