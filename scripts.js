// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('show');
});

// Active Nav Link Handling
const navItems = document.querySelectorAll('.nav-links a');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(link => link.classList.remove('active'));
        item.classList.add('active');
        navLinks.classList.remove('show'); // Close menu on mobile after click
    });
});
