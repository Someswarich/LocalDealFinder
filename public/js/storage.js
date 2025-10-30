// NearNab storage helper - JSON Server first, localStorage fallback
const STORAGE_KEY = 'nearnab_deals_cache';

// Auto-detect environment: localhost vs Render
const BASE_URL = window.location.hostname.includes('localhost')
  ? "http://localhost:10000"
  : "https://localdealfinder.onrender.com";

const DEALS_URL = `${BASE_URL}/deals`;

/**
 * Fetch all deals from server or cache
 */
export async function getDeals() {
  try {
    const res = await fetch(DEALS_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Server not OK');
    const data = await res.json();
    const deals = Array.isArray(data) ? data : data.deals || [];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
    return deals;
  } catch (err) {
    console.warn("Server unavailable, using cached deals:", err);
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }
}

/**
 * Post a new deal to the server
 */
export async function postDeal(deal) {
  const payload = {
    ...deal,
    id: deal.id || Date.now().toString(),
    createdAt: deal.createdAt || new Date().toISOString(),
  };

  try {
    const res = await fetch(DEALS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('POST failed');
  } catch (err) {
    console.warn("POST failed, saving locally:", err);
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(payload);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  return payload;
}
