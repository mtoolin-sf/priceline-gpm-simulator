const express = require('express');
const router = express.Router();
const { sfApiRequest } = require('../utils/sfApiClient');
const { v4: uuidv4 } = require('uuid');

const PROGRAM_NAME = process.env.SF_PROGRAM_NAME || 'Priceline Beauty Rewards';

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
        engagementChannelTypeId: channelMap[channel] || channelMap['Online'],
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

  const channelId = channelMap[channel] || channelMap['Online'];
  const orderGuid = uuidv4();
  const now = new Date().toISOString();

  const transactionJournals = items.map(item => ({
    MemberId: profile.memberId,
    TransactionAmount: (item.price * item.qty).toFixed(2),
    Status: 'Pending',
    ActivityDate: now,
    ProductCategoryId: item.sfCategoryId,
    EngagementChannelTypeId: channelId,
    ExternalTransactionNumber: orderGuid,
  }));

  try {
    const data = await sfApiRequest(
      `/connect/loyalty/programs/${encodeURIComponent(PROGRAM_NAME)}/transaction-journals`,
      'POST',
      { transactionJournals }
    );
    res.json({ orderGuid, results: data });
  } catch (err) {
    // Fallback to mock TJs if Loyalty API not available
    if (err.status === 404 || err.status === 400) {
      return res.json(buildMockTJResult(profile, items, channel));
    }
    next(err);
  }
});

router.get('/channel-map', (req, res) => res.json(channelMap));

module.exports = router;
