import React, { createContext, useContext, useState } from 'react';

const BrandContext = createContext();

const defaultBrand = {
  name: 'Priceline Pharmacy',
  tagline: "Australia's Leading Health & Beauty Retailer",
  primaryColor: '#E8005C',
  primaryDark: '#B8004A',
  primaryLight: '#FFE0ED',
  logoDataUrl: null,
  vertical: 'pharmacy',
};

export function BrandProvider({ children }) {
  const [brand, setBrand] = useState(defaultBrand);

  function applyBrand(updates) {
    setBrand(prev => {
      const next = { ...prev, ...updates };
      document.documentElement.style.setProperty('--brand-primary', next.primaryColor);
      document.documentElement.style.setProperty('--brand-primary-dark', next.primaryDark || next.primaryColor);
      document.documentElement.style.setProperty('--brand-primary-light', next.primaryLight || '#FFE0ED');
      return next;
    });
  }

  function resetBrand() {
    setBrand(defaultBrand);
    document.documentElement.style.removeProperty('--brand-primary');
    document.documentElement.style.removeProperty('--brand-primary-dark');
    document.documentElement.style.removeProperty('--brand-primary-light');
  }

  return <BrandContext.Provider value={{ brand, applyBrand, resetBrand }}>{children}</BrandContext.Provider>;
}

export function useBrand() { return useContext(BrandContext); }
