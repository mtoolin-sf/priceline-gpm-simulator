import React, { useState, useEffect, useCallback } from 'react';
import { checkEligible } from '../api/client';

// Per-profile carts — each member has a distinct basket that triggers their specific promotions
const PROFILE_CARTS = {
  // Emma — Gold, Sister Club: UC1 (Skincare 2+) + UC4 (Spend) + UC8 (Cross-category) + UC9 (Gold Gift Set)
  'emma-wilson': [
    { id: 'demo-sk1', name: 'La Roche-Posay Anthelios SPF 50+', category: 'Skincare', price: 32.99, qty: 1 },
    { id: 'demo-sk2', name: 'CeraVe Moisturising Cream', category: 'Skincare', price: 24.99, qty: 1 },
    { id: 'demo-mk1', name: "L'Oréal Paris True Match Foundation", category: 'Makeup', price: 26.99, qty: 1, supplier: "L'Oréal", brand: "L'Oréal Paris" },
    { id: 'demo-gs1', name: 'Gold Beauty Club Skincare Gift Set', category: 'Gift Sets', price: 79.99, qty: 1 },
  ],
  // Diana — Gold, Sister Club: UC8 (Cross-category) + UC9 (Gold Gift Set) + UC4 (Spend)
  'diana-nguyen': [
    { id: 'demo-sk1', name: 'La Roche-Posay Anthelios SPF 50+', category: 'Skincare', price: 32.99, qty: 1 },
    { id: 'demo-mk2', name: 'Maybelline Fit Me Foundation', category: 'Makeup', price: 19.99, qty: 1 },
    { id: 'demo-gs1', name: 'Gold Beauty Club Skincare Gift Set', category: 'Gift Sets', price: 79.99, qty: 1 },
  ],
  // Priya — Silver, Sister Club: UC5 (App Lancôme 3X) + UC1 (Skincare) + UC4 (Spend)
  'priya-sharma': [
    { id: 'demo-sk1', name: 'La Roche-Posay Anthelios SPF 50+', category: 'Skincare', price: 32.99, qty: 1 },
    { id: 'demo-sk2', name: 'CeraVe Moisturising Cream', category: 'Skincare', price: 24.99, qty: 1 },
    { id: 'demo-fr1', name: 'Lancome La Vie Est Belle EDP 50mL', category: 'Fragrance', price: 149.00, qty: 1 },
  ],
  // Rachel — Silver, Sister Club: UC10 (L'Oréal supplier) + UC2 (Vitamins) + UC4 (Spend)
  'rachel-kim': [
    { id: 'demo-mk1', name: "L'Oréal Paris True Match Foundation", category: 'Makeup', price: 26.99, qty: 1, supplier: "L'Oréal", brand: "L'Oréal Paris" },
    { id: 'demo-vt1', name: 'Swisse Ultivite Womens Multivitamin', category: 'Vitamins & Supplements', price: 39.99, qty: 2 },
  ],
  // Sarah — Standard, new card (30 days): UC6 (Welcome offer OOS) + UC4 (Spend)
  'sarah-obrien': [
    { id: 'demo-sk1', name: 'La Roche-Posay Anthelios SPF 50+', category: 'Skincare', price: 32.99, qty: 1 },
    { id: 'demo-vt1', name: 'Swisse Ultivite Womens Multivitamin', category: 'Vitamins & Supplements', price: 39.99, qty: 2 },
  ],
  // James — Standard, No Card: UC4 only (non-cardholder rate, 3x)
  'james-park': [
    { id: 'demo-sk1', name: 'La Roche-Posay Anthelios SPF 50+', category: 'Skincare', price: 32.99, qty: 1 },
    { id: 'demo-vt1', name: 'Swisse Ultivite Womens Multivitamin', category: 'Vitamins & Supplements', price: 39.99, qty: 1 },
  ],
};

// Sarah's welcome offer needs Out of Store channel and $75+ spend — adjust channel in loadPromos
const PROFILE_CHANNELS = {
  'sarah-obrien': 'Out of Store',
};

