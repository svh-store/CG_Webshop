document.addEventListener('DOMContentLoaded', () => {
  const media = document.getElementById('product-media');
  const info = document.querySelector('.product-info');
  if (!media || !info) return;

  const updateSticky = () => {
    media.classList.remove('is-sticky');
    info.classList.remove('is-sticky');

    const mediaHeight = media.getBoundingClientRect().height;
    const infoHeight = info.getBoundingClientRect().height;

    if (window.innerWidth >= 769) {
      if (mediaHeight < infoHeight) {
        media.classList.add('is-sticky');
      } else {
        info.classList.add('is-sticky');
      }
    }
  };

  updateSticky();
  window.addEventListener('resize', updateSticky);
  window.addEventListener('load', updateSticky);
});
