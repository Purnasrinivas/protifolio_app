document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            const currentActiveSection = document.querySelector('.page-section.active');
            const currentActiveLink = document.querySelector('.nav-link.active');

            if (currentActiveSection.id === targetId) {
                // Do nothing if the clicked section is already active
                return;
            }

            // Remove active class from current link and add to new one
            currentActiveLink.classList.remove('active');
            link.classList.add('active');

            // Animate out the current section
            currentActiveSection.classList.add('is-exiting');

            // Wait for the exit animation to complete
            currentActiveSection.addEventListener('animationend', () => {
                currentActiveSection.classList.remove('active');
                currentActiveSection.classList.remove('is-exiting');

                // Animate in the new section
                targetSection.classList.add('active');
            }, { once: true }); // Important: Use 'once' to auto-remove the listener
        });
    });
});
// --- Scroll-driven animation for the Home page ---

const imageElement = document.getElementById('home-image');
const headlines = document.querySelectorAll('.headline-group');

// An array of the images you added to your assets/images folder
const images = [
    'assets/images/purna-photo-1.jpg',
    'assets/images/purna-photo-2.jpg',
    'assets/images/purna-photo-3.jpg'
];

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5 // Trigger when 50% of the headline is visible
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Find the index of the intersecting headline
            const headlineIndex = Array.from(headlines).indexOf(entry.target);
            
            // Fade out the old image
            imageElement.style.opacity = 0;

            // Wait for the fade out, then change source and fade in
            setTimeout(() => {
                imageElement.src = images[headlineIndex];
                imageElement.style.opacity = 1;
            }, 400); // This delay should match the CSS transition time
        }
    });
}, observerOptions);

// Observe each headline element
headlines.forEach(headline => {
    observer.observe(headline);
});
// --- Scroll-triggered animations for Beyond 9-5 page ---

const animatedElements = document.querySelectorAll('.animate-on-scroll');

const scrollObserverOptions = {
    root: null,
    threshold: 0.3 // Trigger when 30% of the element is visible
};

const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Remove the 'hidden' classes and add 'visible' to trigger animation
            entry.target.classList.remove('hidden-left', 'hidden-right');
            entry.target.classList.add('visible');
            
            // Stop observing the element once it has been animated
            observer.unobserve(entry.target);
        }
    });
}, scrollObserverOptions);

animatedElements.forEach(el => scrollObserver.observe(el));

// --- Home page scroll transition from Image to Text ---

const scrollTrigger = document.getElementById('scroll-trigger');
const homeImage = document.getElementById('home-image');
const homeSummaryText = document.getElementById('home-summary-text');
const cvButton = document.getElementById('cv-button');
const cvNavLink = document.querySelector('a[href="#cv"]');

const heroObserverOptions = {
    root: null,
    threshold: 0.1 // Trigger when 10% of the trigger is visible
};

const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // When the trigger div scrolls INTO view
        if (entry.isIntersecting) {
            homeImage.classList.add('fade-out');
            homeSummaryText.classList.add('visible');
        } 
        // When the trigger div scrolls BACK OUT of view
        else {
            homeImage.classList.remove('fade-out');
            homeSummaryText.classList.remove('visible');
        }
    });
}, heroObserverOptions);

// Start observing the trigger
if (scrollTrigger) {
    heroObserver.observe(scrollTrigger);
}

// Make the new CV button switch to the CV page
if (cvButton && cvNavLink) {
    cvButton.addEventListener('click', (e) => {
        e.preventDefault();
        // Programmatically click the main CV nav link to trigger our existing page transition
        cvNavLink.click();
    });
}