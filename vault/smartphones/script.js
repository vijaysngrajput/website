
// --- smartphones.js logic inlined for browser compatibility ---
async function fetchSmartphones() {
  try {
    const res = await fetch('../../data/mobiles/mobiles.json');
    if (!res.ok) throw new Error('Fetch failed');
    return await res.json();
  } catch (e) {
    // Dummy fallback list
    return [
      {
        name: 'Apple iPhone 16 Pro',
        image: 'https://cdn.pixabay.com/photo/2017/01/06/19/15/smartphone-1957740_1280.png',
        ram: '8GB',
        processor: 'Apple A18',
        camera: '48',
        battery: '4500',
        price: '₹1,29,999',
        brand: 'Apple',
        color: 'White',
        display: '6.7'
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        image: 'https://cdn.pixabay.com/photo/2017/01/06/19/15/smartphone-1957740_1280.png',
        ram: '12GB+',
        processor: 'Snapdragon 8 Gen 3',
        camera: '200',
        battery: '5000',
        price: '₹1,19,999',
        brand: 'Samsung',
        color: 'Black',
        display: '6.8'
      },
      {
        name: 'Google Pixel 9 Pro',
        image: 'https://cdn.pixabay.com/photo/2017/01/06/19/15/smartphone-1957740_1280.png',
        ram: '12GB+',
        processor: 'Google Tensor G4',
        camera: '50',
        battery: '5000',
        price: '₹89,999',
        brand: 'Google',
        color: 'White',
        display: '6.7'
      }
    ];
  }
}

function renderSmartphones(phones) {
  const grid = document.getElementById('smartphone-grid');
  grid.innerHTML = '';
  phones.forEach((phone, i) => {
    // Use phone.id or fallback to name
    const phoneId = phone.id || (phone.name ? phone.name.replace(/\s+/g, '').toLowerCase() : 'unknown');
    const card = document.createElement('a');
    card.className = 'glass-card p-8 flex flex-col items-center justify-center border border-black min-h-[320px] hover:scale-105 transition-transform duration-300 cursor-pointer';
    card.href = `details.html?id=${encodeURIComponent(phoneId)}`;
    card.setAttribute('title', `View details for ${phone.name}`);
    card.innerHTML = `
      <img src="${phone.image || 'https://cdn.pixabay.com/photo/2017/01/06/19/15/smartphone-1957740_1280.png'}" alt="${phone.name}" class="w-32 h-32 object-contain mb-4 rounded-xl shadow-lg"/>
      <h3 class="text-2xl font-bold mb-2 text-black">${phone.name}</h3>
      <ul class="text-base text-black mb-2">
        <li>RAM: ${phone.ram}</li>
        <li>Chipset: ${phone.processor}</li>
        <li>Camera: ${phone.camera}MP</li>
        <li>Battery: ${phone.battery}mAh</li>
      </ul>
      <span class="font-bold text-xl text-black">${phone.price}</span>
      <span class="mt-4 py-2 px-6 rounded-lg bg-blue-500 text-white font-bold shadow-lg">View Details</span>
    `;
    // Animation
    card.style.opacity = '0';
    card.style.animation = `cardFadeInUp 0.8s cubic-bezier(0.33,1,0.68,1) both`;
    card.style.animationDelay = (i * 0.12) + 's';
    card.addEventListener('animationend', () => { card.style.opacity = '1'; });
    grid.appendChild(card);
  });
}

function applyFilters(phones, filters) {
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

document.addEventListener('DOMContentLoaded', async () => {
  let smartphones = await fetchSmartphones();
  renderSmartphones(smartphones);

  // Filter panel toggle (use visibility/opacity for Tailwind/flex compatibility)
  const toggleBtn = document.getElementById('filters-toggle-btn');
  const panel = document.getElementById('filters-panel');
  // Use a CSS class for hidden state
  panel.classList.add('hidden');
  toggleBtn.addEventListener('click', () => {
    panel.classList.toggle('hidden');
    // Optionally, add smooth transition
    panel.classList.toggle('flex');
  });

  // Filter form
  const form = panel.querySelector('form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    // Use all select elements in order
    const selects = form.querySelectorAll('select');
    const filters = {
      ram: selects[0].value,
      price: selects[1].value,
      processor: selects[2].value,
      color: selects[3].value,
      brand: selects[4].value,
      camera: selects[5].value,
      battery: selects[6].value,
      display: selects[7].value
    };
    const filtered = applyFilters(smartphones, filters);
    renderSmartphones(filtered);
  });
});
// Custom JS for smartphones page

document.addEventListener('DOMContentLoaded', function() {
  var menuBtn = document.getElementById('mobile-menu-button');
  var mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }
  // Filters toggle
  var filtersBtn = document.getElementById('filters-toggle-btn');
  var filtersPanel = document.getElementById('filters-panel');
  if (filtersBtn && filtersPanel) {
    filtersBtn.addEventListener('click', function() {
      if (filtersPanel.style.display === 'none' || filtersPanel.style.display === '') {
        filtersPanel.style.display = 'flex';
      } else {
        filtersPanel.style.display = 'none';
      }
    });
  }
});
