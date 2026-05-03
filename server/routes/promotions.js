const express = require('express');
const router = express.Router();
const { sfApiRequest } = require('../utils/sfApiClient');

const CATALOG = process.env.SF_CATALOG_NAME || 'Priceline Beauty Rewards Catalog';

function buildCartPayload(profile, items, channel) {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  return {
    cart: {
      cartDetails: [{
        cartHeaderId__std: `priceline-demo-${Date.now()}`,
        activityStartDate: new Date().toISOString(),
        contactId: profile.contactId,
        transactionAmount: total.toFixed(2),
        currencyISOCode: 'AUD',
        cartLineDetails: items.map(item => ({
          cartLineProduct: item.name,
          cartLineItemQuantity: item.qty,
          cartLineItemAmount: (item.price * item.qty).toFixed(2),
          cartLineItemId: item.id,
          cartLineNetUnitPrice__std: item.price,
          cartLineProductCatalog: CATALOG,
        })),
      }],
    },
  };
}

// Smart mock: detect UC from cart/profile, return realistic SF API-shaped response
function buildMockEligible(profile, items, channel) {
  const promos = [];
  const categories = [...new Set(items.map(i => i.category))];
  const skincareCount = items.filter(i => i.category === 'Skincare').reduce((s, i) => s + i.qty, 0);
  const vitaminCount = items.filter(i => i.category === 'Vitamins & Supplements').reduce((s, i) => s + i.qty, 0);
  const haircareCount = items.filter(i => i.category === 'Haircare').reduce((s, i) => s + i.qty, 0);
  const hasLancome = items.some(i => i.name && i.name.toLowerCase().includes('lancome'));
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const isSisterCard = profile.cardType === 'Sister Club Card';
  const isNewCard = profile.cardJoinDaysAgo !== null && profile.cardJoinDaysAgo <= 60;
  const isNonMember = !profile.isMember;

  // UC1 — Skincare 2+ items
  if (skincareCount >= 2 && isSisterCard) {
    promos.push({
      promotionId: 'UC1-PROMO-001',
      promotionName: 'Skincare Bundle Bonus',
      promotionDescription: 'Buy 2 or more Skincare products → earn 1,000 Beauty Points ($5)',
      eligibilityReasonCode: 'QUANTITY_THRESHOLD_MET',
      rewardPoints: 1000,
      totalReward: '1,000 Beauty Points ($5 value)',
      promotionType: 'QuantityThreshold',
      loyaltyOffers: [
        { offerId: 'OFFER-UC1-PTS', offerName: '1,000 Beauty Points', offerType: 'POINTS', fulfillmentAction: 'CREDIT_POINTS', rewardValue: 1000, currencyType: 'BeautyPoints', presentmentDetails: { headline: 'Earn 1,000 Beauty Points', description: 'Worth $5.00, credited instantly to your account', ctaText: 'Claim Points', badgeText: 'Most Popular', imageUrl: '/offers/offer-points-badge.png' } },
        { offerId: 'OFFER-UC1-VCH', offerName: '$5 Shopping Voucher', offerType: 'VOUCHER', fulfillmentAction: 'ISSUE_VOUCHER', rewardValue: 5.00, currencyType: 'AUD', presentmentDetails: { headline: '$5 Off Your Next Shop', description: 'Digital voucher emailed within 24 hrs, valid 90 days', ctaText: 'Get Voucher', imageUrl: '/offers/offer-voucher.png' } },
        { offerId: 'OFFER-UC1-PRD', offerName: 'Free Priceline Tote Bag', offerType: 'PRODUCT', fulfillmentAction: 'SHIP_PRODUCT', rewardValue: 0, currencyType: null, presentmentDetails: { headline: 'Free Reusable Tote Bag', description: 'Complimentary Priceline tote added to your order', ctaText: 'Add Free Gift', imageUrl: '/offers/offer-tote-bag.png' } },
      ],
    });
  }

  // UC2 — Vitamins Buy More Earn More
  if (vitaminCount >= 1 && isSisterCard) {
    const pts = vitaminCount === 1 ? 200 : vitaminCount === 2 ? 400 : 600;
    promos.push({
      promotionId: `UC2-PROMO-${vitaminCount}`,
      promotionName: `Buy More Earn More — ${vitaminCount} Vitamin${vitaminCount > 1 ? 's' : ''}`,
      promotionDescription: `Buy ${vitaminCount} Vitamin & Supplement product${vitaminCount > 1 ? 's' : ''} → earn ${pts} Beauty Points`,
      eligibilityReasonCode: 'BUY_MORE_EARN_MORE',
      rewardPoints: pts,
      totalReward: `${pts} Beauty Points`,
      promotionType: 'IncrementalPoints',
      loyaltyOffers: [
        { offerId: 'OFFER-UC2-PTS', offerName: `${pts} Beauty Points`, offerType: 'POINTS', fulfillmentAction: 'CREDIT_POINTS', rewardValue: pts, currencyType: 'BeautyPoints', presentmentDetails: { headline: `Earn ${pts} Beauty Points`, description: `Worth $${(pts / 200).toFixed(2)} on your Beauty Club account`, ctaText: 'Claim Points', badgeText: 'Auto Applied', imageUrl: '/offers/offer-vitamins.png' } },
        { offerId: 'OFFER-UC2-DSC', offerName: '10% Off Next Vitamins', offerType: 'DISCOUNT', fulfillmentAction: 'APPLY_DISCOUNT', rewardValue: 10, currencyType: 'PERCENT', presentmentDetails: { headline: '10% Off Next Vitamins Order', description: 'Single-use discount applied at checkout, expires in 30 days', ctaText: 'Get Discount', imageUrl: '/offers/offer-discount-tag.png' } },
      ],
    });
  }

  // UC3 — Haircare engagement trail (in store only)
  if (haircareCount >= 1 && channel === 'In Store') {
    promos.push({
      promotionId: 'UC3-PROMO-001',
      promotionName: 'Haircare Repeat Shopper Bonus',
      promotionDescription: 'Make 2 Haircare purchases within 14 days → earn 500 Beauty Points. Transaction 1 of 2 recorded.',
      eligibilityReasonCode: 'ENGAGEMENT_TRAIL_STARTED',
      rewardPoints: 0,
      totalReward: '500 Beauty Points on 2nd transaction',
      promotionType: 'EngagementTrail',
      loyaltyOffers: [
        { offerId: 'OFFER-UC3-PTS', offerName: '500 Points on Completion', offerType: 'POINTS', fulfillmentAction: 'CREDIT_POINTS', rewardValue: 500, currencyType: 'BeautyPoints', presentmentDetails: { headline: '500 pts after 2nd Haircare purchase', description: 'Completes when you buy Haircare again within 14 days', ctaText: 'Track Progress', imageUrl: '/offers/offer-points-badge.png' } },
      ],
    });
  }

  // UC4 — Bonus Points Days
  if (total >= 10) {
    const rateLabel = isSisterCard ? '5x points per $10' : '3x points per $10';
    const rate = isSisterCard ? 50 : 30;
    const bonusPts = Math.floor(total / 10) * rate;
    promos.push({
      promotionId: 'UC4-PROMO-001',
      promotionName: 'Beauty Club Bonus Points Days',
      promotionDescription: `${rateLabel} spent — ${isSisterCard ? 'Sister Club Card member' : 'Beauty Club member'} rate`,
      eligibilityReasonCode: 'SPEND_THRESHOLD_MET',
      rewardPoints: bonusPts,
      totalReward: `${bonusPts} Beauty Points (${rateLabel})`,
      promotionType: 'SpendMultiplier',
      loyaltyOffers: [
        { offerId: 'OFFER-UC4-PTS', offerName: `${bonusPts} Bonus Points`, offerType: 'POINTS', fulfillmentAction: 'CREDIT_POINTS', rewardValue: bonusPts, currencyType: 'BeautyPoints', presentmentDetails: { headline: `${bonusPts} Bonus Points Today`, description: `${rateLabel} — credited at transaction completion`, ctaText: 'Claim Bonus', badgeText: 'Auto Applied', imageUrl: '/offers/offer-points-badge.png' } },
        { offerId: 'OFFER-UC4-VCH', offerName: '$5 Next Visit Voucher', offerType: 'VOUCHER', fulfillmentAction: 'ISSUE_VOUCHER', rewardValue: 5.00, currencyType: 'AUD', presentmentDetails: { headline: '$5 Off Your Next Visit', description: 'Choose this instead of points — valid on next purchase', ctaText: 'Get Voucher', imageUrl: '/offers/offer-voucher.png' } },
      ],
    });
  }

  // UC5 — App-only Lancôme 3X
  if (hasLancome && channel === 'App') {
    const lancomeItems = items.filter(i => i.name && i.name.toLowerCase().includes('lancome'));
    const lancomePts = lancomeItems.reduce((s, i) => s + Math.floor(i.price * i.qty) * 3, 0);
    promos.push({
      promotionId: 'UC5-PROMO-001',
      promotionName: 'App Exclusive — Lancôme 3X Beauty Points',
      promotionDescription: 'Priceline App exclusive: earn 3x Beauty Points on select Lancôme fragrances',
      eligibilityReasonCode: 'APP_CHANNEL_SKU_MATCH',
      rewardPoints: lancomePts,
      totalReward: `${lancomePts} Beauty Points (3x on Lancôme)`,
      promotionType: 'PointsMultiplier',
      loyaltyOffers: [
        { offerId: 'OFFER-UC5-PTS', offerName: `${lancomePts} Points (3x)`, offerType: 'POINTS', fulfillmentAction: 'CREDIT_POINTS', rewardValue: lancomePts, currencyType: 'BeautyPoints', presentmentDetails: { headline: `${lancomePts} pts — 3x on Lancôme`, description: 'App-exclusive multiplier, credited on order confirmation', ctaText: 'Claim Points', badgeText: 'App Exclusive', imageUrl: '/offers/offer-lancome-perfume.png' } },
        { offerId: 'OFFER-UC5-PRD', offerName: 'Lancôme Miniature Fragrance', offerType: 'PRODUCT', fulfillmentAction: 'SHIP_PRODUCT', rewardValue: 0, currencyType: null, presentmentDetails: { headline: 'Free Lancôme Miniature', description: 'La Vie Est Belle 5mL miniature added to your order', ctaText: 'Add Free Sample', imageUrl: '/offers/offer-lancome-miniature.png' } },
      ],
    });
  }

  // UC6 — New Sister Club Card OOS Welcome
  if (isNewCard && channel === 'Out of Store' && isSisterCard && total >= 75) {
    promos.push({
      promotionId: 'UC6-PROMO-001',
      promotionName: 'New Sister Club Card Welcome Offer',
      promotionDescription: 'New cardholder bonus: spend $75 out of store within 60 days → earn 1,000 Beauty Points ($5)',
      eligibilityReasonCode: 'NEW_CARDHOLDER_OOS_SPEND',
      rewardPoints: 1000,
      totalReward: '1,000 Beauty Points ($5 value)',
      promotionType: 'WelcomeOffer',
      loyaltyOffers: [
        { offerId: 'OFFER-UC6-PTS', offerName: '1,000 Beauty Points', offerType: 'POINTS', fulfillmentAction: 'CREDIT_POINTS', rewardValue: 1000, currencyType: 'BeautyPoints', presentmentDetails: { headline: '1,000 Welcome Points', description: 'New cardholder bonus — $5.00 added to your account', ctaText: 'Claim Welcome Gift', badgeText: 'Welcome Offer', imageUrl: '/offers/offer-points-badge.png' } },
        { offerId: 'OFFER-UC6-VCH', offerName: '$5 Welcome Voucher', offerType: 'VOUCHER', fulfillmentAction: 'ISSUE_VOUCHER', rewardValue: 5.00, currencyType: 'AUD', presentmentDetails: { headline: '$5 Welcome Voucher', description: 'Prefer cash value? Use this voucher on any purchase', ctaText: 'Get Voucher', imageUrl: '/offers/offer-voucher.png' } },
      ],
    });
  }

  // UC8 — Cross-category bundle: Skincare + Makeup in same basket → 1,500 pts
  const makeupCount = items.filter(i => i.category === 'Makeup').reduce((s, i) => s + i.qty, 0);
  if (skincareCount >= 1 && makeupCount >= 1 && profile.isMember) {
    promos.push({
      promotionId: 'UC8-PROMO-001',
      promotionName: 'Skincare + Makeup Cross-Category Bundle',
      promotionDescription: 'Buy 1+ Skincare AND 1+ Makeup products in the same basket → earn 1,500 Beauty Points ($7.50). Cross-line promotion evaluated across all cart items.',
      eligibilityReasonCode: 'CROSS_CATEGORY_BUNDLE_MET',
      rewardPoints: 1500,
      totalReward: '1,500 Beauty Points ($7.50 value)',
      promotionType: 'CrossCategoryBundle',
      ruleDetail: 'GPM cross-line rule: qualifies when cartLineDetails span both Skincare and Makeup product catalog categories in a single cartDetails entry.',
      loyaltyOffers: [
        { offerId: 'OFFER-UC8-PTS', offerName: '1,500 Beauty Points', offerType: 'POINTS', fulfillmentAction: 'CREDIT_POINTS', rewardValue: 1500, currencyType: 'BeautyPoints', presentmentDetails: { headline: 'Earn 1,500 Beauty Points', description: 'Cross-category reward — worth $7.50 on your account', ctaText: 'Claim Points', badgeText: 'Most Popular', imageUrl: '/offers/offer-cross-category.png' } },
        { offerId: 'OFFER-UC8-VCH', offerName: '$7.50 Gift Voucher', offerType: 'VOUCHER', fulfillmentAction: 'ISSUE_VOUCHER', rewardValue: 7.50, currencyType: 'AUD', presentmentDetails: { headline: '$7.50 Priceline Voucher', description: 'Redeemable on any future Priceline purchase, valid 90 days', ctaText: 'Get Voucher', imageUrl: '/offers/offer-voucher.png' } },
      ],
    });
  }

  // UC9 — Gold tier exclusive: 2,000 pts on Gift Sets, Gold members only
  const giftSetCount = items.filter(i => i.category === 'Gift Sets').reduce((s, i) => s + i.qty, 0);
  if (giftSetCount >= 1 && profile.tier === 'Gold') {
    promos.push({
      promotionId: 'UC9-PROMO-001',
      promotionName: 'Gold Member Exclusive — Gift Set Bonus',
      promotionDescription: 'Gold Beauty Club members only: purchase any Priceline Gift Set → earn 2,000 Beauty Points ($10). Not available to Silver or Standard members.',
      eligibilityReasonCode: 'TIER_GATE_GOLD_MET',
      rewardPoints: 2000,
      totalReward: '2,000 Beauty Points ($10 value)',
      promotionType: 'TierExclusive',
      ruleDetail: 'GPM member segment rule: LoyaltyProgramMember.CurrentTier = Gold. Evaluation fails for Standard/Silver — promo not returned in eligiblePromotions response.',
      tierRequired: 'Gold',
      loyaltyOffers: [
        { offerId: 'OFFER-UC9-PTS', offerName: '2,000 Beauty Points', offerType: 'POINTS', fulfillmentAction: 'CREDIT_POINTS', rewardValue: 2000, currencyType: 'BeautyPoints', presentmentDetails: { headline: '2,000 Points — Gold Exclusive', description: 'Worth $10 — Gold member exclusive reward', ctaText: 'Claim Points', badgeText: 'Gold Member', imageUrl: '/offers/offer-gold-exclusive.png' } },
        { offerId: 'OFFER-UC9-DSC', offerName: '10% Off Gift Set', offerType: 'DISCOUNT', fulfillmentAction: 'APPLY_DISCOUNT', rewardValue: 10, currencyType: 'PERCENT', presentmentDetails: { headline: '10% Off Your Gift Set', description: 'Immediate discount applied at checkout for Gold members', ctaText: 'Apply Discount', imageUrl: '/offers/offer-discount-tag.png' } },
        { offerId: 'OFFER-UC9-PRD', offerName: 'Free Gift Wrap & Ribbon', offerType: 'PRODUCT', fulfillmentAction: 'SHIP_PRODUCT', rewardValue: 0, currencyType: null, presentmentDetails: { headline: 'Free Premium Gift Wrap', description: 'Complimentary gift wrapping with ribbon and personalised card', ctaText: 'Add Gift Wrap', imageUrl: '/offers/offer-gift-wrap.png' } },
      ],
    });
  }

  // UC10 — Supplier-funded L'Oréal SKU bonus: 500 pts per L'Oréal item, funded by L'Oréal
  const lorealItems = items.filter(i => i.supplier === "L'Oréal" || (i.brand && i.brand.toLowerCase().includes("l'oréal")));
  if (lorealItems.length > 0 && profile.isMember) {
    const lorealPts = lorealItems.reduce((s, i) => s + 500 * i.qty, 0);
    promos.push({
      promotionId: 'UC10-PROMO-001',
      promotionName: "L'Oréal Supplier Bonus — 500 pts per SKU",
      promotionDescription: `Buy any L'Oréal Paris product → earn 500 Beauty Points per item (${lorealItems.length} item${lorealItems.length > 1 ? 's' : ''} in cart = ${lorealPts.toLocaleString()} pts). Promotion cost funded by L'Oréal, not Priceline.`,
      eligibilityReasonCode: 'SUPPLIER_FUNDED_SKU_MATCH',
      rewardPoints: lorealPts,
      totalReward: `${lorealPts.toLocaleString()} Beauty Points`,
      promotionType: 'SupplierFunded',
      fundingSource: "L'Oréal Australia Pty Ltd",
      fundingModel: 'Supplier absorbs 100% of points cost. Reported via FundingSource__c on PromotionRecord.',
      ruleDetail: "GPM Quick Promotion: product list = L'Oréal Paris SKUs. FundingSource custom field points to L'Oréal Account record for cost attribution and billing.",
      loyaltyOffers: [
        { offerId: 'OFFER-UC10-PTS', offerName: `${lorealPts} Points (L'Oréal Funded)`, offerType: 'POINTS', fulfillmentAction: 'CREDIT_POINTS', rewardValue: lorealPts, currencyType: 'BeautyPoints', presentmentDetails: { headline: `${lorealPts} pts — Supplier Funded`, description: "Funded by L'Oréal Australia — no cost to Priceline", ctaText: 'Claim Points', badgeText: "L'Oréal Offer", imageUrl: '/offers/offer-loreal-foundation.png' } },
        { offerId: 'OFFER-UC10-PRD', offerName: "L'Oréal Paris Sample Pack", offerType: 'PRODUCT', fulfillmentAction: 'SHIP_PRODUCT', rewardValue: 0, currencyType: null, presentmentDetails: { headline: "Free L'Oréal Sample Pack", description: '3-piece True Match deluxe sample set, while stocks last', ctaText: 'Add Samples', imageUrl: '/offers/offer-loreal-samples.png' } },
      ],
    });
  }

  return { eligiblePromotions: promos, totalCount: promos.length };
}

