document.addEventListener('DOMContentLoaded', function () {
  var pair = document.getElementById('pdpPair');
  if (!pair) return;

  var gallery = document.getElementById('product-media');
  var info = document.getElementById('pdpInfo');
  if (!gallery || !info) return;

  var mq = window.matchMedia('(min-width: 990px)');
  var resizeTimer;

  function getOffset() {
    var header = document.querySelector('header');
    return header ? header.getBoundingClientRect().height : 0;
  }

  function applySticky() {
    gallery.style.position = '';
    gallery.style.top = '';
    info.style.position = '';
    info.style.top = '';

    if (!mq.matches) return;

    var offset = getOffset();
    var galleryHeight = gallery.offsetHeight;
    var infoHeight = info.offsetHeight;
    var stickyEl = galleryHeight < infoHeight ? gallery : info;

    stickyEl.style.position = 'sticky';
    stickyEl.style.top = offset + 'px';
  }

  applySticky();

  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(applySticky, 150);
  });

  window.addEventListener('load', applySticky);
  document.addEventListener('on:variant:change', applySticky);
});
