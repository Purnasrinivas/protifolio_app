// --- Preloader Logic ---
document.body.classList.add('is-loading');

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('hidden');
        }
        document.body.classList.remove('is-loading');
        
        initializeHomepageAnimations();

    }, 5000);
});


// --- Main Application Logic ---
document.addEventListener('DOMContentLoaded', () => {

    // --- GRAND FINALE & GLOBAL CLICK EFFECT ---
    const totalLinks = 3; // Work, Beyond 9-5, Contact
    const clickedLinks = new Set();
    let finaleTriggered = false;

    // A single, global click listener for the splash effect
    document.addEventListener('click', (e) => {
        // 1. Always create the particle explosion on any click
        createParticleExplosion(e.clientX, e.clientY);

        // 2. Check if a tracked link was clicked to progress the finale
        const trackedLink = e.target.closest('[data-nav]');
        if (trackedLink && !finaleTriggered) {
            const navId = trackedLink.dataset.nav;
            if (!clickedLinks.has(navId)) {
                clickedLinks.add(navId);
                if (clickedLinks.size >= totalLinks) {
                    finaleTriggered = true;
                    // Add a slight delay for the last splash to be seen
                    setTimeout(() => triggerFinale(), 500);
                }
            }
        }
    });


    function createParticleExplosion(x, y) {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'finale-splash-container';
        document.body.appendChild(particleContainer);

        const PARTICLE_COUNT = 30;
        const colors = ['#FF4136', '#FFDC00', '#0074D9', '#2ECC40', '#F012BE', '#FF851B', '#FFFFFF'];

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const particle = document.createElement('div');
            particle.className = 'color-particle';
            
            const angle = Math.random() * 360;
            const distance = Math.random() * 200 + 80;
            const size = Math.random() * 15 + 5;

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${x - size / 2}px`;
            particle.style.top = `${y - size / 2}px`;
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.setProperty('--x', `${Math.cos(angle * Math.PI / 180) * distance}px`);
            particle.style.setProperty('--y', `${Math.sin(angle * Math.PI / 180) * distance}px`);

            particleContainer.appendChild(particle);
        }

        setTimeout(() => particleContainer.remove(), 1500);
    }

    function triggerFinale() {
        document.body.classList.add('finale');
        
        const finaleMessage = document.createElement('div');
        finaleMessage.id = 'finale-notification';
        finaleMessage.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">😊</div>
                <div class="notification-text">
                    <p class="sender">THANK YOU</p>
                    <p>You’ve just brought this website to life,</p>
                    <p> now let’s see it shine in action!!</p>
                </div>
            </div>
        `;
        document.body.appendChild(finaleMessage);

        setTimeout(() => {
            finaleMessage.classList.add('fade-out');
            setTimeout(() => {
                finaleMessage.remove();
            }, 500);
        }, 5000); 
    }


    // --- Page Section Transitions (this still needs its own listener) ---
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href').substring(1);
            if (!targetId || targetId.includes('.pdf')) return;

            e.preventDefault();
            const targetSection = document.getElementById(targetId);
            const currentActiveSection = document.querySelector('.page-section.active');
            const currentActiveLink = document.querySelector('.nav-link.active');

            if (currentActiveSection && currentActiveSection.id === targetId) return;

            if (currentActiveLink) currentActiveLink.classList.remove('active');
            link.classList.add('active');

            if(currentActiveSection) {
                currentActiveSection.classList.add('is-exiting');
                currentActiveSection.addEventListener('animationend', () => {
                    currentActiveSection.classList.remove('active', 'is-exiting');
                    targetSection.classList.add('active');
                }, { once: true });
            } else {
                 targetSection.classList.add('active');
            }
        });
    });

    // --- Beyond 9-5: Slide-in animations ---
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


// --- Homepage Animations Initialization ---
function initializeHomepageAnimations() {
    // --- Image-to-Text Scroll Transition ---
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

    // --- Typewriter effect for headlines ---
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