function buildMockExecution(profile, items, channel) {
  const mockEligible = buildMockEligible(profile, items, channel);
  const promos = mockEligible.eligiblePromotions;
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  // UC9 Gold gift sets get a 10% price discount in addition to points
  const giftSetDiscount = promos.find(p => p.promotionType === 'TierExclusive')
    ? items.filter(i => i.category === 'Gift Sets').reduce((s, i) => s + i.price * i.qty * 0.10, 0)
    : 0;

  const appliedPromos = promos.map(p => ({
    ...p,
    discountAmount: p.promotionType === 'TierExclusive' ? parseFloat(giftSetDiscount.toFixed(2)) : 0,
    status: 'Applied',
  }));

  const totalDiscount = appliedPromos.reduce((s, p) => s + (p.discountAmount || 0), 0);

  return {
    cart: {
      cartDetails: [{
        cartHeaderId__std: `priceline-exec-${Date.now()}`,
        transactionAmount: subtotal.toFixed(2),
        appliedCartPromotionDetails: appliedPromos,
        totalDiscountAmount: parseFloat(totalDiscount.toFixed(2)),
        finalTransactionAmount: parseFloat((subtotal - totalDiscount).toFixed(2)),
      }],
    },
  };
}

router.post('/eligible', async (req, res, next) => {
  const { profile, items, channel, useMock } = req.body;

  // Always use smart mock (GPM not configured in org yet)
  if (useMock || process.env.USE_MOCK_GPM === 'true') {
    return res.json(buildMockEligible(profile, items, channel));
  }

  try {
    const payload = buildCartPayload(profile, items, channel);
    const data = await sfApiRequest(
      '/connect/global-promotions-management/eligible-promotions',
      'POST',
      payload
    );
    res.json(data);
  } catch (err) {
    // Auto-fallback to mock if SF GPM not available
    if (err.status === 404) {
      return res.json(buildMockEligible(profile, items, channel));
    }
    next(err);
  }
});

router.post('/execute', async (req, res, next) => {
  const { profile, items, channel, useMock } = req.body;

  if (useMock || process.env.USE_MOCK_GPM === 'true') {
    return res.json(buildMockExecution(profile, items, channel));
  }

  try {
    const payload = buildCartPayload(profile, items, channel);
    const data = await sfApiRequest(
      '/connect/global-promotions-management/promotion-execution',
      'POST',
      payload
    );
    res.json(data);
  } catch (err) {
    if (err.status === 404) {
      return res.json(buildMockExecution(profile, items, channel));
    }
    next(err);
  }
});

module.exports = router;
