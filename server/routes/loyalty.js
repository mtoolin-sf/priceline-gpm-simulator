const express = require('express');
const router = express.Router();
const { sfApiRequest } = require('../utils/sfApiClient');
const { v4: uuidv4 } = require('uuid');

const PROGRAM_ID = process.env.SF_PROGRAM_ID || '';
const ACCRUAL_JOURNAL_TYPE_ID = process.env.SF_ACCRUAL_JOURNAL_TYPE_ID || '0lEIi0000004PiUMAU';

// EngagementChannelType → channel label map (for display only, not used in TJ create)
const channelMap = {
  'App': '0eFIi000000XepZMAS',
  'In Store': '0eFIi000000XfMgMAK',
  'Online': '0eFIi000000XfMlMAK',
  'Out of Store': '0eFIi000000XfMqMAK',
};

function buildMockTJResult(profile, items, channel) {
  const orderGuid = uuidv4();
  const now = new Date().toISOString();
  return {
    orderGuid,
    mock: true,
    results: {
      transactionJournals: items.map((item, i) => ({
        id: `TJ-MOCK-${String(i+1).padStart(4,'0')}`,
        transactionJournalId: `TJ-MOCK-${String(i+1).padStart(4,'0')}`,
        memberId: profile.memberId,
        transactionAmount: (item.price * item.qty).toFixed(2),
        status: 'Processed',
        activityDate: now,
        productCategoryId: item.sfCategoryId,
        externalTransactionNumber: orderGuid,
      })),
    },
  };
}

router.post('/transaction-journals', async (req, res, next) => {
  const { profile, items, channel } = req.body;
  if (!profile.isMember || !profile.memberId) {
    return res.json({ skipped: true, reason: 'Non-member — no loyalty TJ created' });
  }

  const orderGuid = uuidv4();
  const now = new Date().toISOString();
  const programId = PROGRAM_ID || profile.programId;

  // Build one TJ payload per cart line item
  const tjPayloads = items.map(item => ({
    MemberId: profile.memberId,
    LoyaltyProgramId: programId,
    JournalTypeId: ACCRUAL_JOURNAL_TYPE_ID,
    ActivityDate: now,
    Status: 'Pending',
    TransactionAmount: parseFloat((item.price * item.qty).toFixed(2)),
    CurrencyIsoCode: 'USD',
    ExternalTransactionNumber: orderGuid,
    ProductCategoryId: item.sfCategoryId || null,
  }));

  try {
    // Create TJs in parallel via sObject REST API
    const results = await Promise.all(
      tjPayloads.map(payload =>
        sfApiRequest('/sobjects/TransactionJournal', 'POST', payload)
      )
    );

    const transactionJournals = results.map((r, i) => ({
      id: r.id,
      transactionJournalId: r.id,
      memberId: profile.memberId,
      transactionAmount: (items[i].price * items[i].qty).toFixed(2),
      status: 'Pending',
      activityDate: now,
      externalTransactionNumber: orderGuid,
    }));

    res.json({ orderGuid, results: { transactionJournals } });
  } catch (err) {
    // Fallback to mock TJs if SF API not available
    if (err.status === 404 || err.status === 400) {
      return res.json(buildMockTJResult(profile, items, channel));
    }
    next(err);
  }
});

router.get('/channel-map', (req, res) => res.json(channelMap));

module.exports = router;
