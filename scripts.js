document.addEventListener("DOMContentLoaded", function() {

  /* --------------------
     Helper selectors
     -------------------- */

  // support both classes/markup variants: ".nav-links" or "nav ul"
  const navMenu = document.querySelector('.nav-links') || document.querySelector('nav ul');
  const menuToggle = document.querySelector('.hamburger') || document.querySelector('.menu-toggle');

  /* --------------------
     Mobile menu toggle + accessibility
     -------------------- */
  if (menuToggle && navMenu) {
    // initialize aria attribute
    menuToggle.setAttribute('role', 'button');
    menuToggle.setAttribute('tabindex', '0');
    menuToggle.setAttribute('aria-expanded', 'false');

    const toggleMenu = () => {
      const isOpen = navMenu.classList.toggle('active') || navMenu.classList.toggle('show');
      const expanded = navMenu.classList.contains('active') || navMenu.classList.contains('show');
      menuToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');

      if (expanded) {
        document.body.style.overflowX = 'hidden';
      } else {
        document.body.style.overflowX = '';
      }
    };

    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleMenu();
    });

    menuToggle.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
      }
    });

    document.addEventListener('click', function(e) {
      const open = navMenu.classList.contains('active') || navMenu.classList.contains('show');
      if (!open) return;
      const clickedInsideMenu = navMenu.contains(e.target) || menuToggle.contains(e.target);
      if (!clickedInsideMenu) {
        navMenu.classList.remove('active');
        navMenu.classList.remove('show');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflowX = '';
      }
    });
  }

  /* --------------------
     Lightbox (certificates)
     -------------------- */
  let lightbox = document.getElementById('lightbox');

  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox hidden';
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close">✕</button>
        <img src="" alt="">
        <div class="lightbox-caption"></div>
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const lbImg = lightbox.querySelector('img');
  const lbCaption = lightbox.querySelector('.lightbox-caption');
  const lbClose = lightbox.querySelector('.lightbox-close');

  function openLightbox(src, title) {
    if (!lightbox || !lbImg) return;
    lbImg.src = src;
    lbCaption.textContent = title || '';
    lightbox.classList.remove('hidden');
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    if (lbClose) lbClose.focus();
  }

  function closeLightbox() {
    if (!lightbox || !lbImg) return;
    lightbox.classList.add('hidden');
    lightbox.style.display = 'none';
    lbImg.src = '';
    lbCaption.textContent = '';
    document.body.style.overflow = '';
  }

  const thumbWrappers = document.querySelectorAll('.cert-thumb');
  thumbWrappers.forEach(wrapper => {
    wrapper.addEventListener('click', () => {
      const full = wrapper.dataset.full || (wrapper.querySelector('img') && wrapper.querySelector('img').src);
      const title = wrapper.dataset.title || (wrapper.querySelector('img') && wrapper.querySelector('img').alt) || '';
      if (full) openLightbox(full, title);
    });
    wrapper.addEventListener('keypress', (e) => { if (e.key === 'Enter') wrapper.click(); });
  });

  const gridImages = document.querySelectorAll('.certificate-grid img, .certificates-grid img, .cert-grid img, .cert-grid .cert-thumb img');
  gridImages.forEach(img => {
    img.addEventListener('click', (e) => {
      const src = img.dataset.full || img.dataset.src || img.getAttribute('data-full') || img.src;
      const title = img.alt || img.dataset.title || '';
      if (src) openLightbox(src, title);
    });
    img.addEventListener('keypress', (e) => { if (e.key === 'Enter') img.click(); });
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  /* --------------------
     Robust Active Nav Logic
     -------------------- */
  (function markActiveNav() {
    const anchors = document.querySelectorAll('.nav-links a, nav ul li a');
    if (!anchors || anchors.length === 0) return;

    const rawPath = window.location.pathname.split('/').pop() || 'index.html';
    const currentPage = rawPath;
    const currentHash = window.location.hash || '';

    anchors.forEach(a => a.classList.remove('active'));

    let matched = null;

    anchors.forEach(a => {
      const href = a.getAttribute('href') || '';
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

      if (hrefPath && hrefPath === currentPage && hrefHash && hrefHash === currentHash) {
        matched = a;
      }
    });

    if (!matched) {
      anchors.forEach(a => {
        if (matched) return;
        const href = a.getAttribute('href') || '';
        if (!href) return;
        if (href.startsWith('#')) return;
        const hrefPath = href.split('#')[0];
        if (hrefPath === currentPage) matched = a;
        if (!currentPage || currentPage === 'index.html') {
          if (hrefPath === 'index.html' || hrefPath === '' || hrefPath === './') matched = a;
        }
      });
    }

    if (!matched && currentHash) {
      anchors.forEach(a => {
        if (matched) return;
        const href = a.getAttribute('href') || '';
        if (href === currentHash) matched = a;
      });
    }

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
     Close mobile nav on nav link click
     -------------------- */
  const navAnchors = document.querySelectorAll('.nav-links a, nav ul li a');
  navAnchors.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu && (navMenu.classList.contains('active') || navMenu.classList.contains('show'))) {
        navMenu.classList.remove('active');
        navMenu.classList.remove('show');
        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflowX = '';
      }
    });
  });

  /* --------------------
     Page loaded flag
     -------------------- */
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });

  /* --------------------
     Section fade-in on scroll
     -------------------- */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});

  document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
  });

  /* ========================================================
     THEME TOGGLE — Manual override + Sunset/Moonrise animation
     ======================================================== */
  const htmlEl = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const saved = localStorage.getItem('theme');

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      themeBtn.dataset.theme = theme;
    }
  }

  function animateToggle(toTheme) {
    if (!themeBtn) return;
    themeBtn.classList.remove('to-dark','to-light');
    themeBtn.offsetWidth; // reflow
    themeBtn.classList.add(toTheme === 'dark' ? 'to-dark' : 'to-light');
    const cleanup = () => {
      themeBtn.classList.remove('to-dark','to-light');
      themeBtn.removeEventListener('animationend', cleanup);
    };
    themeBtn.addEventListener('animationend', cleanup);
  }

  const initial = saved ? saved : (prefersDark.matches ? 'dark' : 'light');
  applyTheme(initial);

  prefersDark.addEventListener('change', (e) => {
    if (localStorage.getItem('theme')) return;
    const next = e.matches ? 'dark' : 'light';
    animateToggle(next);
    applyTheme(next);
  });

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      animateToggle(next);
      applyTheme(next);
      localStorage.setItem('theme', next);
    });

    themeBtn.addEventListener('click', (e) => {
      if (e.shiftKey) {
        localStorage.removeItem('theme');
      }
    }, { capture: true });
  }

}); // DOMContentLoaded end
