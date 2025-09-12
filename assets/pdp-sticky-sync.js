(function () {
  const mq = window.matchMedia('(min-width: 990px)');

  function sync() {
    const gallery = document.getElementById('galleryCard');
    const info = document.getElementById('infoCard');
    const gw = document.getElementById('galleryWrap');
    const iw = document.getElementById('infoWrap');
    if (!gallery || !info || !gw || !iw) return;

    const apply = () => {
      const max = Math.max(gallery.offsetHeight, info.offsetHeight);
      gw.style.setProperty('--pair-height', `${max}px`);
      iw.style.setProperty('--pair-height', `${max}px`);
    };

    const ro = new ResizeObserver(apply);
    ro.observe(gallery);
    ro.observe(info);
    apply();

    mq.addEventListener('change', () => {
      if (mq.matches) {
        apply();
      } else {
        gw.style.removeProperty('--pair-height');
        iw.style.removeProperty('--pair-height');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', sync);
})();
