import React, { useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useBrand } from '../context/BrandContext';
import BrandConfigurator from './BrandConfigurator';
import MobileAppPreview from './MobileAppPreview';
import { reconnect } from '../api/client';

export default function Header() {
  const { state, dispatch } = useCart();
  const { brand } = useBrand();
  const [showBrand, setShowBrand] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [reconnectStatus, setReconnectStatus] = useState(null); // 'ok' | 'error' | null
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = state.items.reduce((s, i) => s + i.qty, 0);

  const handleLogoClick = useCallback(async (e) => {
    e.preventDefault();
    if (reconnecting) return;
    setReconnecting(true);
    setReconnectStatus(null);
    try {
      await reconnect();
      setReconnectStatus('ok');
      setTimeout(() => {
        setReconnectStatus(null);
        navigate('/');
      }, 800);
    } catch {
      setReconnectStatus('error');
      setTimeout(() => {
        setReconnectStatus(null);
        navigate('/');
      }, 1500);
    } finally {
      setReconnecting(false);
    }
  }, [reconnecting, navigate]);

  const logoRing = reconnecting
    ? 'ring-2 ring-yellow-300 ring-offset-1 ring-offset-transparent'
    : reconnectStatus === 'ok'
    ? 'ring-2 ring-green-400 ring-offset-1 ring-offset-transparent'
    : reconnectStatus === 'error'
    ? 'ring-2 ring-red-400 ring-offset-1 ring-offset-transparent'
    : '';

  return (
    <>
      <header className="sticky top-0 z-40 shadow-md" style={{ backgroundColor: 'var(--brand-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo — click to reconnect + navigate home */}
            <button
              onClick={handleLogoClick}
              className={`flex items-center gap-3 rounded-xl transition-all ${reconnecting ? 'opacity-70' : 'hover:opacity-90'}`}
              title={reconnecting ? 'Reconnecting…' : 'Home — click to refresh SF connection'}
              style={{ background: 'none', border: 'none', padding: 0, cursor: reconnecting ? 'wait' : 'pointer' }}
            >
              {brand.logoDataUrl ? (
                <img src={brand.logoDataUrl} alt={brand.name} className={`h-9 object-contain rounded-lg ${logoRing}`} />
              ) : (
                <div className={`bg-white rounded-xl px-4 py-2 ${logoRing}`}>
                  {reconnecting ? (
                    <div className="h-12 flex items-center gap-2 px-1">
                      <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping inline-block" />
                      <span className="text-xs text-gray-400 font-medium">Reconnecting…</span>
                    </div>
                  ) : reconnectStatus === 'ok' ? (
                    <div className="h-12 flex items-center gap-2 px-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                      <span className="text-xs text-green-600 font-semibold">Connected</span>
                    </div>
                  ) : reconnectStatus === 'error' ? (
                    <div className="h-12 flex items-center gap-2 px-1">
                      <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                      <span className="text-xs text-red-500 font-semibold">Offline</span>
                    </div>
                  ) : (
                    <img src="/priceline-logo.webp" alt="Priceline Pharmacy" className="h-12 object-contain" />
                  )}
                </div>
              )}
            </button>

            {/* Beauty Club badge */}
            <div className="hidden sm:flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5">
              <span className="text-white text-sm font-medium">Beauty Club</span>
              {state.profile && (
                <span className="text-white/80 text-xs">| {state.profile.name}</span>
              )}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Live SF indicator — no toggle exposed in demo mode */}
              <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white/20 text-white">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse" /> Live SF
              </span>

              {/* Mobile app preview */}
              <button
                onClick={() => setShowMobile(true)}
                className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                title="Preview personalised offers in mobile app"
              >
                📱 App
              </button>

              {/* Brand config */}
              <button
                onClick={() => setShowBrand(true)}
                className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                title="Brand Configurator"
              >
                Brand
              </button>

              {/* Cart */}
              {state.profile && (
                <button
                  onClick={() => navigate('/cart')}
                  className="relative px-3 py-2 rounded-full bg-white text-priceline-pink hover:bg-pink-50 transition-colors text-sm font-semibold"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      {showBrand && <BrandConfigurator onClose={() => setShowBrand(false)} />}
      {showMobile && <MobileAppPreview onClose={() => setShowMobile(false)} />}
    </>
  );
}
