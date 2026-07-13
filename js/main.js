/* =====================================================
   RAJA STICKER — Main JavaScript
   ===================================================== */

'use strict';

const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

/* ── PRELOADER ──────────────────────────────────────── */
(function initPreloader() {
  const el = $('#preloader');
  if (!el) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      el.classList.add('done');
      setTimeout(() => el.remove(), 700);
    }, 1600);
  });
})();

/* ── NAVBAR ─────────────────────────────────────────── */
(function initNavbar() {
  const nav     = $('#navbar');
  const links   = $$('.nav-link');
  const sections = $$('section[id]');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);

    // Active link tracking
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── HAMBURGER ──────────────────────────────────────── */
(function initHamburger() {
  const btn     = $('#hamburger');
  const menu    = $('#navLinks');
  const overlay = $('#mobileOverlay');
  if (!btn || !menu) return;

  const close = () => {
    btn.classList.remove('open');
    menu.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
    document.body.style.overflow = '';
  };

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    if (overlay) overlay.classList.toggle('show', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  if (overlay) overlay.addEventListener('click', close);

  $$('.nav-link', menu).forEach(link => {
    link.addEventListener('click', close);
  });
})();

/* ── SMOOTH SCROLL ──────────────────────────────────── */
(function initSmoothScroll() {
  document.addEventListener('click', e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const target = $(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
})();

/* ── SCROLL REVEAL ──────────────────────────────────── */
(function initScrollReveal() {
  const items = $$('.reveal-up, .reveal-left, .reveal-right, .stat-item, .service-card, .process-step, .faq-item, .testi-wrapper, .filter-bar, .port-more, .cta-inner, .about-visual, .about-content, .contact-info, .contact-form-box');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
})();

/* ── ANIMATED COUNTERS ──────────────────────────────── */
(function initCounters() {
  const counters = $$('.stat-number[data-target]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target);
    const duration = 1800;
    const step = 16;
    const increments = Math.ceil(duration / step);
    let count = 0;
    let current = 0;

    const timer = setInterval(() => {
      count++;
      current = Math.round(target * (count / increments));
      el.textContent = current.toLocaleString('id-ID');
      if (count >= increments) {
        el.textContent = target.toLocaleString('id-ID');
        clearInterval(timer);
      }
    }, step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ── PORTFOLIO FILTER ───────────────────────────────── */
(function initPortfolioFilter() {
  const filterBtns = $$('.filter-btn');
  const items      = $$('.port-item');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      items.forEach(item => {
        const match = filter === 'all' || item.dataset.cat === filter;

        if (!match) {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.92)';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        } else {
          item.style.display = '';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = '';
            });
          });
        }
      });
    });
  });

  // apply transition to all items
  items.forEach(item => {
    item.style.transition = 'opacity .3s ease, transform .3s ease';
  });
})();

/* ── LIGHTBOX ───────────────────────────────────────── */
(function initLightbox() {
  const lightbox  = $('#lightbox');
  const lbContent = $('#lbContent');
  const lbClose   = $('#lbClose');
  const backdrop  = $('#lightboxBackdrop');
  if (!lightbox) return;

  const open = (item) => {
    const title = item.querySelector('h4')?.textContent || '';
    const desc  = item.querySelector('p')?.textContent  || '';
    const cat   = item.querySelector('.port-cat-tag')?.textContent || '';
    const imgDiv = item.querySelector('.port-img');
    const bg    = imgDiv?.style.cssText || '';

    lbContent.innerHTML = `
      <div style="width:100%;height:300px;${bg};display:flex;align-items:center;justify-content:center;">
        ${imgDiv?.innerHTML || ''}
      </div>
      <div style="padding:24px 28px 28px">
        <span style="display:inline-block;padding:3px 12px;background:var(--accent);color:#fff;font-size:.72rem;font-weight:700;border-radius:99px;margin-bottom:12px">${cat}</span>
        <h3 style="font-size:1.2rem;font-weight:700;margin-bottom:8px">${title}</h3>
        <p style="font-size:.88rem;color:var(--text-muted)">${desc}</p>
      </div>
    `;

    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  };

  document.addEventListener('click', e => {
    const zoomBtn = e.target.closest('.port-zoom');
    if (zoomBtn) {
      const item = zoomBtn.closest('.port-item');
      if (item) open(item);
    }
  });

  if (lbClose) lbClose.addEventListener('click', close);
  if (backdrop) backdrop.addEventListener('click', close);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
})();

