const BASE = '/api';

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw Object.assign(new Error(data.error || 'API error'), { data });
  return data;
}

export const getProducts = (category) =>
  apiFetch(`/products${category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : ''}`);

export const getCategories = () => apiFetch('/products/categories');

export const getProfiles = () => apiFetch('/profiles');

export const checkEligible = (profile, items, channel, useMock = false) =>
  apiFetch('/promotions/eligible', {
    method: 'POST',
    body: JSON.stringify({ profile, items, channel, useMock }),
  });

export const executePromotion = (profile, items, channel, useMock = false) =>
  apiFetch('/promotions/execute', {
    method: 'POST',
    body: JSON.stringify({ profile, items, channel, useMock }),
  });

export const createTransactionJournals = (profile, items, channel) =>
  apiFetch('/loyalty/transaction-journals', {
    method: 'POST',
    body: JSON.stringify({ profile, items, channel }),
  });

export const recordBLMSpend = (contactId, amount) =>
  apiFetch('/blm/record-spend', {
    method: 'POST',
    body: JSON.stringify({
      contactId,
      amount,
      windowStart: new Date().toISOString().split('T')[0],
      windowEnd: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    }),
  });

export const getBLMTracker = (contactId) => apiFetch(`/blm/tracker/${contactId}`);

export const uploadLogo = async (file) => {
  const form = new FormData();
  form.append('logo', file);
  const res = await fetch(`${BASE}/brand/upload-logo`, { method: 'POST', body: form });
  return res.json();
};

export const scrapeBrand = (url) =>
  apiFetch('/brand/scrape', { method: 'POST', body: JSON.stringify({ url }) });
