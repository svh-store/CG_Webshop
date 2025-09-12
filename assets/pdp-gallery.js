(() => {
  class PdpGallery {
    constructor(root) {
      this.root = root;
      this.mediaWrapper = root.querySelector('[data-media]');
      this.slides = Array.from(root.querySelectorAll('.pdp-gallery__slide'));
      this.thumbs = root.querySelector('[data-thumbs]');
      this.prev = root.querySelector('[data-prev]');
      this.next = root.querySelector('[data-next]');
      this.index = 0;
      this.count = this.slides.length;
      this.bind();
      this.update();
    }
    bind() {
      this.prev.addEventListener('click', () => this.setIndex(this.index - 1));
      this.next.addEventListener('click', () => this.setIndex(this.index + 1));
      this.thumbs.querySelectorAll('.pdp-gallery__thumb').forEach((btn) => {
        btn.addEventListener('click', () => this.setIndex(parseInt(btn.dataset.index, 10)));
      });
      this.mediaWrapper.addEventListener('mouseenter', () => this.showCtrls(true));
      this.mediaWrapper.addEventListener('mouseleave', () => this.showCtrls(false));
      this.mediaWrapper.addEventListener('focusin', () => this.showCtrls(true));
      this.mediaWrapper.addEventListener('focusout', (e) => {
        if (!this.mediaWrapper.contains(e.relatedTarget)) this.showCtrls(false);
      });
      this.mediaWrapper.addEventListener('touchstart', () => {
        this.mediaWrapper.dataset.touchShow = '1';
        clearTimeout(this.touchTimer);
        this.touchTimer = setTimeout(() => {
          delete this.mediaWrapper.dataset.touchShow;
        }, 1500);
      }, { passive: true });
      this.root.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') this.setIndex(this.index - 1);
        if (e.key === 'ArrowRight') this.setIndex(this.index + 1);
      });
      document.addEventListener('on:variant:change', (e) => {
        const productId = this.root.dataset.productId;
        if (e.detail?.product?.id != productId) return;
        const id = e.detail?.variant?.featured_media?.id;
        if (!id) return;
        const found = this.slides.findIndex((s) => s.id === `Media-${id}`);
        if (found >= 0) this.setIndex(found);
      });
    }
    showCtrls(show) {
      if (show) this.mediaWrapper.dataset.show = '1';
      else delete this.mediaWrapper.dataset.show;
    }
    setIndex(i) {
      if (i < 0 || i >= this.count) return;
      this.index = i;
      this.update();
    }
    update() {
      this.slides.forEach((s) => s.removeAttribute('data-active'));
      const active = this.slides[this.index];
      if (active) active.setAttribute('data-active', 'true');
      this.prev.hidden = this.index === 0;
      this.next.hidden = this.index === this.count - 1;
      this.thumbs.querySelectorAll('.pdp-gallery__thumb').forEach((btn) => {
        btn.setAttribute('aria-selected', btn.dataset.index == this.index);
      });
    }
  }
  document.querySelectorAll('[data-gallery]').forEach((el) => new PdpGallery(el));
})();
