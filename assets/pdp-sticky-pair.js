// Sync scrolling for product gallery and info cards
// Chooses shorter column to stick and locks it at the bottom of taller column

document.addEventListener('DOMContentLoaded', () => {
  const pair = document.getElementById('pdpPair');
  const gallery = document.getElementById('galleryCard');
  const info = document.getElementById('infoCard');
  if (!pair || !gallery || !info) return;

  let stickyEl, tallerEl;

  const resizeObserver = new ResizeObserver(setup);
  resizeObserver.observe(gallery);
  resizeObserver.observe(info);

  function setup() {
    pair.classList.remove('pdp-stick-left', 'pdp-stick-right');
    gallery.classList.remove('is-locked');
    info.classList.remove('is-locked');
    window.removeEventListener('scroll', onScroll);

    if (window.innerWidth <= 989) {
      return;
    }

    if (gallery.offsetHeight < info.offsetHeight) {
      pair.classList.add('pdp-stick-left');
      stickyEl = gallery;
      tallerEl = info;
    } else {
      pair.classList.add('pdp-stick-right');
      stickyEl = info;
      tallerEl = gallery;
    }

    window.addEventListener('scroll', onScroll);
    onScroll();
  }

  function onScroll() {
    if (!stickyEl) return;
    const stickyTop = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pdp-sticky-top')) || 0;
    const stickyBottom = window.scrollY + stickyTop + stickyEl.offsetHeight;
    const tallerBottom = tallerEl.getBoundingClientRect().bottom + window.scrollY;
    if (stickyBottom >= tallerBottom) {
      stickyEl.classList.add('is-locked');
    } else {
      stickyEl.classList.remove('is-locked');
    }
  }

  window.addEventListener('resize', setup);
  setup();
});

