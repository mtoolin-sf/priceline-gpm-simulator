import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfiles } from '../api/client';
import { useCart } from '../context/CartContext';
import { useBrand } from '../context/BrandContext';

const TIER_BADGE = {
  Gold: 'badge-tier-gold',
  Silver: 'badge-tier-silver',
  Standard: 'badge-tier-standard',
};

export default function ProfileSelector() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { dispatch } = useCart();
  const { brand } = useBrand();
  const navigate = useNavigate();

  useEffect(() => {
    getProfiles().then(setProfiles).finally(() => setLoading(false));
  }, []);

  function selectProfile(profile) {
    dispatch({ type: 'SET_PROFILE', payload: profile });
    navigate('/shop');
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-pink-200 border-t-priceline-pink rounded-full animate-spin mx-auto mb-4" style={{ borderTopColor: 'var(--brand-primary)' }}></div>
        <p className="text-gray-500 text-sm">Loading profiles…</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-white mb-4" style={{ backgroundColor: 'var(--brand-primary)' }}>
          ✦ Beauty Club GPM Demo
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
          Welcome to <span style={{ color: 'var(--brand-primary)' }}>{brand.name}</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Select a shopper profile to explore Salesforce GPM promotions and loyalty in action.
        </p>
      </div>

      {/* Profile grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {profiles.map(profile => (
          <button
            key={profile.id}
            onClick={() => selectProfile(profile)}
            className="card text-left p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group"
          >
            {/* Avatar */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 group-hover:scale-105 transition-transform"
                style={{ backgroundColor: profile.color || 'var(--brand-primary)' }}
              >
                {profile.avatar}
              </div>
              <div>
                <div className="font-bold text-gray-900 text-sm">{profile.name}</div>
                {profile.tier ? (
                  <span className={TIER_BADGE[profile.tier] || 'badge-tier-standard'}>{profile.tier}</span>
                ) : (
                  <span className="badge-nonmember">Non-Member</span>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Card</span>
                <span className="font-medium text-gray-700 truncate ml-2">{profile.cardType}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Balance</span>
                <span className="font-semibold" style={{ color: 'var(--brand-primary)' }}>
                  {profile.pointsBalance.toLocaleString()} pts
                </span>
              </div>
              {profile.membershipNumber && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Member #</span>
                  <span className="font-mono text-gray-600">{profile.membershipNumber}</span>
                </div>
              )}
            </div>

            {/* Scenario */}
            <div className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-xs text-gray-600 leading-snug">{profile.scenario}</p>
            </div>

            {/* CTA */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs font-semibold" style={{ color: 'var(--brand-primary)' }}>
                Shop as {profile.firstName} →
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Use case legend */}
      <div className="mt-10 card p-6">
        <h3 className="font-bold text-gray-900 mb-4">7 Demo Use Cases</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {[
            ['UC1', 'Skincare Bundle Bonus', 'Buy 2+ skincare → 1,000 Beauty Points'],
            ['UC2', 'Buy More Earn More Vitamins', '1 item=200pts, 2=400pts, 3=600pts'],
            ['UC3', 'Haircare Repeat Shopper', '2 transactions in 14 days → 500 pts'],
            ['UC4', 'Bonus Points Days', '5x pts (card) or 3x pts (no card) per $10'],
            ['UC5', 'App-Only Lancôme 3X', '3x points on select fragrances, App only'],
            ['UC6', 'New Card Welcome Offer', 'Spend $75 OOS in 60 days → 1,000 pts'],
            ['UC7', 'Non-Member Tiered GC', '$100/$200/$300+ spend → $10/$20/$30 GC'],
          ].map(([uc, name, desc]) => (
            <div key={uc} className="flex gap-3">
              <span className="shrink-0 font-bold text-xs px-2 py-1 rounded-full text-white w-10 text-center" style={{ backgroundColor: 'var(--brand-primary)' }}>{uc}</span>
              <div>
                <div className="font-semibold text-gray-800 text-xs">{name}</div>
                <div className="text-gray-500 text-xs">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
