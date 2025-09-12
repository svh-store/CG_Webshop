(function(){
  document.addEventListener('DOMContentLoaded', function(){
    var pair = document.getElementById('pdpPair');
    if (!pair || pair.dataset.stickOnScroll === 'false') return;
    var gallery = document.getElementById('product-media');
    var info = document.getElementById('pdpInfo');
    if (!gallery || !info) return;
    var mq = window.matchMedia('(min-width: 990px)');
    function apply(){
      gallery.classList.remove('pdp-sticky');
      info.classList.remove('pdp-sticky');
      if (!mq.matches) return;
      var g = gallery.offsetHeight;
      var i = info.offsetHeight;
      (g < i ? gallery : info).classList.add('pdp-sticky');
    }
    apply();
    window.addEventListener('resize', apply);
    window.addEventListener('load', apply);
  });
})();
