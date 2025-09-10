class ProductGallery{
  constructor(root){
    this.root=root;
    this.media=root.querySelector('.pg__media');
    this.slides=[...this.media.children];
    this.thumbsContainer=root.querySelector('.pg__thumbs');
    this.thumbs=[...this.thumbsContainer.children];
    this.prev=root.querySelector('[data-prev]');
    this.next=root.querySelector('[data-next]');
    this.index=0;
    this.count=this.slides.length;
    this.prev.addEventListener('click',()=>this.goTo(this.index-1));
    this.next.addEventListener('click',()=>this.goTo(this.index+1));
    this.thumbs.forEach((btn,i)=>{
      btn.addEventListener('click',()=>this.goTo(i));
      btn.addEventListener('keydown',e=>{
        if(e.key==='ArrowRight'){
          e.preventDefault();
          (this.thumbs[i+1]||this.thumbs[0]).focus();
        }else if(e.key==='ArrowLeft'){
          e.preventDefault();
          (this.thumbs[i-1]||this.thumbs[this.thumbs.length-1]).focus();
        }
      });
    });
    root.addEventListener('pointerenter',()=>root.dataset.show='1');
    root.addEventListener('pointerleave',()=>{delete root.dataset.show;});
    root.addEventListener('touchstart',()=>{
      root.dataset.touchShow='1';
      clearTimeout(this.touchTimeout);
      this.touchTimeout=setTimeout(()=>{delete root.dataset.touchShow;},1500);
    },{passive:true});
    this.update();
  }
  goTo(i){
    if(i<0||i>=this.count)return;
    this.slides[this.index].classList.remove('is-active');
    this.thumbs[this.index].setAttribute('aria-selected','false');
    this.index=i;
    this.slides[this.index].classList.add('is-active');
    this.thumbs[this.index].setAttribute('aria-selected','true');
    this.update();
    this.centerActiveThumb();
    if(!this.root.matches(':hover')) delete this.root.dataset.show;
  }
  update(){
    const atStart=this.index===0;
    const atEnd=this.index===this.count-1;
    this.prev.toggleAttribute('hidden',atStart);
    this.prev.toggleAttribute('disabled',atStart);
    this.next.toggleAttribute('hidden',atEnd);
    this.next.toggleAttribute('disabled',atEnd);
  }
  centerActiveThumb(){
    const active=this.thumbs[this.index];
    const cont=this.thumbsContainer;
    if(!active)return;
    const r=active.getBoundingClientRect();
    const rt=cont.getBoundingClientRect();
    cont.scrollLeft+=(r.left+r.width/2)-(rt.left+rt.width/2);
  }
}
window.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('[data-gallery]').forEach(el=>new ProductGallery(el));
});
