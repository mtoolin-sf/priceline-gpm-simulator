import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AccessGate from './components/AccessGate';
import { CartProvider } from './context/CartContext';
import { BrandProvider } from './context/BrandContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProfileSelector from './pages/ProfileSelector';
import ProductCatalog from './pages/ProductCatalog';
import Cart from './pages/Cart';
import CheckoutResults from './pages/CheckoutResults';
import Responses from './pages/Responses';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Standalone WesHealth deck — no simulator chrome */}
        <Route path="/whdeck" element={<Responses />} />
        <Route path="/responses" element={<Navigate to="/whdeck" replace />} />

        {/* Priceline GPM simulator */}
        <Route path="/*" element={
          <AccessGate>
            <BrandProvider>
              <CartProvider>
                <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--brand-bg)' }}>
                  <Header />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<ProfileSelector />} />
                      <Route path="/shop" element={<ProductCatalog />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<CheckoutResults />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </CartProvider>
            </BrandProvider>
          </AccessGate>
        } />
      </Routes>
    </BrowserRouter>
  );
}
