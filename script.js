// v2 scroll stage: the step in the middle of the screen picks the image on the left.
(function () {
  const stage = document.querySelector('[data-stage]');
  if (!stage || !('IntersectionObserver' in window)) return;
  const shots = stage.querySelectorAll('.shot');
  const steps = stage.querySelectorAll('.step');

  const show = (i) => shots.forEach((s) => s.classList.toggle('is-active', s.dataset.shot === String(i)));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) show(e.target.dataset.step); });
  }, { rootMargin: '-45% 0px -45% 0px' });
  steps.forEach((s) => io.observe(s));
})();

// Callout balloons: hovering or focusing a callout lights up its balloon on the drawing, and the reverse.
(function () {
  const items = document.querySelectorAll('[data-callout]');
  const set = (id, on) => {
    document.querySelectorAll('[data-for="' + id + '"], [data-callout="' + id + '"]').forEach((el) => el.classList.toggle('is-on', on));
  };
  items.forEach((li) => {
    const id = li.dataset.callout;
    li.tabIndex = 0;
    ['mouseenter', 'focus'].forEach((ev) => li.addEventListener(ev, () => set(id, true)));
    ['mouseleave', 'blur'].forEach((ev) => li.addEventListener(ev, () => set(id, false)));
  });
  document.querySelectorAll('.balloon[data-for]').forEach((b) => {
    b.addEventListener('mouseenter', () => set(b.dataset.for, true));
    b.addEventListener('mouseleave', () => set(b.dataset.for, false));
  });
})();

// Image viewer: any .zoom button opens its image large.
(function () {
  const dlg = document.querySelector('.viewer');
  if (!dlg || typeof dlg.showModal !== 'function') return;
  const img = dlg.querySelector('.viewer__img');
  const cap = dlg.querySelector('.viewer__cap');
  document.querySelectorAll('.zoom').forEach((btn) => {
    btn.addEventListener('click', () => {
      const inner = btn.querySelector('img');
      img.src = btn.dataset.zoom || (inner && inner.src);
      img.alt = inner ? inner.alt : '';
      cap.textContent = btn.dataset.caption || '';
      dlg.showModal();
    });
  });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
})();
