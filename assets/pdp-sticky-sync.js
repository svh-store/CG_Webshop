(() => {
  const pair = document.getElementById('pdpPair');
  const gw = document.getElementById('galleryWrap');
  const iw = document.getElementById('infoWrap');
  const g  = document.getElementById('galleryCard');
  const i  = document.getElementById('infoCard');
  if (!pair || !gw || !iw || !g || !i) return;

  const mq = window.matchMedia('(min-width: 990px)');

  const applyHeights = () => {
    gw.style.setProperty('--pair-height', 'auto');
    iw.style.setProperty('--pair-height', 'auto');
    if (!mq.matches) return;

    const gh = g.scrollHeight;
    const ih = i.scrollHeight;
    const H = Math.max(gh, ih);

    gw.style.setProperty('--pair-height', `${H}px`);
    iw.style.setProperty('--pair-height', `${H}px`);
  };

  const ro = new ResizeObserver(applyHeights);
  ro.observe(g);
  ro.observe(i);
  ro.observe(pair);
  window.addEventListener('load', applyHeights);
  window.addEventListener('resize', applyHeights);
  mq.addEventListener?.('change', applyHeights);
})();

