import { getDeals } from './storage.js';

const grid = document.getElementById('dealsGrid');
const search = document.getElementById('search');
const sort = document.getElementById('sort');

function render(list) {
  if (!list.length) {
    grid.innerHTML = '<p>No deals yet. <a href="post_deal.html">Post a deal</a>.</p>';
    return;
  }
  grid.innerHTML = list.map(d => `
    <div class="deal-card" id="deal-${d.id}">
      <img src="${d.image}" alt="${d.title}" />
      <div class="title">${d.title}</div>
      <div class="price">₹${Number(d.price).toLocaleString('en-IN')}</div>
      <div class="meta">${d.location || ''}</div>
    </div>
  `).join('');
}

async function apply() {
  const q = (search.value || '').toLowerCase().trim();
  let list = await getDeals();

  if (q) {
    list = list.filter(d =>
      d.title?.toLowerCase().includes(q) ||
      (d.location || '').toLowerCase().includes(q)
    );
  }

  if (sort.value === 'low') {
    list.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sort.value === 'high') {
    list.sort((a, b) => Number(b.price) - Number(a.price));
  } else {
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  render(list);
}

search.addEventListener('input', apply);
sort.addEventListener('change', apply);

apply();
