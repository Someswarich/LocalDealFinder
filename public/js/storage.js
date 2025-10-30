// NearNab storage helper - JSON Server first, localStorage fallback

const STORAGE_KEY = 'nearnab_deals_cache';
// Correct Render API endpoint (your JSON Server)
const JSON_URL = "https://localdealfinder.onrender.com/db";

/**
 * Fetch all deals from Render JSON Server or local cache fallback
 */
export async function getDeals() {
  try {
    // Try to get data from Render JSON server
    const res = await fetch(JSON_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Server not OK');
    const data = await res.json();

    // Extract deals array (since Render returns { users:[], deals:[] })
    const deals = data.deals || [];

    // Cache deals for offline use
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
    } catch (e) {
      console.warn("Failed to cache deals", e);
    }

    return deals;
  } catch (err) {
    console.error("Server fetch failed, using cached deals:", err);
    // fallback to cache
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}

/**
 * Post a new deal to the server, with local fallback if offline
 */
export async function postDeal(deal) {
  const payload = {
    ...deal,
    id: deal.id || Date.now(),
    createdAt: deal.createdAt || new Date().toISOString(),
  };

  try {
    // Post directly to /deals endpoint on Render
    const res = await fetch("https://localdealfinder.onrender.com/deals", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('POST failed');
  } catch (err) {
    console.warn("POST failed, saving locally:", err);
    // Save locally if POST fails
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(payload);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error("Local cache update failed:", e);
    }
  }

  return payload;
}
