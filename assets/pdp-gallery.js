(function () {
  class Gallery {
    constructor(el) {
      this.el = el;
      this.slides = Array.from(el.querySelectorAll('.pdp-gallery__slide'));
      this.thumbs = Array.from(el.querySelectorAll('.pdp-gallery__thumb'));
      this.prev = el.querySelector('[data-prev]');
      this.next = el.querySelector('[data-next]');
      this.index = this.slides.findIndex((s) => s.hasAttribute('data-active')) || 0;
      this.count = this.slides.length;
      this.touchTimer = null;
      this.bind();
      this.update();
    }

    bind() {
      this.prev.addEventListener('click', () => this.go(this.index - 1));
      this.next.addEventListener('click', () => this.go(this.index + 1));
      this.thumbs.forEach((t) => t.addEventListener('click', () => this.go(Number(t.dataset.index))));

      this.el.addEventListener('mouseenter', () => this.show());
      this.el.addEventListener('mouseleave', () => this.hide());
      this.el.addEventListener('focusin', () => this.show());
      this.el.addEventListener('focusout', (e) => {
        if (!this.el.contains(e.relatedTarget)) this.hide();
      });
      this.el.addEventListener('touchstart', () => {
        this.show();
        clearTimeout(this.touchTimer);
        this.touchTimer = setTimeout(() => this.hide(), 1500);
      }, { passive: true });

      this.el.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') this.go(this.index - 1);
        if (e.key === 'ArrowRight') this.go(this.index + 1);
      });

      document.addEventListener('on:variant:change', (e) => {
        if (e.detail.product?.id.toString() !== this.el.dataset.productId) return;
        const id = e.detail.variant?.featured_media?.id;
        if (!id) return;
        const idx = this.slides.findIndex((s) => s.id === `Media-${id}`);
        if (idx !== -1) this.go(idx);
      });
    }

    show() {
      this.el.setAttribute('data-show', '1');
    }

    hide() {
      this.el.removeAttribute('data-show');
    }

    go(i) {
      if (i < 0 || i >= this.count) return;
      this.slides[this.index].removeAttribute('data-active');
      this.thumbs[this.index].setAttribute('aria-selected', 'false');
      this.index = i;
      this.slides[this.index].setAttribute('data-active', 'true');
      this.thumbs[this.index].setAttribute('aria-selected', 'true');
      this.update();
      this.slides[this.index].querySelector('img, video, model-viewer, iframe')?.scrollIntoView({ block: 'nearest' });
    }

    update() {
      this.prev.hidden = this.index === 0;
      this.next.hidden = this.index === this.count - 1;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-gallery]').forEach((el) => new Gallery(el));
  });
})();
