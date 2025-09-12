class ComplementaryBundle {
  constructor(section) {
    this.section = section;
    this.id = section.dataset.sectionId;
    this.compProduct = JSON.parse(document.getElementById(`cb-${this.id}-data`).textContent);
    this.compVariants = this.compProduct.variants;
    this.compVariant = this.compVariants.find((v) => v.available);

    this.mainPicker = document.querySelector('variant-picker');
    this.mainVariantInput = document.querySelector('form[action="/cart/add"] input[name="id"]');
    this.mainData = this.mainPicker
      ? JSON.parse(this.mainPicker.querySelector('[type="application/json"]').textContent).product
      : null;
    this.mainVariantId = this.mainVariantInput ? Number(this.mainVariantInput.value) : null;

    this.mainPriceEl = section.querySelector('.js-cb-main-price');
    this.compPriceEl = section.querySelector('.js-cb-comp-price');
    this.totalPriceEl = section.querySelector('.js-cb-total-price');
    this.button = section.querySelector('.js-cb-atc');
    this.message = section.querySelector('.js-cb-message');
    this.variantSelects = section.querySelectorAll('.cb__select');

    this.variantSelects.forEach((sel) => sel.addEventListener('change', () => this.onCompChange()));
    if (this.mainVariantInput)
      this.mainVariantInput.addEventListener('change', () => this.onMainChange());
    if (this.mainPicker)
      this.mainPicker.addEventListener('on:variant:change', (e) => {
        this.mainVariantId = e.detail.variant ? e.detail.variant.id : null;
        this.updateMainPrice();
        this.updateTotal();
        this.toggleButton();
      });

    this.updateCompPrice();
    this.updateMainPrice();
    this.updateTotal();
    this.toggleButton();
    this.button.addEventListener('click', (e) => this.addBundle(e));
  }

  getMainVariant() {
    return this.mainData?.variants.find((v) => v.id === this.mainVariantId);
  }

  onMainChange() {
    this.mainVariantId = this.mainVariantInput ? Number(this.mainVariantInput.value) : null;
    this.updateMainPrice();
    this.updateTotal();
    this.toggleButton();
  }

  onCompChange() {
    const opts = Array.from(this.variantSelects).map((s) => s.value);
    this.compVariant = this.compVariants.find((v) =>
      v.options.every((o, i) => o === opts[i])
    );
    this.updateCompPrice();
    this.updateTotal();
    this.toggleButton();
  }

  updateMainPrice() {
    const v = this.getMainVariant();
    if (v)
      this.mainPriceEl.textContent = Shopify.formatMoney(
        v.price,
        theme.settings.moneyWithCurrencyFormat
      );
  }

  updateCompPrice() {
    if (this.compVariant) {
      this.compPriceEl.textContent = Shopify.formatMoney(
        this.compVariant.price,
        theme.settings.moneyWithCurrencyFormat
      );
    } else {
      this.compPriceEl.textContent = theme.strings.noStock;
    }
  }

  updateTotal() {
    const main = this.getMainVariant();
    if (main && this.compVariant) {
      const total = main.price + this.compVariant.price;
      this.totalPriceEl.textContent = Shopify.formatMoney(
        total,
        theme.settings.moneyWithCurrencyFormat
      );
    } else {
      this.totalPriceEl.textContent = Shopify.formatMoney(
        0,
        theme.settings.moneyWithCurrencyFormat
      );
    }
  }

  toggleButton() {
    const main = this.getMainVariant();
    const enabled = main && main.available && this.compVariant && this.compVariant.available;
    this.button.disabled = !enabled;
  }

  async addBundle(evt) {
    evt.preventDefault();
    if (this.button.disabled) return;
    this.button.setAttribute('aria-busy', 'true');
    const items = [
      { id: this.mainVariantId, quantity: 1 },
      { id: this.compVariant.id, quantity: 1 }
    ];
    const cartDrawer = document.querySelector('cart-drawer');
    let sections = 'cart-icon-bubble';
    if (cartDrawer)
      sections +=
        ',' +
        cartDrawer.closest('.shopify-section').id.replace('shopify-section-', '');
    try {
      const res = await fetch(theme.routes.cartAdd, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          items,
          sections,
          sections_url: window.location.pathname
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.description || data.message);
      ProductForm.updateCartIcon(data);
      if (cartDrawer && theme.settings.afterAtc === 'drawer') {
        cartDrawer.renderContents(data);
      } else if (theme.settings.afterAtc === 'page') {
        window.location.href = theme.routes.cart;
      }
      this.message.textContent = theme.strings.addedToCart || 'Added to cart';
    } catch (err) {
      this.message.textContent = err.message;
    } finally {
      this.button.removeAttribute('aria-busy');
    }
  }
}

document.querySelectorAll('[data-section-type="complementary-bundle"]').forEach((sec) => {
  if (sec.dataset.cbInit) return;
  sec.dataset.cbInit = 'true';
  new ComplementaryBundle(sec);
});

