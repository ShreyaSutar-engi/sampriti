'use strict';

/*
  Animation layer — all GSAP skills applied:
  ─────────────────────────────────────────────────────
  gsap-core:          gsap.from(), gsap.fromTo(), stagger, ease, defaults
  gsap-timeline:      gsap.timeline() with position parameter for hero entrance
  gsap-scrolltrigger: ScrollTrigger.create(), scroll-linked reveals, once: true
  gsap-plugins:       gsap.registerPlugin(ScrollTrigger)
  gsap-performance:   transform + opacity only; will-change on .char; no layout reads
  gsap-utils:         gsap.utils.toArray() for batching scroll reveals
  gsap-core:          gsap.matchMedia() for reduced-motion gate
*/

gsap.registerPlugin(ScrollTrigger);

/* ── Reduced-motion gate (gsap-core: gsap.matchMedia) ─ */
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  initHero();
  initScrollReveals();
});

mm.add('(prefers-reduced-motion: reduce)', () => {
  /* Show everything immediately — no animation overhead */
  gsap.set(
    '.hero-eyebrow, .hero-sub, .hero-cta, [data-reveal]',
    { opacity: 1, y: 0, clearProps: 'transform' }
  );
});

/* ═══════════════════════════════════════════════════════
   HERO ENTRANCE — gsap.timeline()
   Position parameter sequences elements with overlap.
   Chars clip-reveal from below (overflow:hidden on .name-line).
   ═══════════════════════════════════════════════════════ */
function initHero() {
  /* Split name into individual char spans (SplitText-style, no plugin needed) */
  document.querySelectorAll('.name-line').forEach(line => {
    line.innerHTML = [...line.textContent]
      .map(ch => `<span class="char">${ch === ' ' ? '&nbsp;' : ch}</span>`)
      .join('');
  });

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    delay: 0.15,
  });

  /* Eyebrow fades in */
  tl.fromTo('.hero-eyebrow',
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.6 }
  )
  /* Name chars rise from below the line (clipped by overflow:hidden) */
  .fromTo('.hero-name .char',
    { opacity: 0, y: '100%' },
    { opacity: 1, y: '0%', stagger: 0.028, duration: 0.7 },
    '-=0.3'
  )
  /* Bio and CTA fade in after name completes */
  .fromTo('.hero-sub',
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.55 },
    '-=0.2'
  )
  .fromTo('.hero-cta',
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.45 },
    '-=0.3'
  );
}

/* ═══════════════════════════════════════════════════════
   SCROLL REVEALS — ScrollTrigger
   gsap.utils.toArray() batches all [data-reveal] elements.
   Siblings in groups of 3 get a stagger delay.
   ═══════════════════════════════════════════════════════ */
function initScrollReveals() {
  gsap.utils.toArray('[data-reveal]').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 22 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: 'power2.out',
        delay: (i % 3) * 0.09,
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

  /* Shadow on scroll */
  ScrollTrigger.create({
    start: 'top -1',
    onEnter: ()      => nav.classList.add('scrolled'),
    onLeaveBack: ()  => nav.classList.remove('scrolled'),
  });

  /* Active link per section */
  const links = document.querySelectorAll('.nav-links a');

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
