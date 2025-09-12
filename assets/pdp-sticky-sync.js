(() => {
  const wrap1 = document.getElementById('galleryWrap');
  const wrap2 = document.getElementById('infoWrap');
  if (!wrap1 || !wrap2) return;
  const card1 = document.getElementById('galleryCard');
  const card2 = document.getElementById('infoCard');

  const update = () => {
    const max = Math.max(card1.offsetHeight, card2.offsetHeight);
    wrap1.style.setProperty('--pair-height', `${max}px`);
    wrap2.style.setProperty('--pair-height', `${max}px`);
  };

  const ro = new ResizeObserver(update);
  ro.observe(card1);
  ro.observe(card2);
  window.addEventListener('resize', update);
  update();
})();
