document.addEventListener("DOMContentLoaded", function() {
  // hamburger toggle (mobile)
  const menuToggle = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
    // accessibility: toggle on Enter key
    menuToggle.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') navLinks.classList.toggle('active');
    });
  }

  // Lightbox for certificates (if present)
  const thumbs = document.querySelectorAll('.cert-thumb');
  const lightbox = document.getElementById('lightbox');
  const lbImg = lightbox && lightbox.querySelector('img');
  const lbCaption = lightbox && lightbox.querySelector('.lightbox-caption');
  const lbClose = lightbox && lightbox.querySelector('.lightbox-close');

  function openLightbox(src, title) {
    if (!lightbox || !lbImg) return;
    lbImg.src = src;
    lbCaption.textContent = title || '';
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lightbox || !lbImg) return;
    lightbox.classList.add('hidden');
    lbImg.src = '';
    lbCaption.textContent = '';
    document.body.style.overflow = '';
  }

  thumbs.forEach(t => {
    t.addEventListener('click', () => {
      const full = t.dataset.full || t.querySelector('img').src;
      const title = t.dataset.title || t.querySelector('img').alt || '';
      openLightbox(full, title);
    });
    t.addEventListener('keypress', (e) => { if (e.key === 'Enter') t.click(); });
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  // mark active link (simple)
  const navAnchors = document.querySelectorAll('.nav-links a');
  navAnchors.forEach(a => {
    try {
      const href = a.getAttribute('href');
      if (href && (location.pathname.endsWith(href) || (href.includes('#') && location.pathname.endsWith('index.html')))) {
        a.classList.add('active');
      }
    } catch (e) { /* ignore */ }
  });
});


