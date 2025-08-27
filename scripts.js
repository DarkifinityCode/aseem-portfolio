// ======================================================
// Portfolio Website Script.js
// Handles navigation, theme toggle, animations, and extras
// ======================================================

// -----------------------------
// DOM Ready Handler
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  console.log("Portfolio site loaded successfully.");

  // =============================
  // Variables and Selectors
  // =============================
  const navLinks = document.querySelectorAll(".nav-links a");
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const sun = document.querySelector(".sun");
  const moon = document.querySelector(".moon");
  const stars = document.querySelectorAll(".moon .stars span");
  let currentTheme = localStorage.getItem("theme") || "light";
  let isAnimating = false;

  // =============================
  // Helper Functions
  // =============================
  const setActiveNavLink = () => {
    let currentLocation = window.location.href;
    navLinks.forEach(link => {
      if (currentLocation.includes(link.getAttribute("href"))) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  };

  const applyTheme = (theme) => {
    if (theme === "light") {
      body.classList.remove("dark-theme");
      body.classList.add("light-theme");
      localStorage.setItem("theme", "light");
    } else {
      body.classList.remove("light-theme");
      body.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
    }
  };

  const animateSun = () => {
    return new Promise(resolve => {
      sun.classList.add("rotate");
      setTimeout(() => {
        sun.classList.remove("rotate");
        resolve();
      }, 2000); // duration for 3 rotations
    });
  };

  const animateStars = () => {
    return new Promise(resolve => {
      stars.forEach((star, index) => {
        star.classList.add("blink");
        setTimeout(() => {
          star.classList.remove("blink");
          if (index === stars.length - 1) {
            resolve();
          }
        }, 1500); // 3 blinks per star
      });
    });
  };

  const toggleTheme = async () => {
    if (isAnimating) return; // prevent spamming clicks
    isAnimating = true;

    if (currentTheme === "light") {
      await animateSun();
      applyTheme("dark");
      await animateStars();
      currentTheme = "dark";
    } else {
      await animateStars();
      applyTheme("light");
      await animateSun();
      currentTheme = "light";
    }

    isAnimating = false;
  };

  // =============================
  // Event Listeners
  // =============================
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  themeToggle.addEventListener("click", toggleTheme);

  // Apply theme from localStorage on load
  applyTheme(currentTheme);
  setActiveNavLink();

  // Smooth scroll for anchor links
  navLinks.forEach(link => {
    if (link.getAttribute("href").startsWith("#")) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  });

  // -----------------------------
  // Extra Functionalities
  // -----------------------------

  // Mobile menu toggle
  const hamburger = document.querySelector(".hamburger");
  const navUL = document.querySelector(".nav-links");
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      navUL.classList.toggle("open");
    });
  }

  // Scroll-to-top button
  const scrollTopBtn = document.createElement("button");
  scrollTopBtn.innerText = "↑";
  scrollTopBtn.id = "scrollTopBtn";
  document.body.appendChild(scrollTopBtn);

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      scrollTopBtn.style.display = "block";
    } else {
      scrollTopBtn.style.display = "none";
    }
  });

  // Keyboard accessibility for toggle
  themeToggle.addEventListener("keypress", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      toggleTheme();
    }
  });

  // Lazy load images
  const lazyImages = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        observer.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => {
    imageObserver.observe(img);
  });

  // Typing effect for headings
  const typeEffect = (element, text, speed = 100) => {
    let i = 0;
    function typing() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(typing, speed);
      }
    }
    typing();
  };

  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle && heroTitle.dataset.text) {
    typeEffect(heroTitle, heroTitle.dataset.text, 80);
  }

  // Intersection animations
  const observerOptions = {
    threshold: 0.2
  };

  const animateOnScroll = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  };

  const scrollObserver = new IntersectionObserver(animateOnScroll, observerOptions);
  const hiddenElements = document.querySelectorAll(".hidden");
  hiddenElements.forEach(el => scrollObserver.observe(el));

  // Contact form validation
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      const inputs = contactForm.querySelectorAll("input, textarea");

      inputs.forEach(input => {
        if (input.hasAttribute("required") && !input.value.trim()) {
          valid = false;
          input.classList.add("error");
        } else {
          input.classList.remove("error");
        }
      });

      if (valid) {
        alert("Message sent successfully!");
        contactForm.reset();
      } else {
        alert("Please fill all required fields.");
      }
    });
  }

  // Console Easter Egg
  console.log("%cHey curious developer!", "color:#ff9800; font-size:16px;");
  console.log("%cWelcome to Aseem Shukla's portfolio code 🚀", "color:#9c27b0; font-size:14px;");

  // Theme animation fallback
  window.addEventListener("beforeunload", () => {
    localStorage.setItem("theme", currentTheme);
  });
});

// ======================================================
// End of Script
// ======================================================
