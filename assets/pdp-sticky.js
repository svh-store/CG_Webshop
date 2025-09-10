document.addEventListener('DOMContentLoaded', function() {
  const gallery = document.getElementById('galleryCard');
  const info = document.getElementById('infoCard');
  if (!gallery || !info) return;

  const mediaQuery = window.matchMedia('(min-width: 990px)');

  function equalize() {
    gallery.style.height = '';
    info.style.height = '';
    if (mediaQuery.matches) {
      const height = Math.max(gallery.offsetHeight, info.offsetHeight);
      gallery.style.height = height + 'px';
      info.style.height = height + 'px';
    }
  }

  equalize();
  window.addEventListener('resize', equalize);
});
