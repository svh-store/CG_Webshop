// Determines which product column is shorter and makes it sticky
(function(){
  function init(){
    const media = document.getElementById('product-media');
    const info = document.querySelector('.product-info');
    if(!media || !info) return;
    const attr = 'data-sticky-column';
    function setSticky(){
      media.removeAttribute(attr);
      info.removeAttribute(attr);
      const mediaHeight = media.offsetHeight;
      const infoHeight = info.offsetHeight;
      const shorter = mediaHeight < infoHeight ? media : info;
      shorter.setAttribute(attr, '');
    }
    setSticky();
    window.addEventListener('resize', setSticky);
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
