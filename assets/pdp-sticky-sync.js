(() => {
  const mq = window.matchMedia('(min-width: 990px)');
  const galleryCard = document.getElementById('galleryCard');
  const infoCard = document.getElementById('infoCard');
  const galleryWrap = document.getElementById('galleryWrap');
  const infoWrap = document.getElementById('infoWrap');
  if (!galleryCard || !infoCard || !galleryWrap || !infoWrap) return;
  const ro = new ResizeObserver(() => {
    const h = Math.max(galleryCard.offsetHeight, infoCard.offsetHeight);
    galleryWrap.style.setProperty('--pair-height', `${h}px`);
    infoWrap.style.setProperty('--pair-height', `${h}px`);
  });
  const init = () => {
    if (!mq.matches) {
      ro.disconnect();
      galleryWrap.style.removeProperty('--pair-height');
      infoWrap.style.removeProperty('--pair-height');
      return;
    }
    ro.observe(galleryCard);
    ro.observe(infoCard);
    const h = Math.max(galleryCard.offsetHeight, infoCard.offsetHeight);
    galleryWrap.style.setProperty('--pair-height', `${h}px`);
    infoWrap.style.setProperty('--pair-height', `${h}px`);
  };
  mq.addEventListener('change', init);
  init();
})();
