document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        const toggleMenu = () => {
            // Block opening on desktop widths
            if (window.innerWidth >= 768) {
                mobileMenu.classList.add('hidden');
                return;
            }
            mobileMenu.classList.toggle('hidden');
        };
        mobileMenuButton.addEventListener('click', toggleMenu);
        // Auto-close when resizing to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
});
