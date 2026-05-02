import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { checkEligible, executePromotion, createTransactionJournals, recordBLMSpend } from '../api/client';
import ChannelSelector from '../components/ChannelSelector';
import PromoCard from '../components/PromoCard';
import JsonViewer from '../components/JsonViewer';

export default function Cart() {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();
  const [checkingPromos, setCheckingPromos] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [promoError, setPromoError] = useState('');

  const subtotal = state.items.reduce((s, i) => s + i.price * i.qty, 0);

  async function handleCheckEligible() {
    setCheckingPromos(true);
    setPromoError('');
    try {
      const data = await checkEligible(state.profile, state.items, state.channel, state.useMock);
      dispatch({ type: 'SET_ELIGIBLE_PROMOS', payload: data });
    } catch (err) {
      setPromoError(err.message + (err.data ? ': ' + JSON.stringify(err.data).slice(0, 200) : ''));
    } finally { setCheckingPromos(false); }
  }

  async function handleCheckout() {
    setCheckingOut(true);
    setPromoError('');
    try {
      const [execResult, tjResult] = await Promise.all([
        executePromotion(state.profile, state.items, state.channel, state.useMock),
        createTransactionJournals(state.profile, state.items, state.channel),
      ]);
      dispatch({ type: 'SET_EXECUTION_RESULT', payload: execResult });
      dispatch({ type: 'SET_TJ_RESULT', payload: tjResult });

      // BLM spend tracking for non-members
      if (!state.profile.isMember) {
        const blm = await recordBLMSpend(state.profile.contactId, subtotal);
        dispatch({ type: 'SET_BLM_RESULT', payload: blm });
      }

      navigate('/checkout');
    } catch (err) {
      setPromoError(err.message + (err.data ? ': ' + JSON.stringify(err.data).slice(0, 200) : ''));
    } finally { setCheckingOut(false); }
  }

  if (!state.profile) { navigate('/'); return null; }
  if (state.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some products to see GPM promotions in action.</p>
        <button onClick={() => navigate('/shop')} className="btn-primary px-8 py-3 rounded-full">Browse Products</button>
      </div>
    );
  }

  // Parse eligible promos
  const eligiblePromos = state.eligiblePromos?.eligiblePromotions || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900">Your Cart</h1>
        <button onClick={() => navigate('/shop')} className="text-sm text-gray-500 hover:text-gray-700">← Keep shopping</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Cart items */}
        <div className="lg:col-span-3 space-y-3">
          {state.items.map(item => (
            <div key={item.id} className="card p-4 flex gap-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg shrink-0"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=100'; }} />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500">{item.brand}</div>
                <div className="font-semibold text-sm text-gray-900 leading-snug">{item.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{item.category}</div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="font-bold text-gray-900">${(item.price * item.qty).toFixed(2)}</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { id: item.id, qty: item.qty - 1 } })}
                    className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-sm flex items-center justify-center">−</button>
                  <span className="font-bold text-sm w-4 text-center">{item.qty}</span>
                  <button onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { id: item.id, qty: item.qty + 1 } })}
                    className="w-7 h-7 rounded-full text-white font-bold text-sm flex items-center justify-center"
                    style={{ backgroundColor: 'var(--brand-primary)' }}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Channel selector */}
          <div className="card p-4">
            <h3 className="font-semibold text-sm text-gray-700 mb-3">Shopping Channel</h3>
            <ChannelSelector />
          </div>

          {/* Order summary */}
          <div className="card p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">{state.items.reduce((s,i) => s + i.qty, 0)} items</span>
              <span className="font-bold">${subtotal.toFixed(2)} AUD</span>
            </div>
            <div className="flex items-center gap-2 mt-2 mb-4 p-2 bg-pink-50 rounded-lg">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ backgroundColor: state.profile?.color || 'var(--brand-primary)' }}>
                {state.profile?.avatar}
              </div>
              <div className="text-xs">
                <div className="font-semibold text-gray-800">{state.profile?.name}</div>
                <div className="text-gray-500">{state.profile?.tier || 'Non-Member'} · {state.channel}</div>
              </div>
            </div>

            {promoError && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">{promoError}</div>
            )}

            <button
              onClick={handleCheckEligible}
              disabled={checkingPromos || checkingOut}
              className="w-full py-2.5 rounded-xl text-sm font-semibold mb-2 border-2 transition-all"
              style={{ borderColor: 'var(--brand-primary)', color: 'var(--brand-primary)' }}
            >
              {checkingPromos ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                  Checking with Salesforce GPM…
                </span>
              ) : 'Check Eligible Promotions'}
            </button>

            <button
              onClick={handleCheckout}
              disabled={checkingOut || checkingPromos}
              className="btn-primary w-full py-2.5 rounded-xl text-sm"
            >
              {checkingOut ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Processing with Salesforce…
                </span>
              ) : 'Checkout & Apply Promotions'}
            </button>
          </div>

          {/* Eligible promos */}
          {eligiblePromos.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-gray-700">
                {eligiblePromos.length} Eligible Promotion{eligiblePromos.length !== 1 ? 's' : ''}
              </h3>
              {eligiblePromos.map((p, i) => <PromoCard key={i} promo={p} />)}
              <JsonViewer title="Eligible Promotions API Response" data={state.eligiblePromos} />
            </div>
          )}

          {state.eligiblePromos && eligiblePromos.length === 0 && (
            <div className="card p-4 text-center text-sm text-gray-500">
              No eligible promotions for this cart + channel combination.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
