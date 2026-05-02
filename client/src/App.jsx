import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
    <BrandProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--brand-bg)' }}>
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<ProfileSelector />} />
                <Route path="/shop" element={<ProductCatalog />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<CheckoutResults />} />
                <Route path="/responses" element={<Responses />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </BrandProvider>
  );
}
