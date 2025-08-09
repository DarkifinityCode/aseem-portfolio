// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector("nav ul");

    menuToggle?.addEventListener("click", () => {
        navLinks.classList.toggle("show");
    });
});
