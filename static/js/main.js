// ============================================
// YAMAHA MOTORCYCLES - MAIN JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    // ============================================
    // MOBILE MENU TOGGLE
    // ============================================
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', function () {
            navbarMenu.classList.toggle('active');

            // Toggle icon
            const icon = this.querySelector('i') || this;
            if (navbarMenu.classList.contains('active')) {
                icon.textContent = '✕';
            } else {
                icon.textContent = '☰';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (event) {
            if (!event.target.closest('.navbar-main')) {
                navbarMenu.classList.remove('active');
                if (navbarToggle.querySelector('i')) {
                    navbarToggle.querySelector('i').textContent = '☰';
                }
            }
        });
    }

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animation class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        window.addEventListener('scroll', function () {
            const currentScroll = window.pageYOffset;

            // Add shadow when scrolled
            if (currentScroll > 10) {
                navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.2)';
            } else {
                navbar.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
            }

            lastScroll = currentScroll;
        });
    }

    // ============================================
    // LAZY LOADING IMAGES
    // ============================================
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });

    // ============================================
    // CARD HOVER EFFECTS
    // ============================================
    const cards = document.querySelectorAll('.motorcycle-card, .category-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // ============================================
    // WHATSAPP BUTTON
    // ============================================
    const whatsappButton = document.querySelector('.whatsapp-float');

    if (whatsappButton) {
        // Show/hide based on scroll position
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 300) {
                whatsappButton.style.opacity = '1';
                whatsappButton.style.visibility = 'visible';
            } else {
                whatsappButton.style.opacity = '0';
                whatsappButton.style.visibility = 'hidden';
            }
        });

        // Initial state
        if (window.pageYOffset <= 300) {
            whatsappButton.style.opacity = '0';
            whatsappButton.style.visibility = 'hidden';
        }
    }

    // ============================================
    // SEARCH FUNCTIONALITY (if needed)
    // ============================================
    const searchInput = document.querySelector('.search-input');

    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            const searchTerm = e.target.value.toLowerCase();
            const motorcycleCards = document.querySelectorAll('.motorcycle-card');

            motorcycleCards.forEach(card => {
                const title = card.querySelector('.motorcycle-card-title').textContent.toLowerCase();
                if (title.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // ============================================
    // PERFORMANCE: Reduce animations on low-end devices
    // ============================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches) {
        document.querySelectorAll('.fade-in-up, .fade-in-up-delay-1, .fade-in-up-delay-2').forEach(el => {
            el.style.animation = 'none';
            el.style.opacity = '1';
        });
    }

    // ============================================
    // LOG INITIALIZATION
    // ============================================
    console.log('🏍️ Yamaha Motorcycles - Website Initialized');
});
