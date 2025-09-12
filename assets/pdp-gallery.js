(() => {
  class PDPGallery {
    constructor(root) {
      this.root = root;
      this.media = root.querySelector('[data-media]');
      this.slides = Array.from(root.querySelectorAll('.pdp-gallery__slide'));
      this.thumbs = Array.from(root.querySelectorAll('.pdp-gallery__thumb'));
      this.prev = root.querySelector('[data-prev]');
      this.next = root.querySelector('[data-next]');
      this.index = this.slides.findIndex(s => s.hasAttribute('data-active'));
      this.count = this.slides.length;
      this.hideTimer = null;
      this.bind();
      this.update();
    }

    bind() {
      this.prev.addEventListener('click', () => this.move(-1));
      this.next.addEventListener('click', () => this.move(1));
      this.root.addEventListener('mouseenter', () => this.showCtrls(true));
      this.root.addEventListener('mouseleave', () => this.showCtrls(false));
      this.root.addEventListener('touchstart', () => this.touchShow(), { passive: true });
      this.root.addEventListener('focusin', () => this.showCtrls(true));
      this.root.addEventListener('focusout', (e) => {
        if (!this.root.contains(e.relatedTarget)) this.showCtrls(false);
      });
      this.root.addEventListener('keydown', (e) => this.onKey(e));
      this.thumbs.forEach(btn => {
        btn.addEventListener('click', () => this.goTo(parseInt(btn.dataset.index, 10)));
      });
      document.addEventListener('on:variant:change', (e) => {
        if (String(e.detail.productId) !== this.root.dataset.productId) return;
        const id = e.detail.variant?.featured_media?.id;
        if (!id) return;
        const slide = this.slides.find(s => s.id === `Media-${id}`);
        if (slide) this.goTo(parseInt(slide.dataset.index, 10), false);
      });
    }

    onKey(e) {
      if (e.target.closest('.pdp-gallery__thumbs')) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.move(-1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.move(1);
      }
    }

    touchShow() {
      this.showCtrls(true);
      clearTimeout(this.hideTimer);
      this.hideTimer = setTimeout(() => this.showCtrls(false), 1500);
    }

    showCtrls(show) {
      if (show) this.root.setAttribute('data-show', '1');
      else this.root.removeAttribute('data-show');
    }

    move(delta) {
      this.goTo(this.index + delta);
    }

    goTo(i, focusThumb = true) {
      if (i < 0 || i >= this.count) return;
      this.slides[this.index].removeAttribute('data-active');
      this.thumbs[this.index].setAttribute('aria-selected', 'false');
      this.index = i;
      this.slides[this.index].setAttribute('data-active', 'true');
      this.thumbs[this.index].setAttribute('aria-selected', 'true');
      if (focusThumb) this.thumbs[this.index].focus();
      this.update();
    }

    update() {
      this.prev.hidden = this.index === 0;
      this.next.hidden = this.index === this.count - 1;
    }
  }

  document.querySelectorAll('[data-gallery]').forEach(el => new PDPGallery(el));
})();
