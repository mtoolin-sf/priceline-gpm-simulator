import React, { useState } from 'react';
import { useBrand } from '../context/BrandContext';
import { uploadLogo, scrapeBrand } from '../api/client';

export default function BrandConfigurator({ onClose }) {
  const { brand, applyBrand, resetBrand } = useBrand();
  const [url, setUrl] = useState('');
  const [scraping, setScraping] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [scrapedColors, setScrapedColors] = useState([]);
  const [selectedColors, setSelectedColors] = useState({ primary: null, secondary: null });
  const [error, setError] = useState('');

  async function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { dataUrl } = await uploadLogo(file);
      applyBrand({ logoDataUrl: dataUrl });
    } catch (err) {
      setError('Logo upload failed: ' + err.message);
    } finally { setUploading(false); }
  }

  async function handleScrape() {
    if (!url) return;
    setScraping(true);
    setError('');
    try {
      const data = await scrapeBrand(url);
      setScrapedColors(data.colors || []);
      if (data.title) applyBrand({ name: data.title });
    } catch (err) {
      setError('Scrape failed: ' + err.message);
    } finally { setScraping(false); }
  }

  function applyColors() {
    if (selectedColors.primary) {
      applyBrand({
        primaryColor: selectedColors.primary,
        primaryDark: darken(selectedColors.primary),
        primaryLight: lighten(selectedColors.primary),
      });
    }
    onClose();
  }

  function darken(hex) {
    const r = Math.max(0, parseInt(hex.slice(1,3),16) - 30);
    const g = Math.max(0, parseInt(hex.slice(3,5),16) - 30);
    const b = Math.max(0, parseInt(hex.slice(5,7),16) - 30);
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
  }

  function lighten(hex) {
    const r = Math.min(255, parseInt(hex.slice(1,3),16) + 180);
    const g = Math.min(255, parseInt(hex.slice(3,5),16) + 180);
    const b = Math.min(255, parseInt(hex.slice(5,7),16) + 180);
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Brand Configurator</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

        {/* Logo upload */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Brand Logo</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
            {brand.logoDataUrl ? (
              <div className="flex flex-col items-center gap-2">
                <img src={brand.logoDataUrl} alt="Logo" className="h-12 object-contain" />
                <span className="text-xs text-green-600 font-medium">✓ Transparent logo applied</span>
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                {uploading ? 'Processing…' : 'PNG or JPG — white background auto-removed'}
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" />
            <label htmlFor="logo-upload" className="mt-3 inline-block text-sm text-priceline-pink cursor-pointer font-medium hover:underline" style={{ color: 'var(--brand-primary)' }}>
              {brand.logoDataUrl ? 'Change logo' : 'Choose file'}
            </label>
          </div>
        </div>

        {/* URL scrape */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Website URL (for colour extraction)</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://brand.com.au"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <button onClick={handleScrape} disabled={scraping || !url} className="btn-primary text-sm px-4 py-2 rounded-lg">
              {scraping ? '…' : 'Extract'}
            </button>
          </div>
        </div>

        {/* Color picker */}
        {scrapedColors.length > 0 && (
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Extracted colours — select primary:</label>
            <div className="flex flex-wrap gap-3">
              {scrapedColors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColors(prev => ({ ...prev, primary: color }))}
                  className={`w-10 h-10 rounded-full border-4 transition-all ${selectedColors.primary === color ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            {selectedColors.primary && (
              <p className="text-xs text-gray-500 mt-2">Selected: {selectedColors.primary}</p>
            )}
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button onClick={resetBrand} className="btn-outline flex-1 py-2 text-sm rounded-xl">Reset to Priceline</button>
          <button onClick={applyColors} className="btn-primary flex-1 py-2 text-sm rounded-xl">Apply Brand</button>
        </div>
      </div>
    </div>
  );
}
