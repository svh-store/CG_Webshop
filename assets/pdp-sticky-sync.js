(() => {
  const mq = window.matchMedia('(min-width:990px)');
  function init() {
    const gallery = document.getElementById('galleryCard');
    const info = document.getElementById('infoCard');
    const wraps = [document.getElementById('galleryWrap'), document.getElementById('infoWrap')];
    if (!gallery || !info) return;
    const ro = new ResizeObserver(() => {
      const h = Math.max(gallery.offsetHeight, info.offsetHeight);
      wraps.forEach((w) => w && w.style.setProperty('--pair-height', `${h}px`));
    });
    ro.observe(gallery);
    ro.observe(info);
    const toggleSticky = () => {
      const sticky = mq.matches;
      [gallery, info].forEach((el) => {
        el.style.position = sticky ? 'sticky' : 'static';
      });
    };
    mq.addEventListener('change', toggleSticky);
    toggleSticky();
  }
  document.addEventListener('DOMContentLoaded', init);
})();
