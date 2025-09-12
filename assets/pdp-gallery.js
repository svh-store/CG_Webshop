(() => {
  class PdpGallery {
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
      this.prev && this.prev.addEventListener('click', () => this.go(this.index - 1));
      this.next && this.next.addEventListener('click', () => this.go(this.index + 1));
      this.thumbs.forEach((btn) => {
        btn.addEventListener('click', () => this.go(parseInt(btn.dataset.index, 10)));
      });
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
      document.addEventListener('on:variant:change', (e) => this.onVariantChange(e));
    }
    onVariantChange(e) {
      const mediaId = e.detail?.variant?.featured_media?.id;
      if (!mediaId) return;
      const idx = this.slides.findIndex((s) => s.id === `Media-${mediaId}`);
      if (idx > -1) this.go(idx);
    }
    go(i) {
      if (i < 0 || i >= this.count || i === this.index) return;
      this.slides[this.index].removeAttribute('data-active');
      this.thumbs[this.index].setAttribute('aria-selected', 'false');
      this.index = i;
      this.slides[this.index].setAttribute('data-active', 'true');
      this.thumbs[this.index].setAttribute('aria-selected', 'true');
      this.update();
    }
    update() {
      if (this.prev) {
        if (this.index === 0) this.prev.setAttribute('hidden', '');
        else this.prev.removeAttribute('hidden');
      }
      if (this.next) {
        if (this.index === this.count - 1) this.next.setAttribute('hidden', '');
        else this.next.removeAttribute('hidden');
      }
    }
    show() { this.el.setAttribute('data-show', '1'); }
    hide() { this.el.removeAttribute('data-show'); }
  }
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-gallery]').forEach((el) => new PdpGallery(el));
  });
})();
