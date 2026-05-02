import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, getCategories } from '../api/client';
import { useCart } from '../context/CartContext';

export default function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const { state, dispatch } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.profile) { navigate('/'); return; }
    Promise.all([getProducts(), getCategories()]).then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory);
  const cartCount = state.items.reduce((s, i) => s + i.qty, 0);

  function addToCart(product) {
    dispatch({ type: 'ADD_ITEM', payload: product });
  }

  function getItemQty(id) {
    return state.items.find(i => i.id === id)?.qty || 0;
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="w-8 h-8 border-4 border-pink-200 border-t-priceline-pink rounded-full animate-spin" style={{ borderTopColor: 'var(--brand-primary)' }}></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: state.profile?.color || 'var(--brand-primary)' }}>
            {state.profile?.avatar}
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">{state.profile?.name}</div>
            <div className="text-xs text-gray-500">{state.profile?.pointsBalance.toLocaleString()} Beauty Points</div>
          </div>
        </div>
        {cartCount > 0 && (
          <button onClick={() => navigate('/cart')} className="btn-primary text-sm px-5 py-2 rounded-full">
            View Cart ({cartCount})
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border-2 ${
              activeCategory === cat
                ? 'text-white border-transparent'
                : 'bg-white text-gray-600 border-gray-200 hover:border-pink-200'
            }`}
            style={activeCategory === cat ? { backgroundColor: 'var(--brand-primary)', borderColor: 'var(--brand-primary)' } : {}}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filtered.map(product => {
          const qty = getItemQty(product.id);
          return (
            <div key={product.id} className="card flex flex-col">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full aspect-square object-cover"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop'; }}
                />
                {product.uc?.includes('UC5') && (
                  <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">App 3X</span>
                )}
              </div>
              <div className="p-3 flex flex-col flex-1">
                <div className="text-xs text-gray-500 font-medium mb-0.5">{product.brand}</div>
                <div className="text-xs font-semibold text-gray-900 leading-snug mb-2 flex-1">{product.name}</div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  <span className="text-xs text-gray-400">~{product.pointsEstimate} pts</span>
                </div>
                {qty === 0 ? (
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full py-1.5 rounded-lg text-sm font-semibold text-white transition-all"
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                  >
                    Add
                  </button>
                ) : (
                  <div className="flex items-center justify-between gap-1">
                    <button onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { id: product.id, qty: qty - 1 } })}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 flex items-center justify-center">−</button>
                    <span className="font-bold text-gray-900 w-6 text-center">{qty}</span>
                    <button onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { id: product.id, qty: qty + 1 } })}
                      className="w-8 h-8 rounded-full text-white font-bold flex items-center justify-center"
                      style={{ backgroundColor: 'var(--brand-primary)' }}>+</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
