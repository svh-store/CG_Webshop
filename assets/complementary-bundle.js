class ComplementaryBundle {
  constructor(container){
    this.container=container;
    this.addBtn=container.querySelector('.cb__cta');
    this.mainPriceEl=container.querySelector('[data-main-price]');
    this.compPriceEl=container.querySelector('[data-comp-price]');
    this.totalPriceEl=container.querySelector('[data-total-price]');
    this.statusEl=container.querySelector('[role="status"]');
    this.variantSelectors=Array.from(container.querySelectorAll('.cb__selector'));
    this.variants=JSON.parse(container.querySelector('[data-comp-variants]').textContent);
    this.compVariant=this.variants[0];
    this.mainVariant={id:container.dataset.mainVariantId,price:parseInt(this.mainPriceEl.dataset.mainPrice,10),available:true};
    this.formatMoney=this.formatMoney.bind(this);
    this.bind();
    this.updateCompPrice();
    this.updateTotal();
    this.toggleBtn();
  }
  bind(){
    this.addBtn.addEventListener('click',this.handleSubmit.bind(this));
    this.variantSelectors.forEach(sel=>sel.addEventListener('change',this.handleVariantChange.bind(this)));
    document.addEventListener('on:variant:change',evt=>{
      this.mainVariant=evt.detail.variant;
      if(!this.mainVariant)return;
      this.mainPriceEl.dataset.mainPrice=this.mainVariant.price;
      this.mainPriceEl.textContent=this.formatMoney(this.mainVariant.price);
      this.updateTotal();
      this.toggleBtn();
    });
  }
  handleVariantChange(){
    const opts=this.variantSelectors.map(s=>s.value);
    const v=this.variants.find(v=>v.options.every((opt,i)=>opt===opts[i]));
    this.compVariant=v;
    if(v){
      this.compPriceEl.dataset.compPrice=v.price;
      this.compPriceEl.textContent=this.formatMoney(v.price);
    }
    this.updateTotal();
    this.toggleBtn();
  }
  formatMoney(cents){
    if(typeof Shopify!=='undefined'&&Shopify.formatMoney){
      const fmt=(theme?.settings?.moneyFormat)||Shopify.money_format||'${{amount}}';
      return Shopify.formatMoney(cents,fmt);
    }
    return (cents/100).toFixed(2);
  }
  updateCompPrice(){
    if(this.compVariant){
      this.compPriceEl.dataset.compPrice=this.compVariant.price;
      this.compPriceEl.textContent=this.formatMoney(this.compVariant.price);
    }
  }
  updateTotal(){
    const main=parseInt(this.mainPriceEl.dataset.mainPrice||0,10);
    const comp=parseInt(this.compPriceEl.dataset.compPrice||0,10);
    if(this.totalPriceEl) this.totalPriceEl.textContent=this.formatMoney(main+comp);
  }
  toggleBtn(){
    const disabled=!(this.mainVariant && this.mainVariant.available && this.compVariant && this.compVariant.available);
    this.addBtn.disabled=disabled;
  }
  getMainVariantId(){
    const input=document.querySelector('form[action="/cart/add"] input[name="id"]');
    return input?input.value:this.mainVariant?.id;
  }
  async handleSubmit(){
    const mainId=this.getMainVariantId();
    const compId=this.compVariant?.id;
    if(!mainId||!compId)return;
    this.addBtn.setAttribute('aria-busy','true');
    this.addBtn.disabled=true;
    try{
      const cartDrawer=document.querySelector('cart-drawer');
      let sections='cart-icon-bubble';
      if(cartDrawer) sections+=`,`+cartDrawer.closest('.shopify-section').id.replace('shopify-section-','');
      const body={items:[{id:mainId,quantity:1},{id:compId,quantity:1}],sections,sections_url:window.location.pathname};
      const resp=await fetch('/cart/add.js',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(body)});
      const data=await resp.json();
      if(!resp.ok) throw data;
      if(window.ProductForm) ProductForm.updateCartIcon(data);
      if(cartDrawer && theme.settings.afterAtc!=='page') cartDrawer.renderContents(data,false);
      else if(theme.settings.afterAtc==='page') window.location.href=theme.routes.cart;
      this.statusEl.textContent=this.addBtn.dataset.success;
    }catch(err){
      this.statusEl.textContent=err.description||err.message||'Error';
    }finally{
      this.addBtn.removeAttribute('aria-busy');
      this.addBtn.disabled=false;
    }
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.js-complementary-bundle').forEach(el=>new ComplementaryBundle(el));
});
