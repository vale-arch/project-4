document.addEventListener('DOMContentLoaded', function() {
    // Select all dropdown list items in the main navigation
    const dropdowns = document.querySelectorAll('.main-nav .dropdown');

    dropdowns.forEach(dropdown => {
        // The link that toggles the menu is the direct child 'a' of the 'li.dropdown'
        const toggle = dropdown.querySelector('a');
        const menu = dropdown.querySelector('.dropdown-menu');

        // Check if any link inside this dropdown is the active page, and open it by default
        if (menu.querySelector('a.active')) {
            dropdown.classList.add('open');
            menu.style.maxHeight = menu.scrollHeight + 'px';
        }

        // Add the click event listener to the toggle link
        toggle.addEventListener('click', function(event) {
            // Prevent default link behavior only if it's a '#' link
            if (toggle.getAttribute('href') === '#') {
                event.preventDefault();
            }

            // Toggle the 'open' class on the parent <li>
            dropdown.classList.toggle('open');

            // Animate the dropdown menu by toggling its max-height
            if (dropdown.classList.contains('open')) {
                menu.style.maxHeight = menu.scrollHeight + 'px';
            } else {
                menu.style.maxHeight = '0';
            }
        });
    });

    // --- Mobile Navigation Toggle ---
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const overlay = document.querySelector('.overlay');

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            document.body.classList.toggle('sidebar-open');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            document.body.classList.remove('sidebar-open');
        });
    }

    // --- Back to Top Button Logic ---
    const backToTopButton = document.getElementById('back-to-top-btn');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            // Show button after scrolling down 200px
            if (window.scrollY > 200) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Theme Toggle Logic ---
    const themeToggleButton = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Function to apply the theme to the HTML element
    const applyTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
    };

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
            // Save the user's preference
            localStorage.setItem('theme', newTheme);
        });
    }

    // On page load, apply the saved theme or the user's system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(initialTheme);
});