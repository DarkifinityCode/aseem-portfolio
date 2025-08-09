document.addEventListener("DOMContentLoaded", function() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function() {
      navLinks.classList.toggle("show");
    });
  }

  const thumbs = document.querySelectorAll(".cert-thumb");
  const lightbox = document.getElementById("lightbox");
  const lbImg = lightbox && lightbox.querySelector("img");
  const lbCaption = lightbox && lightbox.querySelector(".lightbox-caption");
  const lbClose = lightbox && lightbox.querySelector(".lightbox-close");

  function openLightbox(src, title) {
    if (!lightbox || !lbImg || !lbCaption) return;
    lbImg.src = src;
    lbCaption.textContent = title || "";
    lightbox.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox || !lbImg || !lbCaption) return;
    lightbox.classList.add("hidden");
    lbImg.src = "";
    lbCaption.textContent = "";
    document.body.style.overflow = "";
  }

  thumbs.forEach(function(t) {
    t.addEventListener("click", function() {
      const full = t.dataset.full || t.querySelector("img").src;
      const title = t.dataset.title || t.querySelector("img").alt || "";
      openLightbox(full, title);
    });
    t.addEventListener("keypress", function(e) {
      if (e.key === "Enter") t.click();
    });
  });

  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", function(e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") closeLightbox();
  });

  const navAnchors = document.querySelectorAll(".nav-links a");
  navAnchors.forEach(function(a) {
    try {
      if (location.pathname.endsWith(a.getAttribute("href"))) {
        a.classList.add("active");
      }
    } catch (e) {}
  });
});
