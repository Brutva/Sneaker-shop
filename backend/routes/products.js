import express from 'express';
import { Product } from '../models/Product.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const search = req.query.search;

  let products;
  if (search) {
    products = await Product.findAll();

    // Filter products by case-insensitive search on name or keywords
    const lowerCaseSearch = search.toLowerCase();

    products = products.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(lowerCaseSearch);

      const brandMatch = product.brand
        ? product.brand.toLowerCase().includes(lowerCaseSearch)
        : false;

      const keywordsMatch = product.keywords.some(keyword => keyword.toLowerCase().includes(lowerCaseSearch));

      return nameMatch || brandMatch || keywordsMatch;
    });

  } else {
    products = await Product.findAll();
  }

  const baseUrl = `${req.protocol}://${req.get('host')}`;

  const normalizeImageUrl = (image) => {
    if (!image || typeof image !== 'string') return image;

    // If it's already an absolute URL, keep it as-is.
    if (image.startsWith('http://') || image.startsWith('https://')) return image;

    // Convert Windows backslashes to forward slashes
    let imgPath = image.replace(/\\/g, '/');

    // If old frontend-style path was stored, map it to backend static images
    // e.g. "src/public/images/NAME.jpg" -> "images/products/NAME.jpg"
    if (imgPath.includes('src/public/images/')) {
      const filename = imgPath.split('/').pop();
      imgPath = `images/products/${filename}`;
    }

    // Ensure no leading slash so `${baseUrl}/${imgPath}` is correct
    if (imgPath.startsWith('/')) imgPath = imgPath.slice(1);

    return `${baseUrl}/${imgPath}`;
  };

  const normalizedProducts = products.map((product) => {
    const data = product.get({ plain: true });
    data.image = normalizeImageUrl(data.image);
    return data;
  });

  res.json(normalizedProducts);
});

export default router;