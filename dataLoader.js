// dataLoader.js
// Handles fetching and rendering of product data for Ten Z Vault

document.addEventListener('DOMContentLoaded', function() {
  // Dynamically load mobiles from data/mobiles/mobiles.json and render them
  fetch('data/mobiles/mobiles.json')
    .then(response => response.json())
    .then(mobiles => {
      // Use the slider container for smartphones
      const container = document.getElementById('categories-slider');
      if (!container) return;
      container.innerHTML = '';
      mobiles.forEach(mobile => {
        let html = `<a href="${mobile.productLink}" target="_blank" rel="noopener" style="text-decoration:none;">
          <div class="crystal-card flex-shrink-0 p-5 text-center flex flex-col justify-between transform hover:-translate-y-2 transition duration-300 cursor-pointer card-animate"
            style="width:370px; height:370px; margin:0 12px; background:rgba(255,255,255,0.16); backdrop-filter:blur(18px); box-shadow:0 10px 40px 0 rgba(59,130,246,0.22), 0 2px 12px 0 rgba(13,148,136,0.10); border:none; border-radius:1.5rem;">
            <img alt="${mobile.name}" class="h-36 mx-auto mb-4" src="${mobile.image}" style="object-fit:contain;"/>
            <h3 class="text-2xl font-bold mb-2" style="color:#fff; letter-spacing:0.02em; text-shadow:0 2px 12px rgba(0,0,0,0.22); font-family:'Poppins',sans-serif;">${mobile.name}</h3>
            <p class="crystal-card-desc mb-2" style="font-size:1.12rem; color:#b5e3ff; text-shadow:0 1px 8px rgba(0,0,0,0.18); font-family:'Poppins',sans-serif;">${mobile.description}</p>
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
      // Make laptops a horizontal slider like smartphones
      container.classList.remove('grid', 'grid-cols-1', 'sm:grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4', 'gap-8');
      container.classList.add('flex', 'overflow-x-auto', 'space-x-8', 'scrollbar-hide', 'px-8', 'py-2', 'snap-x', 'snap-mandatory');
      // Add slider buttons if not present
      if (!document.getElementById('laptops-slider-left')) {
        const parent = container.parentElement;
        const leftBtn = document.createElement('button');
        leftBtn.id = 'laptops-slider-left';
        leftBtn.className = 'absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-40 hover:bg-opacity-70 text-blue-600 rounded-full p-2 shadow-lg';
        leftBtn.style.backdropFilter = 'blur(8px)';
        leftBtn.innerHTML = '<i class="material-icons">chevron_left</i>';
        const rightBtn = document.createElement('button');
        rightBtn.id = 'laptops-slider-right';
        rightBtn.className = 'absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-40 hover:bg-opacity-70 text-blue-600 rounded-full p-2 shadow-lg';
        rightBtn.style.backdropFilter = 'blur(8px)';
        rightBtn.innerHTML = '<i class="material-icons">chevron_right</i>';
        parent.style.position = 'relative';
        parent.appendChild(leftBtn);
        parent.appendChild(rightBtn);
        leftBtn.addEventListener('click', () => {
          container.scrollBy({ left: -container.offsetWidth * 0.8, behavior: 'smooth' });
        });
        rightBtn.addEventListener('click', () => {
          container.scrollBy({ left: container.offsetWidth * 0.8, behavior: 'smooth' });
        });
      }
      laptops.forEach(laptop => {
        let html = `<a href="${laptop.productLink}" target="_blank" rel="noopener" style="text-decoration:none;">
          <div class="crystal-card flex-shrink-0 p-5 text-center flex flex-col justify-between transform hover:-translate-y-2 transition duration-300 cursor-pointer card-animate"
            style="width:370px; height:370px; margin:0 12px; background:rgba(255,255,255,0.16); backdrop-filter:blur(18px); box-shadow:0 10px 40px 0 rgba(59,130,246,0.22), 0 2px 12px 0 rgba(13,148,136,0.10); border:none; border-radius:1.5rem;">
            <img alt="${laptop.name}" class="h-36 mx-auto mb-4" src="${laptop.image}" style="object-fit:contain;"/>
            <h3 class="text-2xl font-bold mb-2" style="color:#fff; letter-spacing:0.02em; text-shadow:0 2px 12px rgba(0,0,0,0.22); font-family:'Poppins',sans-serif;">${laptop.name}</h3>
            <p class="crystal-card-desc mb-2" style="font-size:1.12rem; color:#b5e3ff; text-shadow:0 1px 8px rgba(0,0,0,0.18); font-family:'Poppins',sans-serif;">${laptop.description}</p>
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
      // Make proteins a horizontal slider like smartphones
      container.classList.remove('grid', 'grid-cols-1', 'sm:grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4', 'gap-8');
      container.classList.add('flex', 'overflow-x-auto', 'space-x-8', 'scrollbar-hide', 'px-8', 'py-2', 'snap-x', 'snap-mandatory');
      // Add slider buttons if not present
      if (!document.getElementById('protein-slider-left')) {
        const parent = container.parentElement;
        const leftBtn = document.createElement('button');
        leftBtn.id = 'protein-slider-left';
        leftBtn.className = 'absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-40 hover:bg-opacity-70 text-blue-600 rounded-full p-2 shadow-lg';
        leftBtn.style.backdropFilter = 'blur(8px)';
        leftBtn.innerHTML = '<i class="material-icons">chevron_left</i>';
        const rightBtn = document.createElement('button');
        rightBtn.id = 'protein-slider-right';
        rightBtn.className = 'absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-40 hover:bg-opacity-70 text-blue-600 rounded-full p-2 shadow-lg';
        rightBtn.style.backdropFilter = 'blur(8px)';
        rightBtn.innerHTML = '<i class="material-icons">chevron_right</i>';
        parent.style.position = 'relative';
        parent.appendChild(leftBtn);
        parent.appendChild(rightBtn);
        leftBtn.addEventListener('click', () => {
          container.scrollBy({ left: -container.offsetWidth * 0.8, behavior: 'smooth' });
        });
        rightBtn.addEventListener('click', () => {
          container.scrollBy({ left: container.offsetWidth * 0.8, behavior: 'smooth' });
        });
      }
      proteins.forEach(protein => {
        let html = `<a href="${protein.productLink}" target="_blank" rel="noopener" style="text-decoration:none;">
          <div class="crystal-card flex-shrink-0 p-5 text-center flex flex-col justify-between transform hover:-translate-y-2 transition duration-300 cursor-pointer card-animate"
            style="width:370px; height:370px; margin:0 12px; background:rgba(255,255,255,0.16); backdrop-filter:blur(18px); box-shadow:0 10px 40px 0 rgba(59,130,246,0.22), 0 2px 12px 0 rgba(13,148,136,0.10); border:none; border-radius:1.5rem;">
            <img alt="${protein.name}" class="h-36 mx-auto mb-4" src="${protein.image}" style="object-fit:contain;"/>
            <h3 class="text-2xl font-bold mb-2" style="color:#fff; letter-spacing:0.02em; text-shadow:0 2px 12px rgba(0,0,0,0.22); font-family:'Poppins',sans-serif;">${protein.name}</h3>
            <p class="crystal-card-desc mb-2" style="font-size:1.12rem; color:#b5e3ff; text-shadow:0 1px 8px rgba(0,0,0,0.18); font-family:'Poppins',sans-serif;">${protein.description}</p>
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
