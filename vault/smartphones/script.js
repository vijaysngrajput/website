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
