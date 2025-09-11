(function(){
  function StickyPair(pair){
    this.pair = pair;
    this.left = document.getElementById('galleryCard');
    this.right = document.getElementById('infoCard');
    this.top = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pdp-sticky-top')) || 0;
    this.onResize = this.onResize.bind(this);
    this.onScroll = this.onScroll.bind(this);
    window.addEventListener('resize', this.onResize);
    window.addEventListener('load', this.onResize);
    this.onResize();
  }
  StickyPair.prototype.onResize = function(){
    this.cleanup();
    if (window.innerWidth <= 989) return;
    this.leftHeight = this.left.offsetHeight;
    this.rightHeight = this.right.offsetHeight;
    if (this.leftHeight === this.rightHeight) return;
    if (this.leftHeight < this.rightHeight) {
      this.sticky = this.left;
      this.tallHeight = this.rightHeight;
      this.pair.classList.add('pdp-stick-left');
    } else {
      this.sticky = this.right;
      this.tallHeight = this.leftHeight;
      this.pair.classList.add('pdp-stick-right');
    }
    window.addEventListener('scroll', this.onScroll);
    this.onScroll();
  };
  StickyPair.prototype.onScroll = function(){
    if (!this.sticky) return;
    var pairTop = this.pair.getBoundingClientRect().top + window.scrollY;
    var lockPoint = pairTop + this.tallHeight - this.sticky.offsetHeight - this.top;
    if (window.scrollY >= lockPoint) {
      this.sticky.classList.add('is-locked');
    } else {
      this.sticky.classList.remove('is-locked');
    }
  };
  StickyPair.prototype.cleanup = function(){
    this.pair.classList.remove('pdp-stick-left', 'pdp-stick-right');
    this.left.classList.remove('is-locked');
    this.right.classList.remove('is-locked');
    window.removeEventListener('scroll', this.onScroll);
    this.sticky = null;
  };
  document.addEventListener('DOMContentLoaded', function(){
    var pair = document.getElementById('pdpPair');
    if (pair) new StickyPair(pair);
  });
})();
