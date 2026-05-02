const express = require('express');
const router = express.Router();
const products = require('../data/products.json');

router.get('/', (req, res) => {
  const { category } = req.query;
  if (category && category !== 'All') {
    return res.json(products.filter(p => p.category === category));
  }
  res.json(products);
});

router.get('/categories', (req, res) => {
  const cats = ['All', ...new Set(products.map(p => p.category))];
  res.json(cats);
});

module.exports = router;
