import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import PromoCard from '../components/PromoCard';
import JsonViewer from '../components/JsonViewer';

export default function CheckoutResults() {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();

  if (!state.executionResult && !state.tjResult) {
    navigate('/');
    return null;
  }

  const subtotal = state.items.reduce((s, i) => s + i.price * i.qty, 0);

  // Parse execution result
  const cartDetail = state.executionResult?.cart?.cartDetails?.[0] || {};
  const appliedPromos = cartDetail.appliedCartPromotionDetails || [];
  const totalDiscount = appliedPromos.reduce((s, p) => s + (p.discountAmount || 0), 0);
  const finalTotal = Math.max(0, subtotal - totalDiscount);

  // Points calculation
  const basePoints = Math.floor(subtotal);
  const bonusPoints = appliedPromos.reduce((s, p) => s + (p.rewardPoints || 0), 0);
  const totalPoints = basePoints + bonusPoints;

  // Promo complexity breakdown for display
  const supplierFundedPromos = appliedPromos.filter(p => p.promotionType === 'SupplierFunded');
  const tierExclusivePromos  = appliedPromos.filter(p => p.promotionType === 'TierExclusive');
  const crossCatPromos       = appliedPromos.filter(p => p.promotionType === 'CrossCategoryBundle');

  // TJ results
  const tjData = state.tjResult;
  const orderGuid = tjData?.orderGuid || '';
  const tjResults = tjData?.results?.transactionJournals || [];

  // BLM tracker
  const blm = state.blmResult;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success banner */}
      <div className="rounded-2xl p-6 mb-6 text-white" style={{ background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark, #B8004A))' }}>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-black">Checkout Complete!</h1>
        </div>
        <p className="opacity-90 text-sm">
          GPM promotions evaluated and applied · Loyalty points recorded · Transaction journals created
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-5">
          {/* Order summary */}
          <div className="card p-5">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
            {state.items.map(item => (
              <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-gray-600 truncate mr-4">{item.qty}× {item.name}</span>
                <span className="font-medium shrink-0">${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span>${subtotal.toFixed(2)} AUD</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Promotion Discount</span>
                  <span>−${totalDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-1">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)} AUD</span>
              </div>
            </div>
          </div>

          {/* Applied promotions */}
          <div className="card p-5">
            <h2 className="font-bold text-gray-900 mb-4">
              Applied Promotions
              {appliedPromos.length > 0 && <span className="ml-2 text-sm font-normal text-gray-400">({appliedPromos.length})</span>}
            </h2>
            {appliedPromos.length > 0 ? (
              <div className="space-y-3">
                {appliedPromos.map((p, i) => <PromoCard key={i} promo={p} applied />)}
              </div>
            ) : (
              <div className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4 text-center">
                No promotions applied to this transaction.
                {!state.profile?.isMember && <div className="mt-1 text-xs">Non-member — check BLM Spend Tracker below.</div>}
              </div>
            )}
            <JsonViewer title="Execution API Response" data={state.executionResult} />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Beauty Points */}
          {state.profile?.isMember && (
            <div className="card p-5">
              <h2 className="font-bold text-gray-900 mb-4">Beauty Points Earned</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Base points (1pt per $1)</span>
                  <span className="font-medium">+{basePoints.toLocaleString()} pts</span>
                </div>
                {bonusPoints > 0 && (
                  <div className="flex justify-between text-sm text-green-700">
                    <span>Bonus points (promotions)</span>
                    <span className="font-semibold">+{bonusPoints.toLocaleString()} pts</span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex justify-between font-bold" style={{ color: 'var(--brand-primary)' }}>
                    <span>Total this transaction</span>
                    <span>+{totalPoints.toLocaleString()} pts</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>New balance</span>
                    <span className="font-semibold">{((state.profile.pointsBalance || 0) + totalPoints).toLocaleString()} pts</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transaction Journals */}
          {state.profile?.isMember && (
            <div className="card p-5">
              <h2 className="font-bold text-gray-900 mb-4">Transaction Journals</h2>
              {tjResults.length > 0 ? (
                <div className="space-y-2">
                  {tjResults.map((tj, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-3 text-xs font-mono">
                      <div className="font-semibold text-gray-700 mb-1">TJ #{i+1}: {tj.id || tj.transactionJournalId || '—'}</div>
                      <div className="text-gray-500">Status: {tj.status || 'Pending'}</div>
                      <div className="text-gray-500">Amount: ${tj.transactionAmount}</div>
                    </div>
                  ))}
                  <div className="text-xs text-gray-400 mt-1">Order GUID: {orderGuid}</div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  {tjData?.skipped ? tjData.reason : 'Transaction journals created — processing.'}
                </div>
              )}
              <JsonViewer title="Transaction Journal API Response" data={state.tjResult} />
            </div>
          )}

          {/* Promotion Complexity callout — shown when advanced UCs fire */}
          {(supplierFundedPromos.length > 0 || tierExclusivePromos.length > 0 || crossCatPromos.length > 0) && (
            <div className="card p-5 border-l-4" style={{ borderLeftColor: '#7C3AED' }}>
              <h2 className="font-bold text-gray-900 mb-3">GPM Rule Complexity</h2>
              <div className="space-y-3 text-sm">
                {crossCatPromos.length > 0 && (
                  <div className="p-3 rounded-lg" style={{ background: '#F5F3FF' }}>
                    <div className="font-semibold mb-1" style={{ color: '#7C3AED' }}>Cross-Category Bundle (UC8)</div>
                    <p className="text-gray-600 text-xs leading-relaxed">GPM evaluated cart line items across two separate product catalog categories (Skincare + Makeup) and fired a cross-line promotion. This requires GPM's cross-line evaluation engine — not available in basic rule sets.</p>
                  </div>
                )}
                {tierExclusivePromos.length > 0 && (
                  <div className="p-3 rounded-lg" style={{ background: '#FFFBEB' }}>
                    <div className="font-semibold mb-1" style={{ color: '#D97706' }}>Tier-Gated Exclusive (UC9)</div>
                    <p className="text-gray-600 text-xs leading-relaxed">Promotion returned only because LoyaltyProgramMember.CurrentTier = Gold. Standard and Silver members would receive no result for this promotion ID — the eligibility check gates at the member segment level before any rule evaluation.</p>
                  </div>
                )}
                {supplierFundedPromos.length > 0 && (
                  <div className="p-3 rounded-lg" style={{ background: '#ECFEFF' }}>
                    <div className="font-semibold mb-1" style={{ color: '#0891B2' }}>Supplier-Funded SKU Bonus (UC10)</div>
                    <p className="text-gray-600 text-xs leading-relaxed">
                      Points cost for this promotion is attributed to{' '}
                      <strong>{supplierFundedPromos[0]?.fundingSource}</strong>{' '}
                      via FundingSource__c on the promotion record — not to Priceline's loyalty budget. Enables clean supplier billing and campaign ROI reporting.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* BLM Spend Tracker */}
          {blm && (
            <div className="card p-5 border-2 border-yellow-200">
              <h2 className="font-bold text-gray-900 mb-4">Non-Member Spend Tracker</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Cumulative spend</span>
                  <span className="font-bold">${blm.cumulativeSpend?.toFixed(2)} AUD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Transactions</span>
                  <span className="font-medium">{blm.transactionCount}</span>
                </div>
                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>$0</span><span>$100</span><span>$200</span><span>$300+</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, (blm.cumulativeSpend / 300) * 100)}%`, backgroundColor: 'var(--brand-primary)' }}></div>
                  </div>
                </div>
                {blm.currentTier ? (
                  <div className="mt-3 p-3 bg-yellow-50 rounded-xl text-center">
                    <div className="font-bold text-yellow-800">Eligible for {blm.currentTier}!</div>
                    <div className="text-xs text-yellow-600 mt-0.5">Gift card issued at window close</div>
                  </div>
                ) : blm.nextTier ? (
                  <div className="mt-3 p-3 bg-gray-50 rounded-xl text-center text-sm text-gray-600">
                    Spend <strong>${blm.nextTier.remaining}</strong> more for a <strong>{blm.nextTier.label}</strong>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <button onClick={() => { dispatch({ type: 'RESET' }); navigate('/'); }} className="btn-primary flex-1 py-3 rounded-full">
          New Transaction
        </button>
        <button onClick={() => { dispatch({ type: 'SET_ELIGIBLE_PROMOS', payload: null }); dispatch({ type: 'SET_EXECUTION_RESULT', payload: null }); navigate('/cart'); }} className="btn-outline flex-1 py-3 rounded-full">
          Back to Cart
        </button>
      </div>
    </div>
  );
}
