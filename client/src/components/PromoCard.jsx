import React from 'react';

export default function PromoCard({ promo, applied = false }) {
  const name = promo.promotionName || promo.name || 'Promotion';
  const reward = promo.totalReward || promo.reward || '';
  const points = promo.rewardPoints || promo.points || null;

  return (
    <div className={`rounded-xl border-2 p-4 ${applied ? 'border-green-300 bg-green-50' : 'border-blue-200 bg-blue-50'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{applied ? '✅' : '🎯'}</span>
            <span className="font-semibold text-sm text-gray-900">{name}</span>
          </div>
          {reward && <p className="text-xs text-gray-600 mt-1">{reward}</p>}
          {points && (
            <p className="text-xs font-semibold mt-1" style={{ color: 'var(--brand-primary)' }}>
              +{points.toLocaleString()} Beauty Points
            </p>
          )}
          {promo.discountAmount > 0 && (
            <p className="text-xs font-semibold text-green-700 mt-1">
              ${promo.discountAmount.toFixed(2)} discount applied
            </p>
          )}
        </div>
        <span className={`shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${applied ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'}`}>
          {applied ? 'Applied' : 'Eligible'}
        </span>
      </div>
    </div>
  );
}
