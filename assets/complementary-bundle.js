if(!customElements.get('complementary-bundle')){
  class ComplementaryBundle extends HTMLElement{
    constructor(){
      super();
      this.button=this.querySelector('[data-bundle-add]');
      this.status=this.querySelector('[data-bundle-status]');
      this.mainPriceEl=this.querySelector('[data-main-price]');
      this.compPriceEl=this.querySelector('[data-comp-price]');
      this.totalPriceEl=this.querySelector('[data-total-price]');
      this.variantInput=document.querySelector('form[action="/cart/add"] input[name="id"]');
      if(this.variantInput) this.variantInput.addEventListener('change',()=>this.onChange());
      this.compSelects=[...this.querySelectorAll('[data-comp-select]')];
      this.compSelects.forEach(sel=>sel.addEventListener('change',()=>this.onChange()));
      this.mainVariants=JSON.parse(this.querySelector('[data-main-variants]')?.textContent||'[]');
      this.compVariants=JSON.parse(this.querySelector('[data-comp-variants]')?.textContent||'[]');
      this.onChange();
      this.button?.addEventListener('click',e=>this.add(e));
    }
    formatMoney(cents){
      if(window.Shopify&&Shopify.formatMoney) return Shopify.formatMoney(cents);
      return (cents/100).toFixed(2);
    }
    mainVariantId(){
      return this.variantInput?Number(this.variantInput.value):Number(this.dataset.mainId);
    }
    complementaryVariantId(){
      if(this.compSelects.length===0) return Number(this.dataset.compId);
      const opts=this.compSelects.map(s=>s.value);
      const v=this.compVariants.find(v=>JSON.stringify(v.options)===JSON.stringify(opts));
      return v?v.id:null;
    }
    onChange(){
      const mainId=this.mainVariantId();
      const compId=this.complementaryVariantId();
      const mainVar=this.mainVariants.find(v=>v.id===mainId);
      const compVar=this.compVariants.find(v=>v.id===compId);
      if(mainVar) this.mainPriceEl.textContent=this.formatMoney(mainVar.price);
      if(compVar) this.compPriceEl.textContent=this.formatMoney(compVar.price);
      if(mainVar&&compVar) this.totalPriceEl.textContent=this.formatMoney(mainVar.price+compVar.price);
      const available=mainVar&&compVar&&mainVar.available&&compVar.available;
      this.button.disabled=!available;
    }
    setBusy(state){
      if(!this.button) return;
      if(state){
        this.button.setAttribute('aria-busy','true');
        this.button.disabled=true;
      }else{
        this.button.removeAttribute('aria-busy');
        this.onChange();
      }
    }
    async add(e){
      e.preventDefault();
      const mainId=this.mainVariantId();
      const compId=this.complementaryVariantId();
      if(!mainId||!compId){
        this.status.textContent='Bitte Variante wählen';
        return;
      }
      this.setBusy(true);
      try{
        const res=await fetch('/cart/add.js',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({items:[{id:mainId,quantity:1},{id:compId,quantity:1}]})});
        if(!res.ok) throw await res.json();
        const cart=await res.json();
        document.dispatchEvent(new CustomEvent('cart:refresh',{detail:{cart}}));
        if(this.dataset.redirect==='true'){window.location.href='/cart';}
        else{this.status.textContent=this.dataset.success;}
      }catch(err){
        this.status.textContent=err.description||'Fehler';
      }finally{
        this.setBusy(false);
      }
    }
  }
  customElements.define('complementary-bundle',ComplementaryBundle);
}
