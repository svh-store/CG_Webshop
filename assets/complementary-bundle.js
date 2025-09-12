if(!window.ComplementaryBundle){
class ComplementaryBundle{
  constructor(el){
    this.el=el;
    this.productId=el.dataset.productId;
    this.mainInput=document.querySelector('form[action="/cart/add"] input[name="id"]');
    this.mainVariant={id:parseInt(el.dataset.mainVariantId),price:parseInt(el.dataset.mainVariantPrice),available:true};
    this.compVariants=JSON.parse(el.querySelector('[data-comp-variants]').textContent);
    this.compVariant=this.compVariants.find(v=>v.id==el.dataset.compVariantId)||this.compVariants[0];
    this.mainPriceEl=el.querySelector('[data-cb-main-price]');
    this.compPriceEl=el.querySelector('[data-cb-comp-price]');
    this.totalPriceEl=el.querySelector('[data-cb-total-price]');
    this.addBtn=el.querySelector('[data-cb-add]');
    this.statusEl=el.querySelector('[data-cb-status]');
    this.picker=el.querySelector('[data-comp-picker]');
    if(this.picker)this.picker.addEventListener('change',this.onCompOptionChange.bind(this));
    document.addEventListener('on:variant:change',this.onMainVariantChange.bind(this));
    this.addBtn.addEventListener('click',this.onAdd.bind(this));
    this.updateTotal();
    this.updateAddState();
  }
  formatMoney(cents){
    const fmt=(typeof theme!=='undefined'&&theme.moneyFormat)||"{{amount}}";
    if(window.Shopify&&Shopify.formatMoney)return Shopify.formatMoney(cents,fmt);
    return (cents/100).toFixed(2);
  }
  onMainVariantChange(e){
    if(e.detail.product.id.toString()!==this.productId)return;
    this.mainVariant=e.detail.variant;
    this.mainPriceEl.textContent=this.formatMoney(this.mainVariant.price);
    this.updateTotal();
    this.updateAddState();
  }
  onCompOptionChange(){
    const opts=[...this.el.querySelectorAll('.cb__option')].map(s=>s.value);
    const variant=this.compVariants.find(v=>opts.every((o,i)=>v[`option${i+1}`]===o));
    if(variant){
      this.compVariant=variant;
      this.compPriceEl.textContent=this.formatMoney(variant.price);
      this.updateTotal();
    }
    this.updateAddState();
  }
  updateTotal(){
    if(this.mainVariant&&this.compVariant){
      const total=this.mainVariant.price+this.compVariant.price;
      this.totalPriceEl.textContent=this.formatMoney(total);
    }
  }
  updateAddState(){
    const mainOk=this.mainInput&&!this.mainInput.disabled;
    const compOk=this.compVariant&&this.compVariant.available;
    this.addBtn.disabled=!(mainOk&&compOk);
  }
  setBusy(state){
    this.addBtn.disabled=state;
    if(state){this.addBtn.setAttribute('aria-busy','true');}
    else{this.addBtn.removeAttribute('aria-busy');}
  }
  onAdd(){
    if(this.addBtn.disabled)return;
    this.setBusy(true);
    const items=[{id:parseInt(this.mainInput.value||this.mainVariant.id),quantity:1},{id:this.compVariant.id,quantity:1}];
    fetch('/cart/add.js',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items})})
    .then(r=>{if(!r.ok)throw r;return r.json();})
    .then(()=>{
      document.dispatchEvent(new CustomEvent('dispatch:cart-drawer:refresh'));
      this.statusEl.textContent=this.addBtn.dataset.success||'';
      this.statusEl.hidden=false;
    })
    .catch(()=>{
      this.statusEl.textContent=this.addBtn.dataset.error||'';
      this.statusEl.hidden=false;
    })
    .finally(()=>this.setBusy(false));
  }
}
window.ComplementaryBundle=ComplementaryBundle;
document.querySelectorAll('[data-cb]').forEach(el=>new ComplementaryBundle(el));
}
