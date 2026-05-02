const express = require('express');
const router = express.Router();
const { sfApiRequest } = require('../utils/sfApiClient');

// BLM spend tiers (AUD)
const TIERS = [
  { min: 300, label: '$30 Gift Card', value: 30 },
  { min: 200, label: '$20 Gift Card', value: 20 },
  { min: 100, label: '$10 Gift Card', value: 10 },
];

// In-memory BLM tracker (resets on server restart — demo-friendly)
const trackers = {};

router.post('/record-spend', (req, res) => {
  const { contactId, amount, windowStart, windowEnd } = req.body;
  if (!trackers[contactId]) {
    trackers[contactId] = { contactId, cumulativeSpend: 0, transactionCount: 0, windowStart, windowEnd, status: 'Active', awardedTier: null };
  }
  trackers[contactId].cumulativeSpend += parseFloat(amount);
  trackers[contactId].transactionCount += 1;

  const spend = trackers[contactId].cumulativeSpend;
  const eligible = TIERS.find(t => spend >= t.min);
  if (eligible) {
    trackers[contactId].currentTier = eligible.label;
    trackers[contactId].nextTier = null;
  } else {
    trackers[contactId].currentTier = null;
    const next = [...TIERS].reverse().find(t => spend < t.min);
    trackers[contactId].nextTier = next ? { ...next, remaining: (next.min - spend).toFixed(2) } : null;
  }

  res.json(trackers[contactId]);
});

router.get('/tracker/:contactId', (req, res) => {
  res.json(trackers[req.params.contactId] || null);
});

router.post('/reset/:contactId', (req, res) => {
  delete trackers[req.params.contactId];
  res.json({ reset: true });
});

router.get('/all', (req, res) => res.json(trackers));

module.exports = router;
