import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useBrand } from '../context/BrandContext';
import BrandConfigurator from './BrandConfigurator';

export default function Header() {
  const { state, dispatch } = useCart();
  const { brand } = useBrand();
  const [showBrand, setShowBrand] = useState(false);
  const navigate = useNavigate();

  const cartCount = state.items.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <header className="sticky top-0 z-40 shadow-md" style={{ backgroundColor: 'var(--brand-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              {brand.logoDataUrl ? (
                <img src={brand.logoDataUrl} alt={brand.name} className="h-9 object-contain" />
              ) : (
                <div className="flex flex-col leading-none">
                  <span className="text-white font-black text-2xl tracking-tight" style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.02em' }}>priceline</span>
                  <span className="text-white/75 text-xs font-medium tracking-widest uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>pharmacy</span>
                </div>
              )}
            </Link>

            {/* Beauty Club badge */}
            <div className="hidden sm:flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5">
              <span className="text-white text-sm font-medium">Beauty Club</span>
              {state.profile && (
                <span className="text-white/80 text-xs">| {state.profile.name}</span>
              )}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Mock toggle */}
              <button
                onClick={() => dispatch({ type: 'TOGGLE_MOCK' })}
                className={`hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                  state.useMock ? 'bg-yellow-400 text-yellow-900' : 'bg-white/20 text-white'
                }`}
                title="Toggle between live Salesforce and mock data"
              >
                {state.useMock ? 'Mock' : 'Live SF'}
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
    </>
  );
}
