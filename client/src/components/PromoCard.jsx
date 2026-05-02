import React, { useState } from 'react';

const TYPE_META = {
  CrossCategoryBundle: { label: 'Cross-Category Bundle', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  TierExclusive:       { label: 'Tier Exclusive', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  SupplierFunded:      { label: 'Supplier Funded', color: '#0891B2', bg: '#ECFEFF', border: '#A5F3FC' },
  EngagementTrail:     { label: 'Engagement Trail', color: '#059669', bg: '#F0FDF4', border: '#BBF7D0' },
  PointsMultiplier:    { label: 'Points Multiplier', color: '#EC2B8C', bg: '#FEF2F8', border: '#FBCFE8' },
  SpendMultiplier:     { label: 'Spend Multiplier', color: '#EC2B8C', bg: '#FEF2F8', border: '#FBCFE8' },
  WelcomeOffer:        { label: 'Welcome Offer', color: '#059669', bg: '#F0FDF4', border: '#BBF7D0' },
  IncrementalPoints:   { label: 'Tiered Points', color: '#0176D3', bg: '#EBF5FF', border: '#BFDBFE' },
  QuantityThreshold:   { label: 'Quantity Threshold', color: '#0176D3', bg: '#EBF5FF', border: '#BFDBFE' },
};

export default function PromoCard({ promo, applied = false }) {
  const [showDetail, setShowDetail] = useState(false);

  const name = promo.promotionName || promo.name || 'Promotion';
  const reward = promo.totalReward || promo.reward || '';
  const points = promo.rewardPoints || promo.points || null;
  const meta = TYPE_META[promo.promotionType] || null;

  const dotColor = applied ? '#22C55E' : meta?.color || '#0176D3';
  const cardBg   = applied ? '#F0FDF4' : meta?.bg || '#EBF5FF';
  const cardBorder = applied ? '#BBF7D0' : meta?.border || '#BFDBFE';

  return (
    <div style={{ borderRadius: 10, border: `1.5px solid ${cardBorder}`, background: cardBg, padding: '12px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ flex: 1 }}>
          {/* Type badge + applied badge */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 5 }}>
            {meta && (
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 12, background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
                {meta.label}
              </span>
            )}
            {promo.tierRequired && (
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 12, background: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A' }}>
                {promo.tierRequired} only
              </span>
            )}
            {promo.fundingSource && (
              <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 12, background: '#F8FAFC', color: '#64748B', border: '1px solid #E2E8F0' }}>
                Funded: {promo.fundingSource}
              </span>
            )}
          </div>

          {/* Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
            <span style={{ fontWeight: 700, fontSize: 13, color: '#1E293B' }}>{name}</span>
          </div>

          {/* Description */}
          <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5, margin: '0 0 5px 13px' }}>
            {promo.promotionDescription || promo.description || ''}
          </p>

          {/* Reward line */}
          {reward && (
            <p style={{ fontSize: 12, fontWeight: 600, color: '#032D60', margin: '0 0 0 13px' }}>{reward}</p>
          )}
          {promo.discountAmount > 0 && (
            <p style={{ fontSize: 12, fontWeight: 700, color: '#16A34A', margin: '2px 0 0 13px' }}>
              −${promo.discountAmount.toFixed(2)} discount applied
            </p>
          )}

          {/* Rule detail toggle */}
          {promo.ruleDetail && (
            <div style={{ marginTop: 6, marginLeft: 13 }}>
              <button
                onClick={() => setShowDetail(v => !v)}
                style={{ fontSize: 10, fontWeight: 600, color: '#0176D3', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                {showDetail ? 'Hide rule detail ▲' : 'Show GPM rule detail ▼'}
              </button>
              {showDetail && (
                <div style={{ marginTop: 5, padding: '7px 10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 11, color: '#475569', lineHeight: 1.5, fontFamily: 'monospace' }}>
                  {promo.ruleDetail}
                  {promo.fundingModel && (
                    <div style={{ marginTop: 5, paddingTop: 5, borderTop: '1px solid #E2E8F0', fontFamily: 'sans-serif', color: '#0891B2' }}>
                      {promo.fundingModel}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Status badge */}
        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: applied ? '#DCFCE7' : '#E0F2FE', color: applied ? '#16A34A' : '#0176D3', flexShrink: 0, alignSelf: 'flex-start' }}>
          {applied ? 'Applied' : 'Eligible'}
        </span>
      </div>
    </div>
  );
}
