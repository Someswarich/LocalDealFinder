const _currentUser = localStorage.getItem('loggedInUser');
if(!_currentUser){ alert('Please login to post a deal.'); window.location.href='index.html'; }

import { postDeal } from './storage.js';

const form = document.getElementById('postDealForm');
const imageInput = document.getElementById('image');
const titleInput = document.getElementById('title');
const priceInput = document.getElementById('price');
const locationInput = document.getElementById('location');

function toDataURL(file){
  return new Promise((resolve,reject)=>{
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

form?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const title = titleInput?.value?.trim();
  const price = priceInput?.value?.trim();
  const location = locationInput?.value?.trim();
  const file = imageInput?.files?.[0];

  if(!title || !price || isNaN(Number(price)) || Number(price)<=0 || !file){
    alert('Please add title, valid price, and image.');
    return;
  }
  const imageData = await toDataURL(file);
  await postDeal({ title, price:Number(price), image:imageData, location });
  alert('Deal posted successfully!');
  // Redirect so home & deals fetch latest from server
  window.location.href = 'Deals.html';
});