// Promotion-type theming
const PROMO_THEME = {
  QuantityThreshold:   { accent: '#022AC0', light: '#EAF5FE', border: '#90D0FE', tag: 'Skincare Bundle',      tagBg: '#EAF5FE', tagColor: '#022AC0' },
  IncrementalPoints:   { accent: '#023434', light: '#DEF9F3', border: '#04E1CB', tag: 'Buy More Earn More',   tagBg: '#DEF9F3', tagColor: '#023434' },
  EngagementTrail:     { accent: '#481A54', light: '#F9F0FF', border: '#D17DFE', tag: 'Repeat Shopper',       tagBg: '#F9F0FF', tagColor: '#481A54' },
  SpendMultiplier:     { accent: '#4F2100', light: '#FBF3E0', border: '#FCC003', tag: 'Bonus Points Day',     tagBg: '#FBF3E0', tagColor: '#4F2100' },
  PointsMultiplier:    { accent: '#61022A', light: '#FEF0F3', border: '#EC2B8C', tag: 'App Exclusive',        tagBg: '#FEF0F3', tagColor: '#EC2B8C' },
  WelcomeOffer:        { accent: '#023434', light: '#DEF9F3', border: '#04E1CB', tag: 'Welcome Offer',        tagBg: '#DEF9F3', tagColor: '#023434' },
  CrossCategoryBundle: { accent: '#481A54', light: '#F9F0FF', border: '#D17DFE', tag: 'Cross-Category',       tagBg: '#F9F0FF', tagColor: '#481A54' },
  TierExclusive:       { accent: '#92400E', light: '#FFFBEB', border: '#FCC003', tag: 'Gold Exclusive',       tagBg: '#FFFBEB', tagColor: '#92400E' },
  SupplierFunded:      { accent: '#022AC0', light: '#EAF5FE', border: '#90D0FE', tag: 'Supplier Offer',       tagBg: '#EAF5FE', tagColor: '#022AC0' },
};

const OFFER_TYPE_LABEL = { POINTS: 'pts', VOUCHER: 'voucher', DISCOUNT: '% off', PRODUCT: 'free gift' };

const PROFILES = [
  { id: 'emma-wilson',  name: 'Emma Wilson',   tier: 'Gold',     avatar: 'EW', color: '#E8005C', cardType: 'Sister Club Card', isMember: true, pointsBalance: 2400,  membershipNumber: 'PBC0001', cardJoinDaysAgo: 365 },
  { id: 'diana-nguyen', name: 'Diana Nguyen',  tier: 'Gold',     avatar: 'DN', color: '#D97706', cardType: 'Sister Club Card', isMember: true, pointsBalance: 8500,  membershipNumber: 'PBC0007', cardJoinDaysAgo: 400 },
  { id: 'priya-sharma', name: 'Priya Sharma',  tier: 'Silver',   avatar: 'PS', color: '#7C3AED', cardType: 'Sister Club Card', isMember: true, pointsBalance: 5200,  membershipNumber: 'PBC0003', cardJoinDaysAgo: 180 },
  { id: 'rachel-kim',   name: 'Rachel Kim',    tier: 'Silver',   avatar: 'RK', color: '#0891B2', cardType: 'Sister Club Card', isMember: true, pointsBalance: 3200,  membershipNumber: 'PBC0008', cardJoinDaysAgo: 200 },
  { id: 'sarah-obrien', name: "Sarah O'Brien", tier: 'Standard', avatar: 'SO', color: '#059669', cardType: 'Sister Club Card', isMember: true, pointsBalance: 0,     membershipNumber: 'PBC0004', cardJoinDaysAgo: 30 },
  { id: 'james-park',   name: 'James Park',    tier: 'Standard', avatar: 'JP', color: '#6B7280', cardType: 'No Card',          isMember: true, pointsBalance: 800,   membershipNumber: 'PBC0002', cardJoinDaysAgo: null },
];

const TIER_BADGE = {
  Gold:     { bg: 'linear-gradient(135deg, #F59E0B, #D97706)', text: '#fff', icon: '★' },
  Silver:   { bg: 'linear-gradient(135deg, #94A3B8, #64748B)', text: '#fff', icon: '◆' },
  Standard: { bg: 'linear-gradient(135deg, #9CA3AF, #6B7280)', text: '#fff', icon: '●' },
};

