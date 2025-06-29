// --- Preloader Logic ---
document.body.classList.add('is-loading');

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    
    setTimeout(() => {
        // First, hide the preloader
        if (preloader) {
            preloader.classList.add('hidden');
        }
        // Then, reveal the main content
        document.body.classList.remove('is-loading');

        // THEN, AND ONLY THEN, INITIALIZE THE TYPEWRITER ANIMATION
        initializeHomepageAnimations();

    }, 5000); // 5 seconds
});


// --- Main Application Logic ---
document.addEventListener('DOMContentLoaded', () => {

    // --- Page Section Transitions (Home, Work, etc.) ---
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            const currentActiveSection = document.querySelector('.page-section.active');
            const currentActiveLink = document.querySelector('.nav-link.active');

            if (currentActiveSection.id === targetId) return;

            if (currentActiveLink) currentActiveLink.classList.remove('active');
            link.classList.add('active');

            currentActiveSection.classList.add('is-exiting');
            currentActiveSection.addEventListener('animationend', () => {
                currentActiveSection.classList.remove('active', 'is-exiting');
                targetSection.classList.add('active');
            }, { once: true });
        });
    });

    // --- Beyond 9-5: Slide-in animations on scroll ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('hidden-left', 'hidden-right');
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        animatedElements.forEach(el => scrollObserver.observe(el));
    }
});


// --- All Homepage Animations Are Now In This Function ---
function initializeHomepageAnimations() {
    // --- Home page: Image-to-Text Scroll Transition ---
    const homeImage = document.getElementById('home-image');
    const homeSummaryText = document.getElementById('home-summary-text');
    const scrollTrigger = document.getElementById('scroll-trigger');

    if (homeImage && homeSummaryText && scrollTrigger) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    homeImage.classList.add('fade-out');
                    homeSummaryText.classList.add('visible');
                } else {
                    homeImage.classList.remove('fade-out');
                    homeSummaryText.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });
        heroObserver.observe(scrollTrigger);
    }

    // --- Home page: Typewriter effect for headlines (HTML-Aware Version) ---
    const headlineGroups = document.querySelectorAll('.headline-group');
    const TYPE_SPEED_MS = 120;

    if (headlineGroups.length > 0) {
        const typewriterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const h2 = entry.target.querySelector('h2');
                    if (!h2 || h2.dataset.typed === 'true') return;

                    const originalHTML = h2.dataset.originalHTML;
                    const parts = originalHTML.match(/<[^>]+>|[^<>\s]+/g) || [];

                    h2.innerHTML = '';
                    h2.dataset.typed = 'true';
                    let partIndex = 0;

                    const typingInterval = setInterval(() => {
                        if (partIndex < parts.length) {
                            const part = parts[partIndex];
                            if (!part.startsWith('<')) {
                                h2.innerHTML += (h2.innerHTML === '' ? '' : ' ');
                            }
                            h2.innerHTML += part;
                            partIndex++;
                        } else {
                            clearInterval(typingInterval);
                        }
                    }, TYPE_SPEED_MS);

                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });

        headlineGroups.forEach(group => {
            const h2 = group.querySelector('h2');
            if (h2) {
                h2.dataset.originalHTML = h2.innerHTML;
                h2.innerHTML = '';
                typewriterObserver.observe(group);
            }
        });
    }
}