/* ── TESTIMONIALS SLIDER ────────────────────────────── */
(function initTestimonials() {
  const track  = $('#testiTrack');
  const prevBtn = $('#testiPrev');
  const nextBtn = $('#testiNext');
  const dotsWrap = $('#testiDots');
  if (!track) return;

  const cards = $$('.testi-card', track);
  let current = 0;
  let autoTimer = null;

  const getVisible = () => {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 900) return 2;
    return 3;
  };

  const cardWidth = () => {
    const visible = getVisible();
    return (track.parentElement.offsetWidth / visible);
  };

  const maxIndex = () => Math.max(0, cards.length - getVisible());

  const buildDots = () => {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    const count = maxIndex() + 1;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = 'testi-dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  };

  const updateDots = () => {
    $$('.testi-dot', dotsWrap).forEach((d, i) => d.classList.toggle('active', i === current));
  };

  const goTo = (idx) => {
    current = Math.max(0, Math.min(idx, maxIndex()));
    track.style.transform = `translateX(-${current * cardWidth()}px)`;
    updateDots();
  };

  const next = () => goTo(current >= maxIndex() ? 0 : current + 1);
  const prev = () => goTo(current <= 0 ? maxIndex() : current - 1);

  const startAuto = () => { autoTimer = setInterval(next, 5000); };
  const stopAuto  = () => clearInterval(autoTimer);

  if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); next(); startAuto(); });

  // Touch swipe
  let touchX = 0;
  track.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      stopAuto();
      diff > 0 ? next() : prev();
      startAuto();
    }
  });

  // Card sizing
  const sizeCards = () => {
    const w = cardWidth();
    cards.forEach(c => { c.style.flex = `0 0 ${w - 16}px`; });
    goTo(Math.min(current, maxIndex()));
    buildDots();
  };

  sizeCards();
  startAuto();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(sizeCards, 200);
  });
})();

/* ── FAQ ACCORDION ──────────────────────────────────── */
(function initFAQ() {
  const items = $$('.faq-item');

  items.forEach(item => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      items.forEach(i => i.classList.remove('open'));

      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });
})();

/* ── CONTACT FORM ───────────────────────────────────── */
(function initContactForm() {
  const form    = $('#contactForm');
  const submitBtn = $('#formSubmit');
  const success = $('#formSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = form.querySelector('#cname')?.value.trim()    || '';
    const phone   = form.querySelector('#cphone')?.value.trim()   || '';
    const service = form.querySelector('#cservice')?.value        || '';
    const message = form.querySelector('#cmessage')?.value.trim() || '';

    const serviceLabels = {
      'kaca-film': 'Kaca Film',
      'sunblast':  'Sunblast / Sandblast',
      'stiker':    'Stiker Custom',
      'cutting':   'Cutting Stiker',
      '':          'Belum dipilih'
    };

    const text = `Halo Raja Sticker! 👋\n\nSaya ingin konsultasi mengenai layanan Anda.\n\n📋 *Detail:*\n• Nama: ${name}\n• No. HP: ${phone}\n• Layanan: ${serviceLabels[service] || service}\n• Pesan: ${message || '-'}\n\nDitunggu responnya, terima kasih!`;

    const waNumber = '6281234567890';
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;

    // Button loading state
    const btnText    = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    submitBtn.disabled = true;
    if (btnText)    btnText.style.display    = 'none';
    if (btnLoading) btnLoading.style.display = '';

    setTimeout(() => {
      window.open(waUrl, '_blank');

      submitBtn.disabled = false;
      if (btnText)    btnText.style.display    = '';
      if (btnLoading) btnLoading.style.display = 'none';

      if (success) {
        success.style.display = 'flex';
        setTimeout(() => { success.style.display = 'none'; }, 6000);
      }

      form.reset();
    }, 1200);
  });
})();

/* ── BACK TO TOP ────────────────────────────────────── */
(function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ── FOOTER YEAR ────────────────────────────────────── */
(function initFooterYear() {
  const el = $('#footerYear');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ── PORTFOLIO CSS GRADIENT FIX ─────────────────────── */
(function fixPortfolioGradients() {
  $$('.port-img').forEach(el => {
    const style = el.getAttribute('style') || '';
    const match = style.match(/--bg:(.*?)(?:;|$)/);
    if (match) {
      el.style.background = match[1].trim();
    }
  });
})();