// ── Reward value display ─────────────────────────────────────────────────────
function RewardValue({ offer, accent }) {
  if (offer.offerType === 'POINTS') {
    return (
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: accent, lineHeight: 1 }}>
          +{offer.rewardValue >= 1000 ? `${offer.rewardValue / 1000}k` : offer.rewardValue}
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: accent }}>pts</span>
      </div>
    );
  }
  if (offer.offerType === 'VOUCHER') {
    return (
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: accent }}>$</span>
        <span style={{ fontSize: 22, fontWeight: 800, color: accent, lineHeight: 1 }}>{offer.rewardValue}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: accent }}>off</span>
      </div>
    );
  }
  if (offer.offerType === 'DISCOUNT') {
    return (
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: accent, lineHeight: 1 }}>{offer.rewardValue}%</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: accent }}>off</span>
      </div>
    );
  }
  return <span style={{ fontSize: 16, fontWeight: 800, color: accent }}>Free Gift</span>;
}

// ── Individual offer card ────────────────────────────────────────────────────
function OfferCard({ offer, selected, onSelect, accent, light, border, hasGroupSelection }) {
  const img = offer.presentmentDetails?.imageUrl;
  const dimmed = hasGroupSelection && !selected;

  return (
    <button
      onClick={() => onSelect(offer.offerId)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px',
        background: selected ? light : '#fff',
        border: `1.5px solid ${selected ? accent : '#EBEBEB'}`,
        borderRadius: 16,
        cursor: 'pointer', textAlign: 'left', width: '100%',
        boxShadow: selected ? `0 0 0 1px ${accent}30, 0 4px 12px ${accent}18` : '0 1px 3px rgba(0,0,0,0.06)',
        opacity: dimmed ? 0.45 : 1,
        filter: dimmed ? 'saturate(0.5)' : 'none',
        transition: 'all 0.18s ease',
      }}
    >
      {/* Product image */}
      <div style={{
        width: 64, height: 64, borderRadius: 12, overflow: 'hidden', flexShrink: 0,
        background: '#F8F8F8', border: '1px solid #F0F0F0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {img
          ? <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} />
          : <span style={{ fontSize: 24 }}>🎁</span>
        }
      </div>

      {/* Text content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Reward value — hero */}
        <RewardValue offer={offer} accent={selected ? accent : '#001E5B'} />
        {/* Offer name */}
        <div style={{ fontSize: 12, fontWeight: 600, color: selected ? accent : '#374151', marginTop: 2, lineHeight: 1.3 }}>
          {offer.presentmentDetails?.headline}
        </div>
        {/* Description */}
        <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2, lineHeight: 1.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {offer.presentmentDetails?.description}
        </div>
        {/* Badge */}
        {offer.presentmentDetails?.badgeText && (
          <div style={{ display: 'inline-block', marginTop: 4, fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '2px 6px', borderRadius: 4, background: selected ? `${accent}20` : '#F3F3F3', color: selected ? accent : '#6B7280' }}>
            {offer.presentmentDetails.badgeText}
          </div>
        )}
      </div>

      {/* Radio indicator */}
      <div style={{
        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
        border: `2px solid ${selected ? accent : '#D1D5DB'}`,
        background: selected ? accent : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s ease',
      }}>
        {selected && (
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />
        )}
      </div>
    </button>
  );
}

