// --- Preloader Logic ---
document.body.classList.add('is-loading');

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('hidden');
        }
        document.body.classList.remove('is-loading');
        
        initializePageAnimations();

    }, 5000); // 5 seconds
});


// --- Main Application Logic ---
document.addEventListener('DOMContentLoaded', () => {

    // --- Theme Toggle Logic (Focused / Playful) ---
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    
    if (localStorage.getItem('theme') === 'playful') {
        document.body.classList.add('playful-mode');
        if (themeToggle) themeToggle.checked = true;
    }

    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                document.body.classList.add('playful-mode');
                localStorage.setItem('theme', 'playful');
            } else {
                document.body.classList.remove('playful-mode');
                localStorage.setItem('theme', 'focused');
            }
        });
    }

    // --- Conditional Particle Splash on all clicks ---
    document.addEventListener('click', function(e) {
        if (document.body.classList.contains('playful-mode')) {
            createParticleExplosion(e.clientX, e.clientY);
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
    
    // --- Scroll Transparency for Header ---
    const siteHeader = document.getElementById('site-header');
    let isScrolling;
    window.addEventListener('scroll', () => {
        if (siteHeader) {
            siteHeader.classList.add('nav-scrolled');
        }
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
            if (window.scrollY < 50) {
                siteHeader.classList.remove('nav-scrolled');
            }
        }, 250);
    }, false);


    // --- Universal Scroll-triggered Animation Logic ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    
    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // --- Gallery Card Carousel Logic ---
    const galleryCards = document.querySelectorAll('.gallery-card');
    galleryCards.forEach(card => {
        const nextBtn = card.querySelector('.next-btn');
        const images = card.querySelectorAll('.gallery-image');
        let currentImageIndex = 0;

        if (nextBtn && images.length > 1) {
            nextBtn.addEventListener('click', () => {
                images[currentImageIndex].classList.remove('active');
                currentImageIndex = (currentImageIndex + 1) % images.length;
                images[currentImageIndex].classList.add('active');
            });
        }
    });

});


// --- All Page Animations Are Now In This Function ---
function initializePageAnimations() {

    // Bouncing Ball Navigation Animation
    const navItems = document.querySelectorAll('.main-nav li');
    if (navItems.length > 0) {
        navItems.forEach(item => {
            item.classList.add('visible');
        });
    }

    // Homepage Typewriter effect for headlines
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
        }, { threshold: 0.8 });

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
