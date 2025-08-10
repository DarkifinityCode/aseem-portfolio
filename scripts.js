document.addEventListener("DOMContentLoaded", function() {
  /* --------------------
     Mobile menu toggle
     -------------------- */
  const menuToggle = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');

      // prevent horizontal jump on some phones
      if (navLinks.classList.contains('active')) {
        document.body.style.overflowX = 'hidden';
      } else {
        document.body.style.overflowX = '';
      }
    });

    // accessible toggle via Enter/Space
    menuToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        menuToggle.click();
      }
    });
  }

  /* --------------------
     Lightbox (certificates)
     -------------------- */
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
      const full = t.dataset.full || (t.querySelector('img') && t.querySelector('img').src);
      const title = t.dataset.title || (t.querySelector('img') && t.querySelector('img').alt) || '';
      if (full) openLightbox(full, title);
    });
    t.addEventListener('keypress', (e) => { if (e.key === 'Enter') t.click(); });
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  /* --------------------
     Robust Active Nav Logic — single active only
     -------------------- */
  (function markActiveNav() {
    const anchors = document.querySelectorAll('.nav-links a');
    if (!anchors || anchors.length === 0) return;

    // helper: get current page and hash
    const rawPath = window.location.pathname.split('/').pop() || 'index.html';
    const currentPage = rawPath;
    const currentHash = window.location.hash || '';

    // remove existing
    anchors.forEach(a => a.classList.remove('active'));

    // find best match: exact page+hash > page-only > index as fallback
    let matched = null;

    anchors.forEach(a => {
      const href = a.getAttribute('href') || '';
      // normalize
      // Cases:
      //  - "#about" (anchor-only)
      //  - "index.html#about"
      //  - "index.html"
      //  - "projects.html"
      let hrefPath = '';
      let hrefHash = '';

      if (href.startsWith('#')) {
        hrefHash = href;
      } else if (href.includes('#')) {
        const parts = href.split('#');
        hrefPath = parts[0];
        hrefHash = '#' + parts[1];
      } else {
        hrefPath = href;
      }

      // match priority:
      // 1) if hrefPath equals currentPage and hrefHash equals currentHash -> perfect
      if (hrefPath && hrefPath === currentPage && hrefHash && hrefHash === currentHash) {
        matched = a;
      }
    });

    if (!matched) {
      // second pass: page-only match (no hash required)
      anchors.forEach(a => {
        if (matched) return;
        const href = a.getAttribute('href') || '';
        if (!href) return;
        if (href.startsWith('#')) return; // skip anchor-only in this pass
        const hrefPath = href.split('#')[0];
        if (hrefPath === currentPage) matched = a;
        // special: if currentPage is '' or 'index.html', consider index link
        if (!currentPage || currentPage === 'index.html') {
          if (hrefPath === 'index.html' || hrefPath === '' || hrefPath === './' ) matched = a;
        }
      });
    }

    if (!matched) {
      // third pass: anchor-only that matches currentHash when on index
      if (currentHash) {
        anchors.forEach(a => {
          if (matched) return;
          const href = a.getAttribute('href') || '';
          if (href === currentHash) matched = a;
        });
      }
    }

    // fallback: if still nothing, mark the index/home link (if present)
    if (!matched) {
      anchors.forEach(a => {
        const href = a.getAttribute('href') || '';
        if (href === 'index.html' || href === '' || href === './') matched = a;
      });
    }

    if (matched) {
      anchors.forEach(a => a.classList.remove('active'));
      matched.classList.add('active');
    }
  })();

  /* --------------------
     Close mobile nav when clicking a nav link (good UX)
     -------------------- */
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        document.body.style.overflowX = '';
      }
    });
  });

  /* --------------------
     Page fade-in on load (added)
     -------------------- */
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });

  /* --------------------
     Section fade-in on scroll (added)
     -------------------- */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate once
      }
    });
  });

  document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
  });

});


