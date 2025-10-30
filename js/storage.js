// NearNab storage helper - JSON Server first, localStorage fallback
const STORAGE_KEY = 'nearnab_deals_cache';
const JSON_URL = 'http://localhost:3000/deals';

export async function getDeals() {
  // Always try server first
  try {
    const res = await fetch(JSON_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Server not OK');
    const data = await res.json();
    // cache for offline fallback
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e){}
    return Array.isArray(data) ? data : [];
  } catch (e) {
    // fallback to cache
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e2) {
      return [];
    }
  }
}

export async function postDeal(deal) {
  // Post to server; if fails, also push to cache so UI still works
  const payload = {
    ...deal,
    id: deal.id || Date.now(),
    createdAt: deal.createdAt || new Date().toISOString()
  };
  try {
    const res = await fetch(JSON_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('POST failed');
  } catch (e) {
    // Update local cache list
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(payload);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch(_) {}
  }
  return payload;
}