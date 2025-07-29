/**
 * Throttles a function to limit how often it can be called.
 * @param {Function} func The function to throttle.
 * @param {number} limit The throttle limit in milliseconds.
 * @returns {Function} The throttled function.
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Initializes the dropdown menus in the main navigation.
 */
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.main-nav .dropdown');
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('a');
        const menu = dropdown.querySelector('.dropdown-menu');

        // Open dropdown by default if it contains the active link
        if (menu && menu.querySelector('a.active')) {
            dropdown.classList.add('open');
            menu.style.maxHeight = menu.scrollHeight + 'px';
        }

        // Add click listener to toggle the dropdown
        if (toggle && menu) {
            toggle.addEventListener('click', function(event) {
                if (toggle.getAttribute('href') === '#') {
                    event.preventDefault();
                }
                
                const isOpen = dropdown.classList.toggle('open');
                menu.style.maxHeight = isOpen ? menu.scrollHeight + 'px' : '0';
            });
        }
    });
}

/**
 * Initializes the mobile navigation toggle and overlay.
 */
function initMobileNav() {
    const navToggle = document.getElementById('mobile-nav-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.overlay');

    if (!navToggle || !sidebar || !overlay) return;

    const focusableElements = sidebar.querySelectorAll('a[href]:not([disabled]), button:not([disabled])');
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    const openSidebar = () => {
        document.body.classList.add('sidebar-open');
        navToggle.setAttribute('aria-expanded', 'true');
        firstFocusableElement.focus();
        document.addEventListener('keydown', handleKeyDown);
    };

    const closeSidebar = () => {
        document.body.classList.remove('sidebar-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
        document.removeEventListener('keydown', handleKeyDown);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            closeSidebar();
            return;
        }

        if (event.key === 'Tab') {
            // Trap focus within the sidebar
            if (event.shiftKey) { // Shift + Tab
                if (document.activeElement === firstFocusableElement) {
                    event.preventDefault();
                    lastFocusableElement.focus();
                }
            } else { // Tab
                if (document.activeElement === lastFocusableElement) {
                    event.preventDefault();
                    firstFocusableElement.focus();
                }
            }
        }
    };

    navToggle.addEventListener('click', () => {
        const isSidebarOpen = document.body.classList.contains('sidebar-open');
        isSidebarOpen ? closeSidebar() : openSidebar();
    });

    overlay.addEventListener('click', closeSidebar);
}

/**
 * Initializes the "Back to Top" button functionality.
 */
function initBackToTopButton() {
    const backToTopButton = document.getElementById('back-to-top-btn');
    if (!backToTopButton) return;

    const handleScroll = () => {
        if (window.scrollY > 200) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    };

    window.addEventListener('scroll', throttle(handleScroll, 200));

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Initializes the theme toggle functionality.
 */
function initThemeToggle() {
    const themeToggleButton = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    const applyTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
    };

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Set initial theme based on saved preference or system setting
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(initialTheme);
}

/**
 * Initializes animations for metric cards on data pages.
 * Cards will fade in and slide up when they enter the viewport.
 */
function initMetricCardAnimations() {
    const metricCards = document.querySelectorAll('.metric-card');
    if (metricCards.length === 0) return;

    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the card is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    metricCards.forEach(card => observer.observe(card));
}

/**
 * Initializes the contact form with client-side validation and success message.
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const successMessage = document.getElementById('form-success-message');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        form.classList.add('form-submitted');

        // The browser's built-in checkValidity will trigger UI hints for invalid fields
        if (!form.checkValidity()) {
            // Find the first invalid element and focus it for accessibility
            const firstInvalidField = form.querySelector(':invalid');
            if (firstInvalidField) {
                firstInvalidField.focus();
            }
            return;
        }

        // If the form is valid, show the success message.
        // In a real app, you would send the data to a server here.
        form.style.display = 'none';
        successMessage.style.display = 'block';
    });
}

/**
 * Initializes the collapsible desktop sidebar functionality.
 */
function initDesktopSidebarToggle() {
    const toggleButton = document.getElementById('desktop-sidebar-toggle');
    if (!toggleButton) return;

    const body = document.body;
    const sidebarStateKey = 'sidebarState';

    // Apply saved state on page load
    const savedState = localStorage.getItem(sidebarStateKey);
    if (savedState === 'collapsed') {
        body.classList.add('sidebar-collapsed');
    }

    // Handle toggle button click
    toggleButton.addEventListener('click', () => {
        body.classList.toggle('sidebar-collapsed');
        // Save the new state
        if (body.classList.contains('sidebar-collapsed')) {
            localStorage.setItem(sidebarStateKey, 'collapsed');
        } else {
            localStorage.setItem(sidebarStateKey, 'expanded');
        }
    });
}

/**
 * Initializes the newsletter signup form with validation and success message.
 */
function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    const successMessage = document.getElementById('newsletter-success-message');
    const formContainer = document.getElementById('newsletter'); // The parent section

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        formContainer.classList.add('form-submitted');

        if (!form.checkValidity()) {
            const firstInvalidField = form.querySelector(':invalid');
            if (firstInvalidField) {
                firstInvalidField.focus();
            }
            return;
        }

        // If valid, hide form and show success message
        form.style.display = 'none';
        successMessage.style.display = 'block';
    });
}

/**
 * Initializes page transition animations for a smoother navigation experience.
 */
function initPageTransitions() {
    const links = document.querySelectorAll('a');

    links.forEach(link => {
        const href = link.getAttribute('href');

        // Check for conditions to NOT apply the transition effect
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank' || link.hasAttribute('download')) {
            return;
        }

        // Robust check for external links
        try {
            const linkUrl = new URL(href, window.location.origin);
            if (linkUrl.hostname !== window.location.hostname) {
                return; // It's an external link, do nothing.
            }
        } catch (e) {
            return; // Invalid URL, ignore.
        }

        link.addEventListener('click', function(event) {
            event.preventDefault();
            document.body.classList.add('fade-out');
            
            setTimeout(() => {
                window.location.href = href;
            }, 400); // Match CSS animation duration
        });
    });
}

// Main execution block
document.addEventListener('DOMContentLoaded', () => {
    initDropdowns();
    initMobileNav();
    initBackToTopButton();
    initThemeToggle();
    initMetricCardAnimations();
    initPageTransitions();
    initContactForm();
    initDesktopSidebarToggle();
    initNewsletterForm();
});

// Handle the back-forward cache (bfcache) to ensure the page is visible
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        document.body.classList.remove('fade-out');
    }
});