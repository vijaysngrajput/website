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
        let html = `<div class="bg-white rounded-lg shadow-lg p-6 text-center transform hover:-translate-y-2 transition duration-300 cursor-pointer card-animate">
          <img alt="${mobile.name}" class="h-24 mx-auto mb-4" src="${mobile.image}"/>
          <h3 class="text-xl font-semibold mb-2">${mobile.name}</h3>
          <p class="text-gray-600 mb-2">${mobile.description}</p>
          <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Top 10</span>
        </div>`;
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
        let html = `<div class="bg-white rounded-lg shadow-lg p-6 text-center transform hover:-translate-y-2 transition duration-300 cursor-pointer card-animate">
          <img alt="${laptop.name}" class="h-24 mx-auto mb-4" src="${laptop.image}"/>
          <h3 class="text-xl font-semibold mb-2">${laptop.name}</h3>
          <p class="text-gray-600 mb-2">${laptop.description}</p>
          <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Top 10</span>
        </div>`;
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
        let html = `<div class="bg-white rounded-lg shadow-lg p-6 text-center transform hover:-translate-y-2 transition duration-300 cursor-pointer card-animate">
          <img alt="${protein.name}" class="h-24 mx-auto mb-4" src="${protein.image}"/>
          <h3 class="text-xl font-semibold mb-2">${protein.name}</h3>
          <p class="text-gray-600 mb-2">${protein.description}</p>
          <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Top 10</span>
        </div>`;
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
