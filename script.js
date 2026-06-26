'use strict';

/*
  Animation layer — GSAP skills applied:
  ─────────────────────────────────────────────────────
  gsap-core:          gsap.from(), gsap.fromTo(), stagger, ease, defaults
  gsap-timeline:      gsap.timeline() with position parameter for hero entrance
  gsap-scrolltrigger: ScrollTrigger.create(), scroll-linked reveals, once: true
  gsap-plugins:       gsap.registerPlugin(ScrollTrigger)
  gsap-performance:   transform + opacity only; will-change on .char
  gsap-utils:         gsap.utils.toArray() for batching scroll reveals
  gsap-core:          gsap.matchMedia() for reduced-motion gate
*/

gsap.registerPlugin(ScrollTrigger);

/* ── Reduced-motion gate ─────────────────────────────── */
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  initHero();
  initScrollReveals();
});

mm.add('(prefers-reduced-motion: reduce)', () => {
  gsap.set(
    '.hero-eyebrow, .hero-sub, .hero-actions, [data-reveal]',
    { opacity: 1, y: 0, clearProps: 'transform' }
  );
});

/* ═══════════════════════════════════════════════════════
   HERO ENTRANCE — gsap.timeline()
   ═══════════════════════════════════════════════════════ */
function initHero() {
  /* Set initial hidden state at runtime so elements show if GSAP CDN fails */
  gsap.set('.hero-eyebrow, .hero-sub, .hero-actions', { opacity: 0 });

  /* Split name into individual char spans */
  document.querySelectorAll('.name-line').forEach(line => {
    line.innerHTML = [...line.textContent]
      .map(ch => `<span class="char">${ch === ' ' ? '&nbsp;' : ch}</span>`)
      .join('');
  });

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    delay: 0.1,
  });

  tl.fromTo('.hero-eyebrow',
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.55 }
  )
  .fromTo('.hero-name .char',
    { opacity: 0, y: '100%' },
    { opacity: 1, y: '0%', stagger: 0.026, duration: 0.7 },
    '-=0.25'
  )
  .fromTo('.hero-sub',
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.5 },
    '-=0.2'
  )
  .fromTo('.hero-actions',
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.45 },
    '-=0.25'
  );
}

/* ═══════════════════════════════════════════════════════
   SCROLL REVEALS — ScrollTrigger
   ═══════════════════════════════════════════════════════ */
function initScrollReveals() {
  gsap.utils.toArray('[data-reveal]').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: 'power2.out',
        delay: (i % 3) * 0.08,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
      }
    );
  });
}

/* ═══════════════════════════════════════════════════════
   NAV — scroll shadow + active link tracking
   ═══════════════════════════════════════════════════════ */
(function initNav() {
  const nav = document.getElementById('nav');

  ScrollTrigger.create({
    start: 'top -1',
    onEnter:     () => nav.classList.add('scrolled'),
    onLeaveBack: () => nav.classList.remove('scrolled'),
  });

  const links = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  function setActive(id) {
    links.forEach(a =>
      a.classList.toggle('active', a.getAttribute('href') === `#${id}`)
    );
  }

  document.querySelectorAll('section[id]').forEach(sec => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 55%',
      end:   'bottom 55%',
      onEnter:     () => setActive(sec.id),
      onEnterBack: () => setActive(sec.id),
    });
  });
})();

/* ═══════════════════════════════════════════════════════
   SMOOTH SCROLL — offset for fixed nav
   ═══════════════════════════════════════════════════════ */
(function initSmoothScroll() {
  const navH = document.getElementById('nav').offsetHeight;

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: target.offsetTop - navH - 8,
        behavior: 'smooth',
      });
    });
  });
})();
