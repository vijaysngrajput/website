// dataLoader.js
// Handles fetching and rendering of product data for Ten Z Vault

document.addEventListener('DOMContentLoaded', function() {
  // Dynamically load mobiles from data/mobiles/mobiles.json and render them
  fetch('data/mobiles/mobiles.json')
    .then(response => response.json())
    .then(mobiles => {
      const container = document.getElementById('categories-container');
      container.innerHTML = '';
      mobiles.forEach(mobile => {
        let html = `<a href="${mobile.productLink}" target="_blank" rel="noopener" style="text-decoration:none;">
          <div class="rounded-lg p-3 text-center flex flex-col justify-between transform hover:-translate-y-2 transition duration-300 cursor-pointer card-animate" style="width:260px; height:320px; margin:0 auto; background:rgba(255,255,255,0.82); backdrop-filter:blur(8px); border:8px solid #e0e7ff; box-shadow:0 8px 32px 0 rgba(59,130,246,0.18), 0 0 0 6px rgba(59,130,246,0.10);">
            <img alt="${mobile.name}" class="h-24 mx-auto mb-3" src="${mobile.image}" style="object-fit:contain;"/>
            <h3 class="text-lg font-semibold mb-1">${mobile.name}</h3>
            <p class="mb-1" style="font-size:0.95rem; color:#111;">${mobile.description}</p>
          </div>
        </a>`;
        container.innerHTML += html;
      });
    });

  // Dynamically load laptops from data/laptops/laptops.json and render them
  fetch('data/laptops/laptops.json')
    .then(response => response.json())
    .then(laptops => {
      const container = document.getElementById('laptops-container');
      container.innerHTML = '';
      laptops.forEach(laptop => {
        let html = `<a href="${laptop.productLink}" target="_blank" rel="noopener" style="text-decoration:none;">
          <div class="rounded-lg p-3 text-center flex flex-col justify-between transform hover:-translate-y-2 transition duration-300 cursor-pointer card-animate" style="width:260px; height:320px; margin:0 auto; background:rgba(255,255,255,0.82); backdrop-filter:blur(8px); border:8px solid #e0e7ff; box-shadow:0 8px 32px 0 rgba(59,130,246,0.18), 0 0 0 6px rgba(59,130,246,0.10);">
            <img alt="${laptop.name}" class="h-24 mx-auto mb-3" src="${laptop.image}" style="object-fit:contain;"/>
            <h3 class="text-lg font-semibold mb-1">${laptop.name}</h3>
            <p class="mb-1" style="font-size:0.95rem; color:#111;">${laptop.description}</p>
          </div>
        </a>`;
        container.innerHTML += html;
      });
    });

  // Dynamically load protein from data/protein/protein.json and render them
  fetch('data/protein/protein.json')
    .then(response => response.json())
    .then(proteins => {
      const container = document.getElementById('protein-container');
      container.innerHTML = '';
      proteins.forEach(protein => {
        let html = `<a href="${protein.productLink}" target="_blank" rel="noopener" style="text-decoration:none;">
          <div class="rounded-lg p-3 text-center flex flex-col justify-between transform hover:-translate-y-2 transition duration-300 cursor-pointer card-animate" style="width:260px; height:320px; margin:0 auto; background:rgba(255,255,255,0.82); backdrop-filter:blur(8px); border:8px solid #e0e7ff; box-shadow:0 8px 32px 0 rgba(59,130,246,0.18), 0 0 0 6px rgba(59,130,246,0.10);">
            <img alt="${protein.name}" class="h-24 mx-auto mb-3" src="${protein.image}" style="object-fit:contain;"/>
            <h3 class="text-lg font-semibold mb-1">${protein.name}</h3>
            <p class="mb-1" style="font-size:0.95rem; color:#111;">${protein.description}</p>
          </div>
        </a>`;
        container.innerHTML += html;
      });
    });

  // Restore Explore Categories dropdown logic
  const exploreBtn = document.getElementById('explore-categories-btn');
  const dropdown = document.getElementById('categories-dropdown');
  if (exploreBtn && dropdown) {
    exploreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('hidden');
    });
    document.addEventListener('click', (e) => {
      if (!dropdown.classList.contains('hidden')) {
        if (!dropdown.contains(e.target) && e.target !== exploreBtn) {
          dropdown.classList.add('hidden');
        }
      }
    });
    // Smooth scroll to section
    dropdown.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
        dropdown.classList.add('hidden');
      });
    });
  }
  // Add scroll to How It Works section when clicking the button
  const howItWorksLink = document.getElementById('how-it-works-link');
  if (howItWorksLink) {
    howItWorksLink.addEventListener('click', function(e) {
      e.preventDefault();
      const howItWorks = document.getElementById('how-it-works');
      if (howItWorks) {
        howItWorks.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});
