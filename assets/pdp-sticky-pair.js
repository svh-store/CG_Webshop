(function(){
  let scrollHandler;
  function init(){
    const pair=document.getElementById('pdpPair');
    const gallery=document.getElementById('galleryCard');
    const info=document.getElementById('infoCard');
    if(!pair||!gallery||!info)return;
    pair.classList.remove('pdp-stick-left','pdp-stick-right');
    gallery.classList.remove('is-locked');
    info.classList.remove('is-locked');
    if(scrollHandler){window.removeEventListener('scroll',scrollHandler);scrollHandler=null;}
    if(window.innerWidth<990){return;}
    const gHeight=gallery.offsetHeight;
    const iHeight=info.offsetHeight;
    let sticky,tall;
    if(gHeight<iHeight){pair.classList.add('pdp-stick-left');sticky=gallery;tall=info;}
    else if(iHeight<gHeight){pair.classList.add('pdp-stick-right');sticky=info;tall=gallery;}
    else{return;}
    const topOffset=parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pdp-sticky-top'))||0;
    const pairTop=pair.getBoundingClientRect().top+window.scrollY;
    const maxScroll=tall.offsetHeight-sticky.offsetHeight;
    scrollHandler=function(){
      const scrolled=window.scrollY-pairTop+topOffset;
      if(scrolled>=maxScroll){sticky.classList.add('is-locked');}
      else{sticky.classList.remove('is-locked');}
    };
    window.addEventListener('scroll',scrollHandler);
    scrollHandler();
  }
  document.addEventListener('DOMContentLoaded',init);
  window.addEventListener('load',init);
  window.addEventListener('resize',init);
})();
