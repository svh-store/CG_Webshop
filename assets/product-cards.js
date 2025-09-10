(function() {
  const mq = window.matchMedia('(min-width: 990px)');
  const gallery = document.getElementById('galleryCard');
  const info = document.getElementById('infoCard');
  if (!gallery || !info) return;

  function syncHeights() {
    if (mq.matches) {
      gallery.style.height = info.offsetHeight + 'px';
    } else {
      gallery.style.height = '';
    }
  }

  document.addEventListener('DOMContentLoaded', syncHeights);
  window.addEventListener('resize', syncHeights);
})();
