// smartphones.js - modular logic for smartphones page

export async function fetchSmartphones() {
  const res = await fetch('../../data/mobiles/mobiles.json');
  return res.json();
}

export function renderSmartphones(phones) {
  const grid = document.getElementById('smartphone-grid');
  grid.innerHTML = '';
  phones.forEach(phone => {
    const card = document.createElement('div');
    card.className = 'glass-card p-8 flex flex-col items-center justify-center border border-blue-400/30 min-h-[320px] hover:scale-105 transition-transform duration-300';
    card.innerHTML = `
      <img src="${phone.image || 'https://cdn.pixabay.com/photo/2017/01/06/19/15/smartphone-1957740_1280.png'}" alt="${phone.name}" class="w-32 h-32 object-contain mb-4 rounded-xl shadow-lg"/>
      <h3 class="text-2xl font-bold mb-2 text-blue-300">${phone.name}</h3>
      <ul class="text-base text-gray-200 mb-2">
        <li>RAM: ${phone.ram}</li>
        <li>Chipset: ${phone.processor}</li>
        <li>Camera: ${phone.camera}</li>
        <li>Battery: ${phone.battery}</li>
      </ul>
      <span class="font-bold text-xl text-blue-300">${phone.price}</span>
      <button class="mt-4 py-2 px-6 rounded-lg bg-blue-500 text-white font-bold shadow-lg">View Details</button>
    `;
    grid.appendChild(card);
  });
}

export function applyFilters(phones, filters) {
  return phones.filter(phone => {
    if (filters.ram !== 'Any' && phone.ram !== filters.ram) return false;
    if (filters.price !== 'Any') {
      const priceNum = parseInt(phone.price.replace(/[^\d]/g, ''));
      if (filters.price === '5k-10k' && !(priceNum >= 5000 && priceNum <= 10000)) return false;
      if (filters.price === '10k-15k' && !(priceNum > 10000 && priceNum <= 15000)) return false;
      if (filters.price === '15k-20k' && !(priceNum > 15000 && priceNum <= 20000)) return false;
      if (filters.price === '20k-30k' && !(priceNum > 20000 && priceNum <= 30000)) return false;
      if (filters.price === '30k-40k' && !(priceNum > 30000 && priceNum <= 40000)) return false;
      if (filters.price === '40k-50k' && !(priceNum > 40000 && priceNum <= 50000)) return false;
      if (filters.price === '50k-1L' && !(priceNum > 50000 && priceNum <= 100000)) return false;
      if (filters.price === '1L+' && !(priceNum > 100000)) return false;
    }
    if (filters.processor !== 'Any' && !phone.processor.toLowerCase().includes(filters.processor.toLowerCase())) return false;
    if (filters.color !== 'Any' && (!phone.color || phone.color.toLowerCase() !== filters.color.toLowerCase())) return false;
    if (filters.brand !== 'Any' && (!phone.brand || phone.brand.toLowerCase() !== filters.brand.toLowerCase())) return false;
    if (filters.camera !== 'Any') {
      const camNum = parseInt(phone.camera);
      if (filters.camera === '12MP+' && camNum < 12) return false;
      if (filters.camera === '50MP+' && camNum < 50) return false;
      if (filters.camera === '108MP+' && camNum < 108) return false;
    }
    if (filters.battery !== 'Any') {
      const battNum = parseInt(phone.battery);
      if (filters.battery === '4000mAh+' && battNum < 4000) return false;
      if (filters.battery === '5000mAh+' && battNum < 5000) return false;
    }
    if (filters.display !== 'Any') {
      const dispNum = parseFloat(phone.display);
      if (filters.display === '6"+' && dispNum < 6) return false;
      if (filters.display === '6.5"+' && dispNum < 6.5) return false;
      if (filters.display === '7"+' && dispNum < 7) return false;
    }
    return true;
  });
}
