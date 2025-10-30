import { getDeals } from './storage.js';

const sliderTrack = document.getElementById('slider-track');
const dotsWrap = document.getElementById('dots');
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');
const homeGrid = document.getElementById('homeDealsGrid');

const FALLBACKS = [
  {img:'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1600&auto=format', caption:'Discover Top Tech Deals'},
  {img:'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600&auto=format', caption:'Fashion Offers Near You'},
  {img:'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1600&auto=format', caption:'Home & Kitchen Savings'}
];

async function buildSlider() {
  const deals = await getDeals();
  const slidesData = deals.length ? deals.slice(0,5).map(d => ({img:d.image, caption:d.title})) : FALLBACKS;

  sliderTrack.innerHTML = slidesData.map((s,i)=>`
    <div class="slide"><img src="${s.img}" alt="slide ${i+1}"/><div class="caption">${s.caption||''}</div></div>
  `).join('');
  dotsWrap.innerHTML = slidesData.map((_,i)=>`<span class="dot" data-i="${i}"></span>`).join('');

  let idx = 0, total = slidesData.length;
  const setActive = ()=>{
    sliderTrack.style.transform = `translateX(${-idx*100}%)`;
    [...dotsWrap.children].forEach((d,di)=>d.classList.toggle('active', di===idx));
  };
  setActive();

  nextBtn.onclick = ()=>{ idx = (idx+1)%total; setActive(); };
  prevBtn.onclick = ()=>{ idx = (idx-1+total)%total; setActive(); };
  dotsWrap.onclick = (e)=>{
    const el = e.target.closest('.dot'); if(!el) return;
    idx = Number(el.dataset.i)||0; setActive();
  };
  setInterval(()=>{ nextBtn.click(); }, 4000);
}

async function renderHomeDeals() {
  const deals = await getDeals();
  if(!deals.length) {
    homeGrid.innerHTML = '<p>No deals yet. <a href="post_deal.html">Post a deal</a>.</p>';
    return;
  }
  const top = deals.slice(0,12);
  homeGrid.innerHTML = top.map(d=>`
    <a class="card" href="Deals.html#deal-${d.id}" title="${d.title}">
      <img src="${d.image}" alt="${d.title}"/>
      <div class="title">${d.title}</div>
      <div class="price">₹${Number(d.price).toLocaleString('en-IN')}</div>
    </a>
  `).join('');
}

buildSlider();
renderHomeDeals();