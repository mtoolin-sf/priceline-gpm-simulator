const express = require('express');
const router = express.Router();
const profiles = require('../data/profiles.json');

router.get('/', (req, res) => res.json(profiles));
router.get('/:id', (req, res) => {
  const p = profiles.find(p => p.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'Profile not found' });
  res.json(p);
});

module.exports = router;