// ── Promotion section (label + offer cards) ──────────────────────────────────
function PromoSection({ promo, selectedOfferId, onSelect }) {
  const theme = PROMO_THEME[promo.promotionType] || PROMO_THEME.QuantityThreshold;
  const offers = promo.loyaltyOffers || [];
  const hasSelection = !!selectedOfferId;

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, paddingLeft: 2 }}>
        <span style={{
          fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em',
          padding: '3px 8px', borderRadius: 20,
          background: theme.tagBg, color: theme.tagColor, border: `1px solid ${theme.border}`,
        }}>
          {theme.tag}
        </span>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>{promo.promotionName}</span>
        {hasSelection && (
          <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 700, color: theme.accent, display: 'flex', alignItems: 'center', gap: 3 }}>
            <span style={{ width: 14, height: 14, borderRadius: '50%', background: theme.accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: 8 }}>✓</span>
            </span>
            Selected
          </span>
        )}
      </div>

      {/* Offer cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {offers.map(offer => (
          <OfferCard
            key={offer.offerId}
            offer={offer}
            selected={selectedOfferId === offer.offerId}
            onSelect={(oid) => onSelect(promo.promotionId, oid)}
            accent={theme.accent}
            light={theme.light}
            border={theme.border}
            hasGroupSelection={hasSelection}
          />
        ))}
      </div>
    </div>
  );
}

// ── API Payload panel ────────────────────────────────────────────────────────
function PayloadPanel({ promos, selectedOffers, profile }) {
  const [activeTab, setActiveTab] = useState(0);
  const total = DEMO_CART.reduce((s, i) => s + i.price * i.qty, 0);

  const eligibleRequest = {
    contactId: profile.membershipNumber,
    loyaltyProgramName: 'PricelineBeautyRewards',
    channel: 'App',
    transactionAmount: total.toFixed(2),
    currencyISOCode: 'AUD',
    cartLineDetails: DEMO_CART.map(i => ({
      cartLineItemId: i.id,
      cartLineProduct: i.name,
      cartLineItemQuantity: i.qty,
      cartLineItemAmount: (i.price * i.qty).toFixed(2),
    })),
  };

  const eligibleResponse = {
    eligiblePromotions: promos.map(p => ({
      promotionId: p.promotionId,
      promotionName: p.promotionName,
      eligibilityReasonCode: p.eligibilityReasonCode,
      loyaltyOffers: (p.loyaltyOffers || []).map(o => ({
        offerId: o.offerId,
        offerName: o.offerName,
        offerType: o.offerType,
        fulfillmentAction: o.fulfillmentAction,
        rewardValue: o.rewardValue,
        currencyType: o.currencyType,
        presentmentDetails: o.presentmentDetails,
      })),
    })),
    totalCount: promos.length,
  };

  const selectedList = Object.entries(selectedOffers)
    .filter(([, oid]) => oid)
    .map(([promoId, offerId]) => {
      const promo = promos.find(p => p.promotionId === promoId);
      const offer = promo?.loyaltyOffers?.find(o => o.offerId === offerId);
      return offer ? { promotionId: promoId, offerId, fulfillmentAction: offer.fulfillmentAction } : null;
    }).filter(Boolean);

  const executeRequest = {
    contactId: profile.membershipNumber,
    loyaltyProgramName: 'PricelineBeautyRewards',
    transactionAmount: total.toFixed(2),
    currencyISOCode: 'AUD',
    selectedOffers: selectedList,
    cartLineDetails: DEMO_CART.map(i => ({
      cartLineItemId: i.id,
      cartLineItemQuantity: i.qty,
      cartLineItemAmount: (i.price * i.qty).toFixed(2),
    })),
  };

  const executeResponse = selectedList.length > 0 ? {
    transactionJournalId: `TXJ-${Date.now().toString().slice(-8)}`,
    status: 'COMPLETED',
    appliedOffers: selectedList.map(s => {
      const promo = promos.find(p => p.promotionId === s.promotionId);
      const offer = promo?.loyaltyOffers?.find(o => o.offerId === s.offerId);
      return {
        offerId: s.offerId,
        fulfillmentAction: s.fulfillmentAction,
        fulfillmentStatus: 'FULFILLED',
        ...(offer?.offerType === 'POINTS' ? { pointsCredited: offer.rewardValue, newPointsBalance: profile.pointsBalance + offer.rewardValue } : {}),
        ...(offer?.offerType === 'VOUCHER' ? { voucherId: `VCH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, voucherValue: offer.rewardValue, expiryDate: '2026-08-03' } : {}),
        ...(offer?.offerType === 'DISCOUNT' ? { discountApplied: `${offer.rewardValue}%`, discountAmount: (total * offer.rewardValue / 100).toFixed(2) } : {}),
        ...(offer?.offerType === 'PRODUCT' ? { productSku: 'GIFT-ITEM', productAdded: true } : {}),
      };
    }),
  } : null;

  const tabs = [
    { label: 'Eligible Req', data: eligibleRequest, dir: 'OUT', desc: 'POST /eligible-promotions' },
    { label: 'Eligible Resp', data: eligibleResponse, dir: 'IN', desc: `${promos.length} promotions · nested loyaltyOffers[]` },
    { label: 'Execute Req', data: executeRequest, dir: 'OUT', desc: `${selectedList.length} offer${selectedList.length !== 1 ? 's' : ''} selected with offerId` },
    ...(executeResponse ? [{ label: 'Execute Resp', data: executeResponse, dir: 'IN', desc: 'Fulfillment confirmed' }] : []),
  ];

  return (
    <div style={{ width: 420, display: 'flex', flexDirection: 'column', background: '#0B0B12', borderRadius: 16, overflow: 'hidden', fontFamily: 'monospace', height: '100%' }}>
      <div style={{ padding: '14px 18px 10px', background: '#12121E', borderBottom: '1px solid #1E1E30' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#90D0FE', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>API Payload Inspector</div>
        <div style={{ fontSize: 9, color: '#5A5C61' }}>Salesforce GPM + RTOM · App Channel · {profile.name}</div>
      </div>
      <div style={{ display: 'flex', background: '#12121E', borderBottom: '1px solid #1E1E30', padding: '0 8px', gap: 2, overflowX: 'auto', flexShrink: 0 }}>
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setActiveTab(i)} style={{
            flexShrink: 0, padding: '8px 10px', fontSize: 10, fontWeight: 600, fontFamily: 'monospace',
            background: 'none', border: 'none', cursor: 'pointer',
            borderBottom: activeTab === i ? '2px solid #066AFE' : '2px solid transparent',
            color: activeTab === i ? '#066AFE' : '#5A5C61',
          }}>{t.label}</button>
        ))}
      </div>
      {tabs[activeTab] && (
        <>
          <div style={{ padding: '7px 14px', background: '#12121E', borderBottom: '1px solid #1E1E30', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: tabs[activeTab].dir === 'OUT' ? '#1E3A5F' : '#1A3328', color: tabs[activeTab].dir === 'OUT' ? '#90D0FE' : '#04E1CB' }}>
              {tabs[activeTab].dir === 'OUT' ? '→ REQUEST' : '← RESPONSE'}
            </span>
            <span style={{ fontSize: 9, color: '#5A5C61' }}>{tabs[activeTab].desc}</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
            <pre style={{ fontSize: 10, color: '#C8D3F5', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {JSON.stringify(tabs[activeTab].data, null, 2)}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function MobileAppPreview({ onClose }) {
  const [profile, setProfile] = useState(PROFILES[0]);
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOffers, setSelectedOffers] = useState({});
  const [executed, setExecuted] = useState(false);
  const [showPayloads, setShowPayloads] = useState(false);

  const loadPromos = useCallback(async (p) => {
    setLoading(true);
    setPromos([]);
    setSelectedOffers({});
    setExecuted(false);
    const cart = PROFILE_CARTS[p.id] || PROFILE_CARTS['emma-wilson'];
    const channel = PROFILE_CHANNELS[p.id] || 'App';
    try {
      const result = await checkEligible(p, cart, channel, true);
      setPromos(result.eligiblePromotions || []);
    } catch {
      setPromos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPromos(profile); }, [profile, loadPromos]);

  const selectOffer = (promoId, offerId) => {
    setSelectedOffers(prev => ({ ...prev, [promoId]: prev[promoId] === offerId ? null : offerId }));
    setExecuted(false);
  };

  const selectedCount = Object.values(selectedOffers).filter(Boolean).length;
  const totalPts = Object.entries(selectedOffers).filter(([, oid]) => oid).reduce((sum, [promoId, offerId]) => {
    const promo = promos.find(p => p.promotionId === promoId);
    const offer = promo?.loyaltyOffers?.find(o => o.offerId === offerId);
    return sum + (offer?.offerType === 'POINTS' ? (offer.rewardValue || 0) : 0);
  }, 0);

  const tierBadge = TIER_BADGE[profile.tier] || TIER_BADGE.Standard;

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.78)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 20 }}
    >
      {/* Phone + button wrapper */}
      <div onClick={e => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, flexShrink: 0 }}>

        {/* Phone bezel */}
        <div style={{
          width: 390, maxHeight: '88vh', display: 'flex', flexDirection: 'column',
          background: '#111', borderRadius: 50,
          padding: '14px 11px 11px',
          boxShadow: '0 0 0 1px #333, 0 40px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.12)',
          position: 'relative',
        }}>
          {/* Dynamic island */}
          <div style={{ width: 126, height: 36, background: '#000', borderRadius: 22, margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <div style={{ width: 13, height: 13, borderRadius: '50%', background: '#111', border: '2px solid #2A2A2A' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1A1A1A', border: '2px solid #333' }} />
          </div>

          {/* Screen */}
          <div style={{ flex: 1, background: '#FAFAFA', borderRadius: 38, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>

            {/* Status bar */}
            <div style={{ background: '#EC2B8C', padding: '6px 22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#fff', fontFamily: 'system-ui', fontWeight: 600 }}>9:41</span>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                  {[3, 5, 7, 9].map(h => <div key={h} style={{ width: 3, borderRadius: 1, background: 'rgba(255,255,255,0.9)', height: h }} />)}
                </div>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.9)' }}>⚡</span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>100%</span>
              </div>
            </div>

            {/* App header */}
            <div style={{ background: '#EC2B8C', padding: '12px 18px 18px' }}>
              {/* Nav row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <img src="/priceline-logo.webp" alt="Priceline" style={{ height: 22, filter: 'brightness(0) invert(1)', objectFit: 'contain' }} onError={e => { e.target.style.display = 'none'; }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {/* Tier badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.18)', borderRadius: 20, padding: '3px 10px 3px 6px' }}>
                    <span style={{ fontSize: 10 }}>{tierBadge.icon}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>{profile.tier}</span>
                  </div>
                  {/* Avatar */}
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: profile.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', border: '2.5px solid rgba(255,255,255,0.4)' }}>
                    {profile.avatar}
                  </div>
                </div>
              </div>

              {/* Member card */}
              <div style={{ background: 'rgba(255,255,255,0.14)', borderRadius: 16, padding: '12px 16px', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', marginBottom: 2 }}>Beauty Club Member</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{profile.name}</div>
                    {profile.cardType === 'Sister Club Card' && (
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FCC003', display: 'inline-block' }} />
                        Sister Club Card
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: '-0.03em' }}>{profile.pointsBalance.toLocaleString()}</div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.65)', marginTop: 1 }}>Beauty Points</div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginTop: 1 }}>${(profile.pointsBalance / 200).toFixed(2)} value</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile switcher */}
            <div style={{ background: '#fff', borderBottom: '1px solid #F0F0F0', padding: '10px 14px 8px' }}>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#9CA3AF', marginBottom: 8 }}>Switch Member</div>
              <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
                {PROFILES.map(p => {
                  const isActive = profile.id === p.id;
                  const cart = PROFILE_CARTS[p.id] || [];
                  const tierColor = p.tier === 'Gold' ? '#D97706' : p.tier === 'Silver' ? '#64748B' : '#9CA3AF';
                  return (
                    <button
                      key={p.id}
                      onClick={() => setProfile(p)}
                      style={{
                        flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                        background: isActive ? '#FFF0F6' : 'transparent',
                        border: isActive ? '1.5px solid #EC2B8C' : '1.5px solid #F0F0F0',
                        borderRadius: 12, cursor: 'pointer', padding: '8px 10px',
                        minWidth: 64, transition: 'all 0.15s',
                      }}
                    >
                      {/* Avatar */}
                      <div style={{
                        width: 38, height: 38, borderRadius: '50%', background: p.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700, color: '#fff',
                        boxShadow: isActive ? `0 0 0 2px #fff, 0 0 0 4px #EC2B8C` : 'none',
                        transition: 'all 0.15s',
                      }}>{p.avatar}</div>
                      {/* First name */}
                      <span style={{ fontSize: 9, fontWeight: isActive ? 700 : 500, color: isActive ? '#EC2B8C' : '#374151', whiteSpace: 'nowrap' }}>
                        {p.name.split(' ')[0]}
                      </span>
                      {/* Tier chip */}
                      <span style={{ fontSize: 7, fontWeight: 700, color: tierColor, background: `${tierColor}18`, borderRadius: 4, padding: '1px 5px', whiteSpace: 'nowrap' }}>
                        {p.tier}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Offers area */}
            <div style={{ flex: 1, overflowY: 'auto', background: '#FAFAFA' }}>

              {/* Section header */}
              <div style={{ padding: '14px 16px 6px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>
                      {loading ? 'Loading offers…' : promos.length > 0 ? `${promos.length} Offer${promos.length !== 1 ? 's' : ''} Unlocked` : 'No offers available'}
                    </div>
                    {!loading && promos.length > 0 && (
                      <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>
                        {(PROFILE_CARTS[profile.id] || []).length} items · Choose one reward per promotion
                      </div>
                    )}
                  </div>
                  {totalPts > 0 && !loading && (
                    <div style={{ background: 'linear-gradient(135deg, #EC2B8C, #C01070)', borderRadius: 12, padding: '5px 10px', textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', lineHeight: 1 }}>+{totalPts.toLocaleString()}</div>
                      <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.8)' }}>pts selected</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Loading skeleton */}
              {loading && (
                <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[80, 64, 72].map((w, i) => (
                    <div key={i} style={{ height: 88, borderRadius: 16, background: '#EFEFEF', animation: 'pulse 1.4s ease-in-out infinite', animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!loading && promos.length === 0 && (
                <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#F3F3F3', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 24 }}>🎁</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>No offers available</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>Try a different member above</div>
                </div>
              )}

              {/* Offer sections */}
              {!loading && promos.length > 0 && (
                <div style={{ padding: '8px 14px 100px' }}>
                  {promos.map(promo => (
                    <PromoSection
                      key={promo.promotionId}
                      promo={promo}
                      selectedOfferId={selectedOffers[promo.promotionId]}
                      onSelect={selectOffer}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Sticky CTA — slides up when offers selected */}
            <div style={{
              position: 'absolute', bottom: 50, left: 11, right: 11,
              transform: selectedCount > 0 && !executed ? 'translateY(0)' : 'translateY(120px)',
              opacity: selectedCount > 0 && !executed ? 1 : 0,
              transition: 'transform 0.22s ease, opacity 0.22s ease',
              pointerEvents: selectedCount > 0 && !executed ? 'auto' : 'none',
            }}>
              <button
                onClick={() => setExecuted(true)}
                style={{
                  width: '100%', padding: '14px', borderRadius: 18,
                  background: 'linear-gradient(135deg, #EC2B8C, #C01070)',
                  border: 'none', cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(236,43,140,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>
                  Apply {selectedCount} Selected Offer{selectedCount !== 1 ? 's' : ''}
                </span>
                {totalPts > 0 && (
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
                    +{totalPts.toLocaleString()} pts
                  </span>
                )}
              </button>
            </div>

            {/* Success state */}
            {executed && (
              <div style={{
                position: 'absolute', bottom: 50, left: 11, right: 11,
                background: 'linear-gradient(135deg, #059669, #047857)',
                borderRadius: 18, padding: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                boxShadow: '0 8px 24px rgba(5,150,105,0.4)',
              }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#fff', fontSize: 13 }}>✓</span>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>Offers Applied!</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)' }}>Transaction journal created</div>
                </div>
              </div>
            )}

            {/* Bottom nav */}
            <div style={{ background: '#fff', borderTop: '1px solid #F0F0F0', padding: '8px 0 10px', display: 'flex', justifyContent: 'space-around', flexShrink: 0 }}>
              {[['🏠','Home'],['🎁','Offers'],['💳','Card'],['👤','Account']].map(([icon, label], idx) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <span style={{ fontSize: 20 }}>{icon}</span>
                  <span style={{ fontSize: 9, color: idx === 1 ? '#EC2B8C' : '#9CA3AF', fontWeight: idx === 1 ? 700 : 400 }}>{label}</span>
                  {idx === 1 && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#EC2B8C' }} />}
                </div>
              ))}
            </div>

          </div>{/* end screen */}

          {/* Home indicator */}
          <div style={{ width: 120, height: 4, background: 'rgba(255,255,255,0.25)', borderRadius: 2, margin: '8px auto 0' }} />

          {/* Close button */}
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: -12, right: -12, width: 28, height: 28, borderRadius: '50%', background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#374151', boxShadow: '0 2px 8px rgba(0,0,0,0.25)', fontWeight: 700 }}
          >✕</button>

        </div>{/* end bezel */}

        {/* Payload toggle button — clearly below phone */}
        <button
          onClick={() => setShowPayloads(v => !v)}
          style={{
            height: 38, borderRadius: 19, border: 'none', cursor: 'pointer',
            background: showPayloads ? '#066AFE' : 'rgba(255,255,255,0.12)',
            color: '#fff', fontSize: 12, fontWeight: 700,
            padding: '0 20px', display: 'flex', alignItems: 'center', gap: 8,
            backdropFilter: 'blur(8px)',
            boxShadow: showPayloads ? '0 4px 20px rgba(6,106,254,0.45)' : '0 2px 10px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.15)',
            transition: 'all 0.2s ease',
          }}
        >
          <span style={{ fontFamily: 'monospace', fontSize: 13 }}>{showPayloads ? '✕' : '{ }'}</span>
          {showPayloads ? 'Hide API Payloads' : 'View API Payloads'}
        </button>

      </div>{/* end phone+button column */}

      {/* Payload panel */}
      {showPayloads && (
        <div
          onClick={e => e.stopPropagation()}
          style={{ maxHeight: '88vh', display: 'flex', flexDirection: 'column', flexShrink: 0 }}
        >
          <PayloadPanel promos={promos} selectedOffers={selectedOffers} profile={profile} />
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
      `}</style>
    </div>
  );